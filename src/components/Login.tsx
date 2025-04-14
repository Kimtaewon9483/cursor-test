import React, { useState, MouseEvent, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

const Login: React.FC = () => {
  const { signInWithGoogle, signOut, user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // URL에서 에러 파라미터 확인
    const searchParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.replace("#", ""));

    const error = searchParams.get("error") || hashParams.get("error");
    const errorDescription =
      searchParams.get("error_description") ||
      hashParams.get("error_description");

    if (error) {
      console.error("로그인 에러:", error, errorDescription);
      setErrorMessage(
        `로그인 중 오류가 발생했습니다: ${errorDescription || error}`
      );
    }
  }, [location]);

  const handleGoogleSignIn = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("로그인 에러:", error);
      setErrorMessage(
        "로그인 과정에서 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await signOut();
      // 로그아웃 후 로컬 스토리지 정리
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("supabase.auth") || key.startsWith("sb-")) {
          localStorage.removeItem(key);
        }
      });
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error("로그아웃 에러:", error);
      setErrorMessage("로그아웃 과정에서 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-50 to-teal-100">
      <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-3xl font-bold text-teal-500">가족 다이어리</h1>
          <p className="text-lg text-gray-600 text-center">
            가족과의 소중한 순간을 기록하고 공유하세요
          </p>

          {errorMessage && (
            <div
              className="w-full p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          {user && (
            <div className="w-full bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-medium mb-2">
                현재 로그인: {user.email}
              </p>
              <p className="text-sm text-blue-600 mb-4">
                다른 계정으로 로그인하려면 먼저 로그아웃하세요.
              </p>
              <button
                type="button"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleSignOut}
                disabled={isLoading}
              >
                {isLoading ? "로그아웃 중..." : "로그아웃"}
              </button>
            </div>
          )}

          <button
            type="button"
            className="w-full py-3 px-4 flex items-center justify-center bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <div className="mr-2 text-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                style={{ display: "inline-block" }}
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
            </div>
            <span className="text-gray-700">
              {isLoading ? "로그인 중..." : "Google로 로그인"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
