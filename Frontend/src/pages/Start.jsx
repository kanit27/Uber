
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { IoTicket } from "react-icons/io5";
import { MdElectricRickshaw } from "react-icons/md";
import { SiUbereats } from "react-icons/si";
import { IoMdCar } from "react-icons/io";
import { MdDirectionsBike } from "react-icons/md";
import { IoMdTrain } from "react-icons/io";
import { MdFastfood } from "react-icons/md";
import { Link } from 'react-router-dom';
import { SiUber } from 'react-icons/si';

const Start = () => {

  return (
    <div className="relative h-screen w-screen bg-black">
      <div className="absolute top-[20%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 text-xl text-white">
      <MdFastfood />
      </div>
      <div className="absolute top-[30%] left-[70%] transform -translate-x-1/2 -translate-y-1/2 text-xl text-white">
      <IoMdTrain />
      </div>
      <div className="absolute top-[70%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 text-xl text-white">
      <IoMdCar />
      </div>
      <div className="absolute top-[60%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 text-xl text-white">
      <MdDirectionsBike />
      </div>
      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-white text-9xl">
      <SiUber />
      </div>
      <Link className="absolute top-10 -left-4 pl-8 pr-5 text-4xl py-1 rounded-xl text-black bg-white ">
      <SiUbereats />
      </Link>
      <div className="absolute bottom-[20%] right-[40%] transform -translate-x-1/2 -translate-y-1/2 text-xl text-white">
      <MdElectricRickshaw />
      </div>
      <div className="absolute top-[20%] left-[90%] transform -translate-x-1/2 -translate-y-1/2 text-xl text-white">
      <IoTicket />
      </div>
      <div className="absolute top-[40%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 text-xl text-white">
      <TbTruckDelivery />
      </div>

      <Link
      to="/user-login"
      className="absolute bottom-20 left-[85%] transform -translate-x-1/2 -translate-y-1/2 text-black bg-white text-2xl px-2 py-2 border-neutral-100 rounded-full"
      >
      <MdKeyboardDoubleArrowRight />
      </Link>
    </div>
    );
  };

export default Start;
