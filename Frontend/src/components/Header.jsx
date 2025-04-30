import React from 'react'
import { MdAccountCircle } from 'react-icons/md';

const Header = () => {
  return (
    <div className="absolute top-6 right-6 text-white text-[40px] z-10 font-bold">
      <MdAccountCircle />

    </div>
  );
}

export default Header