import React, { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import musicList from "../data/musicData";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

function MusicContainer() {
  const [currentSong, setCurrentSong] = useState(musicList.lofi); // Default song

  return (
    <div className="grid grid-rows-12 h-full bg-transparent">
      <h2 className="row-start-1 text-lg text-center mb-2 bg-secondary font-bold text-gray-800">
        Music
      </h2>
      <iframe
        style={{ borderRadius: "12px" }}
        src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator"
        width="100%"
        height="430"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      ></iframe>
    </div>
  );
}

export default MusicContainer;
