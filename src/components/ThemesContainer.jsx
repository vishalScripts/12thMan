import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeThemeStructure, changeBackground } from "../store/themeSlice";
import normalTheme from "../assets/normalTheme.png";
import Button from "./Button";
import {
  PaintBrushIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import backgrounds from "../data/backgrounds";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";

function ThemesContainer({ className }) {
  const layoutType = useSelector((state) => state.theme.layoutType);
  const themes = ["normal", "modern", "custom"];
  const [layoutNo, setLayoutNo] = useState(themes.indexOf(layoutType) + 1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();

  console.log(layoutType, themes.indexOf(layoutType));

  useEffect(() => {
    dispatch(changeThemeStructure(themes[layoutNo - 1]));
  }, [layoutNo, dispatch]);

  const handleNext = () => setLayoutNo((prev) => (prev < 3 ? prev + 1 : 1));
  const handlePrev = () => setLayoutNo((prev) => (prev > 1 ? prev - 1 : 3));

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });
  return (
    <div className="w-full h-full">
      <div
        className={`${className} w-full duration-500 border-1 border-gray-200 bg-background p-2 rounded-sm shadow-2xs  flex flex-col gap-1 ${
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

        <div className=" w-50  h-30  grid overflow-hidden  relative">
          <div
            className={`absolute w-full h-full flex items-center justify-between z-[9999999999] `}
          >
            <ChevronLeftIcon
              onClick={() => {
                handlePrev();
              }}
              className="size-4 hover:bg-secondary duration-150 hover:scale-115 rounded-xs aspect-square font-bold cursor-pointer mx-2 "
            />
            <ChevronRightIcon
              onClick={() => {
                handleNext();
              }}
              className="size-4 hover:bg-secondary duration-150 hover:scale-115 rounded-xs aspect-square font-bold cursor-pointer mx-2 "
            />
          </div>
          <div
            className={`transition-transform duration-[700ms] ease-[cubic-bezier(0.25, 1, 0.5, 1.2)] transform grid grid-cols-3 w-150 place-items-center  ${
              layoutNo === 1
                ? "-translate-x-0"
                : layoutNo === 2
                ? "-translate-x-50"
                : "-translate-x-100"
            }`}
          >
            <div
              onClick={() => {
                dispatch(changeThemeStructure("normal"));
              }}
              className={` border-1 border-blue-200 bg-accent items-center justify-center rounded-sm cursor-pointer hover:scale-105 flex flex-col gap-2 duration-700  hover:shadow-2xs hover:bg-blue-500 group w-36  `}
            >
              Normal
            </div>
            <div
              onClick={() => {
                dispatch(changeThemeStructure("modern"));
              }}
              className={` border-1 border-blue-200 bg-accent items-center justify-center rounded-sm cursor-pointer hover:scale-105 flex flex-col gap-2 duration-700  hover:shadow-2xs hover:bg-blue-500 group w-36`}
            >
              Modern
            </div>
            <div
              onClick={() => {
                dispatch(changeThemeStructure("custom"));
              }}
              className={` border-1 border-blue-200 bg-accent items-center justify-center rounded-sm cursor-pointer hover:scale-105 flex flex-col gap-2 duration-700  hover:shadow-2xs hover:bg-blue-500 group w-36`}
            >
              Custom
            </div>
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
          {Object.entries(backgrounds).map(([name, url], index) => {
            const ref = React.useRef(null);
            const isInView = useInView(ref, {
              once: true,
              margin: "-50px 0px",
            });

            return (
              <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.1, delay: index * 0.05 }}
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
              </motion.div>
            );
          })}

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
