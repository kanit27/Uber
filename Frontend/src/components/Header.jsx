import { SiUber } from "react-icons/si";
import { IoIosSettings   } from 'react-icons/io';

const Header = () => {
  return (
    <div className="w-full absolute flex justify-end  p-4 z-[9999]">
      <IoIosSettings  className="w-8 h-8  rounded-full bg-black text-white p-1" />
    </div>
  );
}

export default Header