// Main wrapper component that renders the appropriate theme
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementPomodoros,
  addStudyTime,
  addBreakTime,
} from "../store/statsSlice";
import NormalThemePomodoro from "./themes/NormalThemePomodoro";
import ModernThemePomodoro from "./themes/ModernThemePomodoro";
import CustomThemePomodoro from "./themes/CustomThemePomodoro";

function PromodoroComp({
  minutes,
  seconds,
  isRunning,
  start,
  stop,
  type1,
  type2,
  totalTime,
  reset,
  hours,
  custom,
}) {
  const dispatch = useDispatch();
  const layoutType = useSelector((state) => state.theme.layoutType);
  const { runningTask } = useSelector((state) => state.tasks);

  // Track the current session type (work or break)
  const [sessionType, setSessionType] = useState("work");
  // Track when timer started
  const [startTime, setStartTime] = useState(null);
  const [customTime, setCustomTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle starting the timer
  const handleStart = () => {
    start();
    setStartTime(Date.now());
  };

  // Handle stopping the timer
  const handleStop = () => {
    stop();
    if (startTime) {
      const timeSpentInHours = (Date.now() - startTime) / 1000 / 60 / 60;

      // If it was a work session, increment study time
      if (sessionType === "work") {
        dispatch(addStudyTime(timeSpentInHours));
      } else {
        // Otherwise it was a break
        dispatch(addBreakTime(timeSpentInHours));
      }

      setStartTime(null);
    }
  };

  // When timer completes
  useEffect(() => {
    if (totalTime === 0 && !isRunning && startTime) {
      // If work session completed, increment pomodoro count
      if (sessionType === "work") {
        dispatch(incrementPomodoros());

        // Auto-switch to break mode (5 min)
        setSessionType("break");
        const breakMinutes = 5;
        custom(0, breakMinutes, 0);
      } else {
        // Break completed, switch back to work
        setSessionType("work");
        type1(); // Default back to work timer
      }

      setStartTime(null);
    }
  }, [totalTime, isRunning]);

  useEffect(() => {
    if (isRunning) {
      // Start the timer or perform any action when the timer is running
      console.log("Timer started");
    } else {
      // Handle when the timer stops
      console.log("Timer stopped");
    }
  }, [isRunning]);

  const handleCustomTimeChange = (e) => {
    const { name, value } = e.target;
    setCustomTime((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomSubmit = () => {
    custom(
      Number(customTime.hours),
      Number(customTime.minutes),
      Number(customTime.seconds)
    );
    setIsModalOpen(false); // Close modal after submitting
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Calculate progress for the circular progress bar
  const currentTime = minutes * 60 + seconds;
  const progress = (currentTime / totalTime) * 100;

  // Common props to pass to theme components
  const commonProps = {
    hours,
    minutes,
    seconds,
    progress,
    isRunning,
    start,
    stop,
    reset,
    type1,
    type2,
    openModal,
    closeModal,
    isModalOpen,
    customTime,
    handleCustomTimeChange,
    handleCustomSubmit,
    handleStart,
    handleStop,
    sessionType,
    runningTask,
  };

  // Render the appropriate theme component based on the layoutType
  if (layoutType === "normal") {
    return <NormalThemePomodoro {...commonProps} />;
  } else if (layoutType === "modern") {
    return <ModernThemePomodoro {...commonProps} />;
  } else {
    return <CustomThemePomodoro />;
  }
}

export default PromodoroComp;
