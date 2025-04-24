import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../store/themeSlice";
import {
  FaSun,
  FaMoon,
  FaTree,
  FaWater,
  FaMountain,
  FaSpa,
  FaLeaf,
  FaCoffee,
  FaSnowflake,
  FaSpaceShuttle,
  FaGem,
  FaFire,
  FaSkull,
  FaFlask,
  FaPalette,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const themes = [
  { icon: <FaSun />, value: "light", title: "Light Theme" },
  { icon: <FaMoon />, value: "dark", title: "Dark Theme" },
  { icon: <FaTree />, value: "forest", title: "Forest Theme" },
  { icon: <FaWater />, value: "ocean", title: "Ocean Theme" },
  { icon: <FaMountain />, value: "sunset", title: "Sunset Theme" },
  { icon: <FaSpa />, value: "lavender", title: "Lavender Theme" },
  { icon: <FaLeaf />, value: "mint", title: "Mint Theme" },
  { icon: <FaCoffee />, value: "coffee", title: "Coffee Theme" },
  { icon: <FaSnowflake />, value: "nord", title: "Nord Theme" },
  { icon: <FaSpaceShuttle />, value: "cyberpunk", title: "Cyberpunk Theme" },
  { icon: <FaGem />, value: "amethyst", title: "Amethyst Theme" },
  { icon: <FaFire />, value: "ember", title: "Ember Theme" },
  { icon: <FaSkull />, value: "shadow", title: "Shadow Theme" },
  { icon: <FaFlask />, value: "matrix", title: "Matrix Theme" },
];

export default function ThemeBtn({ variant = "navbar" }) {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.theme);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Find the current theme object to display as button icon
  const currentThemeObject =
    themes.find((theme) => theme.value === currentTheme) || themes[0];

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute("data-theme", currentTheme);

    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [currentTheme]);

  const handleThemeChange = (theme) => {
    dispatch(setTheme(theme));
    setIsOpen(false);
  };

  return (
    <div className="relative " ref={dropdownRef}>
      {/* Single Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-2 rounded-md hover:bg-opacity-20 hover:bg-[var(--color-primary)] transition-all duration-300 hover:scale-105 active:scale-90   `}
        title="Change Theme"
      >
        <span className="text-xl text-text cursor-pointer">
          {currentThemeObject.icon}
        </span>
        {variant === "sidebar" && <span>Theme</span>}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, transformOrigin: "top right" }}
          animate={{ opacity: 1, scale: 1, transformOrigin: "top right" }}
          exit={{ opacity: 0, scale: 0.95, transformOrigin: "top right" }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className={` z-50 bg-[var(--color-background)] shadow-lg  rounded-md p-3 border border-border right-0 top-full mt-4 absolute `}
        >
          <h3 className="text-sm font-medium mb-2 text-[var(--color-text)]">
            Select Theme
          </h3>
          <div className="grid grid-cols-4 gap-2" style={{ width: "280px" }}>
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => handleThemeChange(theme.value)}
                className={`flex flex-col items-center cursor-pointer p-2 rounded transition-all ${
                  currentTheme === theme.value
                    ? "bg-[var(--color-primary)] bg-opacity-20 text-[var(--color-accent)]"
                    : "hover:bg-[var(--color-primary)]/50 hover:bg-opacity-10 text-text"
                }`}
              >
                <span className="text-xl mb-1">{theme.icon}</span>
                <span className="text-xs">{theme.value}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
