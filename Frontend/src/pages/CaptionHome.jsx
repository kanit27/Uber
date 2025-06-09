import { useState, useEffect } from 'react';
import Header from '../components/Header';
import GoOnline from '../components/GoOnline';
import Maps from '../components/Maps';
import socket from "../socket";
import { GoCheck  } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";

const CaptionHome = () => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [location, setLocation] = useState(null);
  const [riderLocations, setRiderLocations] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [rideRequest, setRideRequest] = useState(null);
  const [startingLocationName, setStartingLocationName] =
      useState("Starting Location");
  const [destinationLocationName, setDestinationLocationName] = useState(
      "Destination Location"
  );

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

    const handleRidersUpdate = (locations) => {
      setRiderLocations(locations);
      startingLocationName ;
      destinationLocationName ;
      console.log("Received riders update:", locations);
    };

    socket.on("riders_update", handleRidersUpdate);

    // Listen for ride requests
    socket.on("ride_request", (data) => {
      setRideRequest(data);
      setStartingLocationName(data.startingLocationName);
      setDestinationLocationName(data.destinationLocationName);
    });

    // Cleanup function
    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.off("riders_update", handleRidersUpdate);
      socket.off("ride_request");
    };
  }, [isRegistered]);

  // Accept/Reject handlers
  const handleAccept = () => {
    socket.emit("ride_accept", { rideRequest });
    setRideRequest(null);
  };

  const handleReject = () => {
    socket.emit("ride_reject", { rideRequest });
    setRideRequest(null);
  };

  // Helper: calculate time and earnings (mocked for now)
  const travelTime = rideRequest?.travelTime || "15 mins";
  const cost = rideRequest?.cost || "₹193.20";
  const earnings = rideRequest?.earnings || "₹150.00";

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <Header />
      <Maps
        selfLocation={location}
        otherMarkers={riderLocations}
        routeCoords={routeCoords}
        isRider={false}
      />
      <GoOnline />

      {/* Ride request notification as a form */}
      {rideRequest && (
        <div className="absolute top-20 left-2 bg-white text-black bg-opacity-90 p-6 rounded-xl shadow-lg z-[99999] w-[500px] max-w-[95vw]">
          <div className="flex justify-between items-center mb-2">
            <strong className="text-lg">New Ride Request</strong>
          </div>
          <div className="mb-2">
            <div className="font-semibold">From:</div>
            <div className="truncate">{rideRequest.startingLocationName}</div>
          </div>
          <div className="mb-2">
            <div className="font-semibold">To:</div>
            <div className="truncate">
              {rideRequest.destinationLocationName}
            </div>
          </div>
          <div className="mb-2 flex justify-between">
            <div>
              <div className="font-semibold">Time</div>
              <div>{travelTime}</div>
            </div>
            <div>
              <div className="font-semibold">Cost</div>
              <div>{cost}</div>
            </div>
            <div>
              <div className="font-semibold">Your Earnings</div>
              <div>{earnings}</div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleReject}
              className="border-[1px] border-black text-black p-2 rounded-full "
            >
              <RxCross2 className='text-2xl' />

            </button>
            <button
              onClick={handleAccept}
              className="border-[1px] border-black text-black p-2 rounded-full"
            >
              <GoCheck className="text-2xl" />
            </button>
          </div>
        </div>
      )}

      {/* <div className="absolute top-20 left-4 bg-white p-2 rounded shadow text-xs z-[99999]">
        <div>Driver: {location ? '1' : '0'}</div>
        <div>Riders visible: {riderLocations.length}</div>
        <div>Registered: {isRegistered ? 'Yes' : 'No'}</div>
      </div> */}
    </div>
  );
};

export default CaptionHome;
