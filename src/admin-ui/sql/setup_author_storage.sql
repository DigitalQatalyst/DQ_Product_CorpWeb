-- Setup script for author avatar storage
-- Run this script to ensure proper storage bucket and RLS policies

-- Create storage bucket for author avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('author-avatars', 'author-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Author avatars are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload author avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update author avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete author avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on author avatars" ON storage.objects;

-- Create permissive RLS policies for storage (development-friendly)
CREATE POLICY "Author avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'author-avatars');

-- More permissive upload policy
CREATE POLICY "Allow all operations on author avatars" ON storage.objects
  FOR ALL 
  USING (bucket_id = 'author-avatars') 
  WITH CHECK (bucket_id = 'author-avatars');

-- Verify the bucket was created
SELECT id, name, public FROM storage.buckets WHERE id = 'author-avatars';

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%author%';

-- Success message
SELECT 'Storage bucket and policies set up successfully for author avatars.' as status;