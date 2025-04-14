import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarEvent } from "../types/events";
import { formatDate } from "../utils/dateUtils";

interface CalendarProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  selectedDate,
  onSelectDate,
}) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  // 달력 시작일(해당 월의 첫 주 일요일)과 종료일(해당 월의 마지막 주 토요일) 계산
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  // 달력에 표시할 모든 날짜 배열
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // 요일 목록
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  // 해당 날짜에 이벤트가 있는지 확인
  const hasEventOnDate = (date: Date): boolean => {
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
    });
  };

  const prevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() - 1);
    onSelectDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + 1);
    onSelectDate(newDate);
  };

  // 주 단위로 날짜 배열을 나누는 함수
  const generateCalendarWeeks = (): Date[][] => {
    const weeks: Date[][] = [];
    let week: Date[] = [];

    calendarDays.forEach((day, index) => {
      week.push(day);

      // 토요일이거나 마지막 날짜인 경우 주 배열에 추가
      if (day.getDay() === 6 || index === calendarDays.length - 1) {
        weeks.push(week);
        week = [];
      }
    });

    return weeks;
  };

  const calendarWeeks = generateCalendarWeeks();

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <h2 className="text-lg font-semibold text-gray-900">
          {format(selectedDate, "yyyy년 M월", { locale: ko })}
        </h2>

        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-medium text-gray-500 mb-1">
        {weekdays.map((day) => (
          <div key={day} className="py-1 text-sm">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-1">
        {calendarWeeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day: Date) => {
              const dayNumber = day.getDate();
              const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
              const hasEvent = hasEventOnDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);

              let dayClasses =
                "h-8 w-8 flex flex-col items-center justify-center text-sm transition-all cursor-pointer mx-auto relative";

              if (isSelected) {
                dayClasses +=
                  " bg-indigo-600 text-white font-bold rounded-full";
              } else if (isCurrentDay) {
                dayClasses +=
                  " border border-indigo-400 font-semibold rounded-full";
              } else {
                dayClasses += " hover:bg-gray-100 rounded-full";
              }

              // 현재 월이 아닌 날짜는 흐리게 표시
              if (!isCurrentMonth) {
                dayClasses += " text-gray-300";
              }

              return (
                <div
                  key={`${day.getFullYear()}-${day.getMonth()}-${dayNumber}`}
                  className={dayClasses}
                  onClick={() => onSelectDate(day)}
                >
                  <span>{dayNumber}</span>
                  {hasEvent && !isSelected && (
                    <div className="absolute bottom-0.5 h-1 w-1 bg-indigo-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-3 text-center text-gray-500 text-xs">
        {formatDate(selectedDate)} 선택됨
      </div>
    </div>
  );
};

export default Calendar;
