-- Test script to verify database fixes work
-- Run this in Supabase SQL Editor after applying migrations

-- 1. Check if trigger exists and is properly configured
SELECT 
  'Trigger Check' as test_name,
  CASE 
    WHEN tgname IS NOT NULL THEN '✅ PASS - Trigger exists'
    ELSE '❌ FAIL - Trigger missing'
  END as result
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 2. Check if function exists with SECURITY DEFINER
SELECT 
  'Function Security' as test_name,
  CASE 
    WHEN prosecdef THEN '✅ PASS - Function has SECURITY DEFINER'
    ELSE '❌ FAIL - Function missing SECURITY DEFINER'
  END as result
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 3. Check if policies exist with trigger exceptions
SELECT 
  policyname as policy_name,
  CASE 
    WHEN policyname LIKE '%trigger%' OR policyname LIKE '%exception%' THEN '✅ Trigger-safe'
    ELSE '⚠️ May block trigger'
  END as trigger_safe
FROM pg_policies 
WHERE tablename = 'profiles' AND cmd IN ('INSERT', 'UPDATE');

-- 4. Test trigger manually (safe test)
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
  test_email TEXT := 'test-' || extract(epoch from now())::text || '@example.com';
  profile_created BOOLEAN := FALSE;
  profile_updated BOOLEAN := FALSE;
BEGIN
  RAISE NOTICE '🧪 Testing trigger function...';
  
  -- Simulate user creation
  INSERT INTO auth.users (id, email, raw_user_meta_data, email_confirmed_at)
  VALUES (
    test_user_id,
    test_email,
    '{"first_name": "Test", "last_name": "User"}',
    NOW()
  );
  
  -- Check if profile was created
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = test_user_id) INTO profile_created;
  
  -- Check if email verification was set
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = test_user_id AND email_verified = true) INTO profile_updated;
  
  -- Report results
  IF profile_created AND profile_updated THEN
    RAISE NOTICE '✅ SUCCESS: Trigger working correctly';
  ELSIF profile_created THEN
    RAISE NOTICE '⚠️ PARTIAL: Profile created but email verification failed';
  ELSE
    RAISE NOTICE '❌ FAILED: Profile not created';
  END IF;
  
  -- Clean up test data
  DELETE FROM profiles WHERE id = test_user_id;
  DELETE FROM auth.users WHERE id = test_user_id;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ ERROR: %', SQLERRM;
    -- Clean up on error
    DELETE FROM profiles WHERE id = test_user_id;
    DELETE FROM auth.users WHERE id = test_user_id;
END $$;

-- 5. Check final setup
SELECT 
  'Setup Summary' as info,
  'Run all tests above to verify authentication system' as recommendation;

-- Instructions
SELECT 
  'Next Steps' as action,
  '1. Apply migrations 016 and 017' as step1,
  '2. Run this test script' as step2,
  '3. Test signup in browser' as step3;
