// src/services/AuthService.js
import { auth, provider, db } from "../firebaseConfig";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  reauthenticateWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

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

  async loginWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      const expiresIn = 3600 * 1000;
      const expiryTime = Date.now() + expiresIn;

      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiry", expiryTime.toString());

      return { user: result.user, token };
    } catch (error) {
      console.error("Email login error:", error);
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
      const expiresIn = 3600 * 1000;
      const expiryTime = Date.now() + expiresIn;

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

  // New signup method that accepts username, name, email, and password.
  async signup(email, password, name, username) {
    try {
      // Create the user with email and password
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's display name with the provided name
      await updateProfile(result.user, { displayName: name });

      // Store additional user info (username, name, email) in Firestore
      await addDoc(collection(db, "users"), {
        uid: result.user.uid,
        username: username,
        name: name,
        email: email,
      });

      const token = await result.user.getIdToken();
      const expiresIn = 3600 * 1000;
      const expiryTime = Date.now() + expiresIn;

      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiry", expiryTime.toString());

      return result.user;
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
