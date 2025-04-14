import React, { useState } from "react";

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinGroup: (inviteCode: string) => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
  isOpen,
  onClose,
  onJoinGroup,
}) => {
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      alert("초대 코드를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      await onJoinGroup(inviteCode);
      resetForm();
    } catch (error) {
      console.error("그룹 가입 중 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setInviteCode("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">
            기존 가족 그룹에 참여
          </h3>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-6">
            <label
              htmlFor="invite-code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              초대 코드 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="invite-code"
              placeholder="초대 코드를 입력하세요"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              그룹 관리자에게 받은 초대 코드를 입력하여 가족 그룹에 참여하세요.
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? "참여 중..." : "그룹 참여"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinGroupModal;
