import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import Button from "./Button";
import ParticipantSelector from "./ParticipantSelector";
import { CATEGORIES, EventCategory } from "../types/categories";
import { NewEvent } from "../types/events";
import { FamilyMember } from "../types/members";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  newEvent: NewEvent;
  setNewEvent: React.Dispatch<React.SetStateAction<NewEvent>>;
  toggleParticipant: (member: FamilyMember) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  newEvent,
  setNewEvent,
  toggleParticipant,
}) => {
  // 모달이 열렸을 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // body에 modal-open 클래스 추가
      document.body.classList.add("modal-open");
    }

    // 모달 닫힐 때 초기화
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  // 시간 옵션 생성
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour =
          hour < 12
            ? `오전 ${hour === 0 ? 12 : hour}`
            : `오후 ${hour === 12 ? 12 : hour - 12}`;
        const formattedMinute = minute === 0 ? "00" : minute;
        const timeString = `${formattedHour}:${formattedMinute}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // 전일 이벤트 여부
  const [isAllDay, setIsAllDay] = useState(false);

  // 기간 선택 여부
  const [isDateRange, setIsDateRange] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 overflow-y-auto modal-container"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity modal-overlay"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 relative z-50 modal-content">
          <div>
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                새 일정 추가
              </h3>
              <div className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="event-title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      제목
                    </label>
                    <input
                      type="text"
                      name="event-title"
                      id="event-title"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="일정 제목"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                    />
                  </div>

                  {/* 날짜 선택 옵션 */}
                  <div className="flex items-center mb-2">
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        className="rounded text-indigo-500 focus:ring-indigo-500 mr-2"
                        checked={isDateRange}
                        onChange={() => {
                          setIsDateRange(!isDateRange);
                          // 기간 설정을 켰을 때 종료일 기본값 설정
                          if (!isDateRange && !newEvent.endDate) {
                            // 기본적으로 시작일부터 3일 동안의 일정으로 설정
                            const endDate = new Date(newEvent.date);
                            endDate.setDate(endDate.getDate() + 2); // 시작일 포함 3일
                            setNewEvent({
                              ...newEvent,
                              endDate,
                            });
                          }
                          // 기간 설정을 껐을 때 종료일 초기화
                          if (isDateRange) {
                            setNewEvent({
                              ...newEvent,
                              endDate: undefined,
                            });
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">기간 설정</span>
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="event-date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {isDateRange ? "시작일" : "날짜"}
                    </label>
                    <DatePicker
                      id="event-date"
                      selected={newEvent.date}
                      onChange={(date: Date | null) =>
                        date && setNewEvent({ ...newEvent, date })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      dateFormat="yyyy년 MM월 dd일"
                      locale={ko}
                      wrapperClassName="date-picker-wrapper"
                      calendarClassName="shadow-lg border border-gray-200 rounded-md"
                      inline={false}
                    />
                  </div>

                  {isDateRange && (
                    <div>
                      <label
                        htmlFor="event-end-date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        종료일
                      </label>
                      <DatePicker
                        id="event-end-date"
                        selected={newEvent.endDate}
                        onChange={(date: Date | null) =>
                          setNewEvent({
                            ...newEvent,
                            endDate: date || undefined,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        dateFormat="yyyy년 MM월 dd일"
                        locale={ko}
                        wrapperClassName="date-picker-wrapper"
                        calendarClassName="shadow-lg border border-gray-200 rounded-md"
                        inline={false}
                        minDate={newEvent.date} // 시작일보다 이전 날짜 선택 방지
                      />
                    </div>
                  )}

                  {/* 시간 선택 옵션 */}
                  <div className="flex items-center mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-indigo-500 focus:ring-indigo-500 mr-2"
                        checked={isAllDay}
                        onChange={() => {
                          setIsAllDay(!isAllDay);
                          // 하루 종일 체크시 시간 정보 초기화
                          if (!isAllDay) {
                            setNewEvent({
                              ...newEvent,
                              startTime: "",
                              endTime: "",
                              time: "하루 종일",
                            });
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">하루 종일</span>
                    </label>
                  </div>

                  {!isAllDay && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="event-start-time"
                          className="block text-sm font-medium text-gray-700"
                        >
                          시작 시간
                        </label>
                        <select
                          id="event-start-time"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={newEvent.startTime || ""}
                          onChange={(e) =>
                            setNewEvent({
                              ...newEvent,
                              startTime: e.target.value,
                              time: e.target.value, // 기존 time 필드 호환성 유지
                            })
                          }
                        >
                          <option value="">선택</option>
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="event-end-time"
                          className="block text-sm font-medium text-gray-700"
                        >
                          종료 시간
                        </label>
                        <select
                          id="event-end-time"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={newEvent.endTime || ""}
                          onChange={(e) =>
                            setNewEvent({
                              ...newEvent,
                              endTime: e.target.value,
                            })
                          }
                        >
                          <option value="">선택</option>
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="event-description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      설명
                    </label>
                    <textarea
                      id="event-description"
                      name="event-description"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="일정에 대한 간단한 설명"
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="event-category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      카테고리
                    </label>
                    <select
                      id="event-category"
                      name="event-category"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={newEvent.category}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          category: e.target.value as EventCategory,
                        })
                      }
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <ParticipantSelector
                    selectedParticipants={newEvent.participants}
                    onToggleParticipant={toggleParticipant}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
            <Button onClick={onAdd} className="w-full">
              추가하기
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              className="mt-3 sm:mt-0 w-full hover:bg-gray-200 font-medium"
            >
              취소
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
