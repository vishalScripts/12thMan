// src/components/Notification.jsx

import { motion } from "framer-motion";

const Notification = ({ message, type, onClose }) => {
  const notificationStyles =
    type === "success" ? "bg-green-200 border" : "bg-red-200 border ";

  return (
    <motion.div
      className={`fixed  border-slate-300 w-50 bottom-5 right-5 px-6 py-2 rounded-lg shadow-md text-slate-950 ${notificationStyles}`}
      initial={{ opacity: 0, x: 100 }} // Start from left off-screen
      animate={{ opacity: 1, x: 0 }} // Slide in from left to center
      exit={{ opacity: 0, x: 100 }} // Slide out to right
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-xl font-semibold text-slate-950 hover:text-gray-200"
        >
          &times;
        </button>
      </div>
    </motion.div>
  );
};

export default Notification;
