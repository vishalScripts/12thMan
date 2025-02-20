import { useState, useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Container from "./components/Container/Container";
import { useDispatch, useSelector } from "react-redux";
import authService from "./Auth/auth";
import { CalendarService } from "./services/CalendarServices";
import { setUser } from "./store/authSlice";
import { useNavigate } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const { token, status } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await authService.getSession();
      if (session?.token) {
        dispatch(setUser(session));
      } else {
        navigate("/login"); // Redirect to login if no session
      }
    };

    if (!token) {
      fetchSession();
    }
  }, [dispatch, token, navigate]);

  return (
    <>
      <Navbar />
      <main className="bg-background ">
        <Outlet />
      </main>
    </>
  );
}

export default App;
