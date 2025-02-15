import React, { useState, useEffect } from "react";
import GoogleAuth from "../components/GoogleAuth";
import GoogleData from "../components/GoogleData";

function Calendar() {
  const [accessToken, setAccessToken] = useState(null);

  // Check if access token exists in localStorage on page load
  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) {
      setAccessToken(savedToken);
    }
  }, []);
  return (
    <div>
      <h1>Google Calendar & Tasks in React</h1>
      {!accessToken ? (
        <GoogleAuth onLogin={setAccessToken} />
      ) : (
        <GoogleData accessToken={accessToken} />
      )}
    </div>
  );
}

export default Calendar;
