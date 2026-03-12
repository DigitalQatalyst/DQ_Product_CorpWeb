# Two-Step Database Setup: Clean and Fresh Setup

This document provides instructions for completely resetting your database using two separate scripts - first cleaning everything, then setting up the fresh blog and author system.

## Overview

This two-step approach ensures a completely clean slate by:
1. **Step 1**: Removing ALL existing database objects (tables, views, functions, storage)
2. **Step 2**: Creating a fresh blog and author system from scratch

## Files Created

1. `clean_database_completely.sql` - Script to completely remove all database objects
2. `setup_blog_author_system.sql` - Script to create fresh blog and author system
3. This instruction file

## Step-by-Step Instructions

### Step 1: Clean Database Completely

**Run the clean script first:**

```bash
# Execute in your Supabase SQL Editor or via psql
psql "your_database_url" -f clean_database_completely.sql
```

Or copy and paste the contents of `clean_database_completely.sql` into your Supabase SQL Editor and execute.

**What this script does:**
- Drops all views (with CASCADE to handle dependencies)
- Drops all functions and procedures
- Drops all tables in the correct order (child tables first, then parent tables)
- Removes all storage policies and buckets
- Deletes all stored objects
- Removes any custom types
- Verifies that everything is cleaned up

### Step 2: Set Up Fresh Blog and Author System

**Run the setup script after cleaning:**

```bash
# Execute in your Supabase SQL Editor or via psql  
psql "your_database_url" -f setup_blog_author_system.sql
```

Or copy and paste the contents of `setup_blog_author_system.sql` into your Supabase SQL Editor and execute.

**What this script does:**
- Creates a clean `media_items` base table with common fields
- Creates a dedicated `authors` table for blog author management
- Creates a dedicated `blogs` table with 1:1 relationship to `media_items`
- Creates other media type tables (articles, videos, podcasts, etc.)
- Creates supporting tables (taxonomies, media_assets, content_submissions, etc.)
- Sets up storage buckets for media management
- Creates RLS policies for security
- Creates views for unified content access
- Creates helper functions for blog operations
- Inserts sample authors and taxonomies
- Adds documentation comments

## Database Schema Created

### Tables
- `media_items` - Base table with common fields for all content types
- `authors` - Author profiles with complete information
- `blogs` - Blog-specific content (1:1 with media_items)
- `articles`, `videos`, `podcasts`, `reports`, `tools`, `events` - Other media types
- Supporting tables for taxonomies, assets, submissions, etc.

### Views
- `v_media_all` - All content with author information
- `v_media_public` - Public published content
- `v_media_with_authors` - Content with author details

### Functions
- `create_blog_post()` - Complete blog post creation
- `update_blog_post()` - Blog post updates
- `create_author()` - Author creation
- `create_media_item()` - Generic media creation
- `update_media_item()` - Generic media update

### Storage Buckets
- `author-avatars` - For author profile pictures
- `blog-images` - For blog hero images
- `media-thumbnails` - For general media thumbnails
- `media-assets` - For general media assets

## Integration with Frontend

The system is designed to work seamlessly with your existing frontend:

1. **MediaCreate.tsx** - Will work with the new blog system
2. **AuthorSelector.tsx** - Will access authors from the new table
3. **MediaList.tsx** - Will display content from the new views
4. **Database types** - May need to be updated to match new schema

## Important Notes

- **Data Loss**: This process will completely remove ALL existing data. Make sure to backup any important data first.
- **Order Matters**: Always run Step 1 before Step 2. Never skip the cleaning step.
- **Verification**: Both scripts include verification queries to confirm successful execution.
- **Permissions**: The scripts use CASCADE where appropriate to handle dependencies.

## Troubleshooting

If you encounter errors:
1. Make sure you're running the scripts in the correct order
2. Verify that you have the necessary database permissions
3. Check that no other connections are using the database during cleanup
4. If issues persist, run the scripts individually in your Supabase dashboard

## Rollback

Since this is a complete reset, there's no automatic rollback. If you need to restore previous data, you'll need to use backups from before running these scripts.