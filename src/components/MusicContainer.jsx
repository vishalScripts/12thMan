import React, { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import musicList from "../data/musicData";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

function MusicContainer() {
  const [currentSong, setCurrentSong] = useState(musicList.lofi); // Default song

  return (
    <div className=" h-full w-full overflow-hidden  bg-transparent">
     
     <div className="relative w-full pb-[56.25%] rounded-2xl shadow-xl overflow-hidden">
     <iframe
        style={{ borderRadius: "12px", position: "absolute", width: "100%", bottom: "0" }}
        src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator"
        height={"400"}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        
      ></iframe>
</div>

    </div>
  );
}

export default MusicContainer;
