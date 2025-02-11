import React from "react";

function Container({ children, className = "" }) {
  return <div className={` container mx-auto ${className}`}>{children}</div>;
}

export default Container;
