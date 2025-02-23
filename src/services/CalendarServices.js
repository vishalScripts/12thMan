import { Client, Databases, ID } from "appwrite";
import conf from "../conf/conf";
import authService from "../Auth/auth";

export class CalendarService {
  constructor(token) {
    this.token = token;

    // Initialize Appwrite client
    this.appwriteClient = new Client();
    this.appwriteClient
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.appwriteClient);
  }

  async ensureValidToken() {
    console.log("Checking if token is valid...");
    let session = await authService.getSession();
    if (!session) {
      throw new Error("Session expired. Please login again.");
    }

    const expiresAt = new Date(
      session.data.providerAccessTokenExpiry
    ).getTime();
    const now = new Date().getTime();

    if (now > expiresAt) {
      console.log("Token expired. Refreshing...");
      const refreshed = await authService.refreshToken();
      if (!refreshed)
        throw new Error("Could not refresh token. Login required.");
      this.token = refreshed.token;
    } else {
      this.token = session.token;
    }

    return this.token;
  }

  async fetchEvents() {
    await this.ensureValidToken();
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
      return await response.json();
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }

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
  async updateEvent(eventId, updatedEvent) {
    try {
      // Ensure valid access token before making API call
      await this.ensureValidToken();

      const response = await fetch(
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

      if (!response.ok) {
        // If unauthorized (token expired), try refreshing and retrying
        if (response.status === 401) {
          console.log("Token expired, refreshing token...");
          await this.ensureValidToken();

          // Retry with the refreshed token
          const retryResponse = await fetch(
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

          if (!retryResponse.ok) {
            throw new Error("Failed to update event after retry");
          }
          return await retryResponse.json();
        }
        throw new Error("Failed to update event");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating event:", error);
      return null;
    }
  }

  async createTask(taskData) {
    await this.ensureValidToken();
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
    await this.ensureValidToken();
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        taskId,
        { done }
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      return null;
    }
  }

  async fetchTasks() {
    await this.ensureValidToken();
    try {
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

  async makeAuthenticatedCall(url, options = {}) {
    await this.ensureValidToken();
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${this.token}`,
    };
    let response = await fetch(url, options);

    if (response.status === 401) {
      console.log("Token might be expired. Refreshing token...");
      await this.ensureValidToken();
      options.headers.Authorization = `Bearer ${this.token}`;
      response = await fetch(url, options);
    }

    return response;
  }
}
