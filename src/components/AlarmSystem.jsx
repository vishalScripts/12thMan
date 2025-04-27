import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BellAlertIcon,
  BellSlashIcon,
  XMarkIcon,
  SpeakerXMarkIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import { Spin, Switch, Popover, Badge } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import CalendarService from "../services/CalendarService";

import {
  setAlarms,
  addAlarm,
  removeAlarm,
  toggleAlarmActive,
} from "../store/alarmsSlice";
import alarmAudio from "../assets/music/alarm.mp3";
import Button from "./Button";

function AlarmSystem() {
  const tasks = useSelector((state) => state.tasks.tasks);

  console.log("Tasks:", tasks);

  const { alarms, loading } = useSelector(
    (state) => state.alarms || { alarms: [], loading: false }
  );
  const dispatch = useDispatch();

  const [activeNotifications, setActiveNotifications] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false);

  const alarmSoundRef = useRef(new Audio(alarmAudio));

  // Fetch alarms on component mount
  useEffect(() => {
    const fetchAlarms = async () => {
      const calendarService = new CalendarService();
      try {
        const fetchedAlarms = await calendarService.fetchAlarms();
        dispatch(setAlarms(fetchedAlarms));
      } catch (error) {
        console.error("Error fetching alarms:", error);
      }
    };
    fetchAlarms();
  }, [dispatch]);

  // Check for upcoming alarms
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();

      alarms.forEach((alarm) => {
        if (!alarm.active || alarm.triggered) return;

        const task = tasks.find((t) => t.id === alarm.taskId);
        if (!task || task.done) return;

        const alarmTime = new Date(alarm.time);
        const diffInMinutes = (alarmTime - now) / (1000 * 60);

        if (diffInMinutes <= 0 && diffInMinutes > -1) {
          triggerAlarm(alarm, task);
        }
      });
    };

    const intervalId = setInterval(checkAlarms, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [alarms, tasks]);

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      stopAlarmSound();
    };
  }, []);

  const triggerAlarm = (alarm, task) => {
    // Play sound if enabled
    if (soundEnabled) {
      playAlarmSound();
    }

    // Add notification
    const notification = {
      id: Date.now(),
      alarmId: alarm.id,
      taskId: task.id,
      title: task.title,
      message: `Time for task: ${task.title}`,
      time: new Date().toLocaleTimeString(),
    };

    setActiveNotifications((prev) => [...prev, notification]);

    // Open the popover to show the notification
    setPopoverVisible(true);

    // Mark alarm as triggered
    const calendarService = new CalendarService();
    calendarService
      .markAlarmTriggered(alarm.id)
      .then(() => {
        // Update Redux store
        const updatedAlarms = alarms.map((a) =>
          a.id === alarm.id ? { ...a, triggered: true } : a
        );
        dispatch(setAlarms(updatedAlarms));
      })
      .catch((error) =>
        console.error("Error marking alarm as triggered:", error)
      );
  };

  const playAlarmSound = () => {
    if (!currentlyPlaying) {
      alarmSoundRef.current.loop = true;
      alarmSoundRef.current
        .play()
        .then(() => {
          setCurrentlyPlaying(true);
        })
        .catch((err) => console.error("Failed to play alarm sound:", err));
    }
  };

  const stopAlarmSound = () => {
    alarmSoundRef.current.pause();
    alarmSoundRef.current.currentTime = 0;
    setCurrentlyPlaying(false);
  };

  const toggleSound = () => {
    if (currentlyPlaying) {
      stopAlarmSound();
    }
    setSoundEnabled(!soundEnabled);
  };

  const dismissNotification = (notificationId) => {
    setActiveNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );

    // If no more notifications, stop the sound
    if (activeNotifications.length <= 1) {
      stopAlarmSound();
    }
  };

  const dismissAllNotifications = () => {
    setActiveNotifications([]);
    stopAlarmSound();
  };

  const createAlarm = async (taskId, minutesBefore) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const taskStartTime = new Date(task.start);
    const alarmTime = new Date(
      taskStartTime.getTime() - minutesBefore * 60 * 1000
    );

    // Don't set alarms in the past
    const now = new Date();
    if (alarmTime < now) {
      console.warn("Can't set alarm in the past");
      return;
    }

    const newAlarm = {
      taskId,
      time: alarmTime.toISOString(),
      minutesBefore,
      active: true,
      triggered: false,
      createdAt: new Date().toISOString(),
    };

    const calendarService = new CalendarService();
    try {
      const alarmId = await calendarService.createAlarm(newAlarm);
      dispatch(addAlarm({ ...newAlarm, id: alarmId }));
      return alarmId;
    } catch (error) {
      console.error("Error creating alarm:", error);
      return null;
    }
  };

  const deleteAlarm = async (alarmId) => {
    const calendarService = new CalendarService();
    try {
      await calendarService.deleteAlarm(alarmId);
      dispatch(removeAlarm(alarmId));
    } catch (error) {
      console.error("Error deleting alarm:", error);
    }
  };

  const toggleAlarm = async (alarmId, active) => {
    const calendarService = new CalendarService();
    try {
      await calendarService.updateAlarmStatus(alarmId, active);
      dispatch(toggleAlarmActive({ id: alarmId, active }));
    } catch (error) {
      console.error("Error toggling alarm:", error);
    }
  };

  // Get upcoming alarms for display
  const upcomingAlarms = alarms
    .filter((alarm) => {
      const task = tasks.find((t) => t.id === alarm.taskId);
      return (
        alarm.active &&
        !alarm.triggered &&
        task &&
        !task.done &&
        new Date(alarm.time) > new Date()
      );
    })
    .sort((a, b) => new Date(a.time) - new Date(b.time))
    .slice(0, 5); // Show only the next 5 alarms

  // Popover content
  const content = (
    <div className="w-80  overflow-y-auto ">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-background z-10 py-2">
        <h2 className="text-lg font-bold text-text">Task Alarms</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-1 hover:bg-accent-hover/50 cursor-pointer duration-300 rounded-full"
            title={soundEnabled ? "Mute alarms" : "Enable alarm sound"}
          >
            {soundEnabled ? (
              <SpeakerWaveIcon className="w-5 h-5 text-green-500" />
            ) : (
              <SpeakerXMarkIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {currentlyPlaying && (
            <button
              onClick={stopAlarmSound}
              className="p-1 bg-red-100 hover:bg-red-200 rounded-full"
              title="Stop alarm sound"
            >
              <XMarkIcon className="w-5 h-5 text-red-500" />
            </button>
          )}
        </div>
      </div>

      {/* Active Notifications */}
      <AnimatePresence>
        {activeNotifications.length > 0 && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-md font-medium text-text">Active Alarms</h3>
              <button
                onClick={dismissAllNotifications}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Dismiss all
              </button>
            </div>

            {activeNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-3 p-3 bg-orange-100 border-l-4 border-orange-500 rounded shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-orange-800">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-orange-700">
                      {notification.message}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      {notification.time}
                    </p>
                  </div>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="p-1 hover:bg-orange-200 rounded-full"
                  >
                    <XMarkIcon className="w-5 h-5 text-orange-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Upcoming Alarms */}
      <div className="mt-4">
        <h3 className="text-md font-medium text-text mb-2">Upcoming Alarms</h3>
        {loading ? (
          <div className="flex justify-center py-4">
            <Spin
              indicator={
                <LoadingOutlined style={{ color: COLORS.primary }} spin />
              }
            />
          </div>
        ) : upcomingAlarms.length === 0 ? (
          <p className="text-sm text-text/80 italic py-2">No upcoming alarms</p>
        ) : (
          <ul className="space-y-2">
            {upcomingAlarms.map((alarm) => {
              const task = tasks.find((t) => t.id === alarm.taskId);
              if (!task) return null;

              return (
                <li
                  key={alarm.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100"
                >
                  <div>
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-text/80">
                      {new Date(alarm.time).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      size="small"
                      checked={alarm.active}
                      onChange={(checked) => toggleAlarm(alarm.id, checked)}
                      className={alarm.active ? "bg-purple-500" : "bg-gray-300"}
                    />
                    <button
                      onClick={() => deleteAlarm(alarm.id)}
                      className="p-1 cursor-pointer hover:bg-red-100 rounded-full"
                    >
                      <XMarkIcon className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Add New Alarm Section */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-md font-medium text-text mb-3">Set New Alarm</h3>
        <SetAlarmForm tasks={tasks} createAlarm={createAlarm} />
      </div>
    </div>
  );

  return (
    <div className="bg-background">
      <Popover
        content={content}
        title={null}
        trigger="click"
        open={popoverVisible}
        onOpenChange={setPopoverVisible}
        placement="bottomRight"
        overlayClassName=" alarm-popover !border-1 !border-border !rounded-md "
        color="var(--color-background)"
      >
        <Badge count={activeNotifications.length} size="small">
          <button
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-opacity-20  transition-all duration-300 hover:scale-105 active:scale-90  ${
              currentlyPlaying
                ? "animate-pulse bg-primary "
                : popoverVisible
                ? "bg-primary" // Red background when popover is open
                : "hover:bg-primary"
            }`}
          >
            {activeNotifications.length > 0 ? (
              <BellAlertIcon
                className={`w-6 h-6 cursor-pointer ${
                  currentlyPlaying
                    ? "text-orange-500 animate-wiggle"
                    : "text-purple-500 "
                }`}
              />
            ) : (
              <BellAlertIcon className="w-5 h-5  text-text" />
            )}
          </button>
        </Badge>
      </Popover>
    </div>
  );
}

// Sub-component for setting new alarms
function SetAlarmForm({ tasks, createAlarm }) {
  const [selectedTask, setSelectedTask] = useState("");
  const [minutesBefore, setMinutesBefore] = useState([15]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask) {
      setMessage({ text: "Please select a task", type: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create multiple alarms for each selected time
      const alarmPromises = minutesBefore.map((minutes) =>
        createAlarm(selectedTask, minutes)
      );

      const alarmIds = await Promise.all(alarmPromises);

      // Check if all alarms were created successfully
      if (alarmIds.every((id) => id !== null)) {
        setMessage({
          text: `Alarm${minutesBefore.length > 1 ? "s" : ""} set successfully`,
          type: "success",
        });
        setSelectedTask("");
        setMinutesBefore([15]); // Reset to default
        // Reset message after 3 seconds
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        setMessage({ text: "Failed to set one or more alarms", type: "error" });
      }
    } catch (error) {
      setMessage({ text: error.message || "An error occurred", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMinutesBefore = (time) => {
    setMinutesBefore((prev) =>
      prev.includes(time)
        ? prev.filter((t) => t !== time)
        : [...prev, time].sort((a, b) => a - b)
    );
  };

  // Filter out tasks that are already done or in the past
  tasks.forEach((task) => {
    console.log(
      "Task Start:",
      new Date(task.start),
      "Current Time:",
      new Date()
    );
    console.log(
      "Comparison:",
      new Date(task.start).toISOString() > new Date().toISOString()
    );
  });

  const availableTasks = tasks.filter((task) => {
    if (!task.start) return false; // Skip tasks with no start time

    const taskTime = new Date(task.start).getTime();
    const currentTime = new Date().getTime();

    return !task.done && taskTime > currentTime;
  });

  console.log(availableTasks);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-text saturate-50 mb-1">
          Task
        </label>
        <select
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
          className="w-full p-2 border border-gray-300 text-text saturate-0 rounded text-sm"
          disabled={isSubmitting}
        >
          <option value="">Select a task</option>
          {availableTasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title} (
              {new Date(task.start).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              )
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">
          Notify me, <span className=" font-extrabold">Before:</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {[2, 5, 15, 30, 60, 120, 1440].map((time) => (
            <Button
              type="button"
              variant="compact"
              key={time}
              onClick={() => toggleMinutesBefore(time)}
              className={` text-slate-900 ${
                minutesBefore.includes(time) ? "bg-primary text-white" : ""
              }`}
              disabled={isSubmitting}
            >
              {time === 60
                ? "1hr"
                : time === 120
                ? "2hr"
                : time === 1440
                ? "1d"
                : `${time} m`}
            </Button>
          ))}
        </div>
        {minutesBefore.length > 0 && (
          <div className="text-xs text-text saturate-100 mt-1">
            Selected:{" "}
            {minutesBefore
              .map((m) =>
                m === 60
                  ? "1hr"
                  : m === 120
                  ? "2hr"
                  : m === 1440
                  ? "1d"
                  : `${m}m`
              )
              .join(", ")}
          </div>
        )}
      </div>

      <Button
        variant="primary"
        type="submit"
        disabled={isSubmitting || minutesBefore.length === 0}
        className={`w-full  text-white font-medium rounded transition-colors cursor-pointer ${
          isSubmitting || minutesBefore.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : ""
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Spin
              indicator={<LoadingOutlined style={{ color: "white" }} spin />}
            />
            Setting alarm...
          </span>
        ) : (
          `Set Alarm${minutesBefore.length > 1 ? "s" : ""}`
        )}
      </Button>

      {message.text && (
        <div
          className={`p-2 text-sm rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  );
}

export default AlarmSystem;
