import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
  FiBarChart2,
  FiMoon,
  FiSun,
  FiBook,
  FiTarget,
  FiRefreshCw,
  FiFolder,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../services/AuthService";
import { logoutUser } from "../store/authSlice";
import StatsDashboard from "../components/StatsDashboard";
import TextToSpeech from "../components/TextToSpeech;";
import ThemeBtn from "../components/ThemeBtn";
import Home from "../components/Home";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("home");
  const darkMode = useSelector((state) => state.theme.theme === "dark");

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logoutUser());
  };

  const studyTips = [
    "Break your study sessions into 25-minute focused blocks with 5-minute breaks (Pomodoro Technique)",
    "Create a dedicated study space free from distractions",
    "Use active recall techniques instead of passive reading",
    "Explain concepts out loud as if teaching someone else",
    "Get 7-8 hours of sleep to consolidate memory",
    "Stay hydrated and take regular breaks to maintain focus",
  ];

  const motivationalQuotes = {
    roosevelt: {
      quote:
        "The only limit to our realization of tomorrow will be our doubts of today.",
      author: "Franklin D. Roosevelt",
    },
    churchill: {
      quote:
        "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      author: "Winston Churchill",
    },
    mandela: {
      quote:
        "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela",
    },
    king: {
      quote:
        "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King",
    },
    twain: {
      quote: "The secret of getting ahead is getting started.",
      author: "Mark Twain",
    },
    hayes: {
      quote: "The expert in anything was once a beginner.",
      author: "Helen Hayes",
    },
  };

  const randomTip = studyTips[Math.floor(Math.random() * studyTips.length)];
  const quoteKeys = Object.keys(motivationalQuotes);
  const randomQuoteKey =
    quoteKeys[Math.floor(Math.random() * quoteKeys.length)];
  const randomQuote = motivationalQuotes[randomQuoteKey];

  // Variants for animated transitions
  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  console.log(user, "userrrrrrrrrrrrrrr");

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(to bottom right, var(--acme-background), var(--acme-accent-hover))",
        }}
      >
        <div className="animate-pulse flex flex-col items-center">
          <div
            className="w-24 h-24 rounded-full mb-4"
            style={{ backgroundColor: "var(--acme-primary)" }}
          ></div>
          <div
            className="h-4 w-48 rounded mb-3"
            style={{ backgroundColor: "var(--acme-secondary)" }}
          ></div>
          <div
            className="h-3 w-32 rounded"
            style={{ backgroundColor: "var(--acme-secondary)" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex transition-all duration-300"
      
    >
      {/* Sidebar - Modified to stick when scrolling */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        handleLogout={handleLogout}
        setActiveTab={setActiveTab}
      />
      {/* Add a spacer div to push content to the right */}

      {/* Main Content */}
      <main className="flex-1 overflow-auto transition-all duration-300 p-6 md:p-10">
        <AnimatePresence exitBeforeEnter>
          {activeTab === "home" && (
            <motion.div
              key="home"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="  mx-auto"
            >
              <Home />
            </motion.div>
          )}

          {activeTab === "stats" && (
            <motion.div
              key="stats"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-4xl mx-auto shadow-lg rounded-2xl p-8 transition-all duration-300 backdrop-blur-sm border"
              style={{
                backgroundColor: "var(--acme-background)",
                borderColor: "var(--acme-secondary-hover)",
                opacity: 0.9,
              }}
            >
              <h2
                className="text-2xl font-bold mb-6 flex items-center"
                style={{ color: "var(--acme-text)" }}
              >
                <FiBarChart2
                  className="mr-2"
                  style={{ color: "var(--acme-secondary)" }}
                />
                Detailed Statistics
              </h2>
              <p
                className="mb-6"
                style={{ color: "var(--acme-text)", opacity: 0.6 }}
              >
                View your detailed learning analytics and progress tracking
              </p>
              <StatsDashboard />
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-4xl mx-auto shadow-lg rounded-2xl p-8 transition-all duration-300 backdrop-blur-sm border"
              style={{
                backgroundColor: "var(--acme-background)",
                borderColor: "var(--acme-secondary-hover)",
                opacity: 0.9,
              }}
            >
              <h2
                className="text-2xl font-bold mb-6 flex items-center"
                style={{ color: "var(--acme-text)" }}
              >
                <FiUser
                  className="mr-2"
                  style={{ color: "var(--acme-accent)" }}
                />
                Profile
              </h2>
              <div className="flex flex-col md:flex-row items-center md:space-x-6 mb-8">
                <div className="relative group mb-4 md:mb-0">
                  <img
                    className="h-24 w-24 object-cover rounded-full border-4 transition duration-300"
                    style={{
                      borderColor: "var(--acme-primary)",
                      borderColorHover: "var(--acme-accent)",
                    }}
                    src={user?.photoURL || "https://via.placeholder.com/96"}
                    alt="Profile"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <div className="bg-black bg-opacity-50 rounded-full h-24 w-24 flex items-center justify-center">
                      <span className="text-white text-sm">Change</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4
                    className="text-2xl font-semibold"
                    style={{ color: "var(--acme-text)" }}
                  >
                    {user.displayName}
                  </h4>
                  <p style={{ color: "var(--acme-text)", opacity: 0.6 }}>
                    {user.email}
                  </p>
                  <div className="mt-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(52, 211, 153, 0.1)",
                        color: "rgb(52, 211, 153)",
                      }}
                    >
                      Active Student
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div
                  className="p-4 rounded-lg transition-colors duration-300"
                  style={{
                    backgroundColor: "rgba(var(--acme-text-rgb), 0.05)",
                  }}
                >
                  <h5
                    className="font-medium mb-2"
                    style={{ color: "var(--acme-text)", opacity: 0.7 }}
                  >
                    Account Created:
                  </h5>
                  <p style={{ color: "var(--acme-text)" }}>
                    {new Date(Number(user.createdAt)).toLocaleString()}
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg transition-colors duration-300"
                  style={{
                    backgroundColor: "rgba(var(--acme-text-rgb), 0.05)",
                  }}
                >
                  <h5
                    className="font-medium mb-2"
                    style={{ color: "var(--acme-text)", opacity: 0.7 }}
                  >
                    Last Login:
                  </h5>
                  <p style={{ color: "var(--acme-text)" }}>
                    {new Date(Number(user.lastLoginAt)).toLocaleString()}
                  </p>
                </div>
              </div>
              <div
                className="mt-6 border-t pt-6"
                style={{ borderColor: "var(--acme-secondary-hover)" }}
              >
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "var(--acme-text)" }}
                >
                  Profile Actions
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    className="text-white py-2 px-6 rounded-lg hover:shadow-lg transition duration-200 shadow-md"
                    style={{
                      background:
                        "linear-gradient(to right, var(--acme-primary), var(--acme-primary))",
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="text-white py-2 px-6 rounded-lg hover:shadow-lg transition duration-200 shadow-md"
                    style={{
                      background:
                        "linear-gradient(to right, var(--acme-secondary-hover), var(--acme-secondary-hover))",
                    }}
                  >
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-white py-2 px-6 rounded-lg hover:shadow-lg transition duration-200 shadow-md"
                    style={{
                      background: "linear-gradient(to right, #e53e3e, #c53030)",
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-4xl mx-auto shadow-lg rounded-2xl p-8 transition-all duration-300 backdrop-blur-sm border"
              style={{
                backgroundColor: "var(--acme-background)",
                borderColor: "var(--acme-secondary-hover)",
                opacity: 0.9,
              }}
            >
              <h2
                className="text-2xl font-bold mb-6 flex items-center"
                style={{ color: "var(--acme-text)" }}
              >
                <FiSettings
                  className="mr-2"
                  style={{ color: "var(--acme-primary)" }}
                />
                Settings
              </h2>
              <div className="space-y-8">
                <div
                  className="border-b pb-6"
                  style={{ borderColor: "var(--acme-secondary-hover)" }}
                >
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: "var(--acme-text)" }}
                  >
                    Appearance
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4
                        className="font-medium"
                        style={{ color: "var(--acme-text)" }}
                      >
                        Dark Mode
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: "var(--acme-text)", opacity: 0.6 }}
                      >
                        Toggle between light and dark theme
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      onClick={() => setDarkMode(!darkMode)}
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: darkMode
                          ? "rgba(var(--acme-primary-rgb), 0.1)"
                          : "rgba(229, 231, 235, 1)",
                        color: darkMode
                          ? "var(--acme-primary)"
                          : "var(--acme-text)",
                      }}
                    >
                      {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
                    </motion.button>
                  </div>
                </div>
                <div
                  className="border-b pb-6"
                  style={{ borderColor: "var(--acme-secondary-hover)" }}
                >
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: "var(--acme-text)" }}
                  >
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Email Notifications",
                        description: "Receive updates via email",
                        defaultChecked: true,
                      },
                      {
                        title: "Push Notifications",
                        description: "Receive in-app notifications",
                        defaultChecked: true,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <h4
                            className="font-medium"
                            style={{ color: "var(--acme-text)" }}
                          >
                            {item.title}
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: "var(--acme-text)", opacity: 0.6 }}
                          >
                            {item.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={item.defaultChecked}
                          />
                          <div
                            className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"
                            style={{
                              backgroundColor:
                                "rgba(var(--acme-text-rgb), 0.2)",
                              peerFocusRingColor: "var(--acme-primary)",
                              peerCheckedBackgroundColor: "var(--acme-primary)",
                            }}
                          ></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: "var(--acme-text)" }}
                  >
                    Privacy
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4
                        className="font-medium"
                        style={{ color: "var(--acme-text)" }}
                      >
                        Public Profile
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: "var(--acme-text)", opacity: 0.6 }}
                      >
                        Allow others to see your profile
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div
                        className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{
                          backgroundColor: "rgba(var(--acme-text-rgb), 0.2)",
                          peerFocusRingColor: "var(--acme-primary)",
                          peerCheckedBackgroundColor: "var(--acme-primary)",
                        }}
                      ></div>
                    </label>
                  </div>
                </div>
                <div className="mt-6 pt-6">
                  <button
                    className="text-white py-2 px-6 rounded-lg transition duration-200 hover:shadow-lg"
                    style={{ backgroundColor: "var(--acme-primary)" }}
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Dashboard;
