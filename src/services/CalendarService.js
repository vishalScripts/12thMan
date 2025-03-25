import authService from "./AuthService";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

export class CalendarService {
  constructor() {
    this.tasksCollection = collection(db, "tasks");
    this.statsCollection = collection(db, "stats");
    this.alarmsCollection = collection(db, "alarms");
  }

  // ------------------------ AUTHENTICATED API CALL ------------------------

  async makeAuthenticatedCall(url, options = {}) {
    let token = await authService.getValidToken();

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

  // ------------------------ FIREBASE STATS MANAGEMENT ------------------------

  async getUserStats() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User is not authenticated");

      const statsRef = doc(db, "stats", user.uid);
      const statsSnap = await getDoc(statsRef);

      if (!statsSnap.exists()) {
        const defaultStats = {
          tasksDone: 0,
          hoursStudied: 0,
          breakTime: 0,
          pomodoros: 0,
        };

        await setDoc(statsRef, defaultStats);
        return defaultStats;
      }

      return statsSnap.data();
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return null;
    }
  }

  async updateStat(statKey, value) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User is not authenticated");

      const statsRef = doc(db, "stats", user.uid);
      await updateDoc(statsRef, { [statKey]: value });

      console.log(`Updated ${statKey} to ${value}`);
    } catch (error) {
      console.error(`Error updating ${statKey}:`, error);
    }
  }
  async updateHourStudied() {
    try {
      const stats = await this.getUserStats();
      await this.updateStat("tasksDone", stats.hoursStudied + 1);
    } catch (error) {
      console.log(error, "Error in updating hour studied");
    }
  }
  async updatePomodoroStat() {
    try {
      const stats = await this.getUserStats();
      await this.updateStat("tasksDone", stats.tasksDone + 1);
    } catch (error) {
      console.log(error, "Error in updating hour studied");
    }
  }
  async updateBreakStat() {
    try {
      const stats = await this.getUserStats();
      await this.updateStat("tasksDone", stats.breakTime + 1);
    } catch (error) {
      console.log(error, "Error in updating hour studied");
    }
  }

  // ------------------------ GOOGLE CALENDAR EVENTS ------------------------

  async fetchEvents() {
    try {
      const response = await this.makeAuthenticatedCall(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        { method: "GET" }
      );

      if (!response.ok) throw new Error("Failed to fetch events");
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

      const eventData = await response.json();

      if (event.studySession) {
        const studyHours =
          (new Date(event.end) - new Date(event.start)) / 3600000;
        const stats = await this.getUserStats();
        await this.updateStat("hoursStudied", stats.hoursStudied + studyHours);
      }

      return eventData;
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

  // ------------------------ FIREBASE TASKS ------------------------

  async createTask(taskData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User is not authenticated");

      const docRef = await addDoc(this.tasksCollection, {
        googleEventId: taskData.id || null,
        title: taskData.title,
        start: taskData.start,
        end: taskData.end,
        done: taskData.done,
        userId: user.uid,
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
      const user = auth.currentUser;
      if (!user) throw new Error("User is not authenticated");

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

      if (done) {
        const stats = await this.getUserStats();
        await this.updateStat("tasksDone", stats.tasksDone + 1);
      }

      console.log("Task updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating task status:", error);
      return false;
    }
  }

  // ------------------------ FIREBASE ALARMS ------------------------

  async fetchAlarms() {
    try {
      const user = auth.currentUser;
      const alarmsQuery = query(
        this.alarmsCollection,
        where("userId", "==", user.uid)
      );
      const alarmsSnapshot = await getDocs(alarmsQuery);
      return alarmsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching alarms:", error);
      throw error;
    }
  }

  async createAlarm(alarmData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User is not authenticated");

      const docRef = await addDoc(this.alarmsCollection, {
        ...alarmData,
        userId: user.uid,
      });

      return docRef.id;
    } catch (error) {
      console.error("Error creating alarm:", error);
      throw error;
    }
  }

  async markAlarmTriggered(alarmId) {
    try {
      const alarmRef = doc(db, "alarms", alarmId);
      await updateDoc(alarmRef, { triggered: true });
    } catch (error) {
      console.error("Error marking alarm as triggered:", error);
      throw error;
    }
  }

  async deleteAlarm(alarmId) {
    try {
      const alarmRef = doc(db, "alarms", alarmId);
      await deleteDoc(alarmRef);
    } catch (error) {
      console.error("Error deleting alarm:", error);
      throw error;
    }
  }

  async completePomodoro() {
    try {
      const stats = await this.getUserStats();
      await this.updateStat("pomodoros", stats.pomodoros + 1);
    } catch (error) {
      console.error("Error updating pomodoro count:", error);
    }
  }
}

export default CalendarService;
