import { ReactNode } from "react";
import { Event, NewEvent, CalendarEvent } from "./events";
import { EventCategory } from "./categories";
import { FamilyMember, Participant } from "./members";

export type ButtonVariant = "primary" | "secondary" | "outline";

// 버튼 컴포넌트 props
export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  icon?: ReactNode;
}

// 아이콘 컴포넌트 props
export interface IconProps {
  className?: string;
}

export interface CategoryIconProps {
  category: EventCategory;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// 이벤트 관련 컴포넌트 props
export interface EventCardProps {
  event?: CalendarEvent;
}

export interface CategoryBadgeProps {
  category: EventCategory;
  className?: string;
}

export interface ParticipantBadgeProps {
  participant: Participant;
}

export interface ParticipantSelectorProps {
  selectedParticipants: Participant[];
  onToggleParticipant: (participant: Participant) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  newEvent: NewEvent;
  setNewEvent: React.Dispatch<React.SetStateAction<NewEvent>>;
  toggleParticipant: (member: FamilyMember) => void;
}

// 기타 컴포넌트 props
export interface EmptyStateProps {
  icon: ReactNode;
  message: string;
}

export interface CalendarProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export interface EventListProps {
  events: CalendarEvent[];
  selectedDate: Date;
}
