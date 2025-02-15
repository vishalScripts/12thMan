// src/components/GoogleData.js
import { useState } from "react";

const GoogleData = ({ accessToken }) => {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);

  const getCalendarEvents = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await response.json();
      setEvents(data.items || []);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    }
  };

  const getTasks = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/tasks/v1/lists/@default/tasks",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await response.json();
      setTasks(data.items || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  console.log(tasks, events);

  return (
    <div>
      <h2>Google Calendar Events</h2>
      <button onClick={getCalendarEvents}>Fetch Events</button>
      <ul>
        {events.map((event) => (
          <li key={event.id}>{event.summary}</li>
        ))}
      </ul>

      <h2>Google Tasks</h2>
      <button onClick={getTasks}>Fetch Tasks</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleData;
