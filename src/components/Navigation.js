import React, {useEffect, useState} from 'react';
import {Navbar, Nav, Container} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import '../styles/style.css';


function Navigation() {

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
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    {/*    todo add the my account info box here*/}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;