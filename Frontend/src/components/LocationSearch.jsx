// Updated LocationSearch.jsx
import React, { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

const LocationSearch = ({
  setCurrentCoords,
  setDestinationCoords,
  setLocationOpen,
  setPanelOpen,
}) => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState({ current: [], dest: [] });

  const fetchSuggestions = async (query, type) => {
    try {
      const url = `${NOMINATIM_BASE_URL}q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=5`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(`Fetched ${type} suggestions:`, data);

      setSuggestions((prev) => ({
        ...prev,
        [type]: data,
      }));
    } catch (err) {
      console.error(`Error fetching ${type} suggestions:`, err);
    }
  };

  const handleCurrentChange = (e) => {
    const value = e.target.value;
    setCurrentLocation(value);
    if (value.length > 2) fetchSuggestions(value, "current");
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    if (value.length > 2) fetchSuggestions(value, "dest");
  };

  const handleSuggestionClick = (suggestion, type) => {
    const displayName = suggestion.display_name;
    console.log(`Selected ${type}:`, displayName);
    if (type === "current") {
      setCurrentLocation(displayName);
    } else {
      setDestination(displayName);
    }
    setSuggestions((prev) => ({ ...prev, [type]: [] }));

    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);

    if (type === "current") {
      setCurrentLocation(suggestion.display_name);
      setCurrentCoords({ lat, lng: lon });
    } else {
      setDestination(suggestion.display_name);
      setDestinationCoords({ lat, lng: lon });
    }
    console.log("Updated coords:", { lat, lon });
  };

  const submitLocation = (e) => {
    e.preventDefault();
    console.log("Current Location:", currentLocation);
    console.log("Destination:", destination);
  };

  return (
    <div className="relative w-full pt-2 px-6 flex items-center justify-start">
      <form
        onSubmit={submitLocation}
        className="text-lg flex flex-col pt-4 gap-2"
      >

          <div className="flex flex-col relative">
            <input
              value={currentLocation}
              onChange={handleCurrentChange}
              type="text"
              placeholder="Your current location"
              className="w-[38vh] h-[50px] bg-neutral-100 rounded-xl py-2 px-4 outline-none truncate"
            />
            {suggestions.current.length > 0 && (
              <ul className="absolute top-40 left-0 bg-white border-t-[1px] border-gray-300 w-full z-10 max-h-70 overflow-y-auto">
                {suggestions.current.map((s, i) => (
            <li
              key={i}
              className="px-4 py-3 cursor-pointer border-b-[1px] border-gray-300 flex items-center gap-2"
              onClick={() => handleSuggestionClick(s, "current")}
            >
              <span className="text-black text-xl pr-2">
                 <FaLocationDot />
              </span>
              {s.display_name}
            </li>
                ))}
              </ul>
            )}
          </div>

          {/* Destination Input */}
        <div className="flex flex-col relative">
          <input
            value={destination}
            onChange={handleDestinationChange}
            type="text"
            placeholder="Choose your destination"
            className="w-[38vh] h-[50px] bg-neutral-100 rounded-xl py-2 px-4 outline-none truncate"
          />
          {suggestions.dest.length > 0 && (
            <ul className="absolute top-24 left-0 bg-white border-t-[1px] border-gray-300 w-full z-10 max-h-70 overflow-y-auto">
              {suggestions.dest.map((s, i) => (
                <li
                  key={i}
                  className="px-4 py-3 cursor-pointer border-b-[1px] border-gray-300 flex items-center gap-2"
                  onClick={() => {
                    handleSuggestionClick(s, "dest");
                    setLocationOpen(true);
                    setPanelOpen(false);
                  }}
                >
                  <span className="text-black text-xl pr-2">
                 <FaLocationDot />
              </span>
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-lg mt-2"
        >
          Show Route
        </button> */}
      </form>
    </div>
  );
};

export default LocationSearch;
