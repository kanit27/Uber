import React from "react";
import { HiLocationMarker } from "react-icons/hi";

const SuggestionList = (props) => {

  const locations = [
    {
      id: 1,
      name: "Waghawadi Road",
      address: "Waghawadi Road, Mumbai",
      distance: "10km",
    },
    {
      id: 2,
      name: "Waghawadi Road",
      address: "Waghawadi Road, Mumbai",
      distance: "10km",
    },
    {
      id: 3,
      name: "Waghawadi Road",
      address: "Waghawadi Road, Mumbai",
      distance: "10km",
    }
  ];

  return (
    <>
      {locations.map((location) => (
        <div
        onClick={() => 
        {
          props.setLocationOpen(true);
        }}
          key={location.id}
          className="w-full flex flex-row gap-3 px-2 py-3 border-b-[1px] border-neutral-300"
        >
          <div className="rounded-full bg-neutral-500 w-10 h-10 mt-1 flex items-center justify-center ">
            <HiLocationMarker className="p-2 w-10 h-10 text-3xl text-white" />
          </div>
          <div className="flex flex-col ">
            <h1 className="text-xl truncate">{location.name}</h1>
            <p className="w-80 text-md truncate">{location.address}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default SuggestionList;
