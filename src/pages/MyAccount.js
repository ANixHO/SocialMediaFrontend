import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {compressImage, isUsernameValid, storedImageUrl} from "../components/Utils";
import {Alert, Button, Col, Container, Form, FormGroup, Image, Row} from "react-bootstrap";
import anonymous from '../styles/anonymous.png'

function MyAccount() {
    const [oldUsername, setOldUsername] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [oldAvatarUrl, setOldAvatarUrl] = useState("");
    const [newAvatarUrl, setNewAvatarUrl] = useState("");
    const [newAvatarFile, setNewAvatarFile] = useState();
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate()
    const id = localStorage.getItem('id');

    useEffect(() => {
        getMyInfo()
    }, []);

    const getMyInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/user/${id}`);
            if (response.status === 200) {
                const oldUsername = response.data.username;
                setOldUsername(oldUsername);
                setNewUsername(oldUsername);
                const avatarUrl = storedImageUrl(response.data.avatarBinary.data);
                setOldAvatarUrl(avatarUrl);
                setNewAvatarUrl(avatarUrl);
                console.log(newAvatarUrl);
            }
        } catch (error) {
            console.log("Error fetching my account data: " + error);
        }
    }

    const submitMyAccountUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        let isChanged = false;
        console.log('newAvatar: ' + newAvatarUrl);
        console.log('oldAvatar: ' + oldAvatarUrl)

        if (newAvatarUrl !== oldAvatarUrl) {
            formData.append("avatarFile", newAvatarFile);
            isChanged = true;
        }

        if (newUsername !== oldUsername) {
            let validation = isUsernameValid(newUsername);
            if (validation[0]) {
                formData.append('username', newUsername);
                isChanged = true;
            } else {
                setErrorMsg(validation[1]);
                isChanged = false;
            }
        }

        if (isChanged) {
            try {
                const response = await axios.put(`http://localhost:8080/api/user/${id}`, formData,
                    {
                        headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
                    });

                localStorage.setItem('username', response.data.username);

            } catch (error) {
                console.error("Error updating my account" + error);
                if (error.response.status === 401){
                    navigate('/Login')
                }
            }
        } else {
            window.alert("Nothing Changed. Navigate to home page");
        }
        navigate('/');

    }

    const changeImage = async (e) => {
        const file = e.target.files[0];
        try {
            const compressedFile = await compressImage(file);
            setNewAvatarFile(compressedFile);
            let newUrl = URL.createObjectURL(compressedFile)
            setNewAvatarUrl(newUrl);
        } catch (error) {
            console.error("error processing avatar: " + error);
        }

    }


    return (
        <Container>
            <h1 className={"my-3"}>My Account</h1>
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
            <Form onSubmit={submitMyAccountUpdate}>
                <Row>
                    <Col key={id} xs={6} md={4} lg={3} className="mb-2">
                        <Image
                            src={newAvatarUrl || anonymous}
                            alt={"user avatar"}
                            className={"w-100 mb-3 rounded-circle"}
                            style={{height: '150px', objectFit: 'contain'}}
                        />
                    </Col>
                </Row>
                <Row>
                    <FormGroup>
                        <Form.Label>Change Avatar</Form.Label>
                        <Form.Control
                            type={"file"}
                            className={"mb-3"}
                            onChange={changeImage}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>User Name</Form.Label>
                        <Form.Control
                            type={"text"}
                            value={newUsername}
                            className={"mb-3"}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
                    </FormGroup>
                </Row>
                <Row>
                    <Col xs={6}>
                        <Button
                            variant={"outline-primary"}
                            type={"submit"}
                            className={"w-50"}
                        >
                            Submit
                        </Button>
                    </Col>
                    <Col xs={6} className={"d-flex justify-content-end"}>
                        <Button
                            variant={"outline-info"}
                            onClick={() => navigate('/')}
                        >
                            Cancel
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>

    );
}

export default MyAccount;