-- =====================================================
-- CLEAN AUTHENTICATION SETUP
-- =====================================================
-- Simple, working authentication setup

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    email_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Create simple RLS policies
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

-- 5. Create trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
        'user'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = NEW.email,
        name = COALESCE(NEW.raw_user_meta_data->>'name', users.name),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- 7. Grant permissions
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT ON users TO anon;

-- 8. Test the setup
SELECT 'Testing setup...' as status;

-- Try to create a test user
INSERT INTO users (id, email, name, role)
VALUES (
    '00000000-0000-0000-0000-000000000001'::UUID,
    'test@example.com',
    'Test User',
    'user'
) ON CONFLICT (id) DO NOTHING;

-- Check if test worked
SELECT 
    COUNT(*) as test_user_count
FROM users 
WHERE email = 'test@example.com';

-- Clean up test
DELETE FROM users WHERE email = 'test@example.com';

SELECT 'Clean authentication setup complete!' as result;
