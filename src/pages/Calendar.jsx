import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSelector, useDispatch } from "react-redux";
import { CalendarService } from "../services/CalendarServices";
import DatePicker from "react-datepicker"; // Import React Datepicker
import "react-datepicker/dist/react-datepicker.css";
import TasksComp from "../components/TasksComp";

import { setTasks, setLoading, setError } from "../store/tasksSlice";

// Form component now receives props
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
          placeholder="Enter your title.."
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
      <div className="flex flex-1 items-center justify-between">
        <div className="mb-4 w-[48%] ">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="datetime-local"
            value={
              newEventData.start
                ? new Date(newEventData.start).toISOString().slice(0, 16)
                : new Date().toISOString().slice(0, 16)
            }
            onChange={(e) =>
              setNewEventData((prev) => ({
                ...prev,
                start: e.target.value,
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
            required
          />
        </div>
        <div className="mb-4  w-[48%]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="datetime-local"
            value={
              newEventData.end
                ? new Date(newEventData.end).toISOString().slice(0, 16) // Formatting to match the input format
                : new Date(new Date().getTime() + 60 * 60 * 1000)
                    .toISOString()
                    .slice(0, 16) // Default to 1 hour later
            }
            onChange={(e) =>
              setNewEventData((prev) => ({
                ...prev,
                end: e.target.value, // Save the selected date and time in ISO format
              }))
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
  const { token } = useSelector((state) => state.auth);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: "",
    start: "",
    end: "",
  });

  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (token) {
      const calendarService = new CalendarService(token);
      calendarService.fetchEvents().then((fetchedEvents) => {
        console.log(fetchedEvents);
        const formattedEvents = fetchedEvents.items.map((event) => ({
          id: event.id,
          title: event.summary || "No Title",
          start: event.start?.date || event.start?.dateTime,
          end: event.end?.date || event.end?.dateTime,
        }));
        setEvents(formattedEvents);
      });
    }
  }, [token]);

  const fetchTasks = async () => {
    console.log("i was ere");
    if (token) {
      dispatch(setLoading(true)); // Set loading to true
      try {
        const calendarService = new CalendarService(token);
        const fetchedTasks = await calendarService.fetchTasks();
        dispatch(setTasks(fetchedTasks)); // Set tasks in Redux store
      } catch (error) {
        dispatch(setError(error.message)); // Handle error if any
      } finally {
        dispatch(setLoading(false)); // Set loading to false
      }
    }
  };

  const createNewEvent = async (eventData) => {
    if (!token || !eventData.title || !eventData.start) {
      alert("Please fill in all fields!");
      return false;
    }

    const start = new Date(eventData.start);
    const end = new Date(eventData.end);

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
        const taskCreate = await calendarService.createTask({
          id: createdEvent.id,
          title: createdEvent.summary,
          start: createdEvent.start.dateTime,
          end: createdEvent.end.dateTime,
          done: false,
        });

        if (taskCreate) {
          fetchTasks();
        }

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
    const startDate = new Date(info.date); // Get clicked date (UTC)

    // Convert UTC to local time
    const localStartDate = new Date(
      startDate.getTime() - startDate.getTimezoneOffset() * 60000
    );
    const localEndDate = new Date(localStartDate.getTime() + 60 * 60 * 1000); // 1 hour later

    setNewEventData({
      title: "",
      start: formatForInput(localStartDate),
      end: formatForInput(localEndDate),
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
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border-1 shadow-2xl p-6 w-full max-w-md">
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

      {/* Sidebar for Creating Events */}
      <div
        className="w-[22%] bg-white shadow-lg p-3 flex flex-col gap-6 h-full overflow-y-scroll scroll-smooth scroll-snap-y 
            [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-white
  [&::-webkit-scrollbar-thumb]:bg-slate-700
  dark:[&::-webkit-scrollbar-track]:bg-white
  dark:[&::-webkit-scrollbar-thumb]:bg-slate-700
          border-r border-gray-200"
      >
        <div className="flex gap-2 flex-col border-b-1 py-2">
          <h2 className="text-2xl font-bold ">Create Task</h2>
          <FormElem
            newEventData={newEventData}
            setNewEventData={setNewEventData}
            handleModalSubmit={handleModalSubmit}
          />
        </div>
        <div className="h-full ">
          <TasksComp className="" />
        </div>
      </div>

      {/* Calendar Section */}
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
            eventClick={(info) => {
              console.log(info);
            }}
            eventDidMount={(info) => {
              console.log("Event Mounted", info);

              // Check if the event title matches any task title and the task is marked as done
              const task = tasks.find(
                (task) => task.title === info.event.title && task.done === true
              );

              if (task) {
                // Change the background color if matched and task is done
                info.el.style.backgroundColor = "#FF5733"; // Or any color you want
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Calendar;
