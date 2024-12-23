import React, {useEffect, useState} from 'react';
import {Alert, Container, Form, Button, Image, Col, Row} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {compressImage} from "../components/Utils";
import '../styles/style.css';
import * as Promis from "axios";


function NewPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [hiddenImageIds, setHiddenImageIds] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('jwt')){
            const userConfirm = window.confirm("You need to login first");
            if (userConfirm){
                navigate('/login');
            } else {
                navigate('/')
            }
        }
    }, []);

    const changeImage = async (e) => {
        const files = Array.from(e.target.files);
        setIsLoading(true);
        setError(null);

        try {
            const compressedFiles = await Promis.all(files.map(compressImage))
            setImages(prevImages => [...prevImages, ...compressedFiles]);
            const newPreviewUrls = compressedFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
        } catch (error) {
            console.error('Error processing images:', error);
            setError('An error occurred while processing the images. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const hidePreviewImage = (index) => {
        const imageToHide = images[index];
        if (imageToHide && imageToHide.id) {
            setHiddenImageIds(prevIds => [...prevIds, imageToHide.id]);
        }
        setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const submitNewPost = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (images.length === 0) {
            window.alert("Please choose at least 1 picture");
            return;
        }

        const formData = new FormData();
        formData.append('post', JSON.stringify({title:title, contentText: content}) );
        images.forEach((image, index) => {
            formData.append(`images`, image);
        });

        try {
            const response = await axios.post('http://localhost:8080/api/posts/newpost', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')

                }
            });
            navigate(`/post/${response.data.id}`);
        } catch (error) {
            console.error('Error creating post:', error);
            setError('An error occurred while creating the post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Container className="mt-4">
            <h1>Create New Post</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={submitNewPost}>
                {previewUrls.length > 0 && (
                    <Row className="mb-3">
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
                                        variant="danger"
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
                    <Form.Label>Images (All images will be compressed)</Form.Label>
                    <Form.Control
                        type="file"
                        multiple
                        onChange={changeImage}
                        disabled={isLoading}
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

                <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Post'}
                </Button>
            </Form>
        </Container>
    );
}

export default NewPost;