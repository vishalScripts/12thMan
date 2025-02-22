import React, { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import musicList from "../data/musicData";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

function MusicContainer() {
  const [currentSong, setCurrentSong] = useState(musicList.lofi); // Default song

  return (
    <div className="grid grid-rows-12 h-full">
      <h2 className="row-start-1 text-lg text-center mb-2 bg-secondary font-bold text-gray-800">
        Music
      </h2>
      <ul className="">
        {Object.keys(musicList).map((key) => (
          <li
            key={key}
            className="flex items-center justify-start px-2 hover:bg-accent"
          >
            <button
              onClick={() => setCurrentSong(musicList[key])}
              className="w-full h-full cursor-pointer text-start"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
            </button>
          </li>
        ))}
      </ul>
      <div className="row-end-12">
        <AudioPlayer songSrc={currentSong} />
      </div>
    </div>
  );
}

export default MusicContainer;
