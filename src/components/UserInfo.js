import {useEffect, useState} from "react";
import {getUserInfoData, storedImageData} from "./Utils";

function UserInfo (userId){
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = () => {
        try {
            const userInfo = getUserInfoData(userId);
            if (userInfo != null){
                setUsername(userInfo.username);
                // todo 23DEC modify the user info dto in backend
                // todo 23DEC add the user info display box
                setAvatar(storedImageData(userInfo.avatarBinary.data, ))
            }
        }catch (error){
            console.log('Error fetching user info: user id: ' + userId);
        }
    }

    return (<p></p>

    );
}

export default UserInfo;