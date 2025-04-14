import { useState } from "react";
import { CalendarEvent, NewEvent } from "../types/events";
import { FamilyMember } from "../types/members";
import { isSameDay } from "date-fns";
import { UseCalendarReturn } from "../types/hooks";

// 초기 이벤트 데이터
const initialEvents: CalendarEvent[] = [
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
  // 더 많은 예제 이벤트 추가
  {
    id: 6,
    title: "가족 영화 관람",
    date: new Date(), // 오늘
    time: "오후 6:00",
    description: "영화관에서 최신 영화 관람",
    category: "가족 활동",
    participants: ["아빠", "엄마", "아들", "딸"],
  },
  {
    id: 7,
    title: "도서관 방문",
    date: new Date(), // 오늘
    time: "오전 9:30",
    description: "아이들 독서 프로그램 참여",
    category: "학교",
    participants: ["엄마", "아들", "딸"],
  },
];

// 초기 새 이벤트 상태
const initialNewEvent: NewEvent = {
  title: "",
  date: new Date(),
  endDate: undefined,
  time: "",
  startTime: "",
  endTime: "",
  description: "",
  category: "가족 활동",
  participants: [],
};

export const useCalendar = (): UseCalendarReturn => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEvent>(initialNewEvent);

  // 선택된 날짜의 이벤트
  const selectedDateEvents = events.filter((event) => {
    // 이벤트가 단일 날짜인 경우
    if (!event.endDate) {
      return isSameDay(event.date, selectedDate);
    }
    // 이벤트가 기간인 경우 해당 기간 내에 선택된 날짜가 포함되는지 확인
    const eventStartTime = new Date(event.date).setHours(0, 0, 0, 0);
    const eventEndTime = new Date(event.endDate).setHours(23, 59, 59, 999);
    const selectedDateTime = new Date(selectedDate).setHours(12, 0, 0, 0);
    return (
      selectedDateTime >= eventStartTime && selectedDateTime <= eventEndTime
    );
  });

  // 날짜에 이벤트가 있는지 확인하는 함수
  const hasEventOnDate = (date: Date): string => {
    return events.some((event) => {
      // 이벤트가 단일 날짜인 경우
      if (!event.endDate) {
        return isSameDay(event.date, date);
      }
      // 이벤트가 기간인 경우 해당 기간 내에 날짜가 포함되는지 확인
      const eventStartTime = new Date(event.date).setHours(0, 0, 0, 0);
      const eventEndTime = new Date(event.endDate).setHours(23, 59, 59, 999);
      const dateTime = new Date(date).setHours(12, 0, 0, 0);
      return dateTime >= eventStartTime && dateTime <= eventEndTime;
    })
      ? "bg-indigo-100 text-indigo-800 rounded-full"
      : "";
  };

  // 새 일정 추가하기
  const handleAddEvent = () => {
    if (newEvent.title.trim() === "") return;

    // 하루 종일 이벤트인 경우 시간 정보 초기화
    let updatedEvent = { ...newEvent };

    // 시간 정보 처리
    if (!updatedEvent.startTime && !updatedEvent.endTime) {
      updatedEvent.time = "하루 종일";
    } else if (updatedEvent.startTime && !updatedEvent.endTime) {
      updatedEvent.time = updatedEvent.startTime;
    } else if (updatedEvent.startTime && updatedEvent.endTime) {
      updatedEvent.time = `${updatedEvent.startTime} ~ ${updatedEvent.endTime}`;
    }

    // 기간 이벤트 설명 추가
    if (updatedEvent.endDate) {
      const startDate = updatedEvent.date.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
      });
      const endDate = updatedEvent.endDate.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
      });

      // 설명이 비어있을 경우 기간 정보 추가
      if (!updatedEvent.description) {
        updatedEvent.description = `${startDate}부터 ${endDate}까지의 일정`;
      }
    }

    const updatedEvents = [
      ...events,
      { ...updatedEvent, id: events.length + 1 },
    ];
    setEvents(updatedEvents);
    setIsAddingEvent(false);
    setNewEvent(initialNewEvent);
  };

  // 참여자 토글
  const toggleParticipant = (member: FamilyMember) => {
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
