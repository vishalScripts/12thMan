import React from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "../services/AuthService";
import { logoutUser } from "../store/authSlice";

function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logoutUser());
  };

  if (!user) {
    return <p className="text-center text-gray-600">Loading user data...</p>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm text-center">
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto border-4 border-blue-500"
        />
        <h2 className="text-2xl font-semibold mt-4">{user.displayName}</h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-500 mt-2">
          Last Login: {new Date(Number(user.lastLoginAt)).toLocaleString()}
        </p>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
