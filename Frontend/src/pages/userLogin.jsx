import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const UserLogin = () => {

  const navigate = useNavigate();

  const { user , setUser } = useContext(UserDataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData ={
      email: email,
      password: password,
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);
    if (response.status === 200) {
      const data = response.data;
      console.log("User logged in successfully", response.data);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    }

    setEmail("");
    setPassword("");
  }


  return (
    <div className="w-full px-10 py-10 text-md flex flex-col h-screen">
      <form onSubmit={(e) => handleSubmit(e)} action="">
        <div className="flex flex-col gap-3">
          <label htmlFor="email">What's your email address</label>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
            type="email"
            name="email"
            id="email"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="password">Password</label>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 px-4 mb-5 bg-neutral-100 outline-none rounded-md"
            type="password"
            name="email"
            id="email"
          />
        </div>

        <div className="flex flex-col gap-3">
          <button className="w-full h-10 bg-black text-white rounded-md">
            Login
          </button>
        </div>
      </form>
      <div>
        <p className="text-center text-sm mt-5">Don't have an account? <Link to="/user-signup" className="text-blue-500">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default UserLogin;
