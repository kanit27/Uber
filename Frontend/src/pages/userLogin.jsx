import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const UserLogin = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false); // 🔥 Add loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    
    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 🔥 Add timeout
        }
      );
      
      if (response.status === 200) {
        console.log("Login successful", response.data);
        const data = response.data;
        
        setUser(data.user);
        
        // 🔥 DUAL STORAGE APPROACH
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
      console.error("Login error:", err);
      
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors.map((e) => e.msg));
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
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-10 py-10 text-md flex flex-col h-screen">
      <form onSubmit={handleSubmit} action="">
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
            {loading ? "Logging In..." : "Login"}
          </button>
        </div>
      </form>
      
      {errors.length > 0 && (
        <div className="mb-4 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          <ul className="list-disc pl-5">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div>
        <p className="text-center text-sm mt-5">
          Don't have an account?{" "}
          <Link to="/user-signup" className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </div>
      
      <div className="absolute bottom-10 right-10 text-center mt-5">
        <Link to="/caption-login" className="bg-blue-500 px-4 py-2 text-white rounded-lg">
          Caption Login
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;