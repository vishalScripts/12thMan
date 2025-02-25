import { useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./store/authSlice";
// import authService from "./Auth/auth";
import authService from "./services/authService"
import Navbar from "./components/Navbar";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const autoLogin = async () => {
      const userData = await authService.getStoredUser();
      if (userData) {
        dispatch(setUser(userData)); // Automatically set user if token exists
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
