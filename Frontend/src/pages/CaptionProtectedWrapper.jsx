import React, { useContext, useEffect } from 'react'
import { CaptionDataContext } from '../context/CaptionContext'
import { useNavigate } from 'react-router-dom';

const CaptionProtectedWrapper = ({
    children
}) => {
    

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("caption_token");
        if (!token) {
          navigate("/caption-login"); // Redirect to login if no token is found
        }
      }, [navigate]);
  return (
    <>
    {children}
    </>
  );
}

export default CaptionProtectedWrapper