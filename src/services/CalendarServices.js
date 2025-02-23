import { Client, Databases, ID } from "appwrite";
import conf from "../conf/conf";
import authService from "../Auth/auth";

export class CalendarService {
  constructor(token) {
    this.token = token;
    // For Google Calendar API calls, we use the token as before.

    // NEW: Initialize Appwrite client for storing tasks.
    this.appwriteClient = new Client();
    this.appwriteClient
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.appwriteClient);
  }

  async fetchEvents() {
    try {
      console.log("Using token:", this.token);
      const response = await this.makeAuthenticatedCall(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        { method: "GET" }
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse);
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      return data.items;
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: event.summary,
            start: event.start,
            end: event.end,
            description: event.description,
          }),
        }
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse);
        throw new Error("Failed to create event");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating event:", error);
      return null;
    }
  }

  async updateEvent(eventId, event) {
    try {
      // Use the authenticated call wrapper here as well
      const response = await this.makeAuthenticatedCall(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: event.summary,
            start: event.start,
            end: event.end,
            description: event.description,
          }),
        }
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse);
        throw new Error("Failed to update event");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating event:", error);
      return null;
    }
  }

  async makeAuthenticatedCall(url, options = {}) {
    // Ensure we have a valid token before making the call.
    await this.ensureValidToken();
    // Add the Authorization header using the current token.
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${this.token}`,
    };

    // Make the API call.
    let response = await fetch(url, options);
    // If you get a 401, the token might have expired recently.
    if (response.status === 401) {
      console.log("Token might be expired. Refreshing token...");
      await this.ensureValidToken();
      // Update the header with the refreshed token and try again.
      options.headers.Authorization = `Bearer ${this.token}`;
      response = await fetch(url, options);
    }
    return response;
  }

  async ensureValidToken() {
    const session = await authService.getSession();
    if (!session) {
      throw new Error("Session expired. Please login again.");
    }
    this.token = session.token;
    return this.token;
  }

  // NEW: Methods for task storage in Appwrite

  async createTask(taskData) {
    try {
      const result = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          googleEventId: taskData.id,
          title: taskData.title,
          start: taskData.start,
          end: taskData.end,
          done: taskData.done,
        }
      );
      return result;
    } catch (error) {
      console.error("Error creating task:", error);
      return null;
    }
  }

  async updateTaskStatus(taskId, done) {
    try {
      const result = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        taskId,
        {
          done: done,
        }
      );
      return result;
    } catch (error) {
      console.error("Error updating task status:", error);
      return null;
    }
  }

  async fetchTasks() {
    try {
      console.log(conf.appwriteDatabaseId, conf.appwriteCollectionId);
      const result = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId
      );
      return result.documents;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }
}
