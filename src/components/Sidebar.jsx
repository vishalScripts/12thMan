import React, { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../store/themeSlice";

function Sidebar({ children, clasname = {} }) {
  const dispatch = useDispatch();

  const isSidebarOpen = useSelector((state) => state.theme.isSidebarHidden);
  console.log(isSidebarOpen);
  // Optional: Forward isOpen and setIsOpen to the parent component using forwardRef if needed

  return (
    <div
      className={`${clasname}  bg-transparent border-gray-400 shadow-2xl    hover:opacity-100 h-full left-0 fixed duration-500 ${
        isSidebarOpen ? "w-50" : "w-12"
      } p-2 grid grid-rows-12 gap-2 z-[999999999]`}
    >
      <div className="flex items-center row-start-1 justify-end w-full ">
        <Bars3Icon
          onClick={() => dispatch(toggleSidebar(!isSidebarOpen))}
          className={`  opacity-30  rounded-sm cursor-pointer w-8 aspect-square bg-accent hover:opacity-100 hover:scale-110 duration-300 hover:shadow-2xs`}
        />
      </div>
      {children}
    </div>
  );
}

// Forwarding the ref to Sidebar for access to isOpen state
export default React.forwardRef(Sidebar);
