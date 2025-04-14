import React from "react";
import { FAMILY_MEMBERS } from "../types/members";
import { CheckIcon } from "./icons";
import { ParticipantSelectorProps } from "../types/props";

const ParticipantSelector: React.FC<ParticipantSelectorProps> = ({
  selectedParticipants,
  onToggleParticipant,
}) => {
  return (
    <div>
      <span className="block text-sm font-medium text-gray-700 mb-2">
        참여자
      </span>
      <div className="flex flex-wrap gap-2">
        {FAMILY_MEMBERS.map((member) => (
          <button
            key={member}
            type="button"
            className={`inline-flex items-center px-3 py-1.5 border rounded-full text-xs font-medium ${
              selectedParticipants.includes(member)
                ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => onToggleParticipant(member)}
          >
            {member}
            {selectedParticipants.includes(member) && (
              <CheckIcon className="ml-1.5 -mr-0.5 h-4 w-4" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ParticipantSelector;
