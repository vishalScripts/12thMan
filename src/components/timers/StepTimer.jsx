import { useState, useEffect } from "react";
import useTimer from "../../hooks/useTimer";

export default function StepTimer({ mins }) {
  const { timeLeft, minutes } = useTimer({ mins }); 

  const totalSteps = 30; 
  const [currentStep, setCurrentStep] = useState(mins);

  useEffect(() => {
    const progressRatio = timeLeft / (mins * 60); // Between 0 and 1
    const calculatedStep = Math.round(progressRatio * totalSteps);
    setCurrentStep(calculatedStep);
  }, [timeLeft, mins]);
  

  const ticks = Array.from({ length: totalSteps }, (_, index) => {
    const rotation = (360 / totalSteps) * index;
    return (
      <div
        key={index}
        className={`absolute w-1 rounded-full shadow-accent shadow-xs duration-100 ${
          index >= totalSteps - currentStep ? "bg-text h-6" : "  bg-primary h-6.5"

        }`}
        style={{
          transform: `rotate(${rotation}deg) translateY(-7rem)`,
          transformOrigin: "center",
        }}
      />
    );
  });

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Ticks circle */}
        <div
          className="relative w-full overflow-hidden rounded-full border border-primary/30 bg-primary/10 h-full flex items-center justify-center"
          style={{ boxShadow: "0 0 10px 2px rgba(0, 0, 0, 0.1)" }}
        >
          {ticks}
        </div>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center">
          <div className="text-text text-5xl font-bold">
            {String(minutes).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
          </div>
          <div className="text-text text-sm uppercase tracking-widest">min</div>
        </div>
      </div>
    </div>
  );
}
