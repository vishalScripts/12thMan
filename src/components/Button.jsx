import React from "react";

function Button({ children, className = "", variant = "primary", ...props }) {
  const variantStyles = {
    primary:
      "text-white bg-primary hover:bg-secondary-hover border-purple-200 hover:border-primary ",
    secondary:
      "text-[#1a0e23] bg-[#ff9fe8] hover:bg-[#c9a9ff] border-[#8f5fe8]",
    cancel:
      "text-[#1a0e23] bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-gray-300",
    accent: "text-[#1a0e23] bg-[#a5f0e5] hover:bg-[#d1f7f2] border-[#8f5fe8]",
    compact:
      "px-2 !py-1 text-xs text-primary cursor-pointer bg-gray-200 hover:bg-primary hover:text-white rounded-sm transition-all duration-200 border-none ",
  };

  const baseStyles = `
    border-1
    px-3 py-1.5 
    text-sm 
    rounded-lg 
    transition-all 
    duration-200 
    font-medium
    cursor-pointer
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    focus:ring-primary
  `;

  return (
    <button
      className={`
        ${baseStyles} 
        ${variantStyles[variant]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
