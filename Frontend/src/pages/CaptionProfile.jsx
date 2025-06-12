import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import axios from "axios";

const CaptionProfile = () => {
  const [caption, setCaption] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get caption info from localStorage (set at login)
    const stored = localStorage.getItem("caption");
    if (stored) {
      setCaption(JSON.parse(stored));
    }
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    const token = localStorage.getItem("caption_token");

    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/caption/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Optionally log error
      console.log("Error logging out", error);
    } finally {
      localStorage.removeItem("caption_token");
      localStorage.removeItem("caption");
      navigate("/caption-login");
    }
  };

  if (!caption) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <div className="flex justify-start gap-24 items-center mb-8">
        <button onClick={() => navigate("/caption-home")}>
          <IoArrowBackCircleSharp className="w-8 h-8" />
        </button>
        <h2 className="text-3xl font-bold text-center">Profile</h2>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Name: </span>
        {caption.fullname?.firstname} {caption.fullname?.lastname}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Email: </span>
        {caption.email}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Vehicle Color: </span>
        {caption.vehicle?.color}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Vehicle Plate: </span>
        {caption.vehicle?.plate}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Vehicle Capacity: </span>
        {caption.vehicle?.capacity}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Vehicle Model: </span>
        {caption.vehicle?.vehicleModel}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Vehicle Type: </span>
        {caption.vehicle?.vehicleType}
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

export default CaptionProfile;