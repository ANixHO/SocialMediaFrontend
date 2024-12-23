import {useEffect, useState} from "react";
import axios from "axios";
import navigation from "../components/Navigation";

export function Logout(){
    // todo 23DEC test the logout function

    useEffect(() => {
        const userConfirm = window.confirm("Do you want to log out?")
        if (userConfirm){
            logout()
        } else {
            navigation('/')
        }
    }, []);

    const logout = async ()=>{
        try {
            const logoutResponse = await axios.post('http://localhost:8080/api/auth/logout',"",{
                headers : {'Authorization' : 'Bearer ' + localStorage.getItem('jwt')}
            })

            if (logoutResponse.status === 200){
                localStorage.clear();
                navigation('/')
            }
        }catch (error){
            console.log('Error when logout: ' + error);
        } finally {
            navigation('/');
        }

        return window.alert("Logout successful!")
    }

}