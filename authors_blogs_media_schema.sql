-- Authors, Blogs and Media Schema
-- Maintains existing media_items table while adding dedicated authors and blogs tables

-- Drop the new tables if they exist (from previous attempts)
DROP TABLE IF EXISTS blog_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

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

-- Create blogs table with reference to both authors and media_items
CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_item_id UUID REFERENCES media_items(id) ON DELETE CASCADE,
    author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
    excerpt TEXT, -- blog-specific excerpt
    focus_keyword VARCHAR(255), -- SEO focus keyword
    related_keywords TEXT[], -- related SEO keywords
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_blogs_media_item_id ON blogs(media_item_id);
CREATE INDEX idx_blogs_author_id ON blogs(author_id);
CREATE INDEX idx_authors_email ON authors(email);
CREATE INDEX idx_authors_active ON authors(is_active);

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

-- Create a view to join media_items with authors and blogs for easy fetching
CREATE VIEW v_media_with_authors AS
SELECT 
    mi.id,
    mi.slug,
    mi.title,
    mi.summary,
    mi.body_html,
    mi.body_json,
    mi.type,
    mi.category,
    mi.status,
    mi.visibility,
    mi.language,
    mi.published_at,
    mi.created_at,
    mi.updated_at,
    mi.seo_title,
    mi.seo_description,
    mi.canonical_url,
    mi.tags,
    mi.thumbnail_url,
    mi.hero_image,
    mi.featured,
    mi.read_time,
    mi.highlights,
    -- Blog-specific fields
    b.excerpt,
    b.focus_keyword,
    b.related_keywords,
    -- Author information
    a.id AS author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.bio AS author_bio,
    a.avatar_url AS author_avatar,
    a.social_links AS author_social_links
FROM media_items mi
LEFT JOIN blogs b ON mi.id = b.media_item_id
LEFT JOIN authors a ON b.author_id = a.id
WHERE mi.type = 'Blog';

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

-- Create a function to create a blog entry that links to a media_item
CREATE OR REPLACE FUNCTION create_blog_entry(
    p_media_item_id UUID,
    p_author_id UUID DEFAULT NULL,
    p_excerpt TEXT DEFAULT NULL,
    p_focus_keyword VARCHAR DEFAULT NULL,
    p_related_keywords TEXT[] DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    new_blog_id UUID;
BEGIN
    INSERT INTO blogs (
        media_item_id, author_id, excerpt, focus_keyword, related_keywords
    ) VALUES (
        p_media_item_id, p_author_id, p_excerpt, p_focus_keyword, p_related_keywords
    )
    RETURNING id INTO new_blog_id;
    
    RETURN new_blog_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update a blog entry
CREATE OR REPLACE FUNCTION update_blog_entry(
    p_media_item_id UUID,
    p_author_id UUID DEFAULT NULL,
    p_excerpt TEXT DEFAULT NULL,
    p_focus_keyword VARCHAR DEFAULT NULL,
    p_related_keywords TEXT[] DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO blogs (
        media_item_id, author_id, excerpt, focus_keyword, related_keywords
    ) VALUES (
        p_media_item_id, p_author_id, p_excerpt, p_focus_keyword, p_related_keywords
    )
    ON CONFLICT (media_item_id) 
    DO UPDATE SET
        author_id = COALESCE(p_author_id, blogs.author_id),
        excerpt = COALESCE(p_excerpt, blogs.excerpt),
        focus_keyword = COALESCE(p_focus_keyword, blogs.focus_keyword),
        related_keywords = COALESCE(p_related_keywords, blogs.related_keywords),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Insert sample author data
INSERT INTO authors (name, email, title, bio, avatar_url, is_active) VALUES
('Dr. Stéphane Niango', 'stephane.niango@digitalqatalyst.com', 'Expert in Digital Cognitive Organizations & Strategic Transformation', 'Dr. Niango is a globally recognized Digital Transformation Architect and Founder of DigitalQatalyst, specializing in the evolution of Digital Cognitive Organizations and AI-driven strategic transformation.', '/images/Stephane_Avatar.png', TRUE),
('Kaylynn Océanne', 'kaylynn.oceanne@digitalqatalyst.com', 'Content Engagement Strategist | Research Analyst', 'Kaylynn is a Content Engagement Strategist at DigitalQatalyst, specializing in the design of underlying systems that make content coherent, engaging, and repeatable at scale.', '/images/Kaylynn_Avatar.png', TRUE);

-- Create a function to get all active authors
CREATE OR REPLACE FUNCTION get_active_authors()
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    email VARCHAR,
    title VARCHAR,
    bio TEXT,
    avatar_url TEXT,
    social_links JSONB,
    is_guest BOOLEAN,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT a.id, a.name, a.email, a.title, a.bio, a.avatar_url, 
           a.social_links, a.is_guest, a.is_active, a.created_at, a.updated_at
    FROM authors a
    WHERE a.is_active = TRUE
    ORDER BY a.name;
END;
$$ LANGUAGE plpgsql;