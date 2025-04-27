import { useState, useEffect } from "react";

export default function OrbitingDotTimer() {
  const totalTime = 22 * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1);
    return () => clearInterval(timer);
  }, []);

  const rotation = ((totalTime - timeLeft) / totalTime) * 360;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative w-64 h-64">
        <div
          className="absolute w-4 h-4 bg-red-400 rounded-full"
          style={{
            top: "50%",
            left: "50%",
            transform: `rotate(${rotation}deg) translateX(120px) translateY(-50%)`,
            transformOrigin: "center left",
            transition: "transform 1s linear",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="text-5xl font-bold">{Math.floor(timeLeft / 60)}</div>
          <div className="text-xs mt-1">min</div>
        </div>
      </div>
    </div>
  );
}
