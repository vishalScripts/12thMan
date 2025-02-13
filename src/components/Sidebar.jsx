import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Bars3Icon } from "@heroicons/react/24/solid";

function Sidebar({ children, clasname = "" }) {
  const isFullScreen = useSelector((state) => state.theme.navbarHidden);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`${clasname}  left-0   ${
        isFullScreen ? "top-0 h-screen" : "top-[10vh] h-[90vh]"
      } bg-red-600   

      ${isOpen ? "w-30" : "w-10"}
       p-2 flex flex-col items-center justify-start gap-2
      `}
    >
      {/* row 1 */}
      <div>
        <Bars3Icon className=" w-8" />
      </div>
      {/* row-2 */}
      {children}
    </div>
  );
}

export default Sidebar;
