import { useContext, useEffect } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';

const UserProtectedWrapper = ({
    children
}) => {
    

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/user-login"); // Redirect to login if no token is found
        }
      }, [navigate]);
  return (
    <>
    {children}
    </>
  );
}

export default UserProtectedWrapper