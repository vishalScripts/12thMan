import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

export function useTimer(
  initialHours = 0,
  initialMinutes = 30,
  initialSeconds = 0,
  autoStart = false
) {
  // Load saved state from localStorage or use default values
  const storedTime = JSON.parse(localStorage.getItem("timerState")) || {};
  const [hours, setHours] = useState(storedTime.hours ?? initialHours);
  const [minutes, setMinutes] = useState(storedTime.minutes ?? initialMinutes);
  const [seconds, setSeconds] = useState(storedTime.seconds ?? initialSeconds);
  const [isRunning, setIsRunning] = useState(storedTime.isRunning ?? autoStart);
  const intervalRef = useRef(null);
  const [totalTime, setTotalTime] = useState(
    storedTime.totalTime ??
      initialHours * 3600 + initialMinutes * 60 + initialSeconds
  );

  function saveToLocalStorage() {
    localStorage.setItem(
      "timerState",
      JSON.stringify({ hours, minutes, seconds, isRunning, totalTime })
    );
  }
  function sendNotification(title, message) {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "https://i.pinimg.com/originals/a4/03/ab/a403ab437cabe6b1d988cd7a74ffa046.gif", // Custom icon
        badge:
          "https://i.pinimg.com/originals/a4/03/ab/a403ab437cabe6b1d988cd7a74ffa046.gif", // Small icon (optional)
        vibrate: [200, 100, 200], // Vibration pattern (works on mobile)
      });

      toast.info(`${title} - ${message}`, {
        position: "bottom-center",
        autoClose: 5000,
        style: { backgroundColor: "#2D3748", color: "#F7FAFC" }, // Custom styling for toast
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          sendNotification(title, message);
        }
      });
    }
  }

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTotalTime((prevTotalTime) => {
          if (prevTotalTime <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            sendNotification("Let's go to work", "Your 5-min break is over!!");
            return 0;
          }

          const newTotalTime = prevTotalTime - 1;

          // Send notification when 5 minutes remain (300 seconds)
          if (newTotalTime === 300) {
            sendNotification("done!", "time for break!!!!!!!!!");
          }

          const newHours = Math.floor(newTotalTime / 3600);
          const newMinutes = Math.floor((newTotalTime % 3600) / 60);
          const newSeconds = newTotalTime % 60;

          setHours(newHours);
          setMinutes(newMinutes);
          setSeconds(newSeconds);

          // Save state to localStorage
          saveToLocalStorage();

          return newTotalTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    saveToLocalStorage();
  }, [hours, minutes, seconds, isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setHours(initialHours);
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);
    setTotalTime(initialHours * 3600 + initialMinutes * 60 + initialSeconds);
    saveToLocalStorage();
  };

  const type1 = () => {
    setIsRunning(false);
    setHours(0);
    setMinutes(30);
    setSeconds(0);
    setTotalTime(30 * 60);
    saveToLocalStorage();
  };

  const type2 = () => {
    setIsRunning(false);
    setHours(1);
    setMinutes(0);
    setSeconds(0);
    setTotalTime(60 * 60);
    saveToLocalStorage();
  };

  const custom = (hrs, min, sec) => {
    setIsRunning(true);
    setHours(hrs);
    setMinutes(min);
    setSeconds(sec);
    setTotalTime(hrs * 3600 + min * 60 + sec);
    saveToLocalStorage();
  };

  return {
    hours,
    minutes,
    seconds,
    isRunning,
    start,
    stop,
    reset,
    type1,
    type2,
    totalTime,
    custom,
  };
}
