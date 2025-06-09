import Header from "../components/Header";
import Maps from "../components/Maps";
import WhereTo from "../components/WhereTo";
import { useEffect, useState, useRef } from "react";
import socket from "../socket"; // import socket

const Home = () => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [location, setLocation] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setLocation(loc);
        
        // Register as rider only once when we first get location
        if (!isRegistered) {
          socket.emit("register_rider", loc);
          setIsRegistered(true);
          console.log("Rider registered with location:", loc);
        } else {
          // Send location updates after registration
          socket.emit("rider_location_update", loc);
        }
      },
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    // Listen for driver updates
    socket.on("drivers_update", (driverLocations) => {
      console.log("Received drivers update:", driverLocations);
      setDrivers(driverLocations);
    });

    // Cleanup function
    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.off("drivers_update");
      // Optionally emit a disconnect event
      socket.emit("rider_disconnect");
    };
  }, [isRegistered]);

  const handleRequestRide = () => {
    if (location) {
      socket.emit("ride_request", { location });
      setRequesting(true);
      setTimeout(() => setRequesting(false), 3000); // Reset after 3s
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <Maps
        selfLocation={location}
        otherMarkers={drivers}
        routeCoords={routeCoords}
        isRider={true}
      />
      <WhereTo setRouteCoords={setRouteCoords} />

      {/* Request Ride Button */}
      {/* <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[99999]">
        <button
          onClick={handleRequestRide}
          className="bg-green-600 text-white px-6 py-2 rounded shadow-lg text-lg"
          disabled={requesting || !location}
        >
          {requesting ? "Request Sent!" : "Request Ride"}
        </button>
      </div> */}

      {/* Debug info - remove in production */}
      {/* <div className="absolute top-60 left-4 bg-white p-2 rounded shadow text-xs z-[9999]">
        <div>Riders: {location ? '1' : '0'}</div>
        <div>Drivers: {drivers.length}</div>
        <div>Registered: {isRegistered ? 'Yes' : 'No'}</div>
      </div> */}
    </div>
  );
};

export default Home;