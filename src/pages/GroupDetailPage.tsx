import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { FamilyGroup, GroupMember } from "../types/groups";

const GroupDetailPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState<FamilyGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId, user]);

  const fetchGroupDetails = async () => {
    try {
      setIsLoading(true);

      // 그룹 정보 가져오기
      const { data: groupData, error: groupError } = await supabase
        .from("family_groups")
        .select("*")
        .eq("id", groupId)
        .single();

      if (groupError) throw groupError;
      if (!groupData) {
        alert("그룹을 찾을 수 없습니다.");
        navigate("/mypage");
        return;
      }

      setGroup(groupData);
      setIsOwner(groupData.owner_id === user?.id);

      // 그룹원 정보 가져오기
      if (groupData.members && groupData.members.length > 0) {
        const { data: membersData, error: membersError } = await supabase
          .from("profiles")
          .select("id, email, full_name, avatar_url")
          .in("id", groupData.members);

        if (membersError) throw membersError;

        // 그룹원 목록에 역할 정보 추가
        const membersWithRole: GroupMember[] = (membersData || []).map(
          (member: any) => ({
            ...member,
            role: member.id === groupData.owner_id ? "owner" : "member",
          })
        );

        setMembers(membersWithRole);
      }
    } catch (error) {
      console.error("그룹 상세 정보를 불러오는 중 오류 발생:", error);
      alert("그룹 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteEmail || !inviteEmail.includes("@")) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    try {
      setIsInviting(true);

      // 해당 이메일을 가진 사용자 찾기
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", inviteEmail.trim().toLowerCase())
        .single();

      if (userError) {
        if (userError.code === "PGRST116") {
          alert("해당 이메일을 가진 사용자를 찾을 수 없습니다.");
        } else {
          throw userError;
        }
        return;
      }

      // 이미 그룹원인지 확인
      if (group?.members.includes(userData.id)) {
        alert("이미 그룹에 참여한 사용자입니다.");
        return;
      }

      // 그룹원 추가
      const updatedMembers = [...(group?.members || []), userData.id];
      const { error: updateError } = await supabase
        .from("family_groups")
        .update({ members: updatedMembers })
        .eq("id", groupId);

      if (updateError) throw updateError;

      alert("그룹원 초대가 완료되었습니다.");
      setInviteEmail("");
      fetchGroupDetails();
    } catch (error) {
      console.error("그룹원 초대 중 오류 발생:", error);
      alert("그룹원 초대에 실패했습니다.");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!isOwner || memberId === user?.id) {
      alert("그룹 소유자만 다른 그룹원을 제거할 수 있습니다.");
      return;
    }

    if (!window.confirm("정말로 이 그룹원을 제거하시겠습니까?")) {
      return;
    }

    try {
      // 그룹원 배열에서 해당 ID 제거
      const updatedMembers =
        group?.members.filter((id) => id !== memberId) || [];

      const { error } = await supabase
        .from("family_groups")
        .update({ members: updatedMembers })
        .eq("id", groupId);

      if (error) throw error;

      // 데이터 새로고침
      fetchGroupDetails();
      alert("그룹원이 제거되었습니다.");
    } catch (error) {
      console.error("그룹원 제거 중 오류 발생:", error);
      alert("그룹원 제거에 실패했습니다.");
    }
  };

  const handleTransferOwnership = async (newOwnerId: string) => {
    if (!isOwner) {
      alert("그룹 소유자만 소유권을 이전할 수 있습니다.");
      return;
    }

    if (
      !window.confirm(
        "정말로 이 그룹의 소유권을 이전하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("family_groups")
        .update({ owner_id: newOwnerId })
        .eq("id", groupId);

      if (error) throw error;

      alert("그룹 소유권이 이전되었습니다.");
      fetchGroupDetails();
    } catch (error) {
      console.error("소유권 이전 중 오류 발생:", error);
      alert("소유권 이전에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">그룹 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">그룹을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 flex justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {group.name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {group.description}
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>멤버 {members.length}명</span>
                <span className="mx-2">•</span>
                <span>{isOwner ? "내가 관리하는 그룹" : "참여 중인 그룹"}</span>
              </div>
            </div>
            <div>
              <button
                onClick={() => navigate("/mypage")}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                목록으로 돌아가기
              </button>
            </div>
          </div>

          {/* 초대 코드 영역 */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-gray-500">초대 코드</h4>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {group.invite_code}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(group.invite_code);
                  alert("초대 코드가 클립보드에 복사되었습니다.");
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                복사
              </button>
            </div>
          </div>

          {/* 그룹원 초대 */}
          {isOwner && (
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">
                이메일로 그룹원 초대
              </h4>
              <form onSubmit={handleInviteMember} className="flex">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="초대할 사용자의 이메일 주소"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
                <button
                  type="submit"
                  disabled={isInviting}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isInviting ? "초대 중..." : "초대"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* 그룹원 목록 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              그룹원 목록
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              그룹에 속한 모든 멤버 목록입니다.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {members.map((member) => (
                <li key={member.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.full_name || member.email}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <span>
                            {(member.full_name || member.email)
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.full_name || "이름 없음"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.role === "owner"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {member.role === "owner" ? "관리자" : "일반 멤버"}
                      </span>

                      {isOwner && member.id !== user?.id && (
                        <div className="ml-4 flex space-x-2">
                          <button
                            onClick={() => handleTransferOwnership(member.id)}
                            className="text-xs text-indigo-600 hover:text-indigo-900"
                          >
                            관리자 권한 이전
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-xs text-red-600 hover:text-red-900"
                          >
                            내보내기
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
