import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSelector, useDispatch } from "react-redux"; // if you are using Redux for global state
import { CalendarService } from "../services/CalendarServices";

function Calendar() {
  const [events, setEvents] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: "",
    start: "",
    end: "",
  });

  useEffect(() => {
    if (token) {
      const calendarService = new CalendarService(token);
      calendarService.fetchEvents().then((fetchedEvents) => {
        const formattedEvents = fetchedEvents.map((event) => ({
          id: event.id,
          title: event.summary || "No Title",
          start: event.start?.date || event.start?.dateTime,
          end: event.end?.date || event.end?.dateTime,
        }));
        setEvents(formattedEvents);
      });
    }
  }, [token]);

  const createNewEvent = async (eventData) => {
    if (!token || !eventData.title || !eventData.start || !eventData.end) {
      alert("Please fill in all fields!");
      return false;
    }

    const start = new Date(eventData.start);
    const end = new Date(eventData.end);
    if (start >= end) {
      alert("End time must be after start time!");
      return false;
    }

    const newEvent = {
      summary: eventData.title,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
    };

    try {
      const calendarService = new CalendarService(token);
      const createdEvent = await calendarService.createEvent(newEvent);

      if (createdEvent) {
        setEvents((prev) => [
          ...prev,
          {
            id: createdEvent.id,
            title: createdEvent.summary,
            start: createdEvent.start.dateTime,
            end: createdEvent.end.dateTime,
          },
        ]);
        // NEW: Create a corresponding task in Appwrite with "done" status set to false.
        await calendarService.createTask({
          id: createdEvent.id,
          title: createdEvent.summary,
          start: createdEvent.start.dateTime,
          end: createdEvent.end.dateTime,
          done: false,
        });
        return true;
      }
    } catch (error) {
      alert("Error creating event: " + error.message);
    }
    return false;
  };

  const handleCreateEvent = async () => {
    const startDate = new Date(eventDate);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const success = await createNewEvent({
      title: eventTitle,
      start: eventDate,
      end: endDate.toISOString().slice(0, 16),
    });

    if (success) {
      setEventTitle("");
      setEventDate("");
    }
  };

  const formatForInput = (date) => {
    const pad = (num) => num.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateClick = (info) => {
    const startDate = info.date;
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    setNewEventData({
      title: "Enter your title",
      start: formatForInput(startDate),
      end: formatForInput(endDate),
    });
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const success = await createNewEvent(newEventData);
    if (success) {
      setShowModal(false);
      setNewEventData({ title: "", start: "", end: "" });
    }
  };

  const handleEventDrop = async (info) => {
    const updatedEvent = {
      summary: info.event.title,
      start: { dateTime: info.event.start.toISOString() },
      end: { dateTime: info.event.end.toISOString() },
    };

    const calendarService = new CalendarService(token);
    await calendarService.updateEvent(info.event.id, updatedEvent);

    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? { ...event, start: info.event.start, end: info.event.end }
        : event
    );
    setEvents(updatedEvents);
  };

  const handleEventResize = async (info) => {
    const updatedEvent = {
      summary: info.event.title,
      start: { dateTime: info.event.start.toISOString() },
      end: { dateTime: info.event.end.toISOString() },
    };

    const calendarService = new CalendarService(token);
    await calendarService.updateEvent(info.event.id, updatedEvent);

    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? { ...event, start: info.event.start, end: info.event.end }
        : event
    );
    setEvents(updatedEvents);
  };

  return (
    <div className="flex h-[90vh] bg-gray-100 font-sans">
      {/* Event Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newEventData.title}
                  onChange={(e) =>
                    setNewEventData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={newEventData.start}
                  onChange={(e) =>
                    setNewEventData((prev) => ({
                      ...prev,
                      start: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={newEventData.end}
                  onChange={(e) =>
                    setNewEventData((prev) => ({
                      ...prev,
                      end: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar for Creating Events */}
      <div className="w-[22%] bg-white shadow-lg p-6 flex flex-col gap-6 border-r border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Create Event</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateEvent}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add Event
          </button>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="flex-1 h-full p-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            events={events}
            height="100%"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            eventBackgroundColor="#6366F1"
            eventTextColor="#ffffff"
            dayMaxEvents={2}
            selectable={true}
            editable={true}
            eventResizableFromStart={true}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            dateClick={handleDateClick}
            eventClick={(info) => {
              alert(`Event: ${info.event.title}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Calendar;
