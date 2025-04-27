import { useState, useEffect } from "react";

export default function BasicTimer({ mins }) {
  const [timeLeft, setTimeLeft] = useState(mins * 60); // 22 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative w-48 h-48 flex items-center justify-center rounded-full bg-gray-800">
        <div className="text-center text-white text-3xl">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}
