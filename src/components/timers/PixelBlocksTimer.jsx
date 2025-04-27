import { useState, useEffect } from "react";

export default function PixelBlocksTimer({ mins }) {
  const totalBlocks = 100; // total tiny blocks
  const totalTime = mins * 60; // total seconds
  const intervalTime = totalTime / totalBlocks;
  const [currentBlock, setCurrentBlock] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBlock((prev) => (prev < totalBlocks ? prev + 1 : totalBlocks));
    }, intervalTime * 1000);

    return () => clearInterval(timer);
  }, [intervalTime]);

  const blocks = Array.from({ length: totalBlocks }, (_, index) => (
    <div
      key={index}
      className={`w-3 h-3 m-0.5 ${
        index < currentBlock ? "bg-green-400" : "bg-gray-700"
      }`}
    />
  ));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="grid grid-cols-10 gap-0.5">{blocks}</div>
      <div className="mt-6 text-white text-4xl font-mono">{mins} min</div>
    </div>
  );
}
