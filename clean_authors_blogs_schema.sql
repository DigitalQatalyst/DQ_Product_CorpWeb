-- Clean Authors and Blogs Schema
-- Drops all existing tables and creates a clean schema with dedicated tables for authors and blogs

-- Drop all existing tables if they exist
DROP TABLE IF EXISTS blog_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS media_items CASCADE;
DROP TABLE IF EXISTS media_assets CASCADE;
DROP TABLE IF EXISTS taxonomies CASCADE;
DROP TABLE IF EXISTS media_taxonomies CASCADE;
DROP TABLE IF EXISTS content_submissions CASCADE;
DROP TABLE IF EXISTS author_profiles CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create authors table
CREATE TABLE authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    title VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    social_links JSONB,
    is_guest BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for authors
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Create blogs table
CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT,
    body_html TEXT,
    body_json JSONB,
    author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
    category VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'InReview', 'Scheduled', 'Published', 'Archived')),
    visibility VARCHAR(10) DEFAULT 'Public' CHECK (visibility IN ('Public', 'Private', 'Unlisted')),
    language VARCHAR(10) DEFAULT 'en',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    seo_title VARCHAR(600),
    seo_description TEXT,
    canonical_url TEXT,
    tags TEXT[],
    thumbnail_url TEXT,
    hero_image TEXT,
    featured BOOLEAN DEFAULT FALSE,
    read_time INTEGER, -- estimated read time in minutes
    highlights TEXT, -- key highlights from the blog
    excerpt TEXT, -- blog-specific excerpt
    focus_keyword VARCHAR(255), -- SEO focus keyword
    related_keywords TEXT[] -- related SEO keywords
);

-- Enable Row Level Security (RLS) for blogs
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_author_id ON blogs(author_id);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_published_at ON blogs(published_at);
CREATE INDEX idx_blogs_category ON blogs(category);
CREATE INDEX idx_blogs_featured ON blogs(featured);
CREATE INDEX idx_authors_email ON authors(email);
CREATE INDEX idx_authors_active ON authors(is_active);

-- Create RLS policies for authors
CREATE POLICY "Authors are viewable by everyone" ON authors
    FOR SELECT USING (TRUE);

CREATE POLICY "Authors can be inserted by authenticated users" ON authors
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can be updated by authenticated users" ON authors
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authors can be deleted by authenticated users" ON authors
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for blogs
CREATE POLICY "Blogs are viewable by everyone" ON blogs
    FOR SELECT USING (
        (visibility = 'Public') OR
        (auth.role() = 'authenticated' AND visibility IN ('Public', 'Private', 'Unlisted'))
    );

CREATE POLICY "Blogs can be inserted by authenticated users" ON blogs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own blogs" ON blogs
    FOR UPDATE USING (auth.uid() = author_id OR auth.role() = 'service_role');

CREATE POLICY "Users can delete their own blogs" ON blogs
    FOR DELETE USING (auth.uid() = author_id OR auth.role() = 'service_role');

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach the trigger to the authors table
CREATE TRIGGER update_authors_updated_at 
    BEFORE UPDATE ON authors 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Attach the trigger to the blogs table
CREATE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON blogs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view to join blogs with authors for easy fetching
CREATE VIEW v_blogs_with_authors AS
SELECT 
    b.id,
    b.slug,
    b.title,
    b.summary,
    b.content,
    b.body_html,
    b.body_json,
    b.author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.bio AS author_bio,
    a.avatar_url AS author_avatar,
    a.social_links AS author_social_links,
    b.category,
    b.status,
    b.visibility,
    b.language,
    b.published_at,
    b.created_at,
    b.updated_at,
    b.seo_title,
    b.seo_description,
    b.canonical_url,
    b.tags,
    b.thumbnail_url,
    b.hero_image,
    b.featured,
    b.read_time,
    b.highlights,
    b.excerpt,
    b.focus_keyword,
    b.related_keywords
FROM blogs b
LEFT JOIN authors a ON b.author_id = a.id;

-- Insert sample author data
INSERT INTO authors (name, email, title, bio, avatar_url, is_active) VALUES
('Dr. Stéphane Niango', 'stephane.niango@digitalqatalyst.com', 'Expert in Digital Cognitive Organizations & Strategic Transformation', 'Dr. Niango is a globally recognized Digital Transformation Architect and Founder of DigitalQatalyst, specializing in the evolution of Digital Cognitive Organizations and AI-driven strategic transformation.', '/images/Stephane_Avatar.png', TRUE),
('Kaylynn Océanne', 'kaylynn.oceanne@digitalqatalyst.com', 'Content Engagement Strategist | Research Analyst', 'Kaylynn is a Content Engagement Strategist at DigitalQatalyst, specializing in the design of underlying systems that make content coherent, engaging, and repeatable at scale.', '/images/Kaylynn_Avatar.png', TRUE);

-- Insert sample blog data
INSERT INTO blogs (
    slug, 
    title, 
    summary, 
    content, 
    author_id, 
    category, 
    status, 
    visibility, 
    published_at, 
    seo_title, 
    seo_description, 
    tags, 
    thumbnail_url, 
    hero_image, 
    featured, 
    read_time, 
    excerpt,
    focus_keyword,
    related_keywords
) VALUES 
(
    'digital-transformation-in-post-pandemic-era',
    'Digital Transformation in the Post-Pandemic Era',
    'Exploring how businesses have adapted to the new digital landscape post-pandemic',
    '<p>The pandemic has accelerated digital transformation initiatives across industries...</p>',
    (SELECT id FROM authors WHERE email = 'stephane.niango@digitalqatalyst.com'),
    'Digital Transformation',
    'Published',
    'Public',
    NOW() - INTERVAL '2 days',
    'Digital Transformation in the Post-Pandemic Era',
    'Exploring how businesses have adapted to the new digital landscape post-pandemic',
    ARRAY['digital transformation', 'post-pandemic', 'business strategy'],
    '/images/blog-thumbnail-1.jpg',
    '/images/blog-hero-1.jpg',
    TRUE,
    8,
    'An analysis of how organizations have pivoted their digital strategies following the global pandemic.',
    'digital transformation',
    ARRAY['digital strategy', 'remote work', 'cloud computing']
),
(
    'ai-and-business-process-optimization',
    'AI and Business Process Optimization',
    'How artificial intelligence is revolutionizing traditional business processes',
    '<p>Artificial Intelligence continues to reshape how businesses operate...</p>',
    (SELECT id FROM authors WHERE email = 'kaylynn.oceanne@digitalqatalyst.com'),
    'AI Ethics',
    'Published',
    'Public',
    NOW() - INTERVAL '1 day',
    'AI and Business Process Optimization',
    'How artificial intelligence is revolutionizing traditional business processes',
    ARRAY['AI', 'automation', 'process optimization'],
    '/images/blog-thumbnail-2.jpg',
    '/images/blog-hero-2.jpg',
    FALSE,
    10,
    'Discover how AI technologies are streamlining operations and increasing efficiency across industries.',
    'AI optimization',
    ARRAY['artificial intelligence', 'machine learning', 'automation']
);

-- Create a function to create a new blog with author
CREATE OR REPLACE FUNCTION create_blog(
    p_slug VARCHAR,
    p_title VARCHAR,
    p_summary TEXT,
    p_content TEXT,
    p_author_id UUID,
    p_category VARCHAR DEFAULT NULL,
    p_status VARCHAR DEFAULT 'Draft',
    p_visibility VARCHAR DEFAULT 'Public',
    p_language VARCHAR DEFAULT 'en',
    p_published_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_seo_title VARCHAR DEFAULT NULL,
    p_seo_description TEXT DEFAULT NULL,
    p_canonical_url TEXT DEFAULT NULL,
    p_tags TEXT[] DEFAULT '{}',
    p_thumbnail_url TEXT DEFAULT NULL,
    p_hero_image TEXT DEFAULT NULL,
    p_featured BOOLEAN DEFAULT FALSE,
    p_read_time INTEGER DEFAULT NULL,
    p_highlights TEXT DEFAULT NULL,
    p_excerpt TEXT DEFAULT NULL,
    p_focus_keyword VARCHAR DEFAULT NULL,
    p_related_keywords TEXT[] DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    new_blog_id UUID;
BEGIN
    INSERT INTO blogs (
        slug, title, summary, content, author_id, category, status, 
        visibility, language, published_at, seo_title, seo_description, 
        canonical_url, tags, thumbnail_url, hero_image, featured, 
        read_time, highlights, excerpt, focus_keyword, related_keywords
    ) VALUES (
        p_slug, p_title, p_summary, p_content, p_author_id, p_category, p_status,
        p_visibility, p_language, p_published_at, p_seo_title, p_seo_description,
        p_canonical_url, p_tags, p_thumbnail_url, p_hero_image, p_featured,
        p_read_time, p_highlights, p_excerpt, p_focus_keyword, p_related_keywords
    )
    RETURNING id INTO new_blog_id;
    
    RETURN new_blog_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update a blog
CREATE OR REPLACE FUNCTION update_blog(
    p_blog_id UUID,
    p_slug VARCHAR DEFAULT NULL,
    p_title VARCHAR DEFAULT NULL,
    p_summary TEXT DEFAULT NULL,
    p_content TEXT DEFAULT NULL,
    p_author_id UUID DEFAULT NULL,
    p_category VARCHAR DEFAULT NULL,
    p_status VARCHAR DEFAULT NULL,
    p_visibility VARCHAR DEFAULT NULL,
    p_language VARCHAR DEFAULT NULL,
    p_published_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_seo_title VARCHAR DEFAULT NULL,
    p_seo_description TEXT DEFAULT NULL,
    p_canonical_url TEXT DEFAULT NULL,
    p_tags TEXT[] DEFAULT NULL,
    p_thumbnail_url TEXT DEFAULT NULL,
    p_hero_image TEXT DEFAULT NULL,
    p_featured BOOLEAN DEFAULT NULL,
    p_read_time INTEGER DEFAULT NULL,
    p_highlights TEXT DEFAULT NULL,
    p_excerpt TEXT DEFAULT NULL,
    p_focus_keyword VARCHAR DEFAULT NULL,
    p_related_keywords TEXT[] DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE blogs SET
        slug = COALESCE(p_slug, slug),
        title = COALESCE(p_title, title),
        summary = COALESCE(p_summary, summary),
        content = COALESCE(p_content, content),
        author_id = COALESCE(p_author_id, author_id),
        category = COALESCE(p_category, category),
        status = COALESCE(p_status, status),
        visibility = COALESCE(p_visibility, visibility),
        language = COALESCE(p_language, language),
        published_at = COALESCE(p_published_at, published_at),
        seo_title = COALESCE(p_seo_title, seo_title),
        seo_description = COALESCE(p_seo_description, seo_description),
        canonical_url = COALESCE(p_canonical_url, canonical_url),
        tags = COALESCE(p_tags, tags),
        thumbnail_url = COALESCE(p_thumbnail_url, thumbnail_url),
        hero_image = COALESCE(p_hero_image, hero_image),
        featured = COALESCE(p_featured, featured),
        read_time = COALESCE(p_read_time, read_time),
        highlights = COALESCE(p_highlights, highlights),
        excerpt = COALESCE(p_excerpt, excerpt),
        focus_keyword = COALESCE(p_focus_keyword, focus_keyword),
        related_keywords = COALESCE(p_related_keywords, related_keywords),
        updated_at = NOW()
    WHERE id = p_blog_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to create a new author
CREATE OR REPLACE FUNCTION create_author(
    p_name VARCHAR,
    p_email VARCHAR DEFAULT NULL,
    p_title VARCHAR DEFAULT NULL,
    p_bio TEXT DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL,
    p_social_links JSONB DEFAULT NULL,
    p_is_guest BOOLEAN DEFAULT FALSE,
    p_is_active BOOLEAN DEFAULT TRUE
) RETURNS UUID AS $$
DECLARE
    new_author_id UUID;
BEGIN
    INSERT INTO authors (
        name, email, title, bio, avatar_url, social_links, 
        is_guest, is_active
    ) VALUES (
        p_name, p_email, p_title, p_bio, p_avatar_url, 
        p_social_links, p_is_guest, p_is_active
    )
    RETURNING id INTO new_author_id;
    
    RETURN new_author_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update an author
CREATE OR REPLACE FUNCTION update_author(
    p_author_id UUID,
    p_name VARCHAR DEFAULT NULL,
    p_email VARCHAR DEFAULT NULL,
    p_title VARCHAR DEFAULT NULL,
    p_bio TEXT DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL,
    p_social_links JSONB DEFAULT NULL,
    p_is_guest BOOLEAN DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE authors SET
        name = COALESCE(p_name, name),
        email = COALESCE(p_email, email),
        title = COALESCE(p_title, title),
        bio = COALESCE(p_bio, bio),
        avatar_url = COALESCE(p_avatar_url, avatar_url),
        social_links = COALESCE(p_social_links, social_links),
        is_guest = COALESCE(p_is_guest, is_guest),
        is_active = COALESCE(p_is_active, is_active),
        updated_at = NOW()
    WHERE id = p_author_id;
END;
$$ LANGUAGE plpgsql;