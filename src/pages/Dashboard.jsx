import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CalendarService } from "../services/CalendarServices";

function Dashboard() {
  const { token } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from Appwrite when the component mounts or when the token changes.
  useEffect(() => {
    if (token) {
      const calendarService = new CalendarService(token);
      calendarService.fetchTasks().then((fetchedTasks) => {
        setTasks(fetchedTasks);
      });
    }
  }, [token]);

  // Toggle the task's done status.
  const toggleTaskStatus = async (task) => {
    if (!token) return;
    const calendarService = new CalendarService(token);
    const newStatus = !task.done;
    const updatedTask = await calendarService.updateTaskStatus(
      task.$id,
      newStatus
    );
    if (updatedTask) {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.$id === task.$id ? { ...t, done: newStatus } : t
        )
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.$id} className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold">{task.title}</h2>
              <p>
                <strong>Start:</strong> {new Date(task.start).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong> {new Date(task.end).toLocaleString()}
              </p>
              <div className="mt-2">
                <label>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTaskStatus(task)}
                  />
                  <span className="ml-2">
                    {task.done ? "Completed" : "Pending"}
                  </span>
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
