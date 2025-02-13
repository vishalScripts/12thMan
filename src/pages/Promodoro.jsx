import React, { useState } from "react";
import PromodoroComp from "../components/PromodoroComp";
import Container from "../components/Container/Container";
import { useDispatch, useSelector } from "react-redux";
import { ViewfinderCircleIcon } from "@heroicons/react/24/solid";
import { hideNavbar } from "../store/themeSlice";
import Time from "../components/Time";
function Promodoro() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const background = useSelector((state) => state.theme.themeBackground);
  const dispatch = useDispatch();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullScreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullScreen(false));
    }
  };

  console.log(background);
  return (
    <div
      className={` ${
        isFullScreen === true
          ? "fixed  w-screen h-screen flex items-center justify-center"
          : "  h-[90vh]"
      }`}
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
      }}
    >
      <div
        onClick={() => {
          dispatch(hideNavbar(!isFullScreen));
          toggleFullScreen();
        }}
        className="absolute top-[13%] right-3 w-8 h-8 cursor-pointer bg-accent flex items-center justify-center rounded-lg object-cover  opacity-25 p-1 hover:opacity-100 hover:scale-105 duration-300 z-[9999999999]"
      >
        <ViewfinderCircleIcon />
      </div>
      <video
        autoPlay
        loop
        muted
        className=" fixed w-screen h-screen object-cover object-center "
      >
        <source src={background} type="video/mp4" />
      </video>
      <PromodoroComp />
    </div>
  );
}

export default Promodoro;
