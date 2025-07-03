import { useState, useEffect } from "react";
import socket from "../socket";
import { GoCheck } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import CaptionHeader from "../components/CaptionHeader";
import { GrLocation, GrLocationPin } from "react-icons/gr";
import DriverMap from "../components/DriverMap";

const CaptionHome = () => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [location, setLocation] = useState(null);
  const [riderLocations, setRiderLocations] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [rideRequest, setRideRequest] = useState(null);
  const storedCaption = localStorage.getItem("caption");
const caption = storedCaption ? JSON.parse(storedCaption) : null;

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setLocation(loc);

        if (!isRegistered) {
          console.log("🚗 DRIVER: Registering driver with location:", loc);
          socket.emit("register_driver", { location: loc });
          setIsRegistered(true);
          console.log("✅ Driver registered successfully");
        } else {
          socket.emit("driver_location_update", loc);
        }
      },
      (err) => console.error("❌ Location error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    const handleRidersUpdate = (locations) => {
      setRiderLocations(locations);
      console.log("📍 Received riders update:", locations);
    };

    console.log("🎧 Setting up socket listeners for driver");
    socket.on("riders_update", handleRidersUpdate);

    // Listen for ride requests
    socket.on("ride_request", (data) => {
      console.log("🚨 NEW RIDE REQUEST: Received ride request:", data);
      setRideRequest(data);
    });

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up driver socket listeners");
      navigator.geolocation.clearWatch(watchId);
      socket.off("riders_update", handleRidersUpdate);
      socket.off("ride_request");
    };
  }, [isRegistered]);

  // Accept/Reject handlers
const handleAccept = () => {
  const driverId = socket.id;
  if (!caption) return; // safety check

  socket.emit("ride_accept", {
    rideRequest,
    driverId,
    driverName: `${caption.fullname?.firstname} ${caption.fullname?.lastname}`,
    vehiclePlate: caption.vehicle?.plate,
    vehicleColor: caption.vehicle?.color,
    vehicleType: caption.vehicle?.vehicleType,
    vehicleCapacity: caption.vehicle?.capacity,
    vehicleModel: caption.vehicle?.vehicleModel,
  });
  setRideRequest(null);
  console.log("✅ Ride accepted:", {
  rideRequest,
  driverId,
  driverName: `${caption.fullname?.firstname} ${caption.fullname?.lastname}`,
  vehiclePlate: caption.vehicle?.plate,
  vehicleColor: caption.vehicle?.color,
  vehicleType: caption.vehicle?.vehicleType,
  vehicleCapacity: caption.vehicle?.capacity,
  vehicleModel: caption.vehicle?.vehicleModel,
});
};

  const handleReject = () => {
    console.log("❌ REJECT BUTTON CLICKED");
    console.log("📋 Rejecting ride request:", rideRequest);
    socket.emit("ride_reject", { rideRequest });
    setRideRequest(null);
    console.log("📤 Ride reject event emitted");
  };

  // Helper: calculate time and earnings (mocked for now)
  const travelTime = rideRequest?.travelTime || "15 mins";
  const cost = rideRequest?.cost || "₹193.20";
  const earnings = rideRequest?.earnings || "₹150.00";

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <CaptionHeader />
      <DriverMap
        selfLocation={location}
        otherMarkers={riderLocations}
        routeCoords={routeCoords}
        isRider={false}
      />

      {/* Ride request notification as a form */}
      {rideRequest && (
        <div className="absolute bottom-5 left-2 bg-white border-[1px] border-black text-black bg-opacity-90 p-4 rounded-xl shadow-lg z-[99999] w-[500px] max-w-[95vw]">
          <div className="flex justify-start gap-2 items-center mb-4">
            <h1 className="text-sm font-bold bg-black text-white px-2 rounded-md py-[2px]">
              UberX
            </h1>
            <h1 className="text-sm font-bold bg-blue-100 text-blue-500 px-3 rounded-md py-[2px]">
              Exclusive
            </h1>
          </div>

          <div className="w-full flex flex-col mb-2 border-b-[1px] border-neutral-400 pb-2">
            <div className="text-5xl ml-2 mb-2 font-bold text-black">₹120</div>
            <div className="flex justify-start items-center gap-2 mb-2">
              <h1 className="text-sm font-bold bg-neutral-300 text-black px-2 rounded-md py-[2px]">
                ⭐ 4.9
              </h1>
            </div>
          </div>

          <div className="mb-2 flex items-center gap-4">
            <div className="font-semibold">
              <GrLocationPin className="text-2xl" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xl font-semibold">4 min (1.2 mi) away</div>
              <div className="text-base truncate tracking-tighter">
                {rideRequest.startingLocationName}
              </div>
            </div>
          </div>
          <div className="mb-2 flex items-center gap-4">
            <div className="font-semibold">
              <GrLocation className="text-2xl"  />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xl font-semibold">20 min (4.7 mi) trip</div>
              <div className="text-base tracking-tighter truncate">
                {rideRequest.destinationLocationName}
              </div>
            </div>
          </div>
          <button
            onClick={handleReject}
            className=" absolute right-4 top-4 bg-gray-200  text-black p-2 rounded-xl "
          >
            <RxCross2 className="text-2xl" />
          </button>
          <div className="flex justify-center mt-4">
            <button
              onClick={handleAccept}
              className=" bg-black text-white w-full px-8 py-3 text-xl rounded-xl"
            >
              Accept
            </button>
          </div>
        </div>
      )}

      {/* Debug info */}
      {/* <div className="absolute top-20 left-4 bg-white p-2 rounded shadow text-xs z-[99999]">
        <div>Driver: {location ? '1' : '0'}</div>
        <div>Riders visible: {riderLocations.length}</div>
        <div>Registered: {isRegistered ? 'Yes' : 'No'}</div>
        <div>Socket ID: {socket.id}</div>
        <div>Has Ride Request: {rideRequest ? 'Yes' : 'No'}</div>
      </div> */}
    </div>
  );
};

export default CaptionHome;