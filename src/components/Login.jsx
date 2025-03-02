// src/components/Login.jsx
import React, { useState } from "react";
import authService from "../services/AuthService";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await authService.login();
      const userData = await authService.getStoredUser();
      if (userData) {
        dispatch(setUser(userData));
      }
      navigate("/Dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed: " + error.message);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await authService.loginWithEmail(email, password);
      if (userData) {
        dispatch(setUser(userData));
        navigate("/Dashboard");
      }
    } catch (error) {
      console.error("Email login failed:", error);
      alert("Email login failed: " + error.message);
    }
  };

  return (
    <div className="h-[90vh] flex flex-col items-center justify-center gap-6">
      {/* Email Login Form */}
      <div className="bg-white border border-gray-400 rounded-md shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleEmailLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login with Email
          </button>
        </form>
      </div>

      <div className="text-center">
        <span className="text-gray-500">or</span>
      </div>

      {/* Google Login Button */}
      <div className="bg-white border border-gray-400 rounded-md shadow-md p-6 w-full max-w-md flex items-center justify-center">
        <Button
          className="py-2 flex items-center justify-center text-text shadow-2xl hover:border-1"
          onClick={handleGoogleLogin}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="30"
            height="30"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303
                 c-1.649,4.657-6.08,8-11.303,8
                 c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12
                 c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                 C34.046,6.053,29.268,4,24,4
                 C12.955,4,4,12.955,4,24
                 c0,11.045,8.955,20,20,20
                 c11.045,0,20-8.955,20-20
                 C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819
                 C14.655,15.108,18.961,12,24,12
                 c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                 C34.046,6.053,29.268,4,24,4
                 C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24,44
                 c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238
                 C29.211,35.091,26.715,36,24,36
                 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025
                 C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303
                 c-0.792,2.237-2.231,4.166-4.087,5.571
                 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238
                 C36.971,39.205,44,34,44,24
                 C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          <span className="ml-2">Login with Google</span>
        </Button>
      </div>
    </div>
  );
}

export default Login;
