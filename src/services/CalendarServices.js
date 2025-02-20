import { Client, Databases, ID } from "appwrite";
import conf from "../conf/conf";

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
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
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
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
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
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.token}`,
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

  // NEW: Methods for task storage in Appwrite

  async createTask(taskData) {
    try {
      const result = await this.databases.createDocument(
        conf.appwriteDatabaseId, // NEW: Pass the database ID from your config.
        conf.appwriteCollectionId, // Collection ID (make sure this collection exists in Appwrite)
        ID.unique(), // Use Appwrite's ID.unique() to generate a unique document ID.
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
        conf.appwriteDatabaseId, // NEW: Pass the database ID.
        conf.appwriteCollectionId, // Collection ID.
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
        conf.appwriteDatabaseId, // NEW: Pass the database ID.
        conf.appwriteCollectionId
      );
      return result.documents;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }
}
