import React from "react";
import { CategoryIcon } from "./icons";
import CategoryBadge from "./CategoryBadge";
import ParticipantBadge from "./ParticipantBadge";
import { Event } from "../types";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="py-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600">
            <CategoryIcon category={event.category} />
          </span>
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
            <span className="text-sm text-gray-500">{event.time}</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">{event.description}</p>
          <div className="mt-2">
            <CategoryBadge category={event.category} />
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {event.participants.map((participant) => (
              <ParticipantBadge key={participant} participant={participant} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
