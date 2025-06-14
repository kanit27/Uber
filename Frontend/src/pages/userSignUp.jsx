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
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false); // 🔥 Add loading state

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true); // 🔥 Set loading

    const newUser = {
      email: email,
      password: password,
      fullname: {
        firstname: firstname,
        lastname: lastname,
      }
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 🔥 Add timeout
        }
      );

      if (response.status === 201) {
        console.log("User registered successfully", response.data);
        const data = response.data;
        
        setUser(data.user);
        
        // 🔥 DUAL STORAGE APPROACH
        // Store both user data AND token
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem("token", data.token); // ✅ Store token too
        }
        
        // 🔥 Verify storage worked
        console.log("Stored in localStorage:", {
          user: localStorage.getItem("user"),
          token: localStorage.getItem("token")
        });
        
        navigate("/home");
      }
    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle validation errors from backend
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors.map(e => e.msg));
      } else if (err.response && err.response.data && err.response.data.message) {
        setErrors([err.response.data.message]);
      } else if (err.code === 'ECONNABORTED') {
        setErrors(["Request timeout. Please try again."]);
      } else if (err.message.includes('Network Error')) {
        setErrors(["Network error. Please check your connection."]);
      } else {
        setErrors(["An unexpected error occurred. Please try again."]);
      }
    } finally {
      setLoading(false); // 🔥 Reset loading
    }

    // Clear form
    setEmail("");
    setPassword("");
    setfirstname("");
    setlastname("");
  };

  return (
    <div className="w-full px-10 py-10 text-md flex flex-col h-screen">
      <form onSubmit={handleSubmit} action="">
        <div className="flex flex-row gap-3">
          <div>
            <label htmlFor="firstname">First Name</label>
            <input
              required
              value={firstname}
              onChange={(e) => setfirstname(e.target.value)}
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="text"
              name="firstname"
              id="firstname"
              disabled={loading} // 🔥 Disable during loading
            />
          </div>
          <div>
            <label htmlFor="lastname">Last Name</label>
            <input
              required
              value={lastname}
              onChange={(e) => setlastname(e.target.value)}
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="text"
              name="lastname"
              id="lastname"
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="email">Email Address</label>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
            type="email"
            name="email"
            id="email"
            disabled={loading}
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
            name="password"
            id="password"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-3">
          <button 
            type="submit"
            disabled={loading}
            className={`w-full h-10 rounded-md text-white ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-black hover:bg-gray-800'
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"} {/* 🔥 Loading state */}
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
      
      {/* Error Display */}
      {errors.length > 0 && (
        <div className="mb-4 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          <ul className="list-disc pl-5">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserSignUp;