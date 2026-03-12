-- Check if blogs table exists and has correct structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'blogs'
ORDER BY ordinal_position;

-- Check if RPC functions exist
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('create_media_item', 'update_media_item')
ORDER BY routine_name;

-- Check if authors table exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'authors'
ORDER BY ordinal_position;