import { useState, useEffect, useRef } from "react";

export function useTimer(
  initialMinutes = 30,
  initialSeconds = 0,
  autoStart = false
) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef(null);
  const [totalTime, setTotalTime] = useState(60 * 60);

  function sendNotification(message, desc) {
    if (Notification.permission === "granted") {
      console.log("i worked");
      new Notification(message, {
        body: desc,
        icon: "https://cdn-icons-png.flaticon.com/512/1040/1040230.png",
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          sendNotification(message, desc); // Pass arguments to avoid undefined values
        }
      });
    }
  }

  // Call this function when the timer ends

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            if (minutes === 0) {
              clearInterval(intervalRef.current); // Stop the timer
              setIsRunning(false); // Ensure it doesn't restart
              sendNotification(
                "lets go to work",
                "your 5min Break is Over !! "
              ); // Notify the user
              return 0;
            }
            if (minutes === 5) {
              sendNotification(
                "Time for break",
                "You should take break, Even soldier rest at night"
              );
            } else {
            }
            return 59;
          }
          return prevSeconds - 1;
        });

        setMinutes((prevMinutes) => {
          if (seconds === 0 && prevMinutes > 0) {
            return prevMinutes - 1;
          }
          return prevMinutes;
        });
      }, 1000); // 🛠️ Fix: Use 1000ms (1 second) instead of 10ms
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, minutes, seconds]); // ✅ Correct dependencies
  // ✅ Fix: added correct dependencies

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);
  };
  const type1 = () => {
    console.log("type1");
    setIsRunning(false);
    setMinutes(30);
    setSeconds(0);
    setTotalTime(30 * 60);
  };
  const type2 = () => {
    console.log("type two");
    setIsRunning(false);
    setMinutes(60);
    setSeconds(0);
    setTotalTime(60 * 60);
  };

  return {
    minutes,
    seconds,
    isRunning,
    start,
    stop,
    reset,
    type1,
    type2,
    totalTime,
  };
}
