import React from "react";
import { IconProps } from "../../types/props";

const AddIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
};

export default AddIcon;
