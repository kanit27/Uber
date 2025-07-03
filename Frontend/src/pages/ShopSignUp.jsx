import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ShopSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopname, setShopname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
  });
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [shopType, setShopType] = useState("");
  const [description, setDescription] = useState("");
  const [businessHours, setBusinessHours] = useState({
    open: "09:00",
    close: "21:00",
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const newShop = {
      shopname,
      ownername: { firstname, lastname },
      email,
      password,
      phone,
      address,
      location: [parseFloat(lat), parseFloat(lng)],
      shopType,
      description,
      businessHours,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/shops/register`,
        newShop,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        localStorage.setItem("shop", JSON.stringify(response.data.shop));
        if (response.data.token) {
          localStorage.setItem("shop_token", response.data.token);
        }
        navigate("/shop-home");
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
      } else if (err.message.includes("Network Error")) {
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
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row gap-3">
          <div>
            <label htmlFor="shopname">Shop Name</label>
            <input
              required
              value={shopname}
              onChange={(e) => setShopname(e.target.value)}
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="text"
              name="shopname"
              id="shopname"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="firstname">Owner First Name</label>
            <input
              required
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="text"
              name="firstname"
              id="firstname"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="lastname">Owner Last Name</label>
            <input
              required
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="text"
              name="lastname"
              id="lastname"
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <div>
            <label htmlFor="phone">Phone</label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="text"
              name="phone"
              id="phone"
              disabled={loading}
            />
          </div>
        </div>
        {/* Address fields */}
        <div className="flex flex-row gap-3">
          <div>
            <label htmlFor="street">Street Address</label>
            <input
              required
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="text"
              name="street"
              id="street"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="city">City</label>
            <input
              required
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="text"
              name="city"
              id="city"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="state">State</label>
            <input
              required
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="text"
              name="state"
              id="state"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="zipcode">Zipcode</label>
            <input
              required
              value={address.zipcode}
              onChange={(e) =>
                setAddress({ ...address, zipcode: e.target.value })
              }
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="text"
              name="zipcode"
              id="zipcode"
              disabled={loading}
            />
          </div>
        </div>
        <div>
          <label for="latitude">Latitude</label>
          <input
          required
          type="number"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
        />
        <label for="longitude">Longitude</label>
        <input
          type="number"
          required
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
        />
        </div>
        <div className="flex flex-row gap-3">
          <div>
            <label htmlFor="shopType">Shop Type</label>
            <input
              required
              value={shopType}
              onChange={(e) => setShopType(e.target.value)}
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="text"
              name="shopType"
              id="shopType"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="text"
              name="description"
              id="description"
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <div>
            <label htmlFor="businessHoursOpen">Open Time</label>
            <input
              value={businessHours.open}
              onChange={(e) =>
                setBusinessHours({ ...businessHours, open: e.target.value })
              }
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="time"
              name="businessHoursOpen"
              id="businessHoursOpen"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="businessHoursClose">Close Time</label>
            <input
              value={businessHours.close}
              onChange={(e) =>
                setBusinessHours({ ...businessHours, close: e.target.value })
              }
              className="w-full h-10 px-4 mb-3 bg-neutral-100 outline-none rounded-md"
              type="time"
              name="businessHoursClose"
              id="businessHoursClose"
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="email">Shop Email</label>
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
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>
      <div>
        <p className="text-center text-sm mt-5">
          Already have a shop account?{" "}
          <Link to="/shop-login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
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

export default ShopSignUp;
