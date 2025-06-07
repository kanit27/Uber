import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import GoOnline from '../components/GoOnline';
import Maps from '../components/Maps';
import socket from "../socket";

const CaptionHome = () => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [location, setLocation] = useState(null);
  // --- FIX 4: Handle multiple riders ---
  // The state now holds an array of rider locations.
  const [riderLocations, setRiderLocations] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  // const driverId = "driver-" + Math.floor(Math.random() * 10000); // mock unique ID

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setLocation(loc);
        
        if (!isRegistered) {
          socket.emit("register_driver", { location: loc });
          setIsRegistered(true);
          console.log("Driver registered with location:", loc);
        } else {
          socket.emit("driver_location_update", loc);
        }
      },
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    // --- FIX 4 (cont.): Listen for the new 'riders_update' event ---
    // This single listener will receive the full list of active rider locations
    // whenever a rider joins, leaves, or moves.
    const handleRidersUpdate = (locations) => {
      console.log("Received riders update:", locations);
      setRiderLocations(locations);
    };
    
    socket.on("riders_update", handleRidersUpdate);

    // Cleanup function
    return () => {
      navigator.geolocation.clearWatch(watchId);
      // Remove the specific listener
      socket.off("riders_update", handleRidersUpdate);
      // The generic "disconnect" on the server will handle this client leaving.
    };
  }, [isRegistered]);

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <Header />
      <Maps
        selfLocation={location}
        // Pass the array of rider locations to the map
        otherMarkers={riderLocations}
        routeCoords={routeCoords}
        isRider={false} // This view is for the driver
      />
      <GoOnline />
      
      <div className="absolute top-20 left-4 bg-white p-2 rounded shadow text-xs z-[99999]">
        <div>Driver: {location ? '1' : '0'}</div>
        <div>Riders visible: {riderLocations.length}</div>
        <div>Registered: {isRegistered ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
};

export default CaptionHome;
