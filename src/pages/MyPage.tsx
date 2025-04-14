import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { FamilyGroup } from "../types/groups";
import CreateGroupModal from "../components/CreateGroupModal";
import JoinGroupModal from "../components/JoinGroupModal";
import { Navigate, Link } from "react-router-dom";

const MyPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [userGroups, setUserGroups] = useState<FamilyGroup[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserGroups();
    }
  }, [user]);

  const fetchUserGroups = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("family_groups")
        .select("*")
        .or(`owner_id.eq.${user?.id},members.cs.{${user?.id}}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUserGroups(data || []);
    } catch (error) {
      console.error("그룹 정보를 불러오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async (
    groupName: string,
    groupDescription: string
  ) => {
    try {
      const newGroup = {
        name: groupName,
        description: groupDescription,
        owner_id: user?.id,
        members: [user?.id],
      };

      const { data, error } = await supabase
        .from("family_groups")
        .insert([newGroup])
        .select();

      if (error) throw error;
      setUserGroups([...(data || []), ...userGroups]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("그룹 생성 중 오류 발생:", error);
      alert("그룹 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleJoinGroup = async (inviteCode: string) => {
    try {
      // 초대 코드로 그룹 찾기
      const { data: groupData, error: groupError } = await supabase
        .from("family_groups")
        .select("*")
        .eq("invite_code", inviteCode)
        .single();

      if (groupError) throw groupError;
      if (!groupData) {
        alert("유효하지 않은 초대 코드입니다.");
        return;
      }

      // 이미 가입한 그룹인지 확인
      if (groupData.members.includes(user?.id)) {
        alert("이미 가입한 그룹입니다.");
        return;
      }

      // 그룹 멤버 업데이트
      const updatedMembers = [...groupData.members, user?.id];
      const { error: updateError } = await supabase
        .from("family_groups")
        .update({ members: updatedMembers })
        .eq("id", groupData.id);

      if (updateError) throw updateError;

      // 그룹 목록 새로고침
      fetchUserGroups();
      setIsJoinModalOpen(false);
    } catch (error) {
      console.error("그룹 가입 중 오류 발생:", error);
      alert("그룹 가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleLeaveGroup = async (groupId: number) => {
    if (window.confirm("정말로 이 그룹을 떠나시겠습니까?")) {
      try {
        // 그룹 정보 가져오기
        const { data: groupData, error: groupError } = await supabase
          .from("family_groups")
          .select("*")
          .eq("id", groupId)
          .single();

        if (groupError) throw groupError;

        // 그룹 소유자인 경우 탈퇴 불가
        if (groupData.owner_id === user?.id) {
          alert(
            "그룹 소유자는 탈퇴할 수 없습니다. 그룹을 삭제하시려면 삭제 버튼을 이용해주세요."
          );
          return;
        }

        // 멤버 배열에서 현재 사용자 제거
        const updatedMembers = groupData.members.filter(
          (id: string) => id !== user?.id
        );
        const { error: updateError } = await supabase
          .from("family_groups")
          .update({ members: updatedMembers })
          .eq("id", groupId);

        if (updateError) throw updateError;

        // 그룹 목록 업데이트
        setUserGroups(userGroups.filter((group) => group.id !== groupId));
      } catch (error) {
        console.error("그룹 탈퇴 중 오류 발생:", error);
        alert("그룹 탈퇴에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (
      window.confirm(
        "정말로 이 그룹을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      try {
        const { error } = await supabase
          .from("family_groups")
          .delete()
          .eq("id", groupId)
          .eq("owner_id", user?.id);

        if (error) throw error;

        // 그룹 목록 업데이트
        setUserGroups(userGroups.filter((group) => group.id !== groupId));
      } catch (error) {
        console.error("그룹 삭제 중 오류 발생:", error);
        alert("그룹 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 로딩 중이거나 로그인하지 않은 경우
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              내 프로필
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              개인 정보 및 계정 설정
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">이름</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.user_metadata?.full_name || "이름 없음"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">이메일</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">가입일</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.created_at).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                내 가족 그룹
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                소속된 그룹 목록 및 관리
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                그룹 가입
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                그룹 만들기
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200">
            {isLoading ? (
              <div className="px-4 py-12 text-center text-gray-500">
                그룹 정보를 불러오는 중...
              </div>
            ) : userGroups.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {userGroups.map((group) => (
                  <li key={group.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-indigo-600">
                          <Link
                            to={`/group/${group.id}`}
                            className="hover:underline"
                          >
                            {group.name}
                          </Link>
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          {group.description}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span>멤버 {group.members.length}명</span>
                          <span className="mx-2">•</span>
                          <span>
                            {group.owner_id === user.id
                              ? "내가 만든 그룹"
                              : "참여 중인 그룹"}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {group.owner_id === user.id ? (
                          <>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(group.invite_code)
                              }
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              초대 코드 복사
                            </button>
                            <button
                              onClick={() => handleDeleteGroup(group.id)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              삭제
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleLeaveGroup(group.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            나가기
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-12 text-center text-gray-500">
                <p className="mb-4">아직 소속된 가족 그룹이 없습니다.</p>
                <p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    새 그룹 만들기
                  </button>
                  {" 또는 "}
                  <button
                    onClick={() => setIsJoinModalOpen(true)}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    기존 그룹에 참여하기
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 그룹 생성 모달 */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGroup={handleCreateGroup}
      />

      {/* 그룹 가입 모달 */}
      <JoinGroupModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoinGroup={handleJoinGroup}
      />
    </div>
  );
};

export default MyPage;
