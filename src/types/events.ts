import { EventCategory } from "./categories";
import { FamilyMember } from "./members";

export interface Event {
  id: number;
  title: string;
  date: Date;
  endDate?: Date; // 기간 종료일(선택 사항)
  time: string;
  startTime?: string; // 시작 시간
  endTime?: string; // 종료 시간
  description: string;
  category: EventCategory;
  participants: FamilyMember[];
}

// CalendarEvent는 Event의 별칭입니다
// 캘린더 인터페이스에서 이벤트를 표시하고 관리하는 데 사용됩니다
// 이 타입은 Calendar, EventList 및 기타 캘린더 관련 컴포넌트에서 사용됩니다
export type CalendarEvent = Event;

export type NewEvent = Omit<Event, "id">;

export interface DateInfo {
  year: number;
  month: number;
  day: number;
}

export interface EventState {
  events: Event[];
  selectedDate: Date;
  isAddingEvent: boolean;
  newEvent: NewEvent;
}
