import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "./Container/Container";
import Logo from "./Logo";
import { useDispatch, useSelector } from "react-redux";
import ProfileLogo from "./ProfileLogo";
import { logoutUser } from "../store/authSlice";
import AlarmSystem from "./AlarmSystem";
import ThemeBtn from "./ThemeBtn";

function Navbar() {
  const isNavbarHidden = useSelector((state) => state.theme.navbarHidden);
  const userStatus = useSelector((state) => state.auth.status);
  const theme = useSelector((state) => state.theme.theme);

  console.log(theme, Math.random());
  const location = useLocation();
  const navRef = useRef(null);
  const containerRef = useRef(null);
  const [bgPosition, setBgPosition] = useState({ left: 0, width: 0 });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const activeLink = document.querySelector(".active-nav-link");
    if (activeLink && containerRef.current) {
      const { left, width } = activeLink.getBoundingClientRect();
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      setBgPosition({
        left: left - containerLeft,
        width,
      });
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logoutUser());
  };

  return (
    <nav
      ref={navRef}
      className={`relative h-[10vh] bg-background border-b border-border shadow-sm  w-full z-[99999999]`}
    >
      <Container className="h-full grid grid-cols-12 items-center relative">
        {/* Logo */}
        <div className="col-span-2">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* Nav Links */}
        <div className="col-span-4 col-start-5 bg-accent/10 px-2 py-1 rounded-sm relative z-10 ">
          <ul
            ref={containerRef}
            className="flex gap-6 justify-center items-center w-full relative"
          >
            <div
              className="absolute h-full bg-secondary transition-all duration-500 ease-in-out rounded-sm"
              style={{
                left: `${bgPosition.left}px`,
                width: `${bgPosition.width}px`,
              }}
            />
            {[
              { path: "/dashboard", label: "Dashboard" },
              { path: "/pomodoro", label: "Pomodoro" },
              { path: "/calendar", label: "Calendar" },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-sm text-text relative z-10 duration-300 ${
                  location.pathname === link.path
                    ? "active-nav-link text-text font-bold"
                    : "hover:text-text/55"
                }`}
              >
                <li className="text-lg">{link.label}</li>
              </Link>
            ))}
          </ul>
        </div>

        {/* Profile + Alarm + Theme */}
        <div className="col-span-2 col-start-10  flex justify-end items-center gap-2">
          {userStatus ? (
            <ProfileLogo />
          ) : (
            <Link to="/login">
              <button className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Login
              </button>
            </Link>
          )}
          <AlarmSystem />
          <ThemeBtn variant={"navbar"} />
        </div>
      </Container>
    </nav>
  );
}

export default Navbar;
