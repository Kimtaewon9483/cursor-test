import { CalendarEvent, NewEvent } from "./events";
import { FamilyMember } from "./members";

export interface UseCalendarReturn {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  selectedDateEvents: CalendarEvent[];
  hasEventOnDate: (date: Date) => string;
  isAddingEvent: boolean;
  setIsAddingEvent: (isAdding: boolean) => void;
  newEvent: NewEvent;
  setNewEvent: React.Dispatch<React.SetStateAction<NewEvent>>;
  handleAddEvent: () => void;
  toggleParticipant: (member: FamilyMember) => void;
}
