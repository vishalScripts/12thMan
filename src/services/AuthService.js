import { auth, provider } from "../firebaseConfig";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  reauthenticateWithPopup,
} from "firebase/auth";

export class AuthService {
  async login() {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = result._tokenResponse.oauthAccessToken;
      const expiresIn = 3600 * 1000; // Firebase tokens expire in 1 hour
      const expiryTime = Date.now() + expiresIn;

      // Store user data and token details in localStorage
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiry", expiryTime.toString());

      return { user: result.user, token };
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  }

  async getStoredUser() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const tokenExpiry = parseInt(localStorage.getItem("tokenExpiry"), 10);

    if (user && token && tokenExpiry) {
      if (Date.now() < tokenExpiry) {
        return { user, token };
      } else {
        return this.refreshToken();
      }
    }
    return null;
  }

  async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  }

  async getSession() {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) resolve(user);
        else reject(new Error("No user logged in"));
      });
    });
  }

  async refreshToken() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      // Reauthenticate to force a new token
      const result = await reauthenticateWithPopup(user, provider);
      const newToken = result._tokenResponse.oauthAccessToken;
      const expiresIn = 3600 * 1000; // Firebase tokens expire in 1 hour
      const expiryTime = Date.now() + expiresIn;

      // Store the new token and expiry time
      localStorage.setItem("token", newToken);
      localStorage.setItem("tokenExpiry", expiryTime.toString());

      console.log("Token refreshed automatically:", newToken);
      return newToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }

  async getValidToken() {
    const tokenExpiry = parseInt(localStorage.getItem("tokenExpiry"), 10);
    if (!tokenExpiry || Date.now() >= tokenExpiry) {
      return this.refreshToken();
    }
    return localStorage.getItem("token");
  }
}

const authService = new AuthService();
export default authService;
