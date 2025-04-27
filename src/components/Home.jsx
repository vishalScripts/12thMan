import React, { useEffect, useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";

import Button from "./Button";
import Timers from "./timers";

function Home() {
  const [mins, setMins] = useState(30);
  const [breaks, setBreaks] = useState(5);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    setBreaks(mins / 30);
  }, [mins]);

  return (
    <div className="w-full grid grid-cols-2 grid-rows-6  place-items-center ">
      <div className=" col-start-1 row-start-1 row-end-4 min-h-90  w-full bg-primary/30 rounded-md p-4 flex h-full shadow border border-border flex-col items-center">
        {timerActive ? (
          <div className="" onClick={() => setTimerActive(false)}>
            <Button variant="accent">X</Button>
            <Timers.PixelBlocksTimer mins={mins} />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl ">Get ready to focus </h2>
            <div className="h-full w-full  flex items-center  justify-center ">
              <div className=" flex flex-col gap-2">
                <div className="flex-row  aspect-video h-25  border-primary border rounded-md items-center justify-between  flex">
                  <h1 className="text-6xl font-bold  w-3/4 items-center border-r-2 border-primary/50 justify-center flex  h-full bg-primary/40   ">
                    {mins}
                  </h1>
                  <div className=" h-full w-1/4    flex gap-0.5 flex-col ">
                    <button
                      onClick={() => setMins((prev) => prev + 30)}
                      className=" flex items-center justify-center group hover:bg-primary/60 cursor-pointer   bg-primary/40 h-1/2  group "
                    >
                      <HiChevronUp className="text-2xl group-active:scale-110 group-hover:text-3xl duration-100 " />
                    </button>
                    <button
                      onClick={() =>
                        setMins((prev) => (prev == 30 ? prev : prev - 30))
                      }
                      className=" flex items-center justify-center group hover:bg-primary/60 cursor-pointer  bg-primary/40 h-1/2  group  "
                    >
                      <HiChevronDown className="text-2xl group-active:scale-110 group-hover:text-3xl duration-100" />
                    </button>
                  </div>
                </div>
                <p className="text-center font-light ">
                  Total breaks: {breaks}
                </p>
                <Button
                  onClick={() => setTimerActive(true)}
                  variant="accent"
                  className="w-full flex items-center justify-center gap-2"
                >
                  {" "}
                  <FaPlay />
                  Start
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
}

export default Home;
