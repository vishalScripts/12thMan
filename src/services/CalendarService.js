// src/services/CalendarService.js
import authService from "./AuthService";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";

export class CalendarService {
  constructor() {
    // Reference Firestore collection for tasks
    this.tasksCollection = collection(db, "tasks");
    // Token will be managed via authService
    this.token = null;
  }

  // Ensure we have a valid token; if not, login to obtain one.
  async ensureValidToken() {
    try {
      const user = await authService.getSession();
      if (!this.token) {
        const { token } = await authService.login();
        this.token = token;
      }
      // (Optional) You may add logic to check token expiry here.
      return this.token;
    } catch (error) {
      throw new Error("Session expired. Please login again.");
    }
  }

  // Helper: Make an API call with authentication headers.
  async makeAuthenticatedCall(url, options = {}) {
    await this.ensureValidToken();
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${this.token}`,
    };
    let response = await fetch(url, options);
    if (response.status === 401) {
      console.log("Token might be expired. Refreshing token...");
      this.token = await authService.refreshToken();
      options.headers.Authorization = `Bearer ${this.token}`;
      response = await fetch(url, options);
    }
    return response;
  }

  // Google Calendar API: Fetch events.
  async fetchEvents() {
    await this.ensureValidToken();
    try {
      const response = await this.makeAuthenticatedCall(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        { method: "GET" }
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse);
        throw new Error("Failed to fetch events");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }

  // Create a new calendar event.
  async createEvent(event) {
    await this.ensureValidToken();
    try {
      const response = await this.makeAuthenticatedCall(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(event),
        }
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse);
        throw new Error("Failed to create event");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating event:", error);
      return null;
    }
  }

  // Update an existing calendar event.
  async updateEvent(eventId, updatedEvent) {
    await this.ensureValidToken();
    try {
      let response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEvent),
        }
      );
      if (response.status === 401) {
        console.log("Token expired, refreshing token...");
        this.token = await authService.refreshToken();
        response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEvent),
          }
        );
      }
      if (!response.ok) throw new Error("Failed to update event");
      return await response.json();
    } catch (error) {
      console.error("Error updating event:", error);
      return null;
    }
  }

  // --- Firestore Tasks Methods ---

  // Create a new task in Firestore.
  async createTask(taskData) {
    try {
      const docRef = await addDoc(this.tasksCollection, {
        googleEventId: taskData.id,
        title: taskData.title,
        start: taskData.start,
        end: taskData.end,
        done: taskData.done,
      });
      console.log("Task created with ID:", docRef.id);
      return { id: docRef.id, ...taskData };
    } catch (error) {
      console.error("Error creating task:", error);
      return null;
    }
  }

  // Fetch tasks from Firestore.
  async fetchTasks() {
    try {
      const querySnapshot = await getDocs(this.tasksCollection);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }

  // Update the status of a task.
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
}

export default CalendarService;
