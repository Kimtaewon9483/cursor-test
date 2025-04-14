-- family_groups 테이블 생성
CREATE TABLE IF NOT EXISTS family_groups (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  members UUID[] NOT NULL DEFAULT '{}',
  invite_code TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::TEXT
);

-- 사용자 프로필 테이블 생성
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  birth_date DATE
);

-- 사용자 프로필 검색을 위한 정책 추가 (그룹원 확인 시 필요)
CREATE POLICY "모든 사용자는 다른 사용자의 프로필을 볼 수 있음" ON profiles 
  FOR SELECT USING (true);

-- profiles 테이블의 유니크 제약 조건 추가 및 수정
-- 다른 사용자 사이의 이메일 중복 방지
ALTER TABLE IF EXISTS profiles 
  DROP CONSTRAINT IF EXISTS profiles_email_key;

-- 프로필 생성 시 보다 안전한 중복 체크 로직
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_profile_count INTEGER;
BEGIN
  -- 해당 사용자 ID의 프로필이 이미 존재하는지 명시적으로 확인
  SELECT COUNT(*) INTO existing_profile_count FROM profiles WHERE id = NEW.id;
  
  IF existing_profile_count = 0 THEN
    INSERT INTO profiles (
      id, 
      email, 
      full_name,
      avatar_url
    )
    VALUES (
      NEW.id, 
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
    );
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- 중복 키 에러가 발생하더라도 계속 진행
    RETURN NEW;
  WHEN OTHERS THEN
    -- 다른 에러는 로그를 남기고 계속 진행
    RAISE WARNING 'Error in create_profile_for_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 기존 트리거 삭제 (에러 방지)
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;

-- 사용자 가입 트리거
CREATE TRIGGER create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_profile_for_user();

-- 사용자 이메일 변경 시 프로필 이메일도 업데이트
CREATE OR REPLACE FUNCTION update_profile_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET email = NEW.email, updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 기존 트리거 삭제 (에러 방지)
DROP TRIGGER IF EXISTS update_profile_email_on_change ON auth.users;

-- 이메일 변경 트리거
CREATE TRIGGER update_profile_email_on_change
AFTER UPDATE OF email ON auth.users
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email)
EXECUTE FUNCTION update_profile_email();

-- profiles RLS 정책 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "사용자는 자신의 프로필을 볼 수 있음" ON profiles;
DROP POLICY IF EXISTS "모든 사용자는 다른 사용자의 프로필을 볼 수 있음" ON profiles;

-- 프로필 읽기 정책 (모든 사용자가 모든 프로필 읽기 가능)
CREATE POLICY "모든 사용자는 모든 프로필 읽기 가능" ON profiles 
  FOR SELECT USING (true);

-- 자신의 프로필만 수정 가능
CREATE POLICY "사용자는 자신의 프로필만 수정 가능" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

-- family_groups RLS 정책 설정: 그룹은 멤버만 볼 수 있음
ALTER TABLE family_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "공개 그룹 생성 가능" ON family_groups FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "멤버만 그룹 읽기 가능" ON family_groups 
  FOR SELECT USING (
    auth.uid() = owner_id OR 
    auth.uid() = ANY(members)
  );

CREATE POLICY "소유자만 그룹 수정 가능" ON family_groups 
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "소유자만 그룹 삭제 가능" ON family_groups 
  FOR DELETE USING (auth.uid() = owner_id);

-- 멤버 업데이트는 별도 정책 필요
CREATE POLICY "멤버는 자신을 그룹에서 제거 가능" ON family_groups
  FOR UPDATE USING (auth.uid() = ANY(members))
  WITH CHECK (auth.uid() = ANY(members));

-- 함수: 새 그룹 생성 시 invite_code 자동 생성
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invite_code = substr(md5(random()::text), 0, 8);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 기존 트리거 삭제 (에러 방지)
DROP TRIGGER IF EXISTS generate_invite_code_trigger ON family_groups;

CREATE TRIGGER generate_invite_code_trigger
BEFORE INSERT ON family_groups
FOR EACH ROW
EXECUTE FUNCTION generate_invite_code();

-- 인덱스 설정
CREATE INDEX IF NOT EXISTS family_groups_owner_id_idx ON family_groups(owner_id);
CREATE INDEX IF NOT EXISTS family_groups_invite_code_idx ON family_groups(invite_code);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- 함수: 멤버 추가
CREATE OR REPLACE FUNCTION add_group_member(group_id BIGINT, user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE family_groups
  SET members = array_append(members, user_id)
  WHERE id = group_id AND NOT (user_id = ANY(members));
END;
$$ LANGUAGE plpgsql;

-- 함수: 멤버 제거
CREATE OR REPLACE FUNCTION remove_group_member(group_id BIGINT, user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE family_groups
  SET members = array_remove(members, user_id)
  WHERE id = group_id AND user_id = ANY(members) AND user_id != owner_id;
END;
$$ LANGUAGE plpgsql;

-- 이메일 검색을 위한 특별 함수 추가
CREATE OR REPLACE FUNCTION get_profile_by_email(search_email TEXT)
RETURNS SETOF profiles AS $$
BEGIN
  RETURN QUERY SELECT * FROM profiles WHERE email = search_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 