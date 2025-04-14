import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 현재 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      // 먼저 기존 세션을 완전히 정리
      await supabase.auth.signOut({
        scope: "global", // 모든 기기에서 로그아웃 처리
      });

      // 로컬 스토리지의 Supabase 관련 데이터 삭제
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("supabase.auth") || key.startsWith("sb-")) {
          localStorage.removeItem(key);
        }
      });

      // 잠시 대기하여 세션 정리가 완료되도록 함
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 이제 새로운 로그인 시도
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error("Google 로그인 오류 상세정보:", error);
        throw error;
      }

      // 로그인 성공 로그
      console.log("로그인 성공 데이터:", data);
    } catch (error) {
      console.error("Google 로그인 에러:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("로그아웃 에러:", error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth는 AuthProvider 내에서 사용되어야 합니다");
  }
  return context;
};
