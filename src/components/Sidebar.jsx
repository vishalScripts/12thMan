import React, { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../store/themeSlice";
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

function Sidebar({
  children,
  clasname = "",
  user = {},
  activeTab = "Home",
  handleLogout,
  setActiveTab,
}) {
  const pages = [
    {
      key: "home",
      label: "Focus",
      icon: <FiSun className="mr-3" style={{ color: "var(--acme-primary)" }} />,
    },

    {
      key: "stats",
      label: "Stats",
      icon: (
        <FiBarChart2
          className="mr-3"
          style={{ color: "var(--acme-primary)" }}
        />
      ),
    },
    {
      key: "profile",
      label: "Profile",
      icon: (
        <FiUser className="mr-3" style={{ color: "var(--acme-primary)" }} />
      ),
    },
    {
      key: "settings",
      label: "Settings",
      icon: (
        <FiSettings
          className="mr-3"
          style={{ color: "var(--acme-secondary-hover)" }}
        />
      ),
    },
  ];
  return (
    <aside
      className="w-64 sticky h-[100vh] top-0 left-0 overflow-y-auto  shadow-xl transition-all duration-300 backdrop-blur-sm border-r z-10 saturate-150"
      style={{
        backgroundColor: "var(--acme-background)",
        borderColor: "var(--acme-secondary-hover)",
        opacity: 0.9,
      }}
    >
      <div className="px-6 py-4 border-b border-b-border">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={user.photoURL || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2"
              style={{ borderColor: "var(--acme-primary)" }}
            />
            <span
              className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full ring-2"
              style={{
                ringColor: "var(--acme-background)",
              }}
            ></span>
          </div>
          <div className="overflow-hidden">
            <p
              className="font-medium truncate"
              style={{ color: "var(--acme-text)" }}
            >
              {user?.displayName}
            </p>
            <p
              className="text-sm truncate"
              style={{ color: "var(--acme-text)", opacity: 0.7 }}
            >
              {user?.email}
            </p>
          </div>
        </div>
      </div>
      <nav className="mt-4">
        <ul>
          {pages.map((item) => (
            <li
              key={item.key}
              className={`flex items-center px-6 py-3 cursor-pointer transition-all duration-200 ${
                activeTab === item.key ? "border-l-4" : ""
              }`}
              style={{
                borderColor:
                  activeTab === item.key
                    ? "var(--acme-primary)"
                    : "transparent",
                backgroundColor:
                  activeTab === item.key
                    ? "rgba(var(--acme-primary-rgb), 0.1)"
                    : "transparent",
              }}
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
          <li
            className="flex items-center px-6 py-3 cursor-pointer mt-6 transition-all duration-200"
            style={{ color: "#e53e3e" }}
            onClick={handleLogout}
          >
            <FiLogOut className="mr-3 text-xl" />
            <span>Logout</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

// Forwarding the ref to Sidebar for access to isOpen state
export default React.forwardRef(Sidebar);
