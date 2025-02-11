import React from "react";

function Button({ children, className = "", ...props }) {
  return (
    <button
      className={` ${className} cursor-pointer bg-primary hover:bg-accent-hover duration-200 px-4 rounded-lg shadow-2xs border-1 border-accent-hover font-medium text-xl hover:border-accent hover:scale-105`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
