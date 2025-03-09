import { useState, useEffect } from "react";
import Button from "../Button";
import Time from "../Time";
import {
  ArrowPathIcon,
  PlayIcon,
  StopCircleIcon,
  SunIcon,
  MoonIcon,
  FireIcon,
  BeakerIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

function NormalThemePomodoro({
  hours,
  minutes,
  seconds,
  progress,
  start,
  stop,
  reset,
  type1,
  type2,
}) {
  const [option, setOption] = useState("pomodoro");
  const [theme, setTheme] = useState("cosmic");
  const [animation, setAnimation] = useState(true);
  const [ringEffect, setRingEffect] = useState("glow");

  // Theme configurations
  const themes = {
    cosmic: {
      background:
        "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800",
      card: "bg-gradient-to-b from-indigo-900/40 to-purple-900/60 backdrop-blur-md border-indigo-500/30",
      primaryColor: "#8b5cf6",
      secondaryColor: "#ec4899",
      textColor: "text-white",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
      buttonActiveColor: "bg-pink-600",
      glowColor: "rgba(139, 92, 246, 0.7)",
    },
    sunset: {
      background: "bg-gradient-to-br from-orange-600 via-amber-600 to-rose-700",
      card: "bg-gradient-to-b from-orange-600/30 to-amber-700/50 backdrop-blur-md border-amber-500/30",
      primaryColor: "#f97316",
      secondaryColor: "#f43f5e",
      textColor: "text-white",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
      buttonActiveColor: "bg-rose-600",
      glowColor: "rgba(249, 115, 22, 0.7)",
    },
    nature: {
      background: "bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-700",
      card: "bg-gradient-to-b from-emerald-600/30 to-teal-800/50 backdrop-blur-md border-emerald-500/30",
      primaryColor: "#10b981",
      secondaryColor: "#0891b2",
      textColor: "text-white",
      buttonColor: "bg-teal-600 hover:bg-teal-700",
      buttonActiveColor: "bg-cyan-600",
      glowColor: "rgba(16, 185, 129, 0.7)",
    },
    neon: {
      background: "bg-black",
      card: "bg-black/70 backdrop-blur-md border-cyan-400/50",
      primaryColor: "#22d3ee",
      secondaryColor: "#fb7185",
      textColor: "text-white",
      buttonColor: "bg-cyan-600 hover:bg-cyan-700",
      buttonActiveColor: "bg-rose-600",
      glowColor: "rgba(34, 211, 238, 0.8)",
    },
    minimal: {
      background: "bg-gradient-to-br from-gray-100 to-slate-200",
      card: "bg-white/80 backdrop-blur-md border-gray-200",
      primaryColor: "#6366f1",
      secondaryColor: "#8b5cf6",
      textColor: "text-gray-800",
      buttonColor: "bg-gray-800 hover:bg-gray-900",
      buttonActiveColor: "bg-indigo-600",
      glowColor: "rgba(99, 102, 241, 0.6)",
    },
  };

  // Ring effect configurations
  const ringEffects = {
    glow: {
      filter: "filter blur-sm opacity-60",
      duplicateRing: true,
      shadow: true,
    },
    pulse: {
      animated: true,
      pulse: true,
      shadow: false,
    },
    particle: {
      particles: animation, // Only use particles when animation is on
      shadow: true,
    },
    liquid: {
      liquidEffect: true,
    },
    minimalist: {
      clean: true,
      shadow: false,
    },
  };

  const currentTheme = themes[theme];
  const currentEffect = ringEffects[ringEffect];

  // Calculate urgency based on time remaining
  const urgencyPercentage = minutes < 5 ? ((5 - minutes) * 100) / 5 : 0;
  const timeColor =
    minutes < 5
      ? `rgba(${Math.min(255, 100 + urgencyPercentage * 1.55)}, ${Math.max(
          0,
          255 - urgencyPercentage * 2.55
        )}, 0, 1)`
      : currentTheme.primaryColor;

  const timeShadow =
    minutes < 5
      ? `0 0 20px rgba(${Math.min(
          255,
          100 + urgencyPercentage * 1.55
        )}, ${Math.max(0, 255 - urgencyPercentage * 2.55)}, 0, 0.8)`
      : `0 0 15px ${currentTheme.glowColor}`;

  // Particles for particle effect - simplified for better performance
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (currentEffect.particles && animation) {
      const interval = setInterval(() => {
        if (particles.length < 10) {
          // Reduced from 20 to 10 particles
          const newParticle = {
            id: Math.random(),
            x: 50 + (Math.random() * 30 - 15), // Reduced range
            y: 50 + (Math.random() * 30 - 15), // Reduced range
            size: Math.random() * 2 + 1, // Smaller particles
            speed: Math.random() * 0.3 + 0.1, // Slower movement
            opacity: Math.random() * 0.6 + 0.3,
            angle: Math.random() * 360,
          };
          setParticles((prev) => [...prev, newParticle]);
        }
      }, 300); // Reduced frequency (200 to 300ms)

      return () => clearInterval(interval);
    }
  }, [currentEffect.particles, animation, particles.length]);

  useEffect(() => {
    if (particles.length > 0) {
      const moveParticles = setInterval(() => {
        setParticles((prev) =>
          prev
            .map((p) => ({
              ...p,
              x: p.x + Math.cos(p.angle * (Math.PI / 180)) * p.speed,
              y: p.y + Math.sin(p.angle * (Math.PI / 180)) * p.speed,
              opacity: p.opacity - 0.02, // Faster fade out
            }))
            .filter((p) => p.opacity > 0)
        );
      }, 80); // Less frequent updates (50 to 80ms)

      return () => clearInterval(moveParticles);
    }
  }, [particles]);

  // Theme icons mapping
  const themeIcons = {
    cosmic: <SparklesIcon className="w-4 h-4" />,
    sunset: <SunIcon className="w-4 h-4" />,
    nature: <BeakerIcon className="w-4 h-4" />,
    neon: <FireIcon className="w-4 h-4" />,
    minimal: <MoonIcon className="w-4 h-4" />,
  };

  function changeOption(opt) {
    setOption(opt);
  }

  return (
    <div
      className={`py-12 w-full min-h-screen duration-500 flex items-center justify-center ${currentTheme.background}`}
    >
      <div
        className={`w-11/12 max-w-4xl mx-auto shadow-2xl rounded-2xl border ${currentTheme.card} backdrop-blur-md transition-all duration-500 overflow-hidden`}
      >
        {/* Header with theme selection */}
        <div className="w-full flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className={`text-xl font-bold ${currentTheme.textColor}`}>
            FocusFlow Timer
          </h2>

          <div className="flex items-center space-x-2">
            <div className="flex bg-black/20 rounded-full p-1">
              {Object.keys(themes).map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => setTheme(themeName)}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    theme === themeName
                      ? `${currentTheme.buttonActiveColor} text-white shadow-lg`
                      : "text-white/60 hover:text-white/80"
                  }`}
                  title={themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                >
                  {themeIcons[themeName]}
                </button>
              ))}
            </div>

            <button
              onClick={() => setAnimation(!animation)}
              className={`p-2 rounded-full transition-all duration-300 ${
                animation
                  ? `${currentTheme.buttonActiveColor} text-white`
                  : "bg-black/20 text-white/60"
              }`}
              title={animation ? "Disable animations" : "Enable animations"}
            >
              <SparklesIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row h-full">
          {/* Timer section */}
          <div className="lg:w-2/3 flex flex-col items-center justify-center p-6">
            {/* Tab buttons */}
            <div className="w-full flex items-center justify-center mb-6">
              <div className="bg-black/20 rounded-full p-1 flex items-center">
                <button
                  onClick={() => changeOption("pomodoro")}
                  className={`${
                    option === "pomodoro"
                      ? currentTheme.buttonActiveColor
                      : "bg-transparent hover:bg-white/10"
                  } rounded-full px-4 py-2 transition-all duration-300 text-white font-medium`}
                >
                  Pomodoro
                </button>
                <button
                  onClick={() => changeOption("custom")}
                  className={`${
                    option === "custom"
                      ? currentTheme.buttonActiveColor
                      : "bg-transparent hover:bg-white/10"
                  } rounded-full px-4 py-2 transition-all duration-300 text-white font-medium`}
                >
                  Custom
                </button>
              </div>
            </div>

            {/* Ring effect selector */}
            <div className="w-full flex items-center justify-center mb-6">
              <div className="bg-black/20 rounded-full p-1 flex items-center text-sm">
                {Object.keys(ringEffects).map((effect) => (
                  <button
                    key={effect}
                    onClick={() => setRingEffect(effect)}
                    className={`${
                      ringEffect === effect
                        ? currentTheme.buttonActiveColor
                        : "bg-transparent hover:bg-white/10"
                    } rounded-full px-3 py-1 transition-all duration-300 text-white font-medium capitalize`}
                  >
                    {effect}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer display with circle */}
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Static shadow for ring */}
              {currentEffect.shadow && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${currentTheme.glowColor} 0%, rgba(0,0,0,0) 70%)`,
                    opacity: 0.3,
                    filter: "blur(20px)",
                  }}
                ></div>
              )}

              {/* SVG container */}
              <svg
                className="absolute top-0 left-0 w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Defs for filters and gradients */}
                <defs>
                  {/* Primary gradient */}
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={currentTheme.primaryColor} />
                    <stop
                      offset="100%"
                      stopColor={currentTheme.secondaryColor}
                    />
                  </linearGradient>

                  {/* Glow filter */}
                  <filter
                    id="glow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite
                      in="SourceGraphic"
                      in2="blur"
                      operator="over"
                    />
                  </filter>

                  {/* Liquid effect - simplified */}
                  {currentEffect.liquidEffect && animation && (
                    <filter
                      id="liquid"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.01"
                        numOctaves="1" // Reduced from 2 to 1 for better performance
                        seed={Math.floor(Date.now() / 2000) % 50} // Less frequent changes
                      />
                      <feDisplacementMap in="SourceGraphic" scale="1" />
                    </filter>
                  )}
                </defs>

                {/* Background track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth={currentEffect.clean ? 2 : 4}
                  fill="transparent"
                />

                {/* Shadow duplicate ring for glow effect - only if animations are on */}
                {currentEffect.duplicateRing && animation && (
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#progressGradient)"
                    strokeOpacity="0.4"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (progress / 100) * 251.2}
                    strokeLinecap="round"
                    fill="transparent"
                    filter="blur(6px)"
                  />
                )}

                {/* Primary progress ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={
                    currentEffect.clean ? timeColor : "url(#progressGradient)"
                  }
                  strokeWidth={currentEffect.clean ? 3 : 5}
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (progress / 100) * 251.2}
                  strokeLinecap="round"
                  fill="transparent"
                  filter={
                    currentEffect.liquidEffect && animation
                      ? "url(#liquid)"
                      : undefined
                  }
                  style={{
                    filter: currentEffect.glow ? "url(#glow)" : undefined,
                    transition: "stroke-dashoffset 0.5s ease",
                  }}
                >
                  {currentEffect.pulse && animation && (
                    <animate
                      attributeName="stroke-opacity"
                      values="1;0.7;1"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>

                {/* Particles for particle effect */}
                {currentEffect.particles &&
                  particles.map((particle) => (
                    <circle
                      key={particle.id}
                      cx={particle.x}
                      cy={particle.y}
                      r={particle.size}
                      fill={
                        Math.random() > 0.5
                          ? currentTheme.primaryColor
                          : currentTheme.secondaryColor
                      }
                      opacity={particle.opacity}
                    />
                  ))}
              </svg>

              {/* Timer content */}
              <div className="flex flex-col items-center justify-center absolute inset-0">
                <div
                  className={`${currentTheme.textColor} text-center font-bold text-5xl md:text-6xl`}
                  style={{
                    color: timeColor,
                    textShadow: animation ? timeShadow : "none",
                    transition: "color 0.5s ease, text-shadow 0.5s ease",
                  }}
                >
                  {hours > 0 && `${hours}:`}
                  {minutes < 10 && hours > 0 ? `0${minutes}` : minutes}:
                  {seconds < 10 ? `0${seconds}` : seconds}
                </div>

                <div
                  className={`mt-2 ${currentTheme.textColor} opacity-80 font-medium`}
                >
                  {option === "pomodoro" ? "Focus Session" : "Custom Timer"}
                </div>

                <div className="mt-4 flex gap-2">
                  <select
                    name="timeSelect"
                    className="bg-black/20 text-white rounded-lg px-2 py-1 text-sm cursor-pointer border border-white/10 hover:bg-black/30 transition-all"
                    id="timeSelect"
                    onChange={(e) => {
                      if (e.target.value === "30") {
                        type1();
                      } else if (e.target.value === "60") {
                        type2();
                      }
                    }}
                  >
                    <option value="30" className="bg-gray-800">
                      25-30 min
                    </option>
                    <option value="60" className="bg-gray-800">
                      55-60 min
                    </option>
                  </select>

                  <div className="bg-black/20 text-white rounded-lg px-2 py-1 text-sm border border-white/10">
                    Break: 5 min
                  </div>
                </div>

                {/* Control buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={start}
                    className={`${currentTheme.buttonColor} text-white p-3 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 focus:ring-${currentTheme.primaryColor}`}
                  >
                    <PlayIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={stop}
                    className={`${currentTheme.buttonColor} text-white p-3 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 focus:ring-${currentTheme.primaryColor}`}
                  >
                    <StopCircleIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={reset}
                    className={`${currentTheme.buttonColor} text-white p-3 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 focus:ring-${currentTheme.primaryColor}`}
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side panel (visible on larger screens) */}
          <div className="lg:w-1/3 bg-black/10 backdrop-blur-md p-6 flex flex-col border-t lg:border-t-0 lg:border-l border-white/10">
            <h3 className={`text-lg font-bold ${currentTheme.textColor} mb-4`}>
              Session Stats
            </h3>

            <div className="space-y-4">
              <div className="bg-black/20 rounded-lg p-4">
                <div className={`text-sm ${currentTheme.textColor} opacity-70`}>
                  Current Session
                </div>
                <div className={`text-xl font-bold ${currentTheme.textColor}`}>
                  {option === "pomodoro" ? "Pomodoro" : "Custom"} -
                  {option === "pomodoro" ? " 25:00" : " Custom"} min
                </div>
              </div>

              <div className="bg-black/20 rounded-lg p-4">
                <div className={`text-sm ${currentTheme.textColor} opacity-70`}>
                  Focus Time Today
                </div>
                <div className={`text-xl font-bold ${currentTheme.textColor}`}>
                  01:45:00
                </div>
              </div>

              <div className="bg-black/20 rounded-lg p-4">
                <div className={`text-sm ${currentTheme.textColor} opacity-70`}>
                  Pomodoros Completed
                </div>
                <div className={`text-xl font-bold ${currentTheme.textColor}`}>
                  4
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <h3
                className={`text-lg font-bold ${currentTheme.textColor} mb-4`}
              >
                Today's Focus
              </h3>
              <div className="bg-black/20 rounded-lg p-4">
                <input
                  type="text"
                  placeholder="What are you working on today?"
                  className="w-full bg-transparent border-b border-white/20 pb-2 text-white focus:outline-none focus:border-white/50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NormalThemePomodoro;
