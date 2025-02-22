import React, { useEffect, useState } from "react";
import { CalendarService } from "../services/CalendarServices";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";
import authService from "../Auth/auth";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const { token } = useSelector((state) => state.auth);
  const userData = useSelector((state) => state.auth.userData);
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logoutUser());
    navigate("/login");
  };

  console.log(userData);

  useEffect(() => {
    if (token) {
      const calendarService = new CalendarService(token);
      calendarService.fetchTasks().then(setTasks);
    }
  }, [token]);

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
      <div className="flex items-center space-x-4 mb-6">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="w-20 h-20 rounded-full border"
        />
        <div>
          <h2 className="text-xl font-bold">{userData.name}</h2>
          <p className="text-gray-600">Email: {userData.email}</p>
          <p className="text-gray-600">
            Registered: {new Date(userData.registration).toLocaleDateString()}
          </p>
          <p
            className={`text-sm ${
              userData.status ? "text-green-600" : "text-red-600"
            }`}
          >
            {userData.status ? "Active" : "Inactive"}
          </p>
          <button onClick={handleLogout} className=" bg-purple-600 px-6 py-4">
            Logout
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>
    </div>
  );
}

export default Dashboard;
