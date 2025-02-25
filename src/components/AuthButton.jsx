import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logoutUser } from "../store/authSlice";
import authService from "../Auth/auth";

function AuthButton() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    authService.logout();
    dispatch(logoutUser());
  };

  return (
    <div>
      {user ? (
        <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded">
          Logout
        </button>
      ) : (
        <button onClick={() => console.log("Trigger Google Login")} className="px-3 py-1 bg-blue-500 text-white rounded">
          Login
        </button>
      )}
    </div>
  );
}

export default AuthButton;
