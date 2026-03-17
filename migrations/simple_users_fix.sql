-- =====================================================
-- SIMPLE USERS TABLE - FIX REGISTRATION ISSUES
-- =====================================================
-- This creates a minimal users table to fix registration errors

-- Drop existing table if it has issues
DROP TABLE IF EXISTS users CASCADE;

-- Create simple users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    email_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create basic indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Simple RLS policy
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create simple policies
CREATE POLICY "Users can view own profile"
    ON users
    FOR SELECT
    TO authenticated
    USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile"
    ON users
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile"
    ON users
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

-- Create trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
        'user'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = NEW.email,
        name = COALESCE(NEW.raw_user_meta_data->>'name', users.name),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;

-- Test insertion
SELECT 'Testing simple user creation...' as status;

-- This should work now
SELECT 'Simple users table created successfully!' as result;
