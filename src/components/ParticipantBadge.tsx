import React from "react";
import { ParticipantBadgeProps } from "../types/props";

const ParticipantBadge: React.FC<ParticipantBadgeProps> = ({ participant }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {participant}
    </span>
  );
};

export default ParticipantBadge;
