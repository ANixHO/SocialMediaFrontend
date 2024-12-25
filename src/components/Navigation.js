import React, {useContext, useEffect, useState} from 'react';
import {Container, Nav, Navbar} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import '../styles/style.css';
import {validateJwtToken} from "./Utils";
import UserInfo from "./UserInfo";
import {AuthContext} from "./AuthContext";


function Navigation() {
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);

    useEffect(() => {
        checkLoggedIn();
    }, [setIsLoggedIn]);

    const checkLoggedIn = async () => {
        if (await validateJwtToken()) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }

    return (
        <Navbar bg="light" expand="lg"
                className='navbar'>
            <Container>
                <Navbar.Brand as={Link} to="/">Social Media App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/new-post">New Post</Nav.Link>

                    </Nav>
                    <Nav className="ms-auto">
                        {isLoggedIn &&
                            <Nav.Link as={Link} to="/logout" className="my-auto">Logout</Nav.Link>
                        }
                        {isLoggedIn ? (
                            <UserInfo userId={localStorage.getItem('id')} />
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )
                        }

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;