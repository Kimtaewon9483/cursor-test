import React from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import Button from "./Button";
import ParticipantSelector from "./ParticipantSelector";
import { CATEGORIES } from "../constants";
import { NewEvent } from "../types";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  newEvent: NewEvent;
  setNewEvent: React.Dispatch<React.SetStateAction<NewEvent>>;
  toggleParticipant: (member: string) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  newEvent,
  setNewEvent,
  toggleParticipant,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
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

                  <div>
                    <label
                      htmlFor="event-date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      날짜
                    </label>
                    <DatePicker
                      selected={newEvent.date}
                      onChange={(date: Date | null) =>
                        date && setNewEvent({ ...newEvent, date })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      dateFormat="yyyy년 MM월 dd일"
                      locale={ko}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="event-time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      시간
                    </label>
                    <input
                      type="text"
                      name="event-time"
                      id="event-time"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="예: 오후 3:00"
                      value={newEvent.time}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, time: e.target.value })
                      }
                    />
                  </div>

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
                          category: e.target.value,
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
              className="mt-3 sm:mt-0 w-full"
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
