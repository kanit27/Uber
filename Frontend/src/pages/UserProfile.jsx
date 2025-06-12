import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage (set at login)
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    const token = localStorage.getItem("token");
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Optionally log error
      console.log("Error logging out", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/user-login");
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <div className="flex justify-start gap-24 items-center mb-8">
        <button onClick={() => navigate("/home")}>
          <IoArrowBackCircleSharp className="w-8 h-8" />
        </button>
        <h2 className="text-3xl font-bold text-center">Profile</h2>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Name: </span>
        {user.fullname?.firstname} {user.fullname?.lastname}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Email: </span>
        {user.email}
      </div>
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="mt-8 w-full h-10 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition"
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
};

export default UserProfile;