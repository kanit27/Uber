import React, { useState } from "react";
import { RiUserFill } from "react-icons/ri";

const RidesList = () => {

  const [selectedRide, setSelectedRide] = useState(null);

  const handleSelectRide = (id) => {
    setSelectedRide(id); // Update the selected ride
  };


    const rides = [
        {
            id: 1,
            image: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_384,w_576/v1714471451/assets/27/362eaf-3e88-4568-a460-29b0da41c285/original/UberX-%281%29.png",
            name: "UberGo",
            distance: "2 mins away",
            time: "15:25",
            price: "₹ 193.20",
            description: "Affordable, compact rides",
            seats: 4,
        },
        {
            id: 2,
            name: "Auto",
            image:"https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
            distance: "5 mins away",
            time: "15:30",
            price: "₹ 293.20",
            description: "Spacious rides for more passengers",
            seats: 2,
        },
        {
            id: 3,
            name: "UberX",
            image:"https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1682350473/assets/97/e2a99c-c349-484f-b6b0-3cea1a8331b5/original/UberBlack.png",
            distance: "10 mins away",
            time: "15:35",
            price: "₹ 393.20",
            description: "Comfortable rides for long distances",
            seats: 4,
        },
        {
            id: 4,
            name: "Bike",
            image:"https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
            distance: "15 mins away",
            time: "15:40",
            price: "₹ 493.20",
            description: "Luxury rides for special occasions",
            seats: 1,
        },
        {
            id: 5,
            name: "UberSUV",
            image:"https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1652995234/assets/92/8d4288-e896-4333-9bc2-c60c49f2a095/original/UberXL_Black_v2.png",
            distance: "20 mins away",
            time: "15:45",
            price: "₹ 593.20",
            description: "Spacious rides for more passengers",
            seats: 7,
        }
    ];



  return (
    <>
      {rides.map((ride) => (
        <div
          key={ride.id}
          onClick={() => handleSelectRide(ride.id)}
          className={`w-full flex flex-row py-4 mb-4 rounded-2xl cursor-pointer ${
            selectedRide === ride.id
              ? "bg-neutral-100 border-[1px] border-black" // Apply styles if selected
              : "active:bg-[#f5f5f5] active:border-[2px] active:border-black"
          }`}
          >
          <img className="h-16  object-cover" src={ride.image} alt="" />
          <div className="w-56 flex pl-2 flex-col leading-none">
            <div className="flex flex-row gap-2  items-center">
              <h2 className="text-lg font-semibold">{ride.name}</h2>
              <span className="flex flex-row">
                <RiUserFill className="text-xl text-black" />
                <span className="text-sm text-black">{ride.seats}</span>
              </span>
            </div>
            <div className="flex flex-row gap-2 items-center ">
              <h3>{ride.distance}</h3>
              <span className=" w-1 h-1 bg-black rounded-full"></span>
              <span>{ride.time}</span>
            </div>
            <div className="text-neutral-500 ">
              <p>{ride.description}</p>
            </div>
          </div>
          <div className="py-3 w-24  text-2xl font-semibold tracking-tighter">
            {ride.price}
          </div>
        </div>
      ))}
    </>
  );
};

export default RidesList;
