-- Set up storage configuration for author avatars

-- Create the storage bucket for author avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, owner, public, file_size_limit, allowed_mime_types)
VALUES ('author-avatars', 'author-avatars', NULL, true, 5242880, '{image/png,image/jpeg,image/gif,image/webp}')
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the author-avatars bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access on author avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload author avatars" ON storage.objects;

-- Create policies for author-avatars bucket specifically
CREATE POLICY "Allow public read access on author avatars" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'author-avatars');

CREATE POLICY "Allow authenticated users to upload author avatars" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'author-avatars');

CREATE POLICY "Allow authenticated users to update author avatars" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'author-avatars');

CREATE POLICY "Allow authenticated users to delete author avatars" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'author-avatars');

-- Grant necessary permissions to service_role for storage
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.buckets TO service_role;

-- Verify the bucket was created
SELECT id, name, public FROM storage.buckets WHERE id = 'author-avatars';

-- Show current policies
SELECT policyname, tablename, roles FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
