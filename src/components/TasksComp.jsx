import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, setLoading, setError } from "../store/tasksSlice"; // Import actions
import { CalendarService } from "../services/CalendarServices";

function TasksComp({ className = "", fixedHeight }) {
  const { token } = useSelector((state) => state.auth); // Get the token from the auth state
  const { tasks, loading, error } = useSelector((state) => state.tasks); // Get tasks from the tasks slice
  const dispatch = useDispatch();

  // Fetch tasks when token is available
  useEffect(() => {
    const fetchTasks = async () => {
      if (token) {
        dispatch(setLoading(true)); // Set loading to true
        try {
          const calendarService = new CalendarService(token);
          const fetchedTasks = await calendarService.fetchTasks();
          dispatch(setTasks(fetchedTasks)); // Set tasks in Redux store
        } catch (error) {
          dispatch(setError(error.message)); // Handle error if any
        } finally {
          dispatch(setLoading(false)); // Set loading to false
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
        // After updating the status, refetch the tasks to get the updated list
        dispatch(setLoading(true));
        const fetchedTasks = await calendarService.fetchTasks();
        dispatch(setTasks(fetchedTasks));
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return (
    <div className={`${className}`}>
      <h2 className="text-lg text-center mb-2 bg-secondary font-bold text-gray-800">
        Tasks
      </h2>
      <div className={fixedHeight}>
        {tasks.length === 0 ? (
          <p>No tasks available...</p>
        ) : (
          <ul className="space-y-4 py-2">
            {tasks.map((task) => (
              <li
                key={task.$id}
                className={`px-2 flex gap-2 border-1 rounded shadow-sm overflow-hidden transition-all duration-200 ${
                  task.done
                    ? "bg-green-50 hover:bg-green-100" // Completed background
                    : "bg-white hover:bg-accent" // Pending background
                } ${task.done ? "h-12" : "h-22"}`}
              >
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className={`w-5 min-w-5 min-h-5 h-5 flex items-center justify-center rounded-full border-2 transition-all duration-200 cursor-pointer hover:scale ${
                      task.done
                        ? "border-green-500 bg-green-500" // Completed state
                        : "border-gray-400 bg-white" // Pending state
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
                  {!task.done && ( // Only show start/end dates if task is not completed
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TasksComp;
