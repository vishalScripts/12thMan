import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((currentTime / duration) * 100);
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-full max-w-md p-4 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
      <audio
        ref={audioRef}
        src="src\assets\Chill Lofi Mix [chill lo-fi hip hop beats] [CLeZyIID9Bo].mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Seek Bar */}
      <input
        type="range"
        className="w-full appearance-none h-1 bg-gray-400 rounded-lg outline-none cursor-pointer"
        value={progress}
        onChange={handleSeek}
      />

      <div className="flex justify-between w-full text-gray-300 text-xs mt-1">
        <span>{formatTime(audioRef.current?.currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 ">
        <button
          className="p-1 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button onClick={() => handleVolumeChange({ target: { value: 0 } })}>
            <VolumeX size={10} className="text-gray-300" />
          </button>
          <input
            type="range"
            className="w-14 appearance-none h-1 bg-gray-400 rounded-lg outline-none cursor-pointer"
            value={volume}
            onChange={handleVolumeChange}
            min="0"
            max="1"
            step="0.01"
          />
          <button onClick={() => handleVolumeChange({ target: { value: 1 } })}>
            <Volume2 size={10} className="text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
