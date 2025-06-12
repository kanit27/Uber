import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

const CaptionSignUp = () => {
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const newCaption = {
      email: email,
      password: password,
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
        vehicleModel: vehicleModel
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/caption/register`,
        newCaption
      );

      if (response.status === 201) {
        // Success: redirect or show message
        navigate("/caption-home");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors.map((e) => e.msg));
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        setErrors([err.response.data.message]);
      } else {
        setErrors(["An unexpected error occurred.", err]);
      }
    }
  };

  return (
    <div className="w-full px-10 py-10 text-md flex flex-col h-screen">
      <form onSubmit={handleSubmit} action="">
        <div className=" flex flex-row gap-3 ">
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
            name="password"
            id="password"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="vehicleColor">Vehicle Color</label>
          <input
            required
            value={vehicleColor}
            onChange={(e) => setVehicleColor(e.target.value)}
            className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
            type="text"
            name="vehicleColor"
            id="vehicleColor"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="vehiclePlate">Vehicle Plate</label>
          <input
            required
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
            className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
            type="text"
            name="vehiclePlate"
            id="vehiclePlate"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="vehicleCapacity">Vehicle Capacity</label>
          <input
            required
            value={vehicleCapacity}
            onChange={(e) => setVehicleCapacity(e.target.value)}
            className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
            type="number"
            name="vehicleCapacity"
            id="vehicleCapacity"
            min="1"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="vehicleModel">Vehicle Model</label>
          <input
            required
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
            type="text"
            name="vehicleModel"
            id="vehicleModel"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="vehicleType">Vehicle Type</label>
          <select
            required
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full h-10 px-4 mb-5 bg-neutral-100 outline-none rounded-md"
            name="vehicleType"
            id="vehicleType"
          >
            <option value="">Select type</option>
            <option value="car">Car</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-3">
          <button className="w-full h-10 bg-black text-white rounded-md">
            Sign Up
          </button>
        </div>
      </form>
      <div>
        <p className="flex flex-row justify-center text-center text-sm mt-5">
          Find your account{" "}
          <span className="ml-0.5 text-xs font-bold pt-1">
            <CiSearch />
          </span>{" "}
          <Link
            to="/caption-login"
            className="text-blue-500 cursor-pointer ml-2"
          >
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

export default CaptionSignUp;
