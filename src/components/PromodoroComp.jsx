import { useState } from "react";
import { useTimer } from "../hooks/useTimer";
import Button from "./Button";

function PromodoroComp() {
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

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="h-[70vh] mx-auto shadow-2xl aspect-video border-2 border-white rounded-lg bg-secondary flex flex-col items-center">
        {/* Buttons */}
        <div className="w-full flex items-center justify-center py-2">
          <div className="bg-white rounded-full flex items-center justify-between border-1 border-gray-100">
            <button
              onClick={() => changeOption("promodoro")}
              className={`${
                option === "promodoro"
                  ? "bg-secondary"
                  : "bg-white hover:bg-secondary-hover"
              } rounded-l-full px-2 duration-500 cursor-pointer`}
            >
              Pomodoro
            </button>
            <button
              onClick={() => changeOption("custom")}
              className={`${
                option === "custom"
                  ? "bg-secondary"
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
            {/* <p>{minutes < 5 ? "Break" : "break in -"}</p> */}
            <div className="text-text text-center font-bold text-6xl">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}{" "}
              <select
                name="timeSelect"
                className=" w-5 "
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
            <p className="">
              break:5min{" "}
              <select name="brakOption" id="breakOption" className="w-4">
                <option
                  value="0"
                  className="text-red-600 text-sm hover:text-red-600 "
                >
                  feature comming sooon
                </option>
              </select>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="py-4 flex gap-4">
          <Button className="" onClick={start}>
            Start
          </Button>
          <Button className="" onClick={stop}>
            Stop
          </Button>
          <Button className="" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PromodoroComp;
