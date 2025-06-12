import { useEffect, useRef, useState } from "react";
import { MdSearch } from "react-icons/md";
import { useGSAP } from "@gsap/react";
import { RiArrowDownWideLine } from "react-icons/ri";
import { GrLocationPin } from "react-icons/gr";
import { GrLocation } from "react-icons/gr";
import gsap from "gsap";
import LocationSearch from "../components/LocationSearch";
import RidesList from "../components/RidesList";
import { HiLocationMarker } from "react-icons/hi";
import { IoWallet } from "react-icons/io5";
import { TfiLineDotted } from "react-icons/tfi";
import socket from "../socket";

const WhereTo = ({ setRouteCoords, rideAccepted }) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [ridesOpen, setRidesOpen] = useState(false);
  const [driverOpen, setDriverOpen] = useState(false);
  const [smallPanelOpen, setSmallPanelOpen] = useState(false);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [startingLocationName, setStartingLocationName] = useState(null);
  const [destinationLocationName, setDestinationLocationName] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const locationRef = useRef(null);
  const locationCloseRef = useRef(null);
  const ridesRef = useRef(null);
  const ridesCloseRef = useRef(null);
  const driverRef = useRef(null);
  const driverCloseRef = useRef(null);
  const smallPanelRef = useRef(null);
  const smallPanelCloseRef = useRef(null);

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          duration: 0.5,
          y: "-100%",
          ease: "power2.out",
        });
        gsap.to(panelCloseRef.current, {
          duration: 0.5,
          y: "0%",
          opacity: 1,
          ease: "power2.out",
        });
      } else {
        gsap.to(panelRef.current, {
          duration: 0.5,
          y: "0%",
          ease: "power2.out",
        });
        gsap.to(panelCloseRef.current, {
          duration: 0.5,
          y: "-100%",
          opacity: 0,
          ease: "power2.out",
        });
      }
    },
    [panelOpen]
  );

  useGSAP(
    function () {
      if (locationOpen) {
        gsap.to(locationRef.current, {
          duration: 0.5,
          y: "-100%",
          ease: "power2.out",
        });
        gsap.to(locationCloseRef.current, {
          duration: 0.5,
          y: "0%",
          // opacity: 1,
          ease: "power2.out",
        });
      } else {
        gsap.to(locationRef.current, {
          duration: 0.5,
          y: "0%",
          ease: "power2.out",
        });
        gsap.to(locationCloseRef.current, {
          duration: 0.5,
          y: "-100%",
          // opacity: 0,
          ease: "power2.out",
        });
      }
    },
    [locationOpen]
  );

  useGSAP(
    function () {
      if (ridesOpen) {
        gsap.to(ridesRef.current, {
          duration: 0.5,
          y: "-100%",
          ease: "power2.out",
        });
        gsap.to(ridesCloseRef.current, {
          duration: 0.5,
          y: "0%",
          ease: "power2.out",
        });
      } else {
        gsap.to(ridesRef.current, {
          duration: 0.5,
          y: "0%",
          ease: "power2.out",
        });
        gsap.to(ridesCloseRef.current, {
          duration: 0.5,
          y: "-100%",
          ease: "power2.out",
        });
      }
    },
    [ridesOpen]
  );

  useGSAP(
    function () {
      if (driverOpen) {
        gsap.to(driverRef.current, {
          duration: 0.5,
          y: "-100%",
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
          y: "-100%",
          opacity: 0,
          ease: "power2.out",
        });
      }
    },
    [driverOpen]
  );

  useGSAP(
    function () {
      if (smallPanelOpen) {
        gsap.to(smallPanelRef.current, {
          duration: 0.5,
          y: "-100%",
          ease: "power2.out",
        });
        gsap.to(smallPanelCloseRef.current, {
          duration: 0.5,
          y: "0%",
          opacity: 1,
          ease: "power2.out",
        });
      } else {
        gsap.to(smallPanelRef.current, {
          duration: 0.5,
          y: "0%",
          ease: "power2.out",
        });
        gsap.to(smallPanelCloseRef.current, {
          duration: 0.5,
          y: "-100%",
          opacity: 0,
          ease: "power2.out",
        });
      }
    },
    [smallPanelOpen]
  );

  useEffect(() => {
    if (rideAccepted) {
      setRidesOpen(false);
    }
  }, [rideAccepted]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!currentCoords || !destinationCoords) return;

      const url = `https://router.project-osrm.org/route/v1/driving/${currentCoords.lng},${currentCoords.lat};${destinationCoords.lng},${destinationCoords.lat}?overview=full&geometries=geojson`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("OSRM Route Data:", data);

        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map((coord) => [
            coord[1],
            coord[0],
          ]);
          setRouteCoords(coords);
        }
      } catch (err) {
        console.error("Error fetching route from OSRM:", err);
      }
    };

    fetchRoute();
  }, [currentCoords, destinationCoords]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = [pos.coords.latitude, pos.coords.longitude];
        socket.emit("register_rider", location);
        console.log("📡 Registered rider with location", location);
      },
      (err) => console.error("Location error:", err)
    );
  }, []);

  const handleConfirmRide = () => {
    socket.emit("ride_request", {
      location: currentCoords,
      destination: destinationCoords,
      startingLocationName: startingLocationName,
      destinationLocationName: destinationLocationName,
    });

    console.log("Emitted ride_request:", {
      location: currentCoords,
      destination: destinationCoords,
      startingLocationName: startingLocationName,
      destinationLocationName: destinationLocationName,
    });
  };

  useEffect(() => {
    const handleRideAccepted = (data) => {
      console.log("✅ RIDE ACCEPTED RECEIVED", data);
      setDriverOpen(true);
      setDriverInfo(data);
      setRidesOpen(false);
    };

    socket.on("ride_accepted", handleRideAccepted);

    return () => {
      socket.off("ride_accepted", handleRideAccepted);
    };
  }, []);

  return (
    <>
      <div className="w-full flex flex-col z-[9999]">
        <div className="w-full absolute bottom-0 left-0 flex justify-center  items-center pb-8 z-[9999]">
          <div
            onClick={() => setPanelOpen(true)}
            className="bg-neutral-50 rounded-full pl-5 w-96 h-14 flex justify-start gap-2 items-center cursor-pointer"
          >
            <MdSearch className="text-3xl text-neutral-600 " />
            <button className="text-[24px] font-semibold text-[Questrial] text-neutral-600 pl-2">
              Where to?
            </button>
          </div>
        </div>
        <div className="relative z-[9999]">
          <div
            ref={panelRef}
            className="z-[9999] w-full h-[100vh] py-4 bg-white "
          >
            <div className="w-full px-6 flex justify-between items-center">
              <h1 className="text-black font-semibold text-[25px] truncate">
                Plan your ride
              </h1>
              <div
                ref={panelCloseRef}
                onClick={() => setPanelOpen(false)}
                className="flex justify-center items-center gap-2"
              >
                <RiArrowDownWideLine className="text-3xl" />
              </div>
            </div>
            <LocationSearch
              currentCoords={currentCoords}
              destinationCoords={destinationCoords}
              setCurrentCoords={setCurrentCoords}
              setDestinationCoords={setDestinationCoords}
              setLocationOpen={setLocationOpen}
              setPanelOpen={setPanelOpen}
              setStartingLocationName={setStartingLocationName}
              setDestinationLocationName={setDestinationLocationName}
            />
          </div>
          <div
            ref={locationRef}
            className="w-full h-[65vh] absolute top-0 left-0 py-6 rounded-2xl bg-white"
          >
            <div className="w-full px-6 flex justify-between items-center">
              <h1 className="text-black font-semibold text-[25px] truncate">
                Choose your ride
              </h1>
              <div
                ref={locationCloseRef}
                onClick={() => {
                  setLocationOpen(false);
                  setSmallPanelOpen(true);
                }}
                className="flex justify-center items-center gap-2"
              >
                <RiArrowDownWideLine className="text-3xl" />
              </div>
            </div>
            <div className="w-full h-[52vh] mt-4  px-2 overflow-y-auto">
              <RidesList />
            </div>
            <button
              ref={ridesCloseRef}
              onClick={() => {
                handleConfirmRide();
                setLocationOpen(false);
                setPanelOpen(false);
                setRidesOpen(true);
              }}
              className="bg-black text-white w-full h-14 rounded-2xl mt-8"
            >
              <h1 className="text-xl -tracking-tight font-semibold ">
                Confirm Ride
              </h1>
            </button>
          </div>
          <div
            ref={smallPanelRef}
            className="w-full h-[13vh] absolute top-0 left-0 py-2 rounded-2xl bg-white"
          >
            <div className="w-full  flex justify-between items-center">
              <div
                onClick={() => {
                  setLocationOpen(true);
                  setSmallPanelOpen(false);
                }}
                className=" text-black h-full w-full flex flex-col "
              >
                <div className="flex  justify-between items-center w-full">
                  <div className=" h-1/2 ">
                    <GrLocationPin className="text-3xl ml-14" />
                  </div>
                  <div className=" h-1/2 ">
                    <TfiLineDotted className="text-6xl " />
                  </div>
                  <div className=" h-1/2">
                    <GrLocation className="text-3xl mr-14" />
                  </div>
                </div>
                <div className=" flex justify-between w-full">
                  <div className="flex flex-col w-full max-w-[160px] h-12">
                    <h2
                      className="w-full h-full text-mg  leading-tight text-center tracking-tighter overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minHeight: "2.5em", // ensures at least 2 lines
                        maxHeight: "2.5em", // restricts to 2 lines
                        whiteSpace: "normal",
                      }}
                    >
                      {startingLocationName}
                    </h2>
                  </div>
                  <div className=" flex flex-col w-full max-w-[160px] h-12">
                    <h2
                      className="w-full h-full  text-mg leading-tight text-center tracking-tighter overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minHeight: "2.5em",
                        maxHeight: "2.5em",
                        whiteSpace: "normal",
                      }}
                    >
                      {destinationLocationName}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            ref={ridesRef}
            onClick={() => {
              setLocationOpen(false);
              setPanelOpen(false);
            }}
            className="w-full h-[40vh] absolute top-0 left-0 py-6 rounded-2xl bg-white"
          >
            <div className="w-full px-6 flex justify-between items-center">
              <h1 className="text-black font-semibold text-[25px] truncate">
                Looking for the rides
              </h1>
            </div>
            <div className="w-full overflow-y-auto">
              <div className="flex flex-col justify-center items-center">
                <div className="absolute top-28 left-50 -z-100 rounded-full w-40 h-[8vh] bg-blue-200"></div>
                <div className="absolute top-28  left-50 -z-10 rounded-full w-60 h-[10vh] bg-blue-50"></div>
                <img
                  className=" h-28 mb-8 object-cover z-10"
                  src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_384,w_576/v1714471451/assets/27/362eaf-3e88-4568-a460-29b0da41c285/original/UberX-%281%29.png"
                  alt=""
                />
                <div className="w-full flex flex-col items-center justify-start mt-2">
                  <div className="w-full flex flex-row gap-6 px-2 mt-4">
                    <div className="rounded-full w-10 h-10 mt-2 flex items-center justify-center ">
                      <HiLocationMarker className="w-6 h-6 ml-4 text-black" />
                    </div>
                    <div className="text-lg leading-tight font-extrabold">{startingLocationName}</div>
                  </div>
                  <div className="w-full flex flex-row gap-6 px-2 mt-2">
                    <div className="rounded-full  w-10 h-10 mt-2 flex items-center justify-center ">
                      <GrLocationPin className="w-6 h-6 ml-4 text-black" />
                    </div>
                    <div className="leading-tight font-bold text-lg">
                      {destinationLocationName}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhereTo;
