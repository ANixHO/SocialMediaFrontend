import "../styles/style.css"
import {useState} from "react";
import {isUsernameValid, isPasswordSame, saveUserInfoToLocalStorage} from "../components/Utils";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Alert, Button, Col, Container, Form, FormControl, FormGroup, FormLabel, Row} from "react-bootstrap";


function SignUp() {
    const [username, setUsername] = useState('');
    const [password_1, setPassword_1] = useState('');
    const [password_2, setPassword_2] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null)

        let validation = isUsernameValid(username, password_2);
        let samePassword = isPasswordSame(password_1, password_2);

        if (!validation[0]) {
            setError(validation[1]);
            return;
        }
        if (!samePassword[0]) {
            setError(samePassword[1]);
            return;
        }

        let isSignupSuccess = false;
        // sign up
        try {
            const signUpResponse = await axios
                .post('http://localhost:8080/api/auth/register',
                    {
                        "username": username,
                        "password": password_2
                    })
            if (signUpResponse.status === 200){
                isSignupSuccess = true;
            }
        } catch (error) {
            setError("Sign up failed. Please try another username");
        }

        if (isSignupSuccess){
            try {
                const loginResponse = await axios
                    .post(
                    'http://localhost:8080/api/auth/login',
                    {
                        "username": username,
                        "password": password_2
                    });

                saveUserInfoToLocalStorage(loginResponse.data);
                navigate('/')
            } catch(error){
                setError('Login failed. Please try again.');
            }
        }


    }

    return (

        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col xs={12} md={6}>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert> }
                    <Form onSubmit={handleSubmit}>
                        <FormGroup className="mb-3" controlId="formUsername">
                            <FormLabel>
                                USER NAME:
                            </FormLabel>
                            <FormControl
                                type="text"
                                value={username}
                                placeholder="user name"
                                onChange={(e)=> setUsername(e.target.value)}
                            >
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="formPassword_1">
                            <FormLabel>
                                PASSWORD
                            </FormLabel>
                            <FormControl
                                type="password"
                                value={password_1}
                                placeholder="password"
                                onChange={(e)=> setPassword_1(e.target.value)}
                            >
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="formPassword_2">
                            <FormLabel>
                                CONFIRM PASSWORD
                            </FormLabel>
                            <FormControl
                                type="password"
                                value={password_2}
                                placeholder="confirm password"
                                onChange={(e)=> setPassword_2(e.target.value)}
                            >
                            </FormControl>
                        </FormGroup>
                        <Button className="w-100" type="submit" variant="primary">SIGN UP</Button>
                    </Form>
                </Col>
            </Row>
        </Container>

    );

}

export default SignUp;
