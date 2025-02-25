// import React, { useEffect, useState } from "react";
// import { CalendarService } from "../services/CalendarServices";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutUser } from "../store/authSlice";
// // import authService from "../Auth/auth";
// import { Link, useNavigate } from "react-router-dom";
// import EventChart from "../components/EventChart";
// import Button from "../components/Button";

function Dashboard() {
  // const { token } = useSelector((state) => state.auth);
  // const userData = useSelector((state) => state.auth.userData);
  // const [tasks, setTasks] = useState([]);

  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  // const handleLogout = async () => {
  //   // await authService.logout();
  //   dispatch(logoutUser());
  //   navigate("/login");
  // };

  // console.log(userData);

  // useEffect(() => {
  //   if (token) {
  //     // const calendarService = new CalendarService(token);
  //     // calendarService.fetchTasks().then(setTasks);
  //   }
  // }, [token]);

  // const toggleTaskStatus = async (task) => {
  //   if (!token) return;
  //   const calendarService = new CalendarService(token);
  //   const newStatus = !task.done;
  //   const updatedTask = await calendarService.updateTaskStatus(
  //     task.$id,
  //     newStatus
  //   );
  //   if (updatedTask) {
  //     setTasks((prevTasks) =>
  //       prevTasks.map((t) =>
  //         t.$id === task.$id ? { ...t, done: newStatus } : t
  //       )
  //     );
  //   }
  // };

  // console.log(tasks);

  return (
    <></>
  );
}

export default Dashboard;
