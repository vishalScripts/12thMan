import React, { useState, useRef, useEffect } from "react";
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from "react-icons/fi";

const InstagramReels = () => {
  const [currentReel, setCurrentReel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const reels = [
    {
      id: 1,
      url: "https://www.instagram.com/reel/DG2ct3ExjPZ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      title: "Top Study Hacks",
      creator: "@studymaster",
      likes: 1245,
      comments: 67,
    },
    {
      id: 2,
      url: "https://example.com/motivationreel.mp4",
      title: "Morning Motivation",
      creator: "@successjourney",
      likes: 2378,
      comments: 124,
    },
    {
      id: 3,
      url: "https://example.com/learningtips.mp4",
      title: "Quick Learning Techniques",
      creator: "@smartstudent",
      likes: 1876,
      comments: 92,
    },
  ];

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      isPlaying ? videoElement.play() : videoElement.pause();
    }
  }, [currentReel, isPlaying]);

  const handleNextReel = () => {
    setCurrentReel((prev) => (prev + 1) % reels.length);
    setIsPlaying(false);
  };

  const handlePrevReel = () => {
    setCurrentReel((prev) => (prev - 1 + reels.length) % reels.length);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const currentReelData = reels[currentReel];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 transform transition duration-300 hover:scale-[1.01] hover:shadow-xl backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-100">
        Study Reels
      </h2>

      <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden shadow-md">
        {/* Video Placeholder - Replace with actual video src */}
        <img
          src="/api/placeholder/400/600"
          alt="Reel Placeholder"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevReel}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full"
          >
            ←
          </button>
          <button
            onClick={handleNextReel}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full"
          >
            →
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="bg-white/30 p-4 rounded-full backdrop-blur-sm"
          >
            {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
          </button>

          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 bg-white/30 p-2 rounded-full backdrop-blur-sm"
          >
            {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
          </button>
        </div>
      </div>

      {/* Reel Details */}
      <div className="mt-4 text-center">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
          {currentReelData.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {currentReelData.creator}
        </p>
        <div className="flex justify-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-300">
          <span>❤️ {currentReelData.likes}</span>
          <span>💬 {currentReelData.comments}</span>
        </div>
      </div>
    </div>
  );
};

export default InstagramReels;
