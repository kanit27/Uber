import React, { useEffect, useRef, useState } from "react";
import { MdOutlineEmergencyShare, MdSearch, MdStarRate } from "react-icons/md";
import { useGSAP } from "@gsap/react";
import { RiArrowDownWideLine } from "react-icons/ri";
import { GrLocationPin } from "react-icons/gr";
import { GrLocation } from "react-icons/gr";
import gsap from "gsap";
import { AiOutlineSafety } from "react-icons/ai";
import LocationSearch from "../components/LocationSearch";
import RidesList from "../components/RidesList";
import { TiMessage } from "react-icons/ti";
import { HiLocationMarker } from "react-icons/hi";
import {
  IoCallOutline,
  IoWallet,
  IoArrowBackCircleOutline,
} from "react-icons/io5";
import { TfiLineDotted } from "react-icons/tfi";
import socket from "../socket";

const WhereTo = ({ setRouteCoords }) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [ridesOpen, setRidesOpen] = useState(false);
  const [smallPanelOpen, setSmallPanelOpen] = useState(false);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [startingLocationName, setStartingLocationName] =
    useState("Starting Location");
  const [destinationLocationName, setDestinationLocationName] = useState(
    "Destination Location"
  );
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const locationRef = useRef(null);
  const locationCloseRef = useRef(null);
  const ridesRef = useRef(null);
  const ridesCloseRef = useRef(null);
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

  const handleConfirmRide = () => {
    // You can add more ride details as needed
    socket.emit("ride_request", {
      location: currentCoords, // or pickup location
      destination: destinationCoords,
      startingLocationName,
      destinationLocationName,
      // Add price, vehicle, etc. if needed
    });
  };

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
            className="w-full h-[70vh] absolute top-0 left-0 py-6 rounded-2xl bg-white"
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
              className="bg-black text-white w-full h-14 rounded-2xl mt-6"
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
            className="w-full h-[50vh] absolute top-0 left-0 py-6 rounded-2xl bg-white"
          >
            <div className="w-full px-6 flex justify-between items-center">
              <h1 className="text-black font-semibold text-[25px] truncate">
                Looking for the rides
              </h1>
              <div
                ref={ridesCloseRef}
                onClick={() => setRidesOpen(false)}
                className="flex justify-center items-center gap-2"
              >
                <RiArrowDownWideLine className="text-3xl" />
              </div>
            </div>
            <div className="w-full  mt-4 overflow-y-auto">
              <div className="flex flex-col justify-center items-center">
                <div className="absolute top-32 left-50 -z-100 rounded-full w-40 h-[8vh] bg-blue-200"></div>
                <div className="absolute top-32  left-50 -z-10 rounded-full w-60 h-[10vh] bg-blue-50"></div>
                <img
                  className=" h-32 mb-8 object-cover z-10"
                  src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_384,w_576/v1714471451/assets/27/362eaf-3e88-4568-a460-29b0da41c285/original/UberX-%281%29.png"
                  alt=""
                />
                <div className="w-full flex flex-col items-center justify-start ">
                  <div className="w-full flex flex-row gap-6 px-2 py-2 mt-2 ">
                    <div className="rounded-full w-12 h-12 mt-4 flex items-center justify-center ">
                      <HiLocationMarker className="w-6 h-6 ml-4 text-black" />
                    </div>
                    <div className=" text-lg p-1">
                      {startingLocationName}
                    </div>
                  </div>
                  <div className="w-full flex flex-row gap-6 px-2 py-4 mt-2">
                    <div className="rounded-full  w-12 h-12 mt-4 flex items-center justify-center ">
                      <GrLocationPin className="w-6 h-6 ml-4 text-black" />
                    </div>
                    <div className=" text-lg p-1 ">
                      {destinationLocationName}
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-row gap-3 px-2 py-4 mt-2 ">
                  <div className="rounded-full w-12 h-12 mt-1 flex  items-center justify-center ">
                    <IoWallet className="p-2 w-12 h-12 text-3xl text-black" />
                  </div>
                  <div className="flex flex-col ">
                    <h1 className="text-2xl font-semibold pt-3">₹ 193.20</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div // ref={panelRef}
            className="w-full h-[40vh] py-4 rounded-2xl bg-white "
          >
            <div className="w-full px-6 flex justify-between items-center">
              <div className="flex flex-col mt-2 mb-1 leading-none">
                <h1 className="text-black font-semibold text-[25px] truncate">
                  Arriving in
                </h1>
              </div>
              <div
                ref={panelCloseRef}
                onClick={() => setPanelOpen(false)}
                className="flex justify-center items-center gap-2"
              >
                <p className="text-xl leading-none font-semibold bg-black px-2 py-1.5 rounded-lg text-white ">
                  5 mins
                </p>
              </div>
            </div>
            <div className="w-full flex flex-row justify-between px-6 items-center mt-4 ">
              <div>
                <img
                  className="h-24"
                  src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_384,w_576/v1714471451/assets/27/362eaf-3e88-4568-a460-29b0da41c285/original/UberX-%281%29.png"
                  alt=""
                />
              </div>
              <div className="flex flex-col text-right">
                <h2 className="text-lg">White - Tesla Model S</h2>
                <h1 className="text-2xl font-semibold leading-none">
                  AV 6081 BD
                </h1>
              </div>
            </div>
            <div className="flex justify-between items-center mt-8 px-4">
              <div className="flex flex-col ">
                <img
                  className="w-16 h-16 object-cover rounded-full"
                  src="https://ceoworld.biz/wp-content/uploads/2020/11/Elon-Musk-2.jpg"
                  alt=""
                />
              </div>
              <div className="flex flex-col pr-24 leading-none">
                <h1 className="text-xl font-semibold">Elon Musk</h1>
                <div className="flex flex-row gap-1 items-center">
                  <div className="pb-0.5">
                    <MdStarRate className="text-sm" />
                  </div>
                  <span className="text-md ">5.0</span>
                </div>
              </div>
              <h1 className="tracking-widest text-2xl font-semibold bg-black text-white px-4 py-1.5 rounded-xl border-[1px] border-black">
                1234
              </h1>
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
        </div>
      </div>
    </>
  );
};

export default WhereTo;
