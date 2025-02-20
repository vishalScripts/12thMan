import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const user = true;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <div>
      <h1>This is a home page</h1>
    </div>
  );
}

export default Home;
