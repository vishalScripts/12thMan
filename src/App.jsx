import { useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen">
        <Outlet />
      </main>
    </>
  );
}

export default App;
