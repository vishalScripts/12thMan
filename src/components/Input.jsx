import React from "react";

function Input({
  className = "",
  type = "text",
  variant = "primary",
  onChange,
  value,
  ...props
}) {
  const variantStyles = {
    secondary: `
      w-full 
      p-2 
      border 
      border-gray-300 
      border-b-slate-900 
      bg-white 
      outline-none 
      focus:ring-1 
      ring-fuchsia-400 
      rounded-md 
      shadow-2xs 
      shadow-black 
      hover:shadow-fuchsia-400 
      focus:shadow-fuchsia-400
    `,
    primary: `
      w-full 
      p-2 
      border 
      border-gray-200 
      rounded-lg 
      focus:ring-1 
      focus:ring-primary 
      focus:border-primary 
      transition 
      duration-200 
      outline-none 
      bg-gray-50 
      text-gray-800
    `,
  };

  // Default onChange handler to prevent uncontrolled component warning
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      className={`
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    />
  );
}

export default Input;
