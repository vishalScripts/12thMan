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

function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-slate-800">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-primary rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-secondary rounded mb-3"></div>
          <div className="h-3 w-32 bg-secondary rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-slate-800 text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-primary dark:text-primary">
            StudyDash
          </h1>
        </div>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={user.photoURL || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-primary"
              />
              <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                {user?.displayName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
        <nav className="mt-4">
          <ul>
            {[
              {
                key: "home",
                label: "Home",
                icon: <FiHome className="mr-3 text-primary" />,
              },
              {
                key: "stats",
                label: "Stats",
                icon: <FiBarChart2 className="mr-3 text-secondary" />,
              },
              {
                key: "profile",
                label: "Profile",
                icon: <FiUser className="mr-3 text-accent" />,
              },
              {
                key: "settings",
                label: "Settings",
                icon: <FiSettings className="mr-3 text-orange-500" />,
              },
            ].map((item) => (
              <li
                key={item.key}
                className={`flex items-center px-6 py-3 hover:bg-primary/10 cursor-pointer transition-all duration-200 ${
                  activeTab === item.key
                    ? "bg-primary/10 border-l-4 border-primary"
                    : ""
                }`}
                onClick={() => setActiveTab(item.key)}
              >
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
            <li
              className="flex items-center px-6 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer text-red-500 mt-6 transition-all duration-200"
              onClick={handleLogout}
            >
              <FiLogOut className="mr-3 text-xl" />
              <span>Logout</span>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-6">
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {darkMode ? "Dark Mode" : "Light Mode"}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1.5 rounded-lg ${
                  darkMode
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </motion.button>
            </div>
          </div>
        </div>
      </aside>

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
              className="max-w-4xl mx-auto"
            >
              {/* Greeting Section */}
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 mb-6 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Welcome back, {user?.displayName?.split(" ")[0]}!
                  </h2>
                  <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {new Date().toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-primary p-6 mb-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100">
                    Today's Motivational Quote:
                  </h3>
                  <p className="italic text-lg text-gray-700 dark:text-gray-300">
                    "{randomQuote.quote}"
                  </p>
                  <p className="text-right mt-2 text-gray-600 dark:text-gray-400">
                    — {randomQuote.author}
                  </p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 mb-6 transform transition duration-300  hover:shadow-xl backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-100">
                  <FiBarChart2 className="mr-2 text-secondary" />
                  Your Stats
                </h2>
                <StatsDashboard />
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 transform transition duration-300 hover:scale-[1.01] hover:shadow-xl backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-100">
                  <FiTarget className="mr-2 text-accent" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: <FiBook className="mr-2" />,
                      label: "Start Study Session",
                      from: "from-primary",
                      to: "to-primary/90",
                    },
                    {
                      icon: <FiRefreshCw className="mr-2" />,
                      label: "Review Progress",
                      from: "from-secondary",
                      to: "to-secondary/90",
                    },
                    {
                      icon: <FiTarget className="mr-2" />,
                      label: "Set New Goals",
                      from: "from-accent",
                      to: "to-accent/90",
                    },
                    {
                      icon: <FiFolder className="mr-2" />,
                      label: "Browse Resources",
                      from: "from-orange-500",
                      to: "to-orange-600",
                    },
                  ].map((btn, idx) => (
                    <button
                      key={idx}
                      className={`bg-gradient-to-r ${btn.from} ${btn.to} text-white py-4 px-4 rounded-xl transition duration-200 shadow-md flex items-center justify-center hover:shadow-lg hover:translate-y-[-2px]`}
                    >
                      {btn.icon}
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "stats" && (
            <motion.div
              key="stats"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-100">
                <FiBarChart2 className="mr-2 text-secondary" />
                Detailed Statistics
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
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
              className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-100">
                <FiUser className="mr-2 text-accent" />
                Profile
              </h2>
              <div className="flex flex-col md:flex-row items-center md:space-x-6 mb-8">
                <div className="relative group mb-4 md:mb-0">
                  <img
                    className="h-24 w-24 object-cover rounded-full border-4 border-primary transition duration-300 group-hover:border-accent"
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
                  <h4 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    {user.displayName}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                  <div className="mt-2">
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                      Active Student
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                  <h5 className="font-medium mb-2 text-gray-600 dark:text-gray-300">
                    Account Created:
                  </h5>
                  <p className="text-gray-800 dark:text-gray-100">
                    {new Date(Number(user.createdAt)).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                  <h5 className="font-medium mb-2 text-gray-600 dark:text-gray-300">
                    Last Login:
                  </h5>
                  <p className="text-gray-800 dark:text-gray-100">
                    {new Date(Number(user.lastLoginAt)).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  Profile Actions
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <button className="bg-gradient-to-r from-primary to-primary/90 text-white py-2 px-6 rounded-lg hover:shadow-lg transition duration-200 shadow-md">
                    Edit Profile
                  </button>
                  <button className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-6 rounded-lg hover:shadow-lg transition duration-200 shadow-md">
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-6 rounded-lg hover:shadow-lg transition duration-200 shadow-md"
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
              className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-100">
                <FiSettings className="mr-2 text-primary" />
                Settings
              </h2>
              <div className="space-y-8">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Appearance
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-100">
                        Dark Mode
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Toggle between light and dark theme
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      onClick={() => setDarkMode(!darkMode)}
                      className={`p-2 rounded-lg ${
                        darkMode
                          ? "bg-primary/10 text-primary"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
                    </motion.button>
                  </div>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
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
                          <h4 className="font-medium text-gray-800 dark:text-gray-100">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={item.defaultChecked}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Privacy
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-100">
                        Public Profile
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allow others to see your profile
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
                <div className="mt-6 pt-6">
                  <button className="bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-lg transition duration-200 hover:shadow-lg">
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
