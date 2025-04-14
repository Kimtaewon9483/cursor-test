import React from "react";
import { Button, AddEventModal } from "../components";
import { useCalendar } from "../hooks/useCalendar";
import Calendar from "../components/Calendar";
import EventList from "../components/EventList";

const CalendarPage: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    events,
    selectedDateEvents,
    isAddingEvent,
    setIsAddingEvent,
    newEvent,
    setNewEvent,
    handleAddEvent,
    toggleParticipant,
  } = useCalendar();

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            가족 일정
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
            우리 가족의 일정을 관리하고 특별한 날을 기억하세요
          </p>
        </div>

        <div className="flex justify-end mb-4">
          <Button onClick={() => setIsAddingEvent(true)}>새 일정 추가</Button>
        </div>

        <div className="flex flex-col space-y-6">
          {/* 캘린더 컴포넌트 */}
          <Calendar
            events={events}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* 이벤트 리스트 컴포넌트 */}
          <EventList events={selectedDateEvents} selectedDate={selectedDate} />
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
