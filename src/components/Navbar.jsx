import React from "react";
import Container from "./Container/Container";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useSelector } from "react-redux";

function Navbar() {
  const isNavbarHidden = useSelector((state) => state.theme.navbarHidden);
  return (
    <>
      <nav
        className={`${
          isNavbarHidden ? "hidden" : "block"
        } h-[10vh]  w-full  border-b-1 border-gray-300 shadow-sm`}
      >
        <Container className=" h-full place-items-center grid grid-cols-12 ">
          {/* row 1 */}
          <div className=" h-full justify-self-start flex col-span-2 ">
            <Link to={"/"}>
              <Logo></Logo>
            </Link>
          </div>
          {/* row 2 */}
          <div className=" col-span-8">
            <ul className="w-full items-center justify-center gap-6 flex-row flex">
              <Link
                to="/"
                className="hover:bg-secondary  duration-300 px-4 rounded-sm"
              >
                <li className="text-lg font-medium">Dashboard</li>
              </Link>
              <Link
                to="/promodoro"
                className="hover:bg-secondary duration-300 px-4 rounded-sm"
              >
                <li className="text-lg font-medium">Promodoro</li>
              </Link>
              <Link
                to="/calendar"
                className="hover:bg-secondary duration-300 px-4 rounded-sm"
              >
                <li className="text-lg font-medium">Calendar</li>
              </Link>
            </ul>
          </div>
          {/* row 3 */}
          <div className="  col-span-2"></div>
        </Container>
      </nav>
    </>
  );
}

export default Navbar;
