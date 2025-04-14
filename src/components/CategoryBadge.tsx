import React from "react";
import { CategoryBadgeProps } from "../types/props";

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  className = "bg-indigo-100 text-indigo-800",
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {category}
    </span>
  );
};

export default CategoryBadge;
