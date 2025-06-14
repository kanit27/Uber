import Maps from "../components/Maps";
import WhereTo from "../components/WhereTo";
import { useEffect, useState, useRef } from "react";
import socket from "../socket"; // import socket
import UserHeader from "../components/UserHeader";
import { AiOutlineSafety } from "react-icons/ai";
import { IoCallOutline } from "react-icons/io5";
import { TiMessage } from "react-icons/ti";
import { MdOutlineEmergencyShare, MdStarRate } from "react-icons/md";
import { useGSAP } from "@gsap/react"; 
import gsap from "gsap";

const Home = ({ setRidesOpen }) => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [location, setLocation] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [driverInfo, setDriverInfo] = useState(null);
  const [rideAccepted, setRideAccepted] = useState(false);
  const driverRef = useRef(null);
  const driverCloseRef = useRef(null);


    useGSAP(
      function () {
        if (rideAccepted) {
          gsap.to(driverRef.current, {
            duration: 0.5,
            y: "-40%",
            ease: "power2.out",
          });
          gsap.to(driverCloseRef.current, {
            duration: 0.5,
            y: "0%",
            opacity: 1,
            ease: "power2.out",
          });
        } else {
          gsap.to(driverRef.current, {
            duration: 0.5,
            y: "0%",
            ease: "power2.out",
          });
          gsap.to(driverCloseRef.current, {
            duration: 0.5,
            y: "-40%",
            opacity: 0,
            ease: "power2.out",
          });
        }
      },
      [rideAccepted]
    );


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
      (err) => {
        console.error("Location error:", err);
        errorCallback(err);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 60000 }
    );

    // Listen for driver updates
    socket.on("drivers_update", (driverLocations) => {
      console.log("Received drivers update:", driverLocations);
      setDrivers(driverLocations);
    });

    socket.on("ride_accepted", (data) => {
      setDriverInfo(data);
      setRideAccepted(true);
      // setRidesOpen(false);
      console.log("Ride accepted by driver:", data);
    });

    // Cleanup function
    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.off("drivers_update");
      socket.off("ride_accepted");
      // Optionally emit a disconnect event
      socket.emit("rider_disconnect");
    };
  }, [isRegistered]);

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <UserHeader />
      <Maps
        selfLocation={location}
        otherMarkers={drivers}
        routeCoords={routeCoords}
        isRider={true}
      />
      <WhereTo setRouteCoords={setRouteCoords} driverInfo={driverInfo} rideAccepted={rideAccepted} />

      {driverInfo && rideAccepted && (
        <div
        ref={driverRef}
        className="w-full absolute z-[99999999] -bottom-40 h-[40vh] py-4 rounded-t-2xl bg-white">
          <div className="w-full px-6 flex justify-between items-center">
            <div className="flex flex-col mt-2 mb-1 leading-none">
              <h1 className="text-black font-semibold text-[25px] truncate">
                Arriving in
              </h1>
            </div>
            <div className="flex justify-center items-center gap-2">
              <p className="text-xl leading-none font-semibold bg-black px-2 py-1.5 rounded-lg text-white ">
                5 mins
              </p>
            </div>
          </div>
          <div className="flex justify-start gap-4 items-center mt-8 pl-8">
            <div className="flex flex-col ">
              <img
                className="w-14 h-14 object-cover rounded-full"
                src="https://ceoworld.biz/wp-content/uploads/2020/11/Elon-Musk-2.jpg"
                // src={
                //   driverInfo.avatar ||
                //   "https://ui-avatars.com/api/?name=" +
                //     encodeURIComponent(driverInfo.name || "Driver")
                // }
                alt=""
              />
            </div>
            <div className="flex flex-col leading-none">
              <h1 className="text-2xl font-semibold capitalize">{driverInfo.name}</h1>
              <div className="flex flex-row gap-1 items-center ">
                  <div className="pb-0.5 ">
                    <MdStarRate className="text-sm" />
                  </div>
                  <span className="text-md ">5.0</span>
                </div>
            </div>
          </div>
          
          <div className="w-full flex flex-row justify-between px-4 items-center mt-4 ">
            <div>
              <img
                className="h-24 pl-8 object-cover"
                src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_384,w_576/v1714471451/assets/27/362eaf-3e88-4568-a460-29b0da41c285/original/UberX-%281%29.png"
                alt=""
              />
            </div>
            <div className="flex flex-col text-right pr-6">
              <h2 className="text-lg font-semibold capitalize">
                {driverInfo.vehicle?.color} - {driverInfo.vehicle?.model}
              </h2>
              <h1 className="text-3xl font-semibold leading-none">
                {/* {driverInfo.vehicle?.plate} */}
                {driverInfo.vehicle?.plate || "ABC 1234"}
              </h1>
              {/* <h2 className="text-lg">
                Capacity: {driverInfo.vehicle?.capacity}
              </h2> */}
            </div>
          </div>
          
          <div className="w-full flex flex-row justify-between items-center  mt-8 px-4">
            <div className="w-1/4 flex flex-col items-center">
              <AiOutlineSafety className="w-10 h-10 bg-neutral-200 text-black p-2 rounded-xl" />
              <h1>Safety</h1>
            </div>
            <div className="w-1/4 flex flex-col items-center">
              <IoCallOutline className="w-10 h-10 bg-neutral-200 text-black p-2 rounded-xl" />
              <h1>Call Driver</h1>
            </div>
            <div className="w-1/4 flex flex-col items-center">
              <TiMessage className="w-10 h-10 bg-neutral-200 text-black p-2 rounded-xl" />
              <h1>Message</h1>
            </div>
            <div className="w-1/4 flex flex-col items-center">
              <MdOutlineEmergencyShare className="w-10 h-10 bg-neutral-200 text-black p-2 rounded-xl" />
              <h1>Share </h1>
            </div>
          </div>
        </div>
      )}
      {/* Debug info - remove in production */}
      {/* <div className="absolute top-60 left-4 bg-white p-2 rounded shadow text-xs z-[9999]">
        <div>Riders: {location ? '1' : '0'}</div>
        <div>Drivers: {drivers.length}</div>
        <div>Registered: {isRegistered ? 'Yes' : 'No'}</div>
      </div> */}
    </div>
  );
};

function errorCallback(error) {
  if (error.code === 3) {
    alert("Location request timed out. Please try again or check your device settings.");
  } else {
    alert("Location error: " + error.message);
  }
}

export default Home;
