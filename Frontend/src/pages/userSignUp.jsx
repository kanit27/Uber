import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const UserSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const { user , setUser } = useContext (UserDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      email: email,
      password: password,
      fullname:{
        firstname: firstname,
        lastname: lastname,
      }
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

    if (response.status === 201) {
      console.log("User registered successfully", response.data);
      const data = response.data;
      setUser(data.user);
      localStorage.setItem("token", data.token);
      navigate("/home");
    }

    if (response.status === 400) {
      console.log("User already exists", response.data);
    }

    setEmail("");
    setPassword("");
    setfirstname("");
    setlastname("");

  }

  return (
    <div className="w-full px-10 py-10 text-md flex flex-col h-screen">
      <form onSubmit={(e) => handleSubmit(e)} action="">
        <div className=" flex flex-row gap-3 ">
          <div>
            <label htmlFor="name">First Name</label>
            <input
              required
              value={firstname}
              onChange={(e) => setfirstname(e.target.value)}
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="text"
              name="name"
              id="name"
            />
          </div>
          <div>
            <label htmlFor="name">Last Name</label>
            <input
              required
              value={lastname}
              onChange={(e) => setlastname(e.target.value)}
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="text"
              name="name"
              id="name"
            />
          </div>
        </div>
        <div className=" flex flex-col gap-3">
          <label htmlFor="email">Email Address</label>
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
        <p className="flex flex-row justify-center text-center text-sm mt-5">
          Find your account{" "}
          <span className="ml-0.5 text-xs font-bold pt-1">
            <CiSearch />
          </span>{" "}
          <Link to="/user-login" className="text-blue-500 cursor-pointer ml-2">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignUp;
