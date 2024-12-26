import {Container, Row, Col, Form, FormGroup, FormLabel, FormControl, Button, Alert} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import axios from 'axios';
import {isUsernameAndPasswordValid, saveUserInfoToLocalStorage} from "../components/Utils";
import "../styles/style.css"
import {AuthContext} from "../components/AuthContext";


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {setIsLoggedIn} = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // if (!username || !password) {
        //     setError('Please enter both username and password');
        // } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        //     setError('Username can only contain letters, numbers, and underscores');
        //     return;
        // } else if (!/^[a-zA-Z0-9!#.&*_+-]+$/.test(password)) {
        //     setError('Password can only contain letters, numbers, and special characters !@#$%^&*()_+=-');
        //     return;
        // }

        let validation = isUsernameAndPasswordValid(username, password);
        if (!validation[0]){
            setError(validation[1]);
            return;
        }

        try {
            const loginResponse = await axios.post('http://localhost:8080/api/auth/login',
                {
                    "username":username,
                    "password":password
                });

            saveUserInfoToLocalStorage(loginResponse.data);
            setIsLoggedIn(true);
            navigate('/');
        } catch (error) {
            setError('Login failed. Please try again.')
        }
    }

    const handleSignup = () => {
        navigate('/signup');
    }

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col xs={12} md={6}>
                    <h2 className="text-center mb-4">Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <FormGroup className="mb-3" controlId="formUsername">
                            <FormLabel>
                                USER NAME:
                            </FormLabel>
                            <FormControl
                                type="text"
                                value={username}
                                placeholder="user name"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup className="mb-3" controlId="formPassword">
                            <FormLabel>
                                PASSWORD:
                            </FormLabel>
                            <FormControl
                                type="password"
                                value={password}
                                placeholder="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormGroup>
                        <Button className="w-100" type="submit" variant="primary">LOGIN</Button>
                    </Form>
                </Col>
            </Row>

            <Row className="justify-content-md-center mt-5">
                <Col xs={12} md={6}>
                    <h2 className="text-center mb-4">You are not a user yet?</h2>
                    <Button type="button" className="btn btn-secondary" onClick={()=> handleSignup()}>Sign Up</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;