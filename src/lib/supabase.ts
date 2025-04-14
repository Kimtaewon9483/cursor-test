import { createClient } from "@supabase/supabase-js";

// 환경 변수에서 Supabase URL과 API 키를 가져옵니다.
// 개발 환경에서는 테스트 프로젝트 URL과 키를 사용합니다.
const isDevelopment = process.env.NODE_ENV === "development";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "";

const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

// 환경 변수가 설정되지 않고 개발 환경이 아닐 때 경고 메시지 출력
if (!supabaseUrl && !isDevelopment) {
  console.warn(
    "Supabase URL이 설정되지 않았습니다. .env 파일에 REACT_APP_SUPABASE_URL을 설정하세요."
  );
}

if (!supabaseAnonKey && !isDevelopment) {
  console.warn(
    "Supabase Anon Key가 설정되지 않았습니다. .env 파일에 REACT_APP_SUPABASE_ANON_KEY를 설정하세요."
  );
}

// Supabase 클라이언트 생성 (추가 옵션 설정)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: "family-diary-auth-storage",
    flowType: "pkce",
  },
});

// 로그인 상태 변경 이벤트 로깅
supabase.auth.onAuthStateChange((event, session) => {
  console.log(
    "Supabase 인증 상태 변경:",
    event,
    session ? "세션 있음" : "세션 없음"
  );
});

// Supabase 데이터베이스 스키마 타입 정의
export type Database = {
  public: {
    tables: {
      groups: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          created_by?: string;
        };
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          role: "admin" | "member";
          created_at: string;
          display_name: string;
          family_role: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          role?: "admin" | "member";
          created_at?: string;
          display_name: string;
          family_role: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          role?: "admin" | "member";
          created_at?: string;
          display_name?: string;
          family_role?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          date: string;
          end_date: string | null;
          time: string;
          start_time: string | null;
          end_time: string | null;
          description: string;
          category: string;
          group_id: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          date: string;
          end_date?: string | null;
          time: string;
          start_time?: string | null;
          end_time?: string | null;
          description: string;
          category: string;
          group_id: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          date?: string;
          end_date?: string | null;
          time?: string;
          start_time?: string | null;
          end_time?: string | null;
          description?: string;
          category?: string;
          group_id?: string;
          created_by?: string;
          created_at?: string;
        };
      };
      event_participants: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      stories: {
        Row: {
          id: string;
          title: string;
          content: string;
          author_id: string;
          group_id: string;
          created_at: string;
          likes: number;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          author_id: string;
          group_id: string;
          created_at?: string;
          likes?: number;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          author_id?: string;
          group_id?: string;
          created_at?: string;
          likes?: number;
        };
      };
      comments: {
        Row: {
          id: string;
          story_id: string;
          text: string;
          author_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          story_id: string;
          text: string;
          author_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          story_id?: string;
          text?: string;
          author_id?: string;
          created_at?: string;
        };
      };
      gallery: {
        Row: {
          id: string;
          src: string;
          alt: string;
          caption: string;
          category: string;
          date: string;
          group_id: string;
          uploaded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          src: string;
          alt: string;
          caption: string;
          category: string;
          date: string;
          group_id: string;
          uploaded_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          src?: string;
          alt?: string;
          caption?: string;
          category?: string;
          date?: string;
          group_id?: string;
          uploaded_by?: string;
          created_at?: string;
        };
      };
    };
  };
};
