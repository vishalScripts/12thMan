import { useState, useRef } from "react";

export default function FloatingWidget() {
  const [isVisible, setIsVisible] = useState(true);
  const widgetRef = useRef(null);

  // Dragging functionality
  const handleMouseDown = (e) => {
    const widget = widgetRef.current;
    if (!widget) return;

    let shiftX = e.clientX - widget.getBoundingClientRect().left;
    let shiftY = e.clientY - widget.getBoundingClientRect().top;

    const moveAt = (pageX, pageY) => {
      widget.style.left = pageX - shiftX + "px";
      widget.style.top = pageY - shiftY + "px";
    };

    const onMouseMove = (e) => {
      moveAt(e.pageX, e.pageY);
    };

    document.addEventListener("mousemove", onMouseMove);

    document.addEventListener(
      "mouseup",
      () => {
        document.removeEventListener("mousemove", onMouseMove);
      },
      { once: true }
    );
  };

  return (
    isVisible && (
      <div
        ref={widgetRef}
        onMouseDown={handleMouseDown}
        className="fixed bottom-5 right-5 w-60 h-40 bg-blue-500 text-white p-4 rounded-lg shadow-lg cursor-grab active:cursor-grabbing"
        style={{ position: "absolute" }}
      >
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-white text-lg"
        >
          ❌
        </button>
        <h3 className="text-lg font-bold">Floating Widget</h3>
        <p className="text-sm">Drag me around!</p>
      </div>
    )
  );
}
