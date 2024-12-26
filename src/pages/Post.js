import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Card, Carousel, Col, Container, Form, Row} from 'react-bootstrap';
import InfiniteScroll from "../components/InfiniteScroll";
import axios from 'axios';
import {base64ToBlob} from "../components/Utils";
import '../styles/style.css';
import UserInfo from "../components/UserInfo";

// todo 23DEC add user info box for each comment
// todo 23DEC add user info box for post owner
function Post() {
    const [post, setPost] = useState([]);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentsIsloading, setCommentsIsloading] = useState(false);
    const [postIsLoading, setPostIsLoading] = useState(true);
    const [commentMessage, setCommentMessage] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [disableInfinitScroll, setDisableInfinitScroll] = useState(false);
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getPost();
        getPostImages();
        getComments();

    }, [id]);


    useEffect(() => {
        updateComment();
    }, [comments]);


    const getPost = async () => {
        try {
            const postResponse = await axios.get(`http://localhost:8080/api/posts/${id}`,
                {
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
                }
            );

            setPost(postResponse.data);
            setPostIsLoading(false);

        } catch (error) {
            if (error.response.status === 401) {
                navigate('/Login');
            }
            console.error('Error fetching post and images:', error);
        }
    };

    const getPostImages = async () => {
        try {
            const imageResponses = await axios.get(`http://localhost:8080/api/postImages/postDetail/${id}`,
                {
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
                }
            );


            setImages(imageResponses.data.map(
                image => {

                    const blob = base64ToBlob(image.imageBinary.data);
                    const url = URL.createObjectURL(blob);
                    const imageId = image.id;
                    return {imageId, url};
                }
            ));
        } catch (error) {
            console.error('Error fetching post images: ', error);

        }
    }


    const updateComment = () => {
        if (comments.length === 0) {
            setCommentMessage("Add the first comment of this post!");
        } else {
            setCommentMessage("Scroll down to see more comments");
        }
    };

    const getComments = async (page) => {
        setCommentsIsloading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/comments/${id}/${page}`,
                {
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
                }
            );
            if (response.data.length < 10) {
                setHasMore(false);
            }
            setComments(response.data);
        } catch (error) {
            setHasMore(false);
            console.error('Error fetching comments:', error);
            if (error.response.status === 401) {
                navigate('/Login');
            }
        } finally {
            setCommentsIsloading(false);
        }
    };

    const deleteComment = async (comment) => {
        try {
            await axios.delete(`http://localhost:8080/api/comments/${comment.id}`,
                {
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
                });

            setComments(prevComments => {
                    const index = prevComments.findIndex(c => c.id === comment.id);
                    if (index !== -1) {
                        const updatedComments = [...prevComments];
                        updatedComments.splice(index, 1);
                        return updatedComments;
                    }
                    return prevComments;
                }
            )

            // if (deleteCommentResponse.status === 200) {
            //     delete comments[comments.indexOf(comment)];
            // }
        } catch (error) {
            console.error('Error deleting comment:', error);
            if (error.response.status === 401) {
                navigate('/Login');
            }
        }
    };

    const submitComment = async (e) => {
        e.preventDefault();
        setComment(comment);
        try {
            const response = await axios.post(`http://localhost:8080/api/comments/${id}`,
                {content: comment},
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                        'content-type': 'application/json'
                    }
                });
            setComments(prevComments => [response.data, ...prevComments]);
            setComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
            if (error.response.status === 401) {
                navigate('/Login');
            }
        }
    };

    const showComments = () => {
        return commentsIsloading ? (
            <p>Loading comments...</p>
        ) : (
            comments.map((comment, index) => (
                <Card key={`${comment.id}-${index}`} className="mb-2 post-page-card ">
                    <Card.Body className="post-page-card-body m-0 p-2">
                        <Card.Text className="m-0">{comment.content}</Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                            <Card.Text className="post-page-comment-timestamp m-0">
                                Posted on {new Date(comment.dateTime).toLocaleString()}
                            </Card.Text>
                            {comment.userId === localStorage.getItem('id') &&
                                <Button
                                    variant="light"
                                    size="s"
                                    className="btn-sm text-muted border-0 text-opacity-50"
                                    onClick={() => deleteComment(comment)}
                                >
                                    x
                                </Button>}
                        </div>
                    </Card.Body>
                </Card>
            ))
        )

    }


    if (!post) return <div>Loading...</div>;

    return (
        <Container fluid className="mt-4  ps-5 pb-5 post-page-container">
            <Row>
                <Col md={7} className="post-page-left-column">
                    <div className="post-page-content">
                        <Carousel className="post-page-image-carousel mb-4">
                            {images.map((image) => (
                                <Carousel.Item key={image.index}>
                                    <img
                                        className="d-block w-100 post-page-carousel-image"
                                        src={image.url}
                                        alt={`Slide ${image.index}`}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        <Row>
                            <Col md={9}>
                                <h1 className="post-page-title">{post.title}</h1>
                            </Col>
                            <Col md={3} className="align-content-center p-1">
                                { !postIsLoading && <UserInfo userId={post.userId}  />}
                            </Col>
                        </Row>
                        <Row>
                        <p className="text-muted post-page-timestamp text-end">
                            Updated at {new Date(post.dateTime).toLocaleString()}
                        </p>
                        <p className="post-page-content-text">{post.contentText}</p>
                        {post.userId === localStorage.getItem('id') && (
                            <Button variant="outline-danger col-3" onClick={() => navigate(`/edit-post/${id}`)}>
                                Edit Post
                            </Button>
                        )}
                        </Row>

                    </div>
                </Col>
                <Col md={5} className="post-page-right-column pt-3">
                    <h3>Comments</h3>
                    <div className="post-page-comments-container ">
                        <InfiniteScroll
                            fetchData={getComments}
                            renderData={showComments}
                            hasMore={hasMore}
                            disable={disableInfinitScroll}/>
                    </div>
                    <hr className="border-1 border-secondary"/>
                    <Form onSubmit={submitComment} className="post-page-add-comment container">
                        <Form.Group className="mb-3 row">
                            <Form.Label className="col-10">Add a comment</Form.Label>
                            <Button className="col-2" variant="outline-primary btn-sm" type="submit">
                                Submit
                            </Button>
                            <Form.Control
                                as="textarea"
                                rows={1}
                                value={comment}
                                onChange={(e) => {
                                    setDisableInfinitScroll(true)
                                    setComment(e.target.value);
                                }}
                                onBlur={(e) => {
                                    setDisableInfinitScroll(false)
                                }}

                            />
                        </Form.Group>


                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Post;