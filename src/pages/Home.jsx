import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container/Container";
import imgSrc from "../assets/time.svg";
import Button from "../components/Button";
import { motion, useInView } from "framer-motion";
import {
  ClockIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
const tonyRobbinsImage = "https://example.com/tony-robbins.jpg";

function Home() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const featureRef = React.useRef(null);
  const isInView = useInView(featureRef, { triggerOnce: true, threshold: 0.2 });
  const userStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (userStatus) {
      navigate("/dashboard");
    }

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative">
      {/* Cursor-following circle */}
      <motion.div
        className="absolute w-32 h-32 bg-blue-500 opacity-20 rounded-full pointer-events-none"
        animate={{
          x: cursorPos.x - 64,
          y: cursorPos.y - 64,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />

      {/* Hero Section */}
      <Container>
        <div className="h-[90vh] grid grid-cols-1 md:grid-cols-2 overflow-hidden items-center">
          {/* Hero Content */}
          <div className="flex flex-col items-start justify-center gap-5 px-4">
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Welcome
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Stay organized and boost your productivity. Set your tasks, track
              them, and achieve your goals effortlessly.
            </p>
            <Button
              onClick={() => navigate("/signup")}
              className="text-white font-medium py-2 px-6 text-lg bg-gradient-to-r from-blue-600 to-purple-500 hover:scale-105 transition-all"
            >
              Get Started 🚀
            </Button>
          </div>

          {/* Hero Image */}
          <div className="hidden md:block">
            <img
              src={imgSrc}
              alt="Productivity Illustration"
              className="h-[80vh] drop-shadow-lg"
            />
          </div>
        </div>
      </Container>

      {/* Feature Section (Appears after scroll) */}
      <div ref={featureRef} className="py-20 bg-gray-950 text-white relative">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/20 to-purple-700/20 blur-3xl opacity-30"></div>

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Unlock Your Productivity
            </h2>

            {/* Feature Grid */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2,
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10"
            >
              {/* Feature Card */}
              {[
                {
                  title: "Use the Timer",
                  icon: <ClockIcon className="w-14 h-14 text-blue-400" />,
                  desc: "Stay focused with a Pomodoro timer and relaxing backgrounds.",
                },
                {
                  title: "Plan with the Calendar",
                  icon: (
                    <CalendarDaysIcon className="w-14 h-14 text-green-400" />
                  ),
                  desc: "Track your tasks and deadlines with ease.",
                },
                {
                  title: "Create & Complete Tasks",
                  icon: (
                    <ClipboardDocumentCheckIcon className="w-14 h-14 text-purple-400" />
                  ),
                  desc: "Set tasks with strict deadlines and complete them step by step.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl flex flex-col items-center text-center border border-white/20 hover:border-white/40 transition-all"
                >
                  {feature.icon}
                  <h3 className="text-xl font-semibold mt-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 mt-2">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </div>
  );
}

export default Home;
