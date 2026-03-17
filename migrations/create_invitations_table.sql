-- =====================================================
-- CREATE INVITATIONS TABLE
-- =====================================================
-- This creates the invitations table for user invitations

-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'hr', 'editor')),
    token TEXT NOT NULL UNIQUE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    accepted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_created_by ON invitations(created_by);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
CREATE INDEX IF NOT EXISTS idx_invitations_expires_at ON invitations(expires_at);

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own invitations" ON invitations;
DROP POLICY IF EXISTS "Admins can manage all invitations" ON invitations;

-- Create RLS policies
CREATE POLICY "Users can view own invitations"
  ON invitations
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid()::text);

CREATE POLICY "Users can create invitations"
  ON invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid()::text);

CREATE POLICY "Admins can view all invitations"
  ON invitations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
        WHERE id = auth.uid()::text 
        AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all invitations"
  ON invitations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
        WHERE id = auth.uid()::text 
        AND role = 'admin'
    )
  );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON invitations TO authenticated;

-- Create function to cleanup expired invitations
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS void AS $$
BEGIN
    DELETE FROM public.invitations 
    WHERE expires_at < NOW() 
    AND status = 'pending';
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-cleanup expired invitations
DROP TRIGGER IF EXISTS trigger_cleanup_expired_invitations ON invitations;
CREATE TRIGGER trigger_cleanup_expired_invitations
    AFTER INSERT OR UPDATE ON invitations
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_expired_invitations();

-- Comments for documentation
COMMENT ON TABLE invitations IS 'User invitation system with role-based access';
COMMENT ON COLUMN invitations.role IS 'User role: user, admin, hr, editor';
COMMENT ON COLUMN invitations.token IS 'Unique invitation token';
COMMENT ON COLUMN invitations.status IS 'Invitation status: pending, accepted, expired';

-- Test the setup
SELECT 'Invitations table created successfully!' as result;
