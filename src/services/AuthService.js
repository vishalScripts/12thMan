// src/services/AuthService.js
import { auth, provider, db } from "../firebaseConfig";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

export class AuthService {
  constructor() {
    // Ensure persistence is set when service is initialized
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Auth persistence set to local.");
      })
      .catch((error) => {
        console.error("Error setting auth persistence:", error);
      });
  }

  async login() {
    try {
      const result = await signInWithPopup(auth, provider);
      return { user: result.user };
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  }

  async loginWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user };
    } catch (error) {
      console.error("Email login error:", error);
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

  async signup(email, password, name, username) {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(result.user, { displayName: name });

      await addDoc(collection(db, "users"), {
        uid: result.user.uid,
        username: username,
        name: name,
        email: email,
      });

      return result.user;
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
