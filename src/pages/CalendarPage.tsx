import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { Button, EventCard, AddEventModal, EmptyState } from "../components";
import { AddIcon, CalendarIcon } from "../components/icons";
import { useCalendar } from "../hooks/useCalendar";

const CalendarPage: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    selectedDateEvents,
    hasEventOnDate,
    isAddingEvent,
    setIsAddingEvent,
    newEvent,
    setNewEvent,
    handleAddEvent,
    toggleParticipant,
  } = useCalendar();

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            가족 일정
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            우리 가족의 일정을 관리하고 특별한 날을 기억하세요
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* 왼쪽: 캘린더 */}
          <div className="col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">캘린더</h2>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => date && setSelectedDate(date)}
              inline
              locale={ko}
              dayClassName={hasEventOnDate}
              className="w-full"
            />
            <div className="mt-4">
              <Button
                onClick={() => setIsAddingEvent(true)}
                className="w-full"
                icon={<AddIcon />}
              >
                새 일정 추가
              </Button>
            </div>
          </div>

          {/* 오른쪽: 해당 날짜 일정 */}
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900">
                {selectedDate.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                의 일정
              </h2>

              {selectedDateEvents.length === 0 ? (
                <EmptyState
                  icon={<CalendarIcon />}
                  message="이 날에는 일정이 없습니다."
                />
              ) : (
                <div className="mt-4 divide-y divide-gray-200">
                  {selectedDateEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 새 일정 추가 모달 */}
      <AddEventModal
        isOpen={isAddingEvent}
        onClose={() => setIsAddingEvent(false)}
        onAdd={handleAddEvent}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        toggleParticipant={toggleParticipant}
      />
    </div>
  );
};

export default CalendarPage;
