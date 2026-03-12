-- Add Categories support to Blog System

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
CREATE POLICY "Public Read Access" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin All Access Categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- 4. Add category_id to blogs
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- 5. Seed initial categories
INSERT INTO public.categories (name, slug, description)
VALUES 
    ('Digital Transformation', 'digital-transformation', 'Insights on evolving business through technology.'),
    ('Technology & AI', 'technology-ai', 'The latest in AI, cloud, and emerging tech.'),
    ('Business Strategy', 'business-strategy', 'Strategic management and operational excellence.'),
    ('Leadership', 'leadership', 'Human-centric leadership in a digital age.'),
    ('Innovation', 'innovation', 'Creative problem-solving and disruptive ideas.')
ON CONFLICT (name) DO NOTHING;

-- 6. Update View to include category information
DROP VIEW IF EXISTS public.v_blogs_all;
CREATE VIEW public.v_blogs_all AS
SELECT 
    b.*,
    a.name as author_name,
    a.title as author_title,
    a.avatar as author_avatar,
    a.bio as author_bio,
    c.name as category_name,
    c.slug as category_slug
FROM public.blogs b
LEFT JOIN public.authors a ON b.author_id = a.id
LEFT JOIN public.categories c ON b.category_id = c.id;

-- 7. Add trigger for categories updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
