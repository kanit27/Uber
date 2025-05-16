import { SiUber } from "react-icons/si";
import { IoIosSettings   } from 'react-icons/io';

const Header = () => {
  return (
    <div className="w-full h-16 flex items-center justify-between px-4">
      <SiUber className="w-20 h-14" />
      <IoIosSettings  className="w-8 h-8 rounded-full bg-black text-white p-1" />
    </div>
  );
}

export default Header