// src/App.jsx
import { useEffect } from "react";
import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./store/authSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user, "uuuuuuuu");
        dispatch(setUser(user)); // Store user in Redux
        navigate("/dashboard");
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-background ">
        <Outlet />
      </main>
      <ToastContainer />
    </>
  );
}

export default App;
