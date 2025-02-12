import { useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  const [count, setCount] = useState(0);
  Notification.requestPermission();
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
