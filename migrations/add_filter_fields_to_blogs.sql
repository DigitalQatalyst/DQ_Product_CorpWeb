-- Migration: Add Filter Fields to Blogs Table
-- Description: Adds filter columns to blogs table for marketplace filtering
-- Date: 2026-02-24
-- Safety: All columns are nullable with sensible defaults - NON-BREAKING

-- Step 1: Add filter columns to blogs table (nullable for backward compatibility)
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS digital_perspective TEXT,
ADD COLUMN IF NOT EXISTS digital_stream TEXT,
ADD COLUMN IF NOT EXISTS digital_domain TEXT,
ADD COLUMN IF NOT EXISTS digital_sector TEXT,
ADD COLUMN IF NOT EXISTS content_type TEXT,
ADD COLUMN IF NOT EXISTS format TEXT,
ADD COLUMN IF NOT EXISTS popularity TEXT;

-- Step 2: Add comments to document the columns
COMMENT ON COLUMN public.blogs.digital_perspective IS 'Single value from Digital Perspectives: D1-D6';
COMMENT ON COLUMN public.blogs.digital_stream IS 'Digital stream: Digital Front-End, Digital Core, or Digital Enablers';
COMMENT ON COLUMN public.blogs.digital_domain IS 'Digital domain under the selected stream';
COMMENT ON COLUMN public.blogs.digital_sector IS 'Single value from Digital Sectors (11 sectors)';
COMMENT ON COLUMN public.blogs.content_type IS 'Content type: Articles, Blogs, Whitepapers, Videos, Podcasts, etc.';
COMMENT ON COLUMN public.blogs.format IS 'Format: Quick Reads, In-Depth Reports, Interactive Tools, Recorded Media, Live Events';
COMMENT ON COLUMN public.blogs.popularity IS 'Popularity tag: Latest, Trending, Most Downloaded, Editors Pick';

-- Step 3: Create indices for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_digital_perspective ON public.blogs(digital_perspective);
CREATE INDEX IF NOT EXISTS idx_blogs_digital_stream ON public.blogs(digital_stream);
CREATE INDEX IF NOT EXISTS idx_blogs_digital_domain ON public.blogs(digital_domain);
CREATE INDEX IF NOT EXISTS idx_blogs_digital_sector ON public.blogs(digital_sector);
CREATE INDEX IF NOT EXISTS idx_blogs_content_type ON public.blogs(content_type);
CREATE INDEX IF NOT EXISTS idx_blogs_format ON public.blogs(format);
CREATE INDEX IF NOT EXISTS idx_blogs_popularity ON public.blogs(popularity);

-- Step 4: Create composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_blogs_filters_main ON public.blogs(content_type, digital_perspective, digital_sector);

-- Verification query (run this to check column creation)
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' AND table_name = 'blogs' 
-- AND column_name IN ('digital_perspective', 'digital_stream', 'digital_domain', 'digital_sector', 'content_type', 'format', 'popularity')
-- ORDER BY ordinal_position;
