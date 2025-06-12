import { SiUber } from "react-icons/si";
import { IoIosSettings } from 'react-icons/io';
import { useNavigate } from "react-router-dom";

const CaptionHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="right-0 absolute flex justify-end  p-4 z-[9999]">
      <IoIosSettings
        className="w-8 h-8 rounded-full bg-black text-white p-1 cursor-pointer"
        onClick={() => navigate("/caption-profile")}
      />
    </div>
  );
}

export default CaptionHeader