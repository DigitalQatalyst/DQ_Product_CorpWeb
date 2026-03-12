-- Configure RLS policies for media_items table to allow service role access
-- First, disable RLS temporarily to make changes
ALTER TABLE public.media_items DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations for service role" ON public.media_items;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.media_items;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.media_items;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.media_items;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.media_items;

-- Create new policies
CREATE POLICY "Allow all operations for service role" ON public.media_items
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.media_items
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.media_items
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.media_items
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.media_items
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Re-enable RLS
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Configure RLS policies for blogs table
ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations for service role on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Enable read access for all users on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Enable insert for authenticated users on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Enable update for authenticated users on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Enable delete for authenticated users on blogs" ON public.blogs;

-- Create new policies
CREATE POLICY "Allow all operations for service role on blogs" ON public.blogs
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users on blogs" ON public.blogs
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users on blogs" ON public.blogs
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users on blogs" ON public.blogs
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users on blogs" ON public.blogs
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Re-enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Configure RLS policies for articles table
ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations for service role on articles" ON public.articles;
DROP POLICY IF EXISTS "Enable read access for all users on articles" ON public.articles;
DROP POLICY IF EXISTS "Enable insert for authenticated users on articles" ON public.articles;
DROP POLICY IF EXISTS "Enable update for authenticated users on articles" ON public.articles;
DROP POLICY IF EXISTS "Enable delete for authenticated users on articles" ON public.articles;

-- Create new policies
CREATE POLICY "Allow all operations for service role on articles" ON public.articles
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users on articles" ON public.articles
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users on articles" ON public.articles
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users on articles" ON public.articles
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users on articles" ON public.articles
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Re-enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to service_role and authenticated roles
GRANT ALL PRIVILEGES ON TABLE public.media_items TO service_role, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.blogs TO service_role, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.articles TO service_role, authenticated;

-- Also grant permissions on sequences if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media_items' AND column_default LIKE '%nextval%') THEN
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role, authenticated;
  END IF;
END $$;

-- Grant execute permissions on RPC functions
GRANT EXECUTE ON FUNCTION public.create_media_item(JSONB, TEXT, JSONB) TO service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.update_media_item(UUID, JSONB, TEXT, JSONB) TO service_role, authenticated;

-- Make sure the functions are owned by the service_role or public
ALTER FUNCTION public.create_media_item(JSONB, TEXT, JSONB) OWNER TO postgres;
ALTER FUNCTION public.update_media_item(UUID, JSONB, TEXT, JSONB) OWNER TO postgres;