import React, { useState } from "react";
import PromodoroComp from "../components/PromodoroComp";
import Container from "../components/Container/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  ViewfinderCircleIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  SparklesIcon,
  QueueListIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/solid";
import { hideNavbar } from "../store/themeSlice";
import Time from "../components/Time";
import Sidebar from "../components/Sidebar";
import AudioPlayer from "../components/AudioPlayer";
import { PaintBrushIcon } from "@heroicons/react/24/solid";
import TasksComp from "../components/TasksComp";

import ThemesContainer from "../components/ThemesContainer";
import FloatingWidget from "../components/FloatingWidget";
import { div } from "motion/react-client";
import MusicContainer from "../components/MusicContainer";
function Promodoro() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const background = useSelector((state) => state.theme.themeBackground);
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.theme.isSidebarHidden);
  const [showThemeContainer, setShowThemeContainer] = useState(false);
  const [showTasksContainer, setShowTasksContainer] = useState(false);
  const [activeContainer, setActiveContainer] = useState(null);

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
      {/* <Sidebar clasname="fixed">
        <div
          className={` row-start-2 ${
            isSidebarOpen ? "row-end-10" : "row-end-3"
          } duration-300 flex items-center justify-center `}
        >
          {isSidebarOpen ? <ThemesContainer /> : <></>}
        </div>
        
        <div
          className={`  ${
            isSidebarOpen
              ? "row-start-10 row-end-12"
              : "row-start-3 row-end-4 hidden"
          } duration-300 flex items-center justify-center overflow-hidden`}
        >
          <AudioPlayer />
        </div>
      </Sidebar> 
      */}

      {/*! side bar */}

      <div className="fixed z-[999] bottom-0 flex items-center justify-center  left-0  h-[90vh]  bg-[#ffffff0d]">
        <div className="w-12 px-2 h-[80%] grid-cols-1  items-center grid-rows-12 grid justify-center">
          <div
            onClick={() => {
              dispatch(hideNavbar(!isFullScreen));
              toggleFullScreen();
            }}
            className=" rounded-sm w-full cursor-pointer p-0.5 bg-[#ec89d80d] hover:bg-secondary-hover duration-200 aspect-square group"
          >
            <ArrowsPointingOutIcon className="w-full h-full group-hover:scale-75 text-black duration-150" />
          </div>
          <div className=" gap-2 self-start row-start-3 flex bg-[#ec89d84d] px-0.5 py-2 backdrop-blur-xs border-1 border-[#ece58969] rounded-md items-center flex-col justify-start w-full   row-end-11">
            <div
              onClick={() =>
                setActiveContainer(activeContainer === "theme" ? null : "theme")
              }
              className={`p-1 border-1 row-start-3 rounded-sm w-full cursor-pointer bg-[#ec89d84d] backdrop-blur-sm hover:bg-[#ec89d8] duration-200 aspect-square group  hover:shadow-sm shadow-secondary ${
                activeContainer === "theme" ? "bg-secondary shadow-sm " : ""
              }`}
            >
              <SparklesIcon className="w-full h-full group-hover:scale-75 text-black duration-150" />
            </div>
            <div
              onClick={() =>
                setActiveContainer(activeContainer === "tasks" ? null : "tasks")
              }
              className={`p-1  border-1 row-start-3 rounded-sm w-full cursor-pointer bg-[#ec89d84d] backdrop-blur-sm hover:bg-[#ec89d8] duration-200 aspect-square group  hover:shadow-sm shadow-secondary ${
                activeContainer === "tasks" ? "bg-secondary shadow-sm " : ""
              }`}
            >
              <QueueListIcon className="w-full h-full group-hover:scale-75 text-black duration-150" />
            </div>
            <div
              onClick={() =>
                setActiveContainer(activeContainer === "music" ? null : "music")
              }
              className={`p-1  border-1 row-start-3 rounded-sm w-full cursor-pointer bg-[#ec89d84d] backdrop-blur-sm hover:bg-[#ec89d8] duration-200 aspect-square group hover:shadow-sm shadow-secondary ${
                activeContainer === "music" ? "bg-secondary  shadow-sm " : ""
              }`}
            >
              <MusicalNoteIcon className="w-full h-full group-hover:scale-75 text-black duration-150" />
            </div>
          </div>
        </div>
        <div className="       w-64 h-[80vh] ml-6">
          {activeContainer === "theme" && <ThemesContainer />}
          {activeContainer === "music" && (
            <div className="bg-white rounded-sm h-full py-4 px-2">
              <MusicContainer />
            </div>
          )}
          {activeContainer === "tasks" && (
            <div className="bg-white rounded-sm h-full overflow-hidden py-4 px-2">
              <TasksComp
                className="h-full"
                fixedHeight="h-[95%] overflow-y-scroll overflow-x-hidden  scroll-smooth scroll-snap-y 
            [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-white
  [&::-webkit-scrollbar-thumb]:bg-slate-700
  dark:[&::-webkit-scrollbar-track]:bg-white
  dark:[&::-webkit-scrollbar-thumb]:bg-slate-700"
              />
            </div>
          )}
        </div>
      </div>

      <PromodoroComp />
      {/* <video
        autoPlay
        loop
        muted
        className=" fixed w-screen top-0 left-0 z-0 h-screen object-cover object-center "
      >
        <source src={background} type="video/mp4" />
      </video> */}
      {/* <FloatingWidget /> */}
    </div>
  );
}

export default Promodoro;
