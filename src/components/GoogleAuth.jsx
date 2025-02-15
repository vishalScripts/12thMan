// src/components/GoogleAuth.js
import { useEffect } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES =
  "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/tasks.readonly";

const GoogleAuth = ({ onLogin }) => {
  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          "https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest",
        ],
        scope: SCOPES,
      });
    }

    gapi.load("client:auth2", start);
  }, []);

  const signIn = () => {
    gapi.auth2
      .getAuthInstance()
      .signIn()
      .then((googleUser) => {
        const token = googleUser.getAuthResponse().access_token;
        // Save token to localStorage
        localStorage.setItem("access_token", token);
        onLogin(token);
      });
  };

  return <button onClick={signIn}>Sign in with Google</button>;
};

export default GoogleAuth;
