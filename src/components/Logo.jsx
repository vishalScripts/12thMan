import React from "react";
import logo from "../assets/logo.png";

function Logo() {
  return (
    <div className="w-14 hover:w-28 duration-500  overflow-hidden h-14 flex items-center group  ">
      <img
        className="w-14 aspect-square object-center object-cover scale-125 drop-shadow-md  duration-300 drop-shadow-purple-500 group-hover:w-8"
        src={logo}
        alt="logo"
      />
      <h3 className="duration-100 min-w-20 font-extrabold text-purple-500 drop-shadow-purple-500 drop-shadow-xs ">
        12th Man
      </h3>
    </div>
  );
}

export default Logo;
