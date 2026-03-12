-- Fix for COALESCE types text and jsonb cannot be matched error

-- Fix in update_media_item function
-- Change line that contains:
-- body_json = COALESCE(_base->>'body_json', body_json)::jsonb,
-- To:
-- body_json = COALESCE((_base->'body_json')::jsonb, body_json),

-- Fix in create_media_item function  
-- Change line that contains:
-- COALESCE(_base->>'body_json', '{}')::jsonb,
-- To:
-- COALESCE((_base->'body_json')::jsonb, '{}')::jsonb,

-- Also fix potential issues with boolean and timestamp conversions by wrapping values in parentheses:
-- Change lines containing:
-- WHEN _base ? 'published_at' AND _base->>'published_at' IS NOT NULL AND _base->>'published_at' != ''
-- To:
-- WHEN _base ? 'published_at' AND (_base->>'published_at') IS NOT NULL AND (_base->>'published_at') != ''

-- These fixes address the "COALESCE types text and jsonb cannot be matched" error that occurs
-- when publishing content by ensuring proper type handling in PostgreSQL functions.

-- To apply these fixes, update the complete_blog_authors_reset.sql file with these corrections
-- and re-run the database reset.