// src/components/Login.jsx
import React, { useState, useEffect } from "react";
import authService from "../services/AuthService";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import Container from "./Container/Container"; // Added for container wrapper
import imgSrc from "../assets/Login.svg"; // Adjusted image to fit the Login theme
import { motion } from "framer-motion"; // Import Framer Motion for animations

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const mapFirebaseError = (errorCode) => {
    const errorMessages = {
      "auth/invalid-email": "Invalid email format. Please enter a valid email.",
      "auth/user-disabled": "This account has been disabled. Contact support.",
      "auth/user-not-found": "No user found with this email. Sign up instead?",
      "auth/wrong-password": "Incorrect password. Try again.",
      "auth/too-many-requests": "Too many failed attempts. Try again later.",
      "auth/email-already-in-use":
        "This email is already registered. Try logging in.",
      "auth/weak-password": "Your password is too weak. Use a stronger one.",
    };

    return errorMessages[errorCode] || "Invalid credentials!!";
  };

  const handleGoogleLogin = async () => {
    try {
      await authService.login();
      const userData = await authService.getStoredUser();
      if (userData) {
        dispatch(setUser(userData));
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed: " + error.message);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before login attempt
    try {
      const userData = await authService.loginWithEmail(email, password);
      if (userData) {
        dispatch(setUser(userData));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Email login failed:", error);
      const errorMessage = mapFirebaseError(error.code);
      setError(errorMessage);
    }
  };

  const [bgRed, setBgRed] = useState(true);

  useEffect(() => {
    if (error) {
      setBgRed(true);
      const timer = setTimeout(() => setBgRed(false), 1500); // Reset after 1s
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="h-[90vh] flex items-center justify-center">
      <Container className="grid grid-cols-2 place-items-center">
        {/* Left Side Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block shadow-md bg-white rounded-md"
        >
          <img
            src={imgSrc}
            alt="Productivity Illustration"
            className="h-[80vh] drop-shadow-lg"
          />
        </motion.div>

        {/* Right Side Login Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-[70%]"
        >
          <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
          <form onSubmit={handleEmailLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 border-b-slate-900 bg-white outline-none focus:ring-1 ring-fuchsia-400 rounded-md shadow-2xs shadow-black hover:shadow-fuchsia-400 focus:shadow-fuchsia-400"
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
                className="w-full p-2 border border-gray-300 border-b-slate-900 bg-white outline-none focus:ring-1 ring-fuchsia-400 rounded-md shadow-2xs shadow-black hover:shadow-fuchsia-400 focus:shadow-fuchsia-400"
                required
              />
              <p
                className={`text-red-600 italic px-1 transition-all duration-400 ${
                  bgRed
                    ? "bg-gradient-to-r from-red-200 via-red-100 to-neutral-50"
                    : ""
                } mt-1 `}
              >
                {error}
              </p>
            </div>

            <Button type="submit" variant="primary" className="w-full py-3">
              Login with Email
            </Button>
          </form>

          <div className=" w-full max-w-md flex  items-center flex-col justify-center">
            <div className="w-full py-4 grid-cols-12 grid place-items-center">
              <div className="col-span-5 border-b-2 translate-y-[-40%] w-full"></div>
              <div className="col-span-2 text-xl">or</div>
              <div className="col-span-5 border-b-2 w-full translate-y-[-40%]"></div>
            </div>

            <div className="w-full">
              <Button
                variant="secondary"
                className="py-2 w-full flex items-center bg-white justify-center text-text shadow-2xl hover:border-1"
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

          <p className="mt-2">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-500 font-bold cursor-pointer"
            >
              Sign Up
            </span>{" "}
          </p>
        </motion.div>
      </Container>
    </div>
  );
}

export default Login;
