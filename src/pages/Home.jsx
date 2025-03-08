import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClockIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// We'll use CSS variables for the color scheme
const colorStyles = {
  "--color-text": "#1a0e23",
  "--color-background": "#fdfcff",
  "--color-primary": "#8f5fe8",
  "--color-secondary": "#ff9fe8",
  "--color-secondary-hover": "#c9a9ff",
  "--color-accent": "#6fd3c7",
  "--color-accent-hover": "#ffd789",
};

function Home() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set features section to visible after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={colorStyles} className="font-sans">
      <div className="bg-[var(--color-background)] min-h-screen text-[var(--color-text)]">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column: Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--color-primary)] to-[#d33cb4] bg-clip-text text-transparent">
                  Focus Better. <br />
                  Achieve More.
                </h1>
                <p className="text-lg opacity-80 max-w-md">
                  Transform your productivity with our Pomodoro timer. Create
                  tasks, set deadlines, and watch your focus soar.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-3 rounded-lg font-medium bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 hover:shadow-[var(--color-primary)]/40 hover:translate-y-1 transition-all duration-300"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate("/learn-more")}
                  className="px-8 py-3 rounded-lg font-medium border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300"
                >
                  Learn More
                </button>
              </motion.div>
            </div>

            {/* Right Column: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[var(--color-primary)]/30 to-[#d33cb4]/30 blur-3xl opacity-70"></div>
                <img
                  src="/pomodoro-illustration.svg"
                  alt="Focus Timer Illustration"
                  className="relative w-full max-w-lg h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Why Pomodoro Section */}
        <div className="bg-gradient-to-b from-white to-[var(--color-secondary)]/10 py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl font-bold mb-6">Why Pomodoro Works</h2>
              <p className="text-lg opacity-80 mb-12">
                The Pomodoro Technique breaks work into focused intervals,
                typically 25 minutes, followed by short breaks. This
                science-backed method helps maintain concentration, reduce
                mental fatigue, and achieve consistent progress on your tasks.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <ClockIcon className="w-12 h-12" />,
                  title: "Focused Time Blocks",
                  description:
                    "25-minute intervals eliminate distractions and optimize concentration",
                },
                {
                  icon: <CalendarDaysIcon className="w-12 h-12" />,
                  title: "Scheduled Breaks",
                  description:
                    "Regular pauses prevent burnout and keep your mind refreshed",
                },
                {
                  icon: <CheckCircleIcon className="w-12 h-12" />,
                  title: "Task Tracking",
                  description:
                    "Visible progress builds momentum and satisfaction",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 30,
                  }}
                  transition={{ duration: 0.7, delay: 0.2 + index * 0.2 }}
                  className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg border border-[var(--color-secondary)]/20"
                >
                  <div className="inline-flex items-center justify-center p-3 mb-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 text-[var(--color-primary)]">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="opacity-75">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Preview Section */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Our platform combines elegant task management with the proven
              Pomodoro technique to help you stay on track
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Elegant Timer</h3>
                  <p className="opacity-75">
                    Customize work sessions and breaks with ambient sounds to
                    maintain focus
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]">
                  <CalendarDaysIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    Calendar Integration
                  </h3>
                  <p className="opacity-75">
                    Visualize your schedule with our Google Calendar-inspired
                    view
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                  <CheckCircleIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    Task Management
                  </h3>
                  <p className="opacity-75">
                    Create, organize, and complete tasks with required deadlines
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.95,
              }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="rounded-2xl overflow-hidden shadow-2xl shadow-[var(--color-primary)]/10 border border-[var(--color-secondary)]/20"
            >
              <div className="bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 p-1">
                <div className="bg-white rounded-2xl p-6 relative">
                  {/* Timer display mockup */}
                  <div className="p-8 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 text-center">
                    <h4 className="text-lg font-medium mb-6">Focus Session</h4>
                    <div className="text-5xl font-bold text-[var(--color-primary)] mb-6">
                      23:45
                    </div>
                    <div className="flex justify-center gap-4">
                      <button className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white">
                        Pause
                      </button>
                      <button className="px-6 py-2 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)]">
                        Skip
                      </button>
                    </div>
                  </div>

                  {/* Task list mockup */}
                  <div className="mt-6 space-y-3">
                    <div className="p-3 rounded-lg bg-white border border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-[var(--color-primary)]"></div>
                        <span>Complete homepage design</span>
                      </div>
                      <span className="text-sm opacity-50">Today</span>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-[var(--color-primary)]"></div>
                        <span>Write project proposal</span>
                      </div>
                      <span className="text-sm opacity-50">Tomorrow</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-tr from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                Ready to boost your productivity?
              </h2>
              <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have transformed their work habits
                with our Pomodoro system. No credit card required to get
                started.
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3 rounded-lg font-medium bg-[var(--color-primary)] text-white shadow-lg hover:shadow-xl shadow-[var(--color-primary)]/30 hover:shadow-[var(--color-primary)]/40 transform transition-all duration-300 hover:-translate-y-1"
              >
                Start for Free
              </button>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[var(--color-primary)] font-bold text-xl">
              Pomodoro Focus
            </div>
            <div className="opacity-70 text-sm">© 2025 All rights reserved</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[var(--color-primary)]">
                Privacy
              </a>
              <a href="#" className="hover:text-[var(--color-primary)]">
                Terms
              </a>
              <a href="#" className="hover:text-[var(--color-primary)]">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
