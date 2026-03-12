# Simple Blog System Setup

## Step 1: Delete All Tables (⚠️ BACKUP FIRST!)

Run this in Supabase SQL Editor:

```sql
\i 00_DELETE_ALL_TABLES.sql
```

## Step 2: Create New Simple Schema

Run this in Supabase SQL Editor:

```sql
\i 01_CREATE_SIMPLE_BLOG_SCHEMA.sql
```

## Step 3: Update Your Routes

Add the blog creation route to your `AppRouter.tsx`:

```typescript
import BlogCreate from './admin-ui/pages/BlogCreate';

// Add this route:
<Route path="/admin-ui/blog/create" element={<BlogCreate />} />
```

## Step 4: Update BlogPage to Use New Service

Update `src/pages/blog/BlogPage.tsx`:

```typescript
import { blogService } from '../../admin-ui/services/blogService';

// In useEffect:
const blog = await blogService.getBlogBySlug(slug);
```

## New Schema Structure

### Authors Table
- id (UUID)
- name
- title
- bio
- avatar
- linkedin, twitter, website
- created_at, updated_at

### Blogs Table
- id (UUID)
- slug (unique)
- title
- excerpt
- content (HTML)
- hero_image
- category
- tags (array)
- publish_date
- read_time
- author_id (FK to authors)
- featured
- created_at, updated_at

## Usage

1. Navigate to `/admin-ui/blog/create`
2. Fill in all required fields
3. Write content in the rich text editor
4. Click "Create Blog Post"
5. Blog will be saved and you'll be redirected to view it

## Files Created

- `00_DELETE_ALL_TABLES.sql` - Cleanup script
- `01_CREATE_SIMPLE_BLOG_SCHEMA.sql` - New schema
- `src/admin-ui/services/blogService.ts` - Blog service
- `src/admin-ui/pages/BlogCreate.tsx` - Simple blog form

## What Changed

- ✅ Removed complex media_items system
- ✅ Simple blogs table with all fields
- ✅ Direct author relationship
- ✅ No RPC functions needed
- ✅ Straightforward CRUD operations
- ✅ Content field stores HTML directly
- ✅ All fields match your schema exactly

## Test It

```typescript
// In browser console after creating a blog:
const blog = await blogService.getBlogBySlug('your-slug');
console.log('Content length:', blog.content.length);
console.log('Content preview:', blog.content.substring(0, 200));
```
