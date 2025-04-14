export interface FamilyGroup {
  id: number;
  created_at: string;
  name: string;
  description: string;
  owner_id: string;
  members: string[];
  invite_code: string;
}

export interface GroupMember {
  id: string;
  email: string;
  full_name: string | null;
  name?: string;
  avatar_url?: string;
  role: "owner" | "member";
}

export interface CreateGroupRequest {
  name: string;
  description: string;
}

export interface JoinGroupRequest {
  inviteCode: string;
}
