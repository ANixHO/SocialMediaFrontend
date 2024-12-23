import React, {useEffect, useState} from 'react';
import InfiniteScroll from "../components/InfiniteScroll";
import {base64ToBlob, validateJwtToken} from "../components/Utils";
import axios from 'axios';
import "../styles/style.css"
import {useNavigate} from "react-router-dom";
import {Card, Col, Container, Row} from "react-bootstrap";

// todo 23DEC add the user info box to each post
function Home() {
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        validateJwtToken();
    }, []);


    const getPostAndImage = async (page) => {
        try {

            const postsResponse = await axios.get(`http://localhost:8080/api/posts/explore/${page}`);
            const postsData = postsResponse.data;

            if (postsData.length < 10) {
                setHasMore(false);
            }

            if (postsResponse.status) {

                const postsWithImages = await Promise.all(postsData.map(async (post) => {
                    try {
                        const imageResponse = await
                            axios.get(
                                `http://localhost:8080/api/postImages/explore/${post.id}`
                            );
                        const blob = base64ToBlob(imageResponse.data.imageBinary.data)
                        const imageUrl = URL.createObjectURL(blob);
                        return {...post, imageUrl};
                    } catch (error) {
                        console.error(`Error fetching image for post ${post.id}:`, error);
                        return post;
                    }

                }));


                setPosts((prevPosts) => {
                    const uniquePosts = [...prevPosts];
                    postsWithImages.forEach(newPost => {
                        if (!uniquePosts.some(post => post.id === newPost.id)) {
                            uniquePosts.push(newPost);
                        }
                    });
                    return uniquePosts;
                });
            }
        } catch (error) {
            setHasMore(false)
            console.error('Error fetching posts and images:', error);
        }
    };

    const clickPost = (postId) => {
        navigate(`/post/${postId}`);
    };


    const showPosts = () => {
        return posts.map((post, index) => (
            <Col key={`${post.id}-${index}`}>
                <Card
                    className="h-100 post-card"
                    onClick={() => clickPost(post.id)}
                    style={{cursor: 'pointer'}}
                >
                    {/* todo modify the image fetching and processing, refer to post.js*/}
                    <Card.Img
                        className="fixed-size-home-post-thumbnail"
                        variant="top"
                        src={post.imageUrl || 'https://via.placeholder.com/300x200'}
                        alt={post.title}
                    />
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>
                            {post.contentText.substring(0, 100)}
                            {post.contentText.length > 100 ? '...' : ''}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        ))
    };


    return (
        <Container className="mt-4 mb-4">
            <h1 className="mb-4"></h1>
            <Row xs={1} md={3} className="g-4">

                <InfiniteScroll
                    fetchData={getPostAndImage}
                    renderData={showPosts}
                    hasMore={hasMore}
                    disable={false}
                />

            </Row>
        </Container>
    );

}

export default Home;