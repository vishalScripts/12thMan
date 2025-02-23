import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, setLoading, setError } from "../store/tasksSlice";
import { CalendarService } from "../services/CalendarServices";
import Button from "./Button";
import {
  ArrowPathIcon,
  PlayIcon,
  StopCircleIcon,
} from "@heroicons/react/24/solid";

function TasksComp({
  className = "",
  fixedHeight,
  start,
  stop,
  reset,
  custom,
}) {
  const { token } = useSelector((state) => state.auth);
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      if (token) {
        dispatch(setLoading(true));
        try {
          const calendarService = new CalendarService(token);
          const fetchedTasks = await calendarService.fetchTasks();
          dispatch(setTasks(fetchedTasks));
        } catch (error) {
          dispatch(setError(error.message));
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    fetchTasks();
  }, [token, dispatch]);

  const toggleTaskStatus = async (task) => {
    if (!token) return;
    const calendarService = new CalendarService(token);
    const newStatus = !task.done;
    try {
      const updatedTask = await calendarService.updateTaskStatus(
        task.$id,
        newStatus
      );
      if (updatedTask) {
        dispatch(setLoading(true));
        const fetchedTasks = await calendarService.fetchTasks();
        dispatch(setTasks(fetchedTasks));
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  // Filter tasks based on chosen filter
  const today = new Date().toISOString().split("T")[0];
  const filteredTasks = tasks.filter((task) => {
    if (filter === "done") return task.done;
    if (filter === "today") return task.start.startsWith(today);
    return true;
  });

  // When the Play button for a task is clicked,
  // calculate the duration between task.start and task.end
  // and call custom(h, m, s)
  const handlePlayTask = (task) => {
    const startDate = new Date(task.start);
    const endDate = new Date(task.end);
    const diffMs = endDate - startDate; // difference in milliseconds
    const totalSeconds = Math.floor(diffMs / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    console.log(`Task "${task.title}" duration: ${h}h ${m}m ${s}s`);
    // Call the custom timer function with calculated duration
    custom(h, m, s);
  };

  return (
    <div className={`${className}`}>
      <h2 className="text-lg text-center mb-2 bg-secondary font-bold text-gray-800">
        Tasks
      </h2>
      <div className="py-4 flex gap-4">
        <Button onClick={start}>
          <PlayIcon className="w-6" />
        </Button>
        <Button onClick={stop}>
          <StopCircleIcon className="w-6" />
        </Button>
        <Button onClick={reset}>
          <ArrowPathIcon className="w-6" />
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-start gap-2 mb-2">
        <button
          className={`px-3 py-0 h-6 text-sm font-bold rounded cursor-pointer ${
            filter === "all"
              ? "bg-slate-600 text-white"
              : "bg-gray-200 text-text"
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
            filter === "today"
              ? "bg-slate-600 text-white"
              : "bg-gray-200 text-text"
          }`}
          onClick={() => setFilter("today")}
        >
          Today
        </button>
      </div>

      <div className={fixedHeight}>
        {filteredTasks.length === 0 ? (
          <p>No tasks available...</p>
        ) : (
          <ul className="space-y-4 py-2">
            {filteredTasks.map((task) => (
              <li
                key={task.$id}
                className={`px-2 flex gap-2 border-1 rounded shadow-sm overflow-hidden transition-all duration-200 ${
                  task.done
                    ? "bg-green-50 hover:bg-green-100"
                    : "bg-white hover:bg-accent"
                } ${task.done ? "h-12" : "h-22"}`}
              >
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className={`w-5 min-w-5 min-h-5 h-5 flex items-center justify-center rounded-full border-2 transition-all duration-200 cursor-pointer hover:scale ${
                      task.done
                        ? "border-green-500 bg-green-500"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {task.done && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
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
                </div>
                <div className="flex items-start flex-col justify-center">
                  <h2 className="font-bold text-lg">{task.title}</h2>
                  {!task.done && (
                    <>
                      <p className="text-xs">
                        <span className="font-semibold text-sm">Start:</span>{" "}
                        {new Date(task.start).toLocaleString()}
                      </p>
                      <p className="text-xs">
                        <span className="font-semibold text-sm">End:</span>{" "}
                        {new Date(task.end).toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
                {/* If task is not done, add a Play button to calculate duration and call custom */}
                {!task.done && (
                  <div className="flex items-center justify-center">
                    <Button
                      onClick={() => handlePlayTask(task)}
                      className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Play
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TasksComp;
