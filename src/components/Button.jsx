import React from "react";

function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`  cursor-pointer bg-accent hover:bg-accent-hover duration-200 px-4 rounded-lg shadow-2xs  font-medium text-xl  hover:scale-105 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
