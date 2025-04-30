import React, { useState } from "react";
import { Link } from "react-router-dom";

const CaptionLogin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captionData, setCaptionData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setCaptionData({
      email: email,
      password: password,
    })
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
        <p className="text-center text-sm mt-5">Don't have an account? <Link to="/caption-signup" className="text-blue-500">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default CaptionLogin;
