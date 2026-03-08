
import React from "react";
import { IoMdAdd } from "react-icons/io";


const Header = ({add,setAdd}) => {
  return (
    <div className="shadow-lg px-4 py-4 sm:px-6 sm:py-5 md:px-10 bg-blue-500 flex w-full justify-between items-center gap-4">
      <h1 className="text-lg sm:text-2xl capitalize font-serif font-semibold text-white">anny</h1>
      <div className="flex gap-3 sm:gap-6 items-center *:border-2 sm:*:border-4 *:rounded-full *:p-2 *:border-white *:text-white *:text-xl sm:*:text-2xl *:font-bold *:cursor-pointer *:active:scale-120 *:duration-300">
        <button
        onClick={()=>setAdd(!add)}><IoMdAdd /></button>
  
      </div>
    </div>
  );
};

export default Header;
