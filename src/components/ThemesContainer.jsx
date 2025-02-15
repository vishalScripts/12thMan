import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeThemeStructure, changeBackground } from "../store/themeSlice";
import normalTheme from "../assets/normalTheme.png";
import Button from "./Button";
import { PaintBrushIcon } from "@heroicons/react/24/solid";
import backgrounds from "../data/backgrounds";

function ThemesContainer({ className }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const modern = useSelector((state) => state.theme.modern);
  return (
    <div className="w-full h-full">
      <div
        className={`${className} w-full duration-500 border-1 border-gray-200 bg-background p-2 rounded-sm shadow-2xs overflow-hidden flex flex-col gap-1 ${
          drawerOpen ? "h-full" : "h-full"
        }`}
      >
        <div
          onClick={() => {
            setDrawerOpen((prev) => !prev);
          }}
          className=" cursor-pointer w-full text-center hover:bg-accent p-1 flex items-center justify-center duration-300 rounded-sm"
        >
          <PaintBrushIcon className="size-6 font-bold " />
        </div>
        <hr />

        <div className=" flex flex-col gap-1">
          <div
            onClick={() => {
              dispatch(changeThemeStructure(!modern));
            }}
            className={` border-1 border-blue-200 bg-accent items-center justify-center rounded-sm cursor-pointer hover:scale-105 flex flex-col gap-2 duration-700  hover:shadow-2xs hover:bg-blue-500 group `}
          >
            {modern ? "Normal" : "Modern"}
          </div>
        </div>
        {/* BAckgrounds */}
        <hr />
        <div
          className={` flex flex-col gap-2  overflow-x-hidden  scroll-smooth scroll-snap-y 
            [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-white
  [&::-webkit-scrollbar-thumb]:bg-slate-700
  dark:[&::-webkit-scrollbar-track]:bg-white
  dark:[&::-webkit-scrollbar-thumb]:bg-slate-700
            `}
        >
          {Object.entries(backgrounds).map(([name, url]) => (
            <div
              onClick={() => dispatch(changeBackground(url))}
              key={name}
              className="border-1 border-blue-200 rounded-sm cursor-pointer hover:scale-105 hover:shadow-2xs group duration-700 aspect-video scroll-snap-start"
            >
              {url.endsWith(".mp4") ? (
                <video
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover"
                >
                  <source src={url} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={url}
                  className="w-full h-full object-cover"
                  alt={name}
                />
              )}
            </div>
          ))}
          <div
            onClick={() => {
              dispatch(changeBackground(""));
            }}
            className="border-1 border-blue-200 rounded-sm cursor-pointer hover:scale-105 hover:shadow-2xs group duration-700 aspect-video"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ThemesContainer;
