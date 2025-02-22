import React, { useEffect, useState } from "react";
import { CalendarService } from "../services/CalendarServices";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";
import authService from "../Auth/auth";
import { Link, useNavigate } from "react-router-dom";
import EventChart from "../components/EventChart";
import Button from "../components/Button";

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

  console.log(tasks);

  return (
    <div className="p-6 grid grid-cols-12 gap-18  overflow-hidden">
      <div className="col-span-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500  rounded-3xl shadow-lg flex flex-col p-6 items-center justify-start space-x-6 ">
        <img
          src="https://picsum.photos/200"
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />
        <div className="text-white">
          <h2 className="text-2xl font-semibold mb-2">{userData.name}</h2>
          <p className="text-lg">{userData.email}</p>
          <p className="text-sm my-2">
            Registered: {new Date(userData.registration).toLocaleDateString()}
          </p>
          <p
            className={`text-sm font-medium ${
              userData.status ? "text-green-300" : "text-red-300"
            }`}
          >
            {userData.status ? "Active" : "Inactive"}
          </p>
          <Button
            onClick={handleLogout}
            className="mt-4 px-5 py-2 rounded-full text-white bg-black hover:bg-gray-800 transition-colors duration-300"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="col-span-9 flex items-center justify-center bg-white rounded-2xl shadow-2xl">
        <EventChart tasks={tasks}></EventChart>
      </div>
    </div>
  );
}

export default Dashboard;
