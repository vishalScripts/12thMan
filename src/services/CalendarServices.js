export class CalendarService {
  constructor(token) {
    this.token = token;
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
}
