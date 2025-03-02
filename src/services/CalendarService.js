import authService from "./AuthService";
import { db, auth } from "../firebaseConfig"; // imported auth from firebaseConfig
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query, // added import
  where, // added import
} from "firebase/firestore";

export class CalendarService {
  constructor() {
    this.tasksCollection = collection(db, "tasks");
  }

  async makeAuthenticatedCall(url, options = {}) {
    let token = await authService.getValidToken(); // Get a valid token

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    let response = await fetch(url, options);

    if (response.status === 401) {
      console.log("Token expired. Refreshing token...");
      token = await authService.refreshToken();
      options.headers.Authorization = `Bearer ${token}`;
      response = await fetch(url, options);
    }

    return response;
  }

  async fetchEvents() {
    try {
      const response = await this.makeAuthenticatedCall(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }

  async createEvent(event) {
    try {
      const response = await this.makeAuthenticatedCall(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) throw new Error("Failed to create event");
      return await response.json();
    } catch (error) {
      console.error("Error creating event:", error);
      return null;
    }
  }

  async updateEvent(eventId, updatedEvent) {
    try {
      const response = await this.makeAuthenticatedCall(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEvent),
        }
      );

      if (!response.ok) throw new Error("Failed to update event");
      return await response.json();
    } catch (error) {
      console.error("Error updating event:", error);
      return null;
    }
  }

  async createTask(taskData) {
    try {
      // Use Firebase Auth to get the current user
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User is not authenticated");
      }
      const docRef = await addDoc(this.tasksCollection, {
        googleEventId: taskData.id || null,
        title: taskData.title,
        start: taskData.start,
        end: taskData.end,
        done: taskData.done,
        userId: user.uid, // Associate task with current user
      });
      console.log("Task created with ID:", docRef.id);
      return { id: docRef.id, ...taskData };
    } catch (error) {
      console.error("Error creating task:", error);
      return null;
    }
  }

  async fetchTasks() {
    try {
      // Use Firebase Auth to get the current user
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User is not authenticated");
      }
      // Query to filter tasks by current user's uid
      const tasksQuery = query(
        this.tasksCollection,
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(tasksQuery);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }

  async updateTaskStatus(taskId, done) {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { done });
      console.log("Task updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating task status:", error);
      return false;
    }
  }

  // New method to update the task (title, start, end, etc.)
  async updateTask(taskId, updatedData) {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, updatedData);
      console.log("Task updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating task:", error);
      return false;
    }
  }
}

export default CalendarService;
