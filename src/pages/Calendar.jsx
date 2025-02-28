// src/components/Calendar.jsx
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSelector, useDispatch } from "react-redux";
import CalendarService from "../services/CalendarService";
import "react-datepicker/dist/react-datepicker.css";
import TasksComp from "../components/TasksComp.jsx";
import { setTasks, setLoading, setError } from "../store/tasksSlice";

// Utility function to format Date objects into 'YYYY-MM-DDTHH:mm' (local time)
const formatForInput = (date) => {
  const pad = (num) => num.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Form component for creating an event
const FormElem = ({
  newEventData,
  setNewEventData,
  handleModalSubmit,
  setShowModal,
}) => {
  return (
    <form onSubmit={handleModalSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          placeholder="Enter your title..."
          type="text"
          value={newEventData.title}
          onChange={(e) =>
            setNewEventData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="flex flex-1 items-center justify-between">
        <div className="mb-4 w-[48%]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="datetime-local"
            value={newEventData.start || formatForInput(new Date())}
            onChange={(e) =>
              setNewEventData((prev) => ({ ...prev, start: e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
            required
          />
        </div>
        <div className="mb-4 w-[48%]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="datetime-local"
            value={
              newEventData.end ||
              formatForInput(new Date(new Date().getTime() + 60 * 60 * 1000))
            }
            onChange={(e) =>
              setNewEventData((prev) => ({ ...prev, end: e.target.value }))
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="flex justify-center gap-2">
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
          Create Task
        </button>
      </div>
    </form>
  );
};

function Calendar() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: "",
    start: "",
    end: "",
  });
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    const calendarService = new CalendarService();
    calendarService
      .fetchEvents()
      .then((fetchedEvents) => {
        // Use optional chaining to safely get the items array
        const items = fetchedEvents?.items || [];
        const formattedEvents = items.map((event) => ({
          id: event.id,
          title: event.summary || "No Title",
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
        }));
        setEvents(formattedEvents);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
      });
  }, []);

  const fetchTasks = async () => {
    const calendarService = new CalendarService();
    dispatch(setLoading(true));
    try {
      const fetchedTasks = await calendarService.fetchTasks();
      dispatch(setTasks(fetchedTasks));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createNewEvent = async (eventData) => {
    if (!eventData.title || !eventData.start) {
      alert("Please fill in all fields!");
      return false;
    }
    // Parse the local date string as local time
    const start = new Date(eventData.start);
    const end = new Date(eventData.end);

    console.log("before", start);
    console.log("before", end);
    console.log("after", start.toISOString());
    console.log("after", end.toISOString());

    const newEvent = {
      summary: eventData.title,
      start: {
        dateTime: start.toISOString(), // UTC time
        timeZone: "Asia/Kolkata", // specify your time zone
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "Asia/Kolkata",
      },
    };
    try {
      const calendarService = new CalendarService();
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
        // Create a corresponding task in Firestore
        const taskCreated = await calendarService.createTask({
          id: createdEvent.id,
          title: createdEvent.summary,
          start: createdEvent.start.dateTime,
          end: createdEvent.end.dateTime,
          done: false,
        });
        if (taskCreated) {
          fetchTasks();
        }
        return true;
      }
    } catch (error) {
      alert("Error creating event: " + error.message);
      return false;
    }
  };

  const handleDateClick = (info) => {
    // Use the provided date directly (it is already in local time)
    const startDate = new Date(info.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    console.log("in handle date time", startDate);
    console.log("in handle date time", endDate);

    setNewEventData({
      title: "",
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
      start: {
        dateTime: info.event.start.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: { dateTime: info.event.end.toISOString(), timeZone: "Asia/Kolkata" },
    };
    const calendarService = new CalendarService();
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
      start: {
        dateTime: info.event.start.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: { dateTime: info.event.end.toISOString(), timeZone: "Asia/Kolkata" },
    };
    const calendarService = new CalendarService();
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
      {/* Modal for creating a new event */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
            <FormElem
              newEventData={newEventData}
              setNewEventData={setNewEventData}
              handleModalSubmit={handleModalSubmit}
              setShowModal={setShowModal}
            />
          </div>
        </div>
      )}

      {/* Sidebar: Create event form & Tasks component */}
      <div className="w-[22%] bg-white shadow-lg p-3 flex flex-col gap-6 h-full overflow-y-scroll border-r border-gray-200">
        <div className="flex gap-2 flex-col border-b py-2">
          <h2 className="text-2xl font-bold">Create Task</h2>
          <FormElem
            newEventData={newEventData}
            setNewEventData={setNewEventData}
            handleModalSubmit={handleModalSubmit}
          />
        </div>
        <div className="h-full">
          <TasksComp />
        </div>
      </div>

      {/* Main Calendar Display */}
      <div className="flex-1 h-full p-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full">
          <FullCalendar
            key={loading ? "loading" : "loaded"}
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
            eventClick={(info) => console.log(info)}
            eventDidMount={(info) => {
              const task = tasks.find(
                (task) => task.title === info.event.title && task.done === true
              );
              if (task) {
                info.el.style.backgroundColor = "#FF5733";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Calendar;
