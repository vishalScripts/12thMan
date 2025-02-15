import { useState } from "react";
import { useTimer } from "../hooks/useTimer";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { pre } from "motion/react-client";
import normalTheme from "../assets/normalTheme.png";
import ThemesContainer from "./ThemesContainer";
import Time from "./Time";
import {
  ArrowPathIcon,
  PlayIcon,
  StopCircleIcon,
} from "@heroicons/react/24/solid";

function PromodoroComp() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const layoutType = useSelector((state) => state.theme.layoutType);
  console.log(layoutType);
  const [option, setOption] = useState("promodoro");
  const {
    minutes,
    seconds,
    isRunning,
    start,
    stop,
    reset,
    type1,
    type2,
    totalTime,
  } = useTimer(30, 0);
  // 25 minutes in seconds
  const currentTime = minutes * 60 + seconds;
  const progress = (currentTime / totalTime) * 100;

  function changeOption(opt) {
    setOption(opt);
  }

  if (layoutType === "normal") {
    return (
      <div className="py-12 w-full duration-1000 z-10 bg-transparent  flex flex-col  items-center justify-center relative">
        <div className="h-[70vh] mx-auto shadow-2xl aspect-video border-2 border-white rounded-lg bg-[#ec89d88a] flex flex-col items-center">
          {/* Buttons */}
          <div className="w-full flex items-center justify-center py-2">
            <div className="bg-white rounded-full flex items-center justify-between border-1 border-gray-100">
              <button
                onClick={() => changeOption("promodoro")}
                className={`${
                  option === "promodoro"
                    ? "bg-accent"
                    : "bg-white hover:bg-secondary-hover"
                } rounded-l-full px-2 duration-500 cursor-pointer`}
              >
                Pomodoro
              </button>
              <button
                onClick={() => changeOption("custom")}
                className={`${
                  option === "custom"
                    ? "bg-accent"
                    : "bg-white hover:bg-secondary-hover"
                } rounded-r-full px-2 duration-500 cursor-pointer`}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Circular Progress Bar */}
          <div className="relative h-full aspect-square">
            <svg
              className="absolute top-0 left-0 w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="white"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={minutes < 5 ? "green" : "#f36015"}
                strokeWidth="4"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (progress / 100) * 251.2}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="flex flex-col items-center justify-center absolute inset-0">
              <Time />

              {/* <p>{minutes < 5 ? "Break" : "break in -"}</p> */}
              <div className="text-text text-center translate-x-4 font-bold text-6xl">
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}{" "}
                <select
                  name="timeSelect"
                  className=" w-5 hover:scale-125 duration-300 cursor-pointer"
                  id="timeSelect"
                  onChange={(e) => {
                    if (e.target.value === "30") {
                      type1();
                    } else if (e.target.value === "60") {
                      type2();
                    }
                  }}
                >
                  <option value="30" className="text-sm cursor-pointer">
                    25-30
                  </option>
                  <option value="60" className="text-sm cursor-pointer">
                    55-60
                  </option>
                </select>
              </div>

              <p className=" flex items-center justify-center flex-col">
                <div>
                  break:5min{" "}
                  <select name="brakOption" id="breakOption" className="w-4">
                    <option
                      value="0"
                      className="text-red-600 text-sm hover:text-red-600 "
                    >
                      feature comming sooon
                    </option>
                  </select>
                </div>
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="py-4 flex gap-4">
            <Button className="" onClick={start}>
              <PlayIcon className="w-6" />
            </Button>
            <Button className="" onClick={stop}>
              <StopCircleIcon className="w-6" />
            </Button>
            <Button className="" onClick={reset}>
              <ArrowPathIcon className="w-6" />
            </Button>
          </div>
        </div>

        {/* Drawer  */}
      </div>
    );
  } else if (layoutType == "modern") {
    return (
      <div className="w-full duration-1000 flex flex-col items-center justify-center relative">
        <div className="h-[70vh] mx-auto  aspect-video  rounded-lg flex flex-col justify-center  items-center ">
          {/* Circular Progress Bar */}
          <Time />
          <div className="flex  flex-col  items-center justify-center  inset-0">
            {/* <p>{minutes < 5 ? "Break" : "break in -"}</p> */}
            <div className="text-text flex items-center justify-center text-center font-bold text-6xl">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}{" "}
              <select
                name="timeSelect"
                className=" w-5 hover:scale-125 duration-300 cursor-pointer"
                id="timeSelect"
                onChange={(e) => {
                  if (e.target.value === "30") {
                    type1();
                  } else if (e.target.value === "60") {
                    type2();
                  }
                }}
              >
                <option value="30" className="text-sm cursor-pointer">
                  25-30
                </option>
                <option value="60" className="text-sm cursor-pointer">
                  55-60
                </option>
              </select>
            </div>

            <p className=" flex items-center justify-center flex-row">
              break:5min{" "}
              <select
                name="brakOption"
                id="breakOption"
                className="w-4 hover:scale-125 duration-300 cursor-pointer"
              >
                <option
                  value="0"
                  className="text-red-600 text-sm hover:text-red-600 "
                >
                  feature comming sooon
                </option>
              </select>
            </p>
          </div>

          {/* Buttons */}
          <div className=" py-4 ">
            <div className=" flex  gap-4">
              <Button
                className="bg-transparent  hover:bg-transparent hover:backdrop-blur-lg hover:border-1  hover:border-text hover:shadow-2xs backdrop-blur-[2px] "
                onClick={start}
              >
                <PlayIcon className="w-6" />
              </Button>
              <Button
                className="bg-transparent  hover:bg-transparent hover:backdrop-blur-lg hover:border-1  hover:border-text hover:shadow-2xs backdrop-blur-[2px]"
                onClick={stop}
              >
                <StopCircleIcon className="w-6" />
              </Button>
              <Button
                className="bg-transparent  hover:bg-transparent hover:backdrop-blur-lg hover:border-1  hover:border-text hover:shadow-2xs backdrop-blur-[2px]"
                onClick={reset}
              >
                <ArrowPathIcon className="w-6" />
              </Button>
            </div>
          </div>
        </div>
        {/* Drawer  */}
      </div>
    );
  } else {
    return (
      <div className="w-full flex h-full bg-white duration-1000 flex-col items-center justify-center relative">
        <h1 className="font-bold  text-9xl text-red-500">Comming Soon</h1>
      </div>
    );
  }
}

export default PromodoroComp;
