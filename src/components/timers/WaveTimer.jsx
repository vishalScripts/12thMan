import { useState, useEffect } from "react";

export default function WaveTimer() {
  const totalTime = 22 * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const percentage = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-950">
      <div className="relative w-64 h-64 overflow-hidden rounded-full bg-blue-600">
        <div
          className="absolute bottom-0 w-full bg-blue-300"
          style={{
            height: `${percentage}%`,
            transition: "height 1s linear",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="text-4xl font-bold">{Math.floor(timeLeft / 60)}</div>
          <div className="text-xs">min</div>
        </div>
      </div>
    </div>
  );
}
