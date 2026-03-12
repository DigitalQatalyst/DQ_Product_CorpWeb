-- Create function to sync user from Azure B2C to Supabase users table
-- This function handles auto-provisioning and updating user profiles on login

CREATE OR REPLACE FUNCTION sync_user_from_b2c(
  p_auth_user_id UUID,
  p_email TEXT,
  p_name TEXT,
  p_given_name TEXT DEFAULT NULL,
  p_family_name TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL
)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  role user_role,
  is_active BOOLEAN,
  created BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_created BOOLEAN := FALSE;
  v_role user_role;
BEGIN
  -- Check if user already exists
  SELECT u.id INTO v_user_id
  FROM users u
  WHERE u.auth_user_id = p_auth_user_id
  LIMIT 1;

  IF v_user_id IS NULL THEN
    -- User does not exist, create new user with 'viewer' role by default
    INSERT INTO users (
      auth_user_id,
      email,
      name,
      avatar_url,
      role,
      is_active,
      created_at,
      updated_at
    ) VALUES (
      p_auth_user_id,
      p_email,
      COALESCE(p_name, p_email),
      p_avatar_url,
      'viewer'::user_role,
      TRUE,
      NOW(),
      NOW()
    )
    RETURNING id INTO v_user_id;

    v_created := TRUE;
  ELSE
    -- User exists, update last_login_at and profile if avatar changed
    UPDATE users u
    SET
      last_login_at = NOW(),
      updated_at = NOW(),
      avatar_url = COALESCE(p_avatar_url, u.avatar_url),
      name = COALESCE(NULLIF(p_name, ''), u.name)
    WHERE u.id = v_user_id;
  END IF;

  -- Get the final role (use table alias to avoid ambiguity)
  SELECT u.role INTO v_role
  FROM users u
  WHERE u.id = v_user_id;

  -- Return the user info
  RETURN QUERY
  SELECT
    v_user_id AS user_id,
    p_email AS email,
    v_role AS role,
    u.is_active,
    v_created AS created
  FROM users u
  WHERE u.id = v_user_id;
END;
$$;

-- Create function to get user by auth_user_id
CREATE OR REPLACE FUNCTION get_user_by_auth_id(p_auth_user_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT,
  role user_role,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  last_login_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.id,
    u.email,
    u.name,
    u.role,
    u.title,
    u.bio,
    u.avatar_url,
    u.is_active,
    u.created_at,
    u.updated_at,
    u.last_login_at
  FROM users u
  WHERE u.auth_user_id = p_auth_user_id;
$$;

-- Create function to check if user has permission
CREATE OR REPLACE FUNCTION check_user_permission(
  p_auth_user_id UUID,
  p_resource TEXT,
  p_action TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT rp.can_perform
      FROM role_permissions rp
      JOIN users u ON u.role = rp.role
      WHERE u.auth_user_id = p_auth_user_id
        AND rp.resource = p_resource
        AND rp.action = p_action
      LIMIT 1
    ),
    FALSE
  );
$$;

-- Create function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions(p_auth_user_id UUID)
RETURNS TABLE (
  resource TEXT,
  action TEXT,
  can_perform BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    rp.resource,
    rp.action,
    rp.can_perform
  FROM role_permissions rp
  JOIN users u ON u.role = rp.role
  WHERE u.auth_user_id = p_auth_user_id;
$$;

COMMENT ON FUNCTION sync_user_from_b2c IS 'Auto-provision or update user from Azure B2C on first login';
COMMENT ON FUNCTION get_user_by_auth_id IS 'Retrieve user profile by auth_user_id';
COMMENT ON FUNCTION check_user_permission IS 'Check if user has specific permission';
COMMENT ON FUNCTION get_user_permissions IS 'Get all permissions for a user based on their role';
