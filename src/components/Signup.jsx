// src/components/Signup.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import authService from "../services/AuthService";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Container from "./Container/Container";
import imgSrc from "../assets/Signup.svg";

function Signup() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await authService.signup(email, password, name, username);
      const token = localStorage.getItem("token");
      dispatch(setUser({ user, token }));
      navigate("/Dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
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
        <motion.div
          className="w-[70%]"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Welcome</h1>
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 border-b-slate-900 bg-white outline-none focus:ring-1 ring-fuchsia-400 rounded-md shadow-2xs shadow-black hover:shadow-fuchsia-400 focus:shadow-fuchsia-400"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 border-b-slate-900 bg-white outline-none focus:ring-1 ring-fuchsia-400 rounded-md shadow-2xs shadow-black hover:shadow-fuchsia-400 focus:shadow-fuchsia-400"
                required
              />
            </div>
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

            <Button
              type="submit"
              variant="primary"
              className="w-full  border-1 py-3 "
            >
              Sign Up
            </Button>
          </form>

          <p className="mt-2">
            already have account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 font-bold cursor-pointer"
            >
              login
            </span>{" "}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hidden md:block shadow-md bg-white rounded-b-md">
            <img
              src={imgSrc}
              alt="Productivity Illustration"
              className="h-[80vh] drop-shadow-lg"
            />
          </div>
        </motion.div>
      </Container>
    </div>
  );
}

export default Signup;
