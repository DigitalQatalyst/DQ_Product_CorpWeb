-- Add avatar_url column to match form expectations
-- The form is still looking for 'avatar_url' column instead of 'avatar'

-- First, add the avatar_url column if it doesn't exist
DO $$
DECLARE
  col_exists INTEGER;
BEGIN
  SELECT count(*) INTO col_exists
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = 'authors'
    AND column_name = 'avatar_url';
  IF col_exists = 0 THEN
    ALTER TABLE public.authors ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- If the 'avatar' column exists (from previous schema), copy its data to avatar_url
DO $$
DECLARE
  avatar_col_exists INTEGER;
BEGIN
  SELECT count(*) INTO avatar_col_exists
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = 'authors'
    AND column_name = 'avatar';
  IF avatar_col_exists > 0 THEN
    UPDATE public.authors SET avatar_url = avatar WHERE avatar_url IS NULL AND avatar IS NOT NULL;
  END IF;
END $$;

-- Also update the views to include avatar_url for backward compatibility
DROP VIEW IF EXISTS public.v_media_all CASCADE;
DROP VIEW IF EXISTS public.v_media_public CASCADE;
DROP VIEW IF EXISTS public.v_media_with_authors CASCADE;

-- Recreate views with both avatar and avatar_url for compatibility
CREATE VIEW public.v_media_all AS
SELECT 
    b.id,
    b.slug,
    b.title,
    b.excerpt,
    b.content,
    b.hero_image,
    b.category,
    b.tags,
    b.publish_date,
    b.read_time,
    b.featured,
    b.status,
    b.created_at,
    b.updated_at,
    -- Author information with both column names for compatibility
    a.id AS author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.avatar AS author_avatar,
    a.avatar_url AS author_avatar_url,
    a.bio AS author_bio,
    a.linkedin_url AS author_linkedin_url,
    a.twitter_url AS author_twitter_url,
    a.website_url AS author_website_url,
    a.email AS author_email,
    a.is_active AS author_is_active,
    a.created_at AS author_created_at,
    a.updated_at AS author_updated_at
FROM public.blogs b
LEFT JOIN public.authors a ON b.author_id = a.id;

CREATE VIEW public.v_media_public AS
SELECT 
    b.id,
    b.slug,
    b.title,
    b.excerpt,
    b.content,
    b.hero_image,
    b.category,
    b.tags,
    b.publish_date,
    b.read_time,
    b.featured,
    b.status,
    b.created_at,
    b.updated_at,
    -- Author information with both column names for compatibility
    a.id AS author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.avatar AS author_avatar,
    a.avatar_url AS author_avatar_url,
    a.bio AS author_bio,
    a.linkedin_url AS author_linkedin_url,
    a.twitter_url AS author_twitter_url,
    a.website_url AS author_website_url,
    a.email AS author_email,
    a.is_active AS author_is_active
FROM public.blogs b
LEFT JOIN public.authors a ON b.author_id = a.id
WHERE b.status = 'Published' 
  AND a.is_active = TRUE;

CREATE VIEW public.v_media_with_authors AS
SELECT 
    b.id,
    b.slug,
    b.title,
    b.excerpt,
    b.content,
    b.hero_image,
    b.category,
    b.tags,
    b.publish_date,
    b.read_time,
    b.featured,
    b.status,
    b.created_at,
    b.updated_at,
    -- Author information with both column names for compatibility
    a.id AS author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.avatar AS author_avatar,
    a.avatar_url AS author_avatar_url,
    a.bio AS author_bio,
    a.linkedin_url AS author_linkedin_url,
    a.twitter_url AS author_twitter_url,
    a.website_url AS author_website_url,
    a.email AS author_email,
    a.is_active AS author_is_active
FROM public.blogs b
LEFT JOIN public.authors a ON b.author_id = a.id;

-- Grant permissions on the views
GRANT SELECT ON public.v_media_all TO authenticated, anon;
GRANT SELECT ON public.v_media_public TO authenticated, anon;
GRANT SELECT ON public.v_media_with_authors TO authenticated, anon;

-- Create a function that works with the form's expected column name
CREATE OR REPLACE FUNCTION public.create_author(
  p_name TEXT,
  p_title TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,  -- Using the form's expected parameter name
  p_bio TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_author_id UUID;
BEGIN
  INSERT INTO public.authors (
    name, title, avatar_url, bio  -- Using the form's expected column name
  ) VALUES (
    p_name, p_title, p_avatar_url, p_bio  -- Using the form's expected parameter name
  ) RETURNING id INTO v_author_id;
  
  RETURN v_author_id;
END;
$$;

-- Also create a function that populates both avatar and avatar_url for consistency
CREATE OR REPLACE FUNCTION public.create_author_with_avatar(
  p_name TEXT,
  p_title TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_author_id UUID;
BEGIN
  INSERT INTO public.authors (
    name, title, avatar, avatar_url, bio  -- Populate both for consistency
  ) VALUES (
    p_name, p_title, p_avatar_url, p_avatar_url, p_bio  -- Same value for both
  ) RETURNING id INTO v_author_id;
  
  RETURN v_author_id;
END;
$$;

-- Update existing records to populate avatar_url if they have avatar
UPDATE public.authors SET avatar_url = avatar WHERE avatar_url IS NULL AND avatar IS NOT NULL;

-- Verify the changes
SELECT 
  '✅ Authors table updated to include avatar_url column!' as status,
  (SELECT count(*) FROM information_schema.tables WHERE table_name = 'authors') as table_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'authors' AND column_name = 'avatar_url') as avatar_url_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'authors' AND column_name = 'avatar') as avatar_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'authors' AND column_name = 'name') as name_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'authors' AND column_name = 'bio') as bio_exists,
  (SELECT count(*) FROM pg_proc WHERE proname = 'create_author') as create_author_function_exists,
  (SELECT count(*) FROM public.authors) as total_authors;