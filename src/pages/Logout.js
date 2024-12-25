import {useContext, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../components/AuthContext";

export function Logout(){
    // todo 23DEC test the logout function

    const navigate = useNavigate()
    const {setIsLoggedIn} = useContext(AuthContext);

    useEffect(() => {
        const userConfirm = window.confirm("Do you want to log out?")
        logout(userConfirm);
    }, []);

    const logout = async (userConfirm)=>{
        try {
            if (userConfirm) {
                const logoutResponse = await axios.post('http://localhost:8080/api/auth/logout', "", {
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
                })

                if (logoutResponse.status === 200) {
                    localStorage.clear();
                    setIsLoggedIn(false);
                }
            }
            navigate('/')
        }catch (error){
            console.log('Error when logout: ' + error);
        } finally {
            navigate('/');
        }

        return window.alert("Logout successful!")
    }

}