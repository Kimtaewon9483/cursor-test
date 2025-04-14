import { format, isSameDay as isSameDayFns } from "date-fns";
import { ko } from "date-fns/locale";
import { DateInfo } from "../types/events";

/**
 * 날짜에서 년, 월, 일 정보를 추출합니다.
 */
export const extractDateInfo = (date: Date): DateInfo => {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
};

/**
 * 두 날짜가 같은 날인지 확인합니다.
 */
export const isSameDay = isSameDayFns;

/**
 * 날짜를 yyyy년 MM월 dd일 형식의 문자열로 변환합니다.
 */
export const formatDate = (date: Date): string => {
  return format(date, "yyyy년 M월 d일", { locale: ko });
};

/**
 * 문자열 형식의 시간이 유효한지 확인합니다.
 */
export const isValidTimeFormat = (time: string): boolean => {
  // '오전 9:00', '오후 3:30' 등의 형식 확인
  const regex = /^(오전|오후) ([0-9]|1[0-2]):[0-5][0-9]$/;
  return regex.test(time);
};
