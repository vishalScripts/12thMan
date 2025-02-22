import React from "react";
import { useSelector } from "react-redux";

function ProfileLogo({ className = "", src }) {
  const userData = useSelector((state) => state.auth.userData);
  console.log(userData);
  return (
    <div className={`${className} w-14 aspect-square flex items-center`}>
      <img
        src={src}
        alt=""
        className="w-full object-center object-cover "
        srcset=""
      />
    </div>
  );
}

export default ProfileLogo;
