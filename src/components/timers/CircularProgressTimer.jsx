import { useState, useEffect } from "react";

export default function CircularProgressTimer() {
  const totalTime = 22 * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-gray-700"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-red-400"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${progress}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-white text-2xl">
          {Math.floor(timeLeft / 60)}
          <span className="text-base ml-1">min</span>
        </div>
      </div>
    </div>
  );
}
