import React from "react";
import { CalendarEvent } from "../types/events";
import { formatDate } from "../utils/dateUtils";
import { CategoryIcon } from "./icons";

interface EventListProps {
  events: CalendarEvent[];
  selectedDate: Date;
}

const EventList: React.FC<EventListProps> = ({ events, selectedDate }) => {
  // 상태별 필터 옵션
  type EventStatus = "전체" | "예정" | "진행중" | "완료";
  const [statusFilter, setStatusFilter] = React.useState<EventStatus>("전체");
  const statusOptions: EventStatus[] = ["전체", "예정", "진행중", "완료"];

  // 임의로 이벤트 상태 결정 (실제로는 이벤트 객체에 status 필드 추가 필요)
  const getEventStatus = (event: CalendarEvent): EventStatus => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays > 1) return "예정";
    if (diffDays > -1) return "진행중";
    return "완료";
  };

  // 상태별 배지 색상
  const statusColors: Record<EventStatus, string> = {
    전체: "bg-gray-100 text-gray-800",
    예정: "bg-orange-100 text-orange-800",
    진행중: "bg-blue-100 text-blue-800",
    완료: "bg-green-100 text-green-800",
  };

  // 필터링된 이벤트
  const filteredEvents =
    statusFilter === "전체"
      ? events
      : events.filter((event) => getEventStatus(event) === statusFilter);

  return (
    <div className="bg-white rounded-lg shadow w-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {formatDate(selectedDate)}의 일정
        </h2>

        {/* 상태 필터 */}
        <div className="flex space-x-2 mt-4 overflow-x-auto py-1">
          {statusOptions.map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === status
                  ? `bg-indigo-600 text-white`
                  : `bg-gray-100 text-gray-700 hover:bg-gray-200`
              }`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          이 날에는 일정이 없습니다.
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredEvents.map((event) => {
            const status = getEventStatus(event);

            return (
              <div
                key={event.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-2 h-full bg-indigo-500 rounded-full"></div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                          <CategoryIcon category={event.category} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {event.title}
                          {event.endDate && (
                            <span className="ml-2 text-sm text-indigo-500 font-normal">
                              (기간 일정)
                            </span>
                          )}
                        </h3>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-1"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {event.endDate ? (
                          <>
                            {event.date.toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            ~{" "}
                            {event.endDate.toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                            {(event.startTime || event.endTime) && (
                              <>
                                <span className="mx-1">|</span>
                                {event.startTime}{" "}
                                {event.endTime && `~ ${event.endTime}`}
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {event.time ||
                              (event.startTime && event.endTime
                                ? `${event.startTime} ~ ${event.endTime}`
                                : event.startTime)}
                          </>
                        )}
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      {event.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {event.participants.map((participant) => (
                        <span
                          key={participant}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList;
