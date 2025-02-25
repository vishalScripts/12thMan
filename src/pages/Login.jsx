import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Replace this with actual API call
      const response = await fakeLoginAPI(email, password);

      if (response.success) {
        const userData = response.data;
        localStorage.setItem("user", JSON.stringify(userData)); // Save user in storage
        dispatch(setUser(userData));
        navigate("/dashboard"); // Redirect to dashboard after login
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;

// Fake API function (replace with actual API call)
async function fakeLoginAPI(email, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          email,
          token: "fake_jwt_token",
          exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
        },
      });
    }, 1000);
  });
}
