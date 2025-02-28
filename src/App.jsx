import { useEffect } from "react";
import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./store/authSlice";
import authService from "./services/AuthService";
import Navbar from "./components/Navbar";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const userData = await authService.getStoredUser();
        if (userData) {
          dispatch(setUser(userData));
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Auto login failed:", error);
      }
    };

    autoLogin();
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <main className="bg-background">
        <Outlet />
      </main>
    </>
  );
}

export default App;
