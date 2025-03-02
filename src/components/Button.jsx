import React from "react";

function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`cursor-pointer bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] 
                  text-[var(--color-text)] px-6 py-1 rounded-md shadow-md 
                  font-semibold text-lg transition-all duration-300 
                  hover:scale-105 active:scale-95 
                  focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)] border-1 
                  ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
