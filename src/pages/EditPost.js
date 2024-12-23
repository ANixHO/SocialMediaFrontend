import React, {useState, useEffect} from 'react';
import {Container, Form, Button, Image, Row, Col} from 'react-bootstrap';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../styles/style.css';
import {base64ToBlob, compressImage} from "../components/Utils";

// TODO need to modify all
function EditPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [hiddenImageIds, setHiddenImageIds] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        getPost();
        getImages();
    }, [id]);

    const getPost = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/${id}`,
                {
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
                });
            const post = response.data;
            setTitle(post.title);
            setContent(post.contentText);

        } catch (error) {
            console.error('Error fetching post:', error);
            if (error.response.status === 401) {
                navigate('/Login');
            }
        }
    };

    const getImages = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/postImages/postDetail/${id}`, {
                headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
            });
            const imageResponses = response.data;
            const fetchedImages = imageResponses.map(image => {
                const blob = base64ToBlob(image.imageBinary.data);
                const url = URL.createObjectURL(blob);
                const imageId = image.id;
                return {imageId, url};
            });
            setImages(fetchedImages);
            setPreviewUrls(fetchedImages.map(img => img.url));


        } catch (error) {
            console.log('Error fetching post: ', error);
            if (error.response.status === 401) {
                navigate('/Login');
            }
        }


    }


    const changeImage = async (e) => {
        const files = Array.from(e.target.files);
        setIsLoading(true);
        setError(null);

        try {
            const compressedFiles = await Promise.all(files.map(compressImage));
            setNewImages(prevImages => [...prevImages, ...compressedFiles]);
            const newPreviewUrls = compressedFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
        } catch (error) {
            console.error('Error processing images:', error);
            setError('An error occurred while processing the images. Please try again.');
            window.confirm(error);
            if (error.response.status === 401) {
                navigate('/Login');
            }
        } finally {
            setIsLoading(false);
            setError(null);
        }
    };

    const hidePreviewImage = (index) => {
        const imageToHide = images[index];
        setHiddenImageIds(prevIds => [...prevIds, imageToHide.imageId]);
        setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
        setNewImages(prevNewImages => prevNewImages.filter((_, i) => i !== (index - images.length)));
    };


    const submitPostUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (previewUrls.length === 0) {
            window.confirm("Please choose at least 1 picture");
            return;
        }

        const formData = new FormData();
        formData.append('post', JSON.stringify({title: title, contentText: content}));
        newImages.forEach((image, index) => {
            formData.append('images', image);
        });


        try {
            await axios.delete(`http://localhost:8080/api/posts/${id}/postImages`,
                {
                    data: hiddenImageIds,
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
                }
            );
        } catch (error) {
            console.error(`Error deleting image`, error);
            if (error.response.status === 401) {
                navigate('/Login');
            }
        }

        try {
            const response = await axios.put(`http://localhost:8080/api/posts/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
            });

            navigate(`/post/${response.data.id}`);
        } catch (error) {
            console.error('Error updating post:', error);
            if (error.response.status === 401) {
                navigate('/Login');
            }
        }
    };

    const deletePost = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8080/api/posts/${id}`,
                    {
                        headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
                    });
                navigate('/'); // Navigate to home page after successful deletion
            } catch (error) {
                console.error('Error deleting post:', error);
                window.alert("Failed to delete the post. Please try again.");
                if (error.response.status === 401) {
                    navigate('/Login');
                }
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <Container className="mt-4">
            <h1>Edit Post</h1>
            <Form onSubmit={submitPostUpdate}>
                {previewUrls.length > 0 && (
                    <Row className="mb-3">
                        <Form.Label>Images (All images will be compressed)</Form.Label>

                        {/*// todo modify the image fetching and processing, refer to post.js*/}
                        {previewUrls.map((url, index) => (
                            <Col key={index} xs={6} md={4} lg={3} className="mb-2">
                                <div className="position-relative">
                                    <Image
                                        src={url}
                                        alt={`Preview ${index}`}
                                        thumbnail
                                        className="w-100"
                                        style={{height: '150px', objectFit: 'cover'}}
                                    />
                                    <Button
                                        variant="danger opacity-75"
                                        size="sm"
                                        className="position-absolute top-0 end-0"
                                        onClick={() => hidePreviewImage(index)}
                                    >
                                        X
                                    </Button>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
                <Form.Group className="mb-3">
                    <Form.Label>Add New Images</Form.Label>
                    <Form.Control
                        type="file"
                        multiple
                        onChange={changeImage}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </Form.Group>
                <Row className="my-3">
                    <Col xs={6}>
                        <Button variant="outline-primary" type="submit" className="w-20">
                            Update Post
                        </Button>
                    </Col>

                    <Col xs={6} className="d-flex justify-content-end">
                        <Button
                            variant="outline-danger"
                            className="w-20"
                            onClick={() => deletePost()}
                        >
                            Delete Post
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default EditPost;