import React from 'react'
import LocationSearch from '../components/LocationSearch'
import { RiArrowLeftLine } from 'react-icons/ri'
import SuggestionList from '../components/SuggestionList'
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';


const Search = () => {
 



  return (
    <div className="h-screen w-screen">
      <div className="w-full h-full  py-4 bg-white">
        <div className="w-full flex items-center justify-start gap-24 px-2 text-xl font-semibold ">
          <Link to={"/home"} className="flex justify-center items-center gap-2">
            <RiArrowLeftLine className="text-3xl" />
          </Link>
          <h1 className="text-black font-semibold text-[25px] truncate">
            Plan your ride
          </h1>
        </div>
        <LocationSearch />
        <div className="w-full h-3/4 flex flex-col border-t-[1px] border-neutral-300 overflow-auto">
          <SuggestionList />
          <SuggestionList />
          <SuggestionList />
          <SuggestionList />
          <SuggestionList />
          <SuggestionList />
          <SuggestionList />
          <SuggestionList />
          <SuggestionList />
          <SuggestionList />
        </div>
      </div>
    </div>
  );
}

export default Search