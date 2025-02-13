import React from "react";
import { useState, useEffect } from "react";

function Time() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",

    hour12: true,
  });

  const formattedDay = time.toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <div className="flex flex-col  items-center justify-center w-full  ">
      <div className=" rounded-2xl   text-center w-full flex items-center justify-center">
        <p className="text-2xl drop-shadow-md  flex items-center justify-center font-mono mt-2">
          {formattedTime}
        </p>
      </div>
    </div>
  );
}

export default Time;
