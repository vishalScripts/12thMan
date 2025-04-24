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

  useEffect(() => {
    const fetchTasks = async () => {
      const calendarService = new CalendarService();
      dispatch(setLoading(true));
      try {
        const fetchedTasks = await calendarService.fetchTasks();
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
      dispatch(incrementTasksDone());
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const filteredTasks = tasks.filter((task) => {
    if (filter === "done") return task.done;
    if (filter === "today") {
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
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 3000);
  };

  return (
    <div className={`${className} bg-[var(--acme-background)]`}>
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
      <h2 className="text-lg text-center mb-2 bg-[var(--acme-secondary)] font-bold text-[var(--acme-text)]">
        Tasks
      </h2>
      <div className="flex justify-start gap-2 mb-2">
        <button
          className={`px-3 py-0 h-6 text-sm font-bold rounded cursor-pointer ${
            filter === "all"
              ? "bg-[var(--acme-primary)] text-[var(--acme-background)]"
              : "bg-[var(--acme-accent-hover)] text-[var(--acme-text)]"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-3 py-0 h-6 text-sm font-bold rounded cursor-pointer ${
            filter === "done"
              ? "bg-[var(--acme-primary)] text-[var(--acme-background)]"
              : "bg-[var(--acme-accent-hover)] text-[var(--acme-text)]"
          }`}
          onClick={() => setFilter("done")}
        >
          Done
        </button>
        <button
          className={`px-3 py-0 h-6 text-sm font-bold rounded cursor-pointer ${
            filter === "today"
              ? "bg-[var(--acme-primary)] text-[var(--acme-background)]"
              : "bg-[var(--acme-accent-hover)] text-[var(--acme-text)]"
          }`}
          onClick={() => setFilter("today")}
        >
          Today
        </button>
      </div>

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
                    bg-[var(--acme-background)] border-[var(--acme-border)] 
                    hover:border-[var(--acme-primary)] hover:shadow-sm cursor-pointer group 
                    hover:bg-[var(--acme-secondary-hover)]`}
                onClick={createTaskInTaskComp}
              >
                <div className="flex flex-col justify-center flex-1">
                  <h3 className={`font-medium text-[var(--acme-text)]`}>
                    Create task...
                  </h3>
                </div>

                <div className="box-border p-1 duration-300 rounded-full group-hover:bg-[var(--acme-secondary)]">
                  <PlusCircleIcon className="w-6 group-hover:scale-105 h-6 text-2xl text-[var(--acme-primary)]" />
                </div>
              </motion.li>
            )}
            <div className="flex flex-col items-center justify-center h-32 text-[var(--acme-accent)]">
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
                    bg-[var(--acme-background)] border-[var(--acme-border)] 
                    hover:border-[var(--acme-primary)] hover:shadow-sm cursor-pointer group 
                    hover:bg-[var(--acme-secondary-hover)]`}
                  onClick={createTaskInTaskComp}
                >
                  <div className="flex flex-col justify-center flex-1">
                    <h3 className={`font-medium text-[var(--acme-text)]`}>
                      Create task...
                    </h3>
                  </div>

                  <div className="box-border p-1 duration-300 rounded-full group-hover:bg-[var(--acme-secondary)]">
                    <PlusCircleIcon className="w-6 group-hover:scale-105 h-6 text-2xl text-[var(--acme-primary)]" />
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
                        ? "bg-[var(--acme-secondary-hover)] border-[var(--acme-primary)] shadow-md"
                        : task.done
                        ? "bg-[var(--acme-accent-hover)] border-[var(--acme-accent)]"
                        : "bg-[var(--acme-background)] border-[var(--acme-border)] hover:border-[var(--acme-primary)] hover:shadow-sm"
                    }
                    ${timer && !task.done ? "cursor-pointer" : ""}
                  `}
                >
                  <div className="flex flex-col justify-center flex-1">
                    <h3
                      className={`font-medium text-[var(--acme-text)] ${
                        task.done
                          ? "line-through text-[var(--acme-accent)]"
                          : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    {!task.done && (
                      <div className="mt-1 items-center justify-start flex">
                        <div className="flex flex-col h-8 w-2 min-h-full items-center justify-center">
                          <img
                            src={uptodown}
                            className="h-[60%] opacity-50 object-cover w-2 object-center"
                            alt=""
                            srcSet=""
                          />
                        </div>
                        <div>
                          <p className="text-xs text-[var(--acme-accent)] flex items-center">
                            {new Date(task.start).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>

                          <p className="text-xs text-[var(--acme-accent)] flex items-center">
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
                      <div className="p-2 rounded-full bg-[var(--acme-secondary)]">
                        <svg
                          className="w-4 h-4 text-[var(--acme-primary)]"
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
                              style={{ color: "var(--acme-primary)" }}
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
                              ? "border-[var(--acme-accent)] bg-[var(--acme-accent)] text-[var(--acme-background)]"
                              : "border-[var(--acme-primary)] hover:border-[var(--acme-primary)] bg-[var(--acme-background)]"
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
