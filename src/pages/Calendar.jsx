import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSelector, useDispatch } from "react-redux";
import CalendarService from "../services/CalendarService";
import "react-datepicker/dist/react-datepicker.css";
import TasksComp from "../components/TasksComp.jsx";
import { setTasks, setLoading, setError } from "../store/tasksSlice";
import Button from "../components/Button.jsx";

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

// Format date for display in event details modal
const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Form component for creating an event
const FormElem = ({
  newEventData,
  setNewEventData,
  handleModalSubmit,
  setShowModal,
  showModal,
}) => {
  return (
    <form onSubmit={handleModalSubmit} className="space-y-4">
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
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary transition-all duration-300 focus:outline-none bg-gray-50"
          required
        />
      </div>
      <div className="flex flex-1 items-center justify-between gap-3">
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary transition-all duration-300 focus:outline-none text-gray-700 bg-gray-50"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary transition-all duration-300 focus:outline-none text-gray-700 bg-gray-50"
            required
          />
        </div>
      </div>
      <div className="flex justify-center gap-3 w-full ">
        {setShowModal && (
          <Button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-5 py-2.5 text-white bg-gray-500 hover:bg-gray-400 rounded-lg transition-all duration-300 shadow-md"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className={`px-5 py-2.5 text-white rounded-lg transition-all duration-300 shadow-md  hover:bg-secondary-hover bg-primary${
            showModal ? " px-5 " : "px-10"
          }`}
        >
          Create Task
        </Button>
      </div>
    </form>
  );
};

// Event Details Modal Component
const EventDetailsModal = ({
  event,
  onClose,
  onDelete,
  onEdit,
  onToggleComplete,
}) => {
  const { tasks } = useSelector((state) => state.tasks);
  const task = tasks.find((t) => t.id === event.id);
  const isCompleted = task?.done || false;

  return (
    <div className="fixed inset-0 backdrop-blur-[1px]  bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border shadow-2xl p-6 w-full max-w-md transform transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-color-text">{event.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700">
            <svg
              className="w-5 h-5 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <span>Starts: {formatDateForDisplay(event.start)}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <svg
              className="w-5 h-5 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Ends: {formatDateForDisplay(event.end)}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <svg
              className="w-5 h-5 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Status: {isCompleted ? "Completed" : "Pending"}</span>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <Button
            onClick={onDelete}
            className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-300 shadow-md"
          >
            Delete
          </Button>

          <Button
            onClick={onToggleComplete}
            className={`px-4 py-2 text-white rounded-lg transition-all duration-300 shadow-md ${
              isCompleted
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-accent hover:bg-accent-hover"
            }`}
          >
            {isCompleted ? "Mark Incomplete" : "Mark Complete"}
          </Button>

          <Button
            onClick={onEdit}
            className="px-4 py-2 text-white bg-primary hover:bg-secondary-hover rounded-lg transition-all duration-300 shadow-md"
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

function Calendar() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: "",
    start: "",
    end: "",
  });
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const calendarRef = useRef(null);

  useEffect(() => {
    const calendarService = new CalendarService();
    // Fetch tasks from Firebase and map them to FullCalendar's event format
    calendarService
      .fetchTasks()
      .then((fetchedTasks) => {
        const formattedTasks = fetchedTasks.map((task) => ({
          id: task.id,
          title: task.title,
          start: task.start,
          end: task.end,
          extendedProps: { done: task.done },
        }));
        setEvents(formattedTasks);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
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

  // Create a new task in Firebase instead of creating an event on Google Calendar
  const createNewEvent = async (eventData) => {
    if (!eventData.title || !eventData.start) {
      alert("Please fill in all fields!");
      return false;
    }
    // Parse the local date string as local time
    const start = new Date(eventData.start);
    const end = new Date(eventData.end);

    try {
      const calendarService = new CalendarService();
      // Create the task in Firebase
      const createdTask = await calendarService.createTask({
        title: eventData.title,
        start: start.toISOString(),
        end: end.toISOString(),
        done: false,
      });
      if (createdTask) {
        setEvents((prev) => [
          ...prev,
          {
            id: createdTask.id,
            title: createdTask.title,
            start: createdTask.start,
            end: createdTask.end,
            extendedProps: { done: false },
          },
        ]);
        // Optionally refresh tasks from Redux store
        fetchTasks();
        return true;
      }
    } catch (error) {
      alert("Error creating task: " + error.message);
      return false;
    }
  };

  // Update existing task
  const updateEvent = async (eventId, eventData) => {
    if (!eventData.title || !eventData.start || !eventData.end) {
      alert("Please fill in all fields!");
      return false;
    }

    try {
      const calendarService = new CalendarService();
      const start = new Date(eventData.start);
      const end = new Date(eventData.end);

      const updatedData = {
        title: eventData.title,
        start: start.toISOString(),
        end: end.toISOString(),
      };

      await calendarService.updateTask(eventId, updatedData);

      setEvents(
        events.map((event) =>
          event.id === eventId
            ? {
                ...event,
                title: eventData.title,
                start: updatedData.start,
                end: updatedData.end,
              }
            : event
        )
      );

      fetchTasks();
      return true;
    } catch (error) {
      alert("Error updating task: " + error.message);
      return false;
    }
  };

  // Delete task
  const deleteEvent = async (eventId) => {
    try {
      const calendarService = new CalendarService();
      await calendarService.deleteTask(eventId);
      setEvents(events.filter((event) => event.id !== eventId));
      fetchTasks();
      return true;
    } catch (error) {
      alert("Error deleting task: " + error.message);
      return false;
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (eventId) => {
    try {
      const calendarService = new CalendarService();
      const task = tasks.find((t) => t.id === eventId);
      if (task) {
        const updatedTask = { ...task, done: !task.done };
        await calendarService.updateTask(eventId, { done: !task.done });

        setEvents(
          events.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  extendedProps: { ...event.extendedProps, done: !task.done },
                }
              : event
          )
        );

        fetchTasks();
        return true;
      }
      return false;
    } catch (error) {
      alert("Error updating task status: " + error.message);
      return false;
    }
  };

  // Handler for selecting a time range by dragging on the calendar
  const handleSelect = (info) => {
    setIsEditing(false);
    setNewEventData({
      title: "",
      start: formatForInput(info.start),
      end: formatForInput(info.end),
    });
    setShowModal(true);
  };

  const handleDateClick = (info) => {
    // Use the provided date directly (it is already in local time)
    const startDate = new Date(info.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    setIsEditing(false);
    setNewEventData({
      title: "",
      start: formatForInput(startDate),
      end: formatForInput(endDate),
    });
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      extendedProps: info.event.extendedProps,
    });
    setShowEventModal(true);
  };

  const handleEditEvent = () => {
    setIsEditing(true);
    setNewEventData({
      id: selectedEvent.id,
      title: selectedEvent.title,
      start: formatForInput(new Date(selectedEvent.start)),
      end: formatForInput(new Date(selectedEvent.end)),
    });
    setShowEventModal(false);
    setShowModal(true);
  };

  const handleDeleteEvent = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const success = await deleteEvent(selectedEvent.id);
      if (success) {
        setShowEventModal(false);
      }
    }
  };

  const handleToggleComplete = async () => {
    const success = await toggleTaskCompletion(selectedEvent.id);
    if (success) {
      setShowEventModal(false);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    let success;

    if (isEditing) {
      success = await updateEvent(newEventData.id, newEventData);
    } else {
      success = await createNewEvent(newEventData);
    }

    if (success) {
      setShowModal(false);
      setNewEventData({ title: "", start: "", end: "" });
      setIsEditing(false);
    }
  };

  const handleEventDrop = async (info) => {
    const updatedData = {
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end.toISOString(),
    };
    const calendarService = new CalendarService();
    await calendarService.updateTask(info.event.id, updatedData);
    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? { ...event, start: info.event.start, end: info.event.end }
        : event
    );
    setEvents(updatedEvents);
  };

  const handleEventResize = async (info) => {
    const updatedData = {
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end.toISOString(),
    };
    const calendarService = new CalendarService();
    await calendarService.updateTask(info.event.id, updatedData);
    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? { ...event, start: info.event.start, end: info.event.end }
        : event
    );
    setEvents(updatedEvents);
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.scrollToTime(new Date()); // Scrolls to the current time
    }
  }, []);

  return (
    <div className="flex h-[90vh] bg-background font-sans">
      {/* Modal for creating a new event */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-[1px]  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border shadow-2xl p-6 w-full max-w-md transform transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-color-text">
              {isEditing ? "Edit Event" : "Create New Event"}
            </h3>
            <FormElem
              newEventData={newEventData}
              setNewEventData={setNewEventData}
              handleModalSubmit={handleModalSubmit}
              setShowModal={setShowModal}
              showModal={showModal}
            />
          </div>
        </div>
      )}

      {/* Modal for displaying event details */}
      {showEventModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setShowEventModal(false)}
          onDelete={handleDeleteEvent}
          onEdit={handleEditEvent}
          onToggleComplete={handleToggleComplete}
        />
      )}

      {/* Sidebar: Create event form & Tasks component */}
      <div className="w-[25%] bg-white shadow-xl p-4 flex flex-col gap-6 h-full overflow-y-auto border-r border-gray-200 rounded-l-xl">
        {/* <div className="flex gap-3 flex-col border-b pb-6">
          {/* <h2 className="text-2xl font-bold text-primary">Create Task</h2>
          <FormElem
            newEventData={newEventData}
            setNewEventData={setNewEventData}
            handleModalSubmit={handleModalSubmit}
          /> */}

        {/* <div className="flex flex-col justify-center flex-1">
            <h3 className={`font-medium text-gray-800 `}>create task</h3>
          </div> 
        </div> */}
        <div className="h-full">
          <TasksComp setShowModal={setShowModal} showModal={showModal} />
        </div>
      </div>

      {/* Main Calendar Display */}
      <div className="flex-1 h-full p-6">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden h-full">
          <FullCalendar
            ref={calendarRef}
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
            themeSystem="standard"
            eventBackgroundColor="#8f5fe8" // Primary color
            eventBorderColor="#8f5fe8"
            eventTextColor="#ffffff"
            dayMaxEvents={3}
            selectable={true}
            select={handleSelect}
            editable={true}
            eventResizableFromStart={true}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            nowIndicator={true}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5],
              startTime: "09:00",
              endTime: "17:00",
            }}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: "short",
            }}
            eventContent={(eventInfo) => {
              const task = tasks.find((task) => task.id === eventInfo.event.id);
              const isDone = task?.done || false;

              return (
                <div
                  className={`p-1 rounded-lg transition-all duration-300 h-full w-full ${
                    isDone ? "bg-accent opacity-90" : "bg-primary"
                  } hover:opacity-90 cursor-pointer`}
                >
                  <div className="text-white font-medium text-sm overflow-hidden">
                    {eventInfo.timeText && (
                      <div className="text-white text-xs mb-1 opacity-90">
                        {eventInfo.timeText}
                      </div>
                    )}
                    <div className="flex items-center">
                      {isDone && (
                        <svg
                          className="w-3 h-3 mr-1 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      )}
                      <span>{eventInfo.event.title}</span>
                    </div>
                  </div>
                </div>
              );
            }}
            eventDidMount={(info) => {
              const task = tasks.find(
                (task) => task.id === info.event.id && task.done === true
              );
              if (task) {
                info.el.style.backgroundColor = "#6fd3c7"; // Accent color for completed tasks
                info.el.style.borderColor = "#6fd3c7";
              }
            }}
            dayHeaderContent={(args) => {
              return (
                <div className="fc-day-header">
                  <div className="text-primary font-bold">
                    {args.date.toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {args.date.getDate()}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Calendar;
