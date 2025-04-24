import React from "react";
import logo from "../assets/logo.png";

function Logo() {
  return (
    <div className="w-14 aspect-square flex items-center  ">
      <img
        className="w-full object-center object-cover scale-150"
        src={logo}
        alt="logo"
      />
    </div>
  );
}

export default Logo;
