-- Create storage bucket for author avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('author-avatars', 'author-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for author-avatars bucket
CREATE POLICY "Author avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'author-avatars');

CREATE POLICY "Authenticated users can upload author avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'author-avatars' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update author avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'author-avatars' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete author avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'author-avatars' 
    AND auth.role() = 'authenticated'
  );