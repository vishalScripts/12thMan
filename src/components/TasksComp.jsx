// src/components/TasksComp.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTasks,
  setLoading,
  setError,
  setRunningTask,
} from "../store/tasksSlice";
import CalendarService from "../services/CalendarService";
import Button from "./Button";
import {
  PauseIcon,
  PlayIcon,
  PlusCircleIcon,
  ArrowTurnDownLeftIcon,
} from "@heroicons/react/24/solid";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import Notification from "./Notification";
import { motion, AnimatePresence } from "framer-motion";
import uptodown from "../assets/uptodown.svg";
import { incrementTasksDone } from "../store/statsSlice";

// Color variables to match our landing page theme
const COLORS = {
  primary: "var(--color-primary, #8f5fe8)",
  secondary: "var(--color-secondary, #ff9fe8)",
  accent: "var(--color-accent, #6fd3c7)",
  background: "var(--color-background, #fdfcff)",
  text: "var(--color-text, #1a0e23)",
  secondaryHover: "var(--color-secondary-hover, #c9a9ff)",
};

function TasksComp({
  className = "",
  fixedHeight,
  custom,
  totalTime,
  isRunning,
  timer = false,

  createTaskInTaskComp,
}) {
  const { tasks, loading, runningTask } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  console.log(runningTask);

  useEffect(() => {
    const fetchTasks = async () => {
      const calendarService = new CalendarService();
      dispatch(setLoading(true));
      try {
        const fetchedTasks = await calendarService.fetchTasks();
        console.log(fetchedTasks, "this is what fatched task looks like");
        dispatch(setTasks(fetchedTasks));
      } catch (error) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchTasks();
  }, [dispatch]);

  const toggleTaskStatus = async (task) => {
    const calendarService = new CalendarService();
    const newStatus = !task.done;
    try {
      await calendarService.updateTaskStatus(task.id, newStatus);
      dispatch(setLoading(true));
      const fetchedTasks = await calendarService.fetchTasks();
      dispatch(setTasks(fetchedTasks));
      dispatch(setLoading(false));
      const fetchUserStats = await calendarService.getUserStats();
      console.log(fetchUserStats);
      dispatch(incrementTasksDone());
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const filteredTasks = tasks.filter((task) => {
    if (filter === "done") return task.done;
    if (filter === "today") {
      // Compare local dates
      const taskDate = new Date(task.start).toLocaleDateString();
      const todayLocal = new Date().toLocaleDateString();
      return taskDate === todayLocal;
    }
    return true;
  });

  const handlePlayTask = (task) => {
    const startDate = new Date(task.start);
    const endDate = new Date(task.end);
    const totalSeconds = Math.floor((endDate - startDate) / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    custom(h, m, s);
    dispatch(setRunningTask(task));
  };

  useEffect(() => {
    if (totalTime === 0 && runningTask) {
      toggleTaskStatus(runningTask);
    }
  }, [totalTime, runningTask]);

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Remove notification after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 3000);
  };

  return (
    <div className={`${className}`}>
      <AnimatePresence>
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            message={notif.message}
            type={notif.type}
            onClose={() =>
              setNotifications((prev) => prev.filter((n) => n.id !== notif.id))
            }
          />
        ))}
      </AnimatePresence>
      <h2 className="text-lg text-center mb-2 bg-secondary font-bold text-gray-800">
        Tasks
      </h2>
      <div className="flex justify-start gap-2 mb-2">
        <button
          className={`px-3 py-0 h-6 text-sm font-bold rounded cursor-pointer ${
            filter === "all" ? "bg-slate-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-3 py-0 h-6 text-sm font-bold rounded cursor-pointer ${
            filter === "done" ? "bg-slate-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("done")}
        >
          Done
        </button>
        <button
          className={`px-3 py-0 h-6 text-sm font-bold rounded cursor-pointer ${
            filter === "today" ? "bg-slate-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("today")}
        >
          Today
        </button>
      </div>

      {/* Tasks List */}
      <div className={`${fixedHeight} overflow-y-auto`}>
        {filteredTasks.length === 0 ? (
          <>
            {timer ? (
              <></>
            ) : (
              <motion.li
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 1 * 0.05 }}
                className={`px-3 py-2 flex gap-3 items-center justify-between relative rounded-sm border transition-all duration-200 
                    bg-white border-gray-100 hover:border-purple-200 hover:shadow-sm cursor-pointer group hover:bg-amber-50
                  `}
                onClick={createTaskInTaskComp}
              >
                <div className="flex flex-col justify-center flex-1">
                  <h3 className={`font-medium text-gray-800 `}>
                    Create task...
                  </h3>
                </div>

                <div className="box-border p-1 duration-300 rounded-full group-hover:bg-amber-100">
                  <PlusCircleIcon className="w-6 group-hover:scale-105 h-6 text-2xl text-amber-600" />
                  {/* <svg
                    className="w-4 h-4 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg> */}
                </div>
              </motion.li>
            )}
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <svg
                className="w-12 h-12 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-sm">No tasks available...</p>
            </div>
          </>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence>
              {timer ? (
                <></>
              ) : (
                <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: 1 * 0.05 }}
                  className={`px-3 py-2 flex gap-3 items-center justify-between relative rounded-sm border transition-all duration-200 
                    bg-white border-gray-100 hover:border-purple-200 hover:shadow-sm cursor-pointer group hover:bg-amber-50
                  `}
                  onClick={createTaskInTaskComp}
                >
                  <div className="flex flex-col justify-center flex-1">
                    <h3 className={`font-medium text-gray-800 `}>
                      Create task...
                    </h3>
                  </div>

                  <div className="box-border p-1 duration-300 rounded-full group-hover:bg-amber-100">
                    <PlusCircleIcon className="w-6 group-hover:scale-105 h-6 text-2xl text-amber-600" />
                    {/* <svg
                    className="w-4 h-4 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg> */}
                  </div>
                </motion.li>
              )}
              {filteredTasks.map((task, index) => (
                <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={
                    timer && !task.done
                      ? () => {
                          handlePlayTask(task);
                          addNotification("Timer started", "success");
                        }
                      : () => {}
                  }
                  key={task.id}
                  className={`p-3 flex gap-3 items-center justify-between relative rounded-sm border transition-all duration-200 
                    ${
                      runningTask.id === task.id
                        ? "bg-amber-50 border-amber-200 shadow-md"
                        : task.done
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-gray-100 hover:border-purple-200 hover:shadow-sm"
                    }
                    ${timer && !task.done ? "cursor-pointer" : ""}
                  `}
                >
                  <div className="flex flex-col justify-center flex-1">
                    <h3
                      className={`font-medium text-gray-800 ${
                        task.done ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    {!task.done && (
                      <div className="mt-1   items-center justify-start flex">
                        <div className="flex  flex-col h-8 w-2 min-h-full items-center justify-center">
                          {" "}
                          <img
                            src={uptodown}
                            className=" h-[60%] opacity-50 object-cover w-2  object-center"
                            alt=""
                            srcset=""
                          />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 flex items-center">
                            {new Date(task.start).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>

                          <p className="text-xs text-gray-500 flex items-center">
                            {new Date(task.end).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {timer ? (
                    runningTask.id === task.id && (
                      <div className="p-2 rounded-full bg-amber-100">
                        <svg
                          className="w-4 h-4 text-amber-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center">
                      {loading ? (
                        <Spin
                          indicator={
                            <LoadingOutlined
                              style={{ color: COLORS.primary }}
                              spin
                            />
                          }
                        />
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskStatus(task);
                          }}
                          className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all duration-200 hover:scale-110 cursor-pointer ${
                            task.done
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-purple-300 hover:border-purple-500 bg-white"
                          }`}
                        >
                          {task.done && (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}

export default TasksComp;
