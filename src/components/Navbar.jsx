import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "./Container/Container";
import Logo from "./Logo";
import { useDispatch, useSelector } from "react-redux";
import ProfileLogo from "./ProfileLogo";
import { logoutUser } from "../store/authSlice";
import AlarmSystem from "./AlarmSystem";

function Navbar() {
  const isNavbarHidden = useSelector((state) => state.theme.navbarHidden);
  const userStatus = useSelector((state) => state.auth.status);
  const location = useLocation();
  const navRef = useRef(null);
  const containerRef = useRef(null);
  const [bgPosition, setBgPosition] = useState({ left: 0, width: 0 });

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logoutUser());
  };
  // Function to check if a link is active
  const isActive = (path) => location.pathname === path;

  // Set background position behind the active link
  const updateActiveBackground = () => {
    const activeLink = document.querySelector(".active-nav-link");
    if (activeLink) {
      const { left, width, height } = activeLink.getBoundingClientRect();
      setBgPosition({
        left: left - containerRef.current.getBoundingClientRect().left,
        width,
      });
    }
  };

  // Update background when route changes
  useEffect(() => {
    updateActiveBackground();
  }, [location.pathname]);

  return (
    <nav
      ref={navRef}
      className={`relative h-[10vh] bg-white border-b-1 border-gray-300 shadow-sm w-full z-[99999999]`}
    >
      {/* Moving Background Behind Active Link */}

      <Container className="h-full place-items-center grid grid-cols-12 relative">
        {/* Logo */}
        <div className="h-full justify-self-start flex col-span-2 bg-white">
          <Link to={"/"}>
            <Logo />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="col-span-8 bg-[#0000001a] px-2 py-1 rounded-sm relative z-10">
          <ul
            className="w-full items-center justify-center gap-6 flex-row flex relative"
            ref={containerRef}
          >
            {[
              { path: "/dashboard", label: "Dashboard" },
              { path: "/promodoro", label: "Pomodoro" },
              { path: "/calendar", label: "Calendar" },
            ].map((link) => (
              <>
                <div
                  className="absolute h-full  bg-secondary transition-all duration-1000 ease-out rounded-sm"
                  style={{
                    left: `${bgPosition.left}px`,
                    width: `${bgPosition.width}px`,
                    // height: `${bgPosition.height}px`,
                  }}
                ></div>
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 rounded-sm relative duration-300 z-10 ${
                    isActive(link.path)
                      ? "active-nav-link text-white"
                      : "hover:text-gray-900"
                  }`}
                >
                  <li className="text-lg font-medium">{link.label}</li>
                </Link>
              </>
            ))}
          </ul>
        </div>

        {/* Profile & Alarm System */}
        <div className="col-span-2 flex items-center  justify-center">
          {userStatus ? (
            <ProfileLogo />
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-1 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Link to="/login">Login</Link>
            </button>
          )}
          <div>
            <AlarmSystem />
          </div>
        </div>
      </Container>
    </nav>
  );
}

export default Navbar;
