import React, { useState} from "react";




const LocationSearch = () => {

  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");

  
  const submitLocation = (e) => {
    e.preventDefault();
    console.log("Current Location: ", currentLocation);
    console.log("Destination: ", destination);
  }

  

  return (
    <>
      <div className="relative w-full pt-2 px-6 flex items-center justify-start">
            <div className="border-[1px] h-11 border-black rounded-full absolute top-14 left-[27px]"></div>
            <form
              onSubmit={(e) => {
                submitLocation(e);
              }}
              className="text-lg flex flex-col  pt-4 gap-2"
              action=""
            >
              <div className="flex items-center justify-start gap-2">
                <div className="w-2 h-2 rounded-full bg-black"></div>
                <input
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  type="text"
                  placeholder="Your current location"
                  className="w-[38vh] h-[50px] bg-neutral-100 rounded-xl py-2 px-4 outline-none truncate"
                />
              </div>
              <div className="flex items-center justify-start gap-2 mb-8">
                <div className="w-2 h-2 bg-black"></div>
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  type="text"
                  placeholder="Choose your destination"
                  className="w-[38vh] h-[50px] bg-neutral-100 rounded-xl py-2 px-4 outline-none truncate"
                />
              </div>
            </form>
          </div>
    </>
  );
};

export default LocationSearch;
