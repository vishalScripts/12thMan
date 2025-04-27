import { useState, useEffect } from "react";

export default function StepTimer({ mins }) {
  const totalSteps = 30;
  const totalTime = mins * 60; // total seconds
  const intervalTime = totalTime / totalSteps;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < totalSteps ? prev + 1 : totalSteps));
    }, intervalTime * 1000); // correct timing

    return () => clearInterval(timer);
  }, [intervalTime]);

  const ticks = Array.from({ length: totalSteps }, (_, index) => {
    const rotation = (360 / totalSteps) * index;
    return (
      <div
        key={index}
        className={`absolute w-1 h-6 bg-gray-600 rounded-full ${
          index < currentStep ? "bg-red-400" : "bg-gray-600"
        }`}
        style={{
          transform: `rotate(${rotation}deg) translateY(-8rem)`,
          transformOrigin: "center",
        }}
      />
    );
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Ticks circle */}
        <div className="relative w-full h-full flex items-center justify-center">
          {ticks}
        </div>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center">
          <div className="text-white text-5xl font-bold">{mins}</div>
          <div className="text-white text-sm uppercase tracking-widest">
            min
          </div>
        </div>
      </div>
    </div>
  );
}
