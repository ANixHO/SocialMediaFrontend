import {useEffect, useState} from "react";
import {storedImageUrl} from "./Utils";
import {Col, Container, Image, Row} from "react-bootstrap";
import axios from "axios";
import anonymous from '../styles/anonymous.png'

function UserInfo(userId) {
    const [username, setUsername] = useState("");
    const [avatarId, setAvatarId] = useState("");
    const [avatarImage, setAvatarImage] = useState();

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/user/${userId.userId}`);
            if (response.status === 200) {
                setUsername(response.data.username);
                // todo 23DEC modify the user info dto in backend
                // todo 23DEC add the user info display box
                setAvatarId(response.data.avatarId);
                setAvatarImage(storedImageUrl(response.data.avatarBinary.data));
            }
        } catch (error) {
            console.log('Error when get user info: ' + error);
        }


    }

    return (
        <Container className="my-auto">
            <Row className="align-items-center" >
                <Col xs="auto" className="">
                    <Image
                        className="rounded-circle fit-image "
                        src={avatarImage || anonymous}
                    />
                </Col>
                <Col xs="auto" className="ps-0">
                    <p className="mb-0">
                        {username}
                    </p>
                </Col>
            </Row>
        </Container>

    );
}

export default UserInfo;