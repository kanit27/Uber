import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserLogout = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        console.log("User logged out successfully", response.data);
        localStorage.removeItem("token");
        navigate("/user-login");
    }).catch((error) => {
        console.log("Error logging out", error);
    })

  return (
    <div>UserLogout</div>
  )
}

export default UserLogout