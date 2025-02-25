// src/services/AuthService.js
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
      // Force consent to ensure Calendar scope is granted
      const result = await signInWithPopup(auth, provider);
      console.log("Logged in user:", result.user);
      // The access token should include the Calendar scope if granted
      const token = result._tokenResponse.oauthAccessToken;
      console.log("Access token:", token);
      return { user: result.user, token };
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(auth);
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
      // Reauthenticate to force a new token with the correct scopes
      const result = await reauthenticateWithPopup(user, provider);
      const newToken = result._tokenResponse.oauthAccessToken;
      console.log("Token refreshed:", newToken);
      return newToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
