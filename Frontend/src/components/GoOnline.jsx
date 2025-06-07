import React from "react";

const GoOnline = () => {
  return (
    <div className="w-full flex flex-col h-full ">
      <div className="w-full flex justify-center items-end pb-8 absolute bottom-0 right-0 z-[9999]">
        <div
          
          className="bg-black rounded-full px-4   h-14 flex justify-start gap-2 items-center cursor-pointer"
        >
         
          <button className="text-[24px] font-semibold text-[Questrial] text-white  pl-2">
            Go Online
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default GoOnline;
