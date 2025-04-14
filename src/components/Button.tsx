import React from "react";
import { ButtonProps, ButtonVariant } from "../types/props";

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  icon,
}) => {
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary:
      "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 shadow-sm",
    outline: "border border-indigo-500 text-indigo-600 hover:bg-indigo-50",
  };

  return (
    <button
      type={type}
      className={`inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
