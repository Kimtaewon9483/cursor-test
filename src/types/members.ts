export type FamilyMember =
  | "아빠"
  | "엄마"
  | "아들"
  | "딸"
  | "할머니"
  | "할아버지";

export const FAMILY_MEMBERS: FamilyMember[] = [
  "아빠",
  "엄마",
  "아들",
  "딸",
  "할머니",
  "할아버지",
];

// 다른 컴포넌트에서 참조하는 Participant 타입을 FamilyMember와 동일하게 설정
export type Participant = FamilyMember;
