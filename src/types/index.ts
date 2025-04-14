export interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
  description: string;
  category: string;
  participants: string[];
}

export type NewEvent = Omit<Event, "id">;

export type EventCategory =
  | "가족 활동"
  | "기념일"
  | "학교"
  | "스포츠"
  | "방문"
  | "기타";
