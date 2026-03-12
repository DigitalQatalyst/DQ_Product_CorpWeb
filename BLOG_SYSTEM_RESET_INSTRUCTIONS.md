# Fresh Blog System Reset Instructions

This document provides instructions for implementing a complete blog system reset with dedicated authors and blogs tables.

## Overview

This implementation provides:

- **Clean database schema** with dedicated tables for each media type
- **Dedicated authors table** for blog author management with profile information
- **Dedicated blogs table** with 1:1 relationship to media_items
- **Proper storage buckets** for author avatars and blog images
- **Complete views** for unified content access
- **Helper functions** for blog operations
- **RLS policies** for security
- **Sample data** for testing

## Files Created

1. `fresh_blog_system_reset.sql` - Complete SQL script to reset the database
2. `setup_blog_system.js` - Node.js script for setup (reference only)
3. `run_fresh_setup.sh` - Shell script for executing the setup
4. Updated `database.types.ts` - Updated TypeScript types for new schema

## Implementation Steps

### 1. Execute the Database Reset

**Note:** If you encounter errors during setup:
- **Foreign key constraint error** (`ERROR: 23503`): The script handles this by cleaning up storage objects before dropping buckets.
- **Policy already exists error** (`ERROR: 42710`): This has been fixed in the updated script with correct policy names.
- **Column specified more than once error** (`ERROR: 42701`): The script now properly drops all existing views, tables, and functions before recreating them to avoid conflicts.

The updated script handles these common issues automatically. If you're still having problems, you may need to manually clear the storage buckets from your Supabase dashboard first.

**Option A: Using Supabase Dashboard (Recommended)**
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy the entire content from `fresh_blog_system_reset.sql`
4. Execute the script to reset your database

**Option B: Using the Shell Script**
```bash
# Make sure you have the database connection string
export SUPABASE_DB_URL="your_database_connection_string"

# Run the setup script
./run_fresh_setup.sh
```

### 2. Update Your Application

The system will now have:

- **media_items** table (base table with common fields)
- **authors** table (with profile information)
- **blogs** table (with blog-specific fields, 1:1 with media_items)
- **Other media type tables** (articles, videos, podcasts, etc.)
- **Storage buckets** for media management
- **Views** for unified access (`v_media_all`, `v_media_public`, `v_media_with_authors`)
- **Helper functions** for operations

### 3. Verify the Setup

After execution, verify that:

1. All tables exist and have proper structure
2. Storage buckets are created (`author-avatars`, `blog-images`, `media-thumbnails`)
3. Views are accessible and return expected data
4. Sample authors are inserted
5. RPC functions are available

## Key Features

### Authors System
- Complete author profiles with avatars, social links, and biographies
- Storage bucket for author avatars
- Integration with blog posts

### Blog System
- Dedicated blogs table with 1:1 relationship to media_items
- Blog-specific fields (excerpt, focus keyword, related keywords, etc.)
- Hero image support separate from thumbnails
- Author linking

### Media Management
- Separate tables for each media type following the same pattern
- Storage buckets for different media types
- Views that combine all content types

## Database Schema

### Tables
- `media_items` - Base table with common fields
- `authors` - Author profiles
- `blogs` - Blog-specific content (1:1 with media_items)
- `articles`, `videos`, `podcasts`, `reports`, `tools`, `events` - Other media types
- Supporting tables for taxonomies, assets, submissions, etc.

### Views
- `v_media_all` - All content with author information
- `v_media_public` - Public published content
- `v_media_with_authors` - Content with author details

### Functions
- `create_blog_post()` - Create complete blog post
- `update_blog_post()` - Update blog post
- `create_author()` - Create author profile
- `create_media_item()` - Generic media creation
- `update_media_item()` - Generic media update

## Integration with Frontend

The frontend components should work with the new schema with minimal changes:

1. **MediaCreate.tsx** - Will work with the new blog system
2. **AuthorSelector.tsx** - Will access authors from the new table
3. **MediaList.tsx** - Will display content from the new views
4. **Database types** - Updated to match new schema

## Testing

After setup, you can:

1. Create authors using the author management interface
2. Create blog posts linking to authors
3. Upload media with proper storage buckets
4. Verify that all content types work correctly
5. Test the blog form end-to-end

## Rollback

If you need to rollback, you can run your previous migration scripts or restore from a backup before executing this reset.