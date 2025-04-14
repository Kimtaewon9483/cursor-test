import { useState } from "react";
import { Event, NewEvent } from "../types";

interface UseCalendarReturn {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  selectedDateEvents: Event[];
  hasEventOnDate: (date: Date) => string;
  isAddingEvent: boolean;
  setIsAddingEvent: (isAdding: boolean) => void;
  newEvent: NewEvent;
  setNewEvent: React.Dispatch<React.SetStateAction<NewEvent>>;
  handleAddEvent: () => void;
  toggleParticipant: (member: string) => void;
}

// 초기 이벤트 데이터
const initialEvents: Event[] = [
  {
    id: 1,
    title: "엄마 생일",
    date: new Date(2024, 4, 15),
    time: "오후 7:00",
    description: "엄마의 생일 파티",
    category: "기념일",
    participants: ["아빠", "엄마", "아들", "딸"],
  },
  {
    id: 2,
    title: "가족 소풍",
    date: new Date(2024, 4, 20),
    time: "오전 10:00",
    description: "날씨가 좋은 날 공원에서 피크닉",
    category: "가족 활동",
    participants: ["아빠", "엄마", "아들", "딸"],
  },
  {
    id: 3,
    title: "딸 학교 발표회",
    date: new Date(2024, 4, 25),
    time: "오후 2:00",
    description: "학교 미술 전시회",
    category: "학교",
    participants: ["엄마", "딸"],
  },
  {
    id: 4,
    title: "아들 축구경기",
    date: new Date(2024, 4, 7),
    time: "오후 4:00",
    description: "지역 리그 축구 경기",
    category: "스포츠",
    participants: ["아빠", "아들"],
  },
  {
    id: 5,
    title: "할머니댁 방문",
    date: new Date(2024, 4, 10),
    time: "오전 11:00",
    description: "주말 할머니댁 방문",
    category: "방문",
    participants: ["아빠", "엄마", "아들", "딸"],
  },
];

// 초기 새 이벤트 상태
const initialNewEvent: NewEvent = {
  title: "",
  date: new Date(),
  time: "",
  description: "",
  category: "가족 활동",
  participants: [],
};

export const useCalendar = (): UseCalendarReturn => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEvent>(initialNewEvent);

  // 선택된 날짜의 이벤트
  const selectedDateEvents = events.filter(
    (event) =>
      event.date.getDate() === selectedDate.getDate() &&
      event.date.getMonth() === selectedDate.getMonth() &&
      event.date.getFullYear() === selectedDate.getFullYear()
  );

  // 날짜에 이벤트가 있는지 확인하는 함수
  const hasEventOnDate = (date: Date): string => {
    return events.some(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    )
      ? "bg-indigo-100 text-indigo-800 rounded-full"
      : "";
  };

  // 새 일정 추가하기
  const handleAddEvent = () => {
    if (newEvent.title.trim() === "") return;

    const updatedEvents = [...events, { ...newEvent, id: events.length + 1 }];
    setEvents(updatedEvents);
    setIsAddingEvent(false);
    setNewEvent(initialNewEvent);
  };

  // 참여자 토글
  const toggleParticipant = (member: string) => {
    if (newEvent.participants.includes(member)) {
      setNewEvent({
        ...newEvent,
        participants: newEvent.participants.filter((p) => p !== member),
      });
    } else {
      setNewEvent({
        ...newEvent,
        participants: [...newEvent.participants, member],
      });
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    events,
    setEvents,
    selectedDateEvents,
    hasEventOnDate,
    isAddingEvent,
    setIsAddingEvent,
    newEvent,
    setNewEvent,
    handleAddEvent,
    toggleParticipant,
  };
};
