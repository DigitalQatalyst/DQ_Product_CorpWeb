// Test script to verify media items fetching

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

// Initialize Supabase client
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing required environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Use service role key if available for admin operations
const adminSupabase = SUPABASE_SERVICE_ROLE_KEY 
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : supabase;

console.log('🧪 Starting Media Items Fetch Test...\n');

async function testMediaFetching() {
    try {
        console.log('🔍 Testing direct table access...');
        
        // Test 1: Check if media_items table exists and has data
        const { data: mediaItems, error: mediaError } = await supabase
            .from('media_items')
            .select('id, title, type, status, created_at')
            .limit(5);
        
        if (mediaError) {
            console.error('❌ Error fetching from media_items table:', mediaError);
        } else {
            console.log(`✅ Successfully fetched ${mediaItems.length} items from media_items table`);
            if (mediaItems.length > 0) {
                console.log('Sample media item:', mediaItems[0]);
            }
        }

        // Test 2: Check if authors table exists and has data
        const { data: authors, error: authorsError } = await supabase
            .from('authors')
            .select('id, name, title, avatar')
            .limit(5);
        
        if (authorsError) {
            console.error('❌ Error fetching from authors table:', authorsError);
        } else {
            console.log(`✅ Successfully fetched ${authors.length} items from authors table`);
            if (authors.length > 0) {
                console.log('Sample author:', authors[0]);
            }
        }

        // Test 3: Check if blogs table exists and has data
        const { data: blogs, error: blogsError } = await supabase
            .from('blogs')
            .select('id, title, slug, excerpt, author_id')
            .limit(5);
        
        if (blogsError) {
            console.error('❌ Error fetching from blogs table:', blogsError);
        } else {
            console.log(`✅ Successfully fetched ${blogs.length} items from blogs table`);
            if (blogs.length > 0) {
                console.log('Sample blog:', blogs[0]);
            }
        }

        // Test 4: Check if v_media_all view exists and has data
        console.log('\n🔍 Testing v_media_all view...');
        const { data: viewData, error: viewError } = await supabase
            .from('v_media_all')
            .select('*')
            .limit(5);
        
        if (viewError) {
            console.error('❌ Error fetching from v_media_all view:', viewError);
        } else {
            console.log(`✅ Successfully fetched ${viewData.length} items from v_media_all view`);
            if (viewData.length > 0) {
                console.log('Sample view item:', {
                    id: viewData[0].id,
                    title: viewData[0].title,
                    type: viewData[0].type,
                    has_author: !!viewData[0].author_name,
                    has_blog_content: !!viewData[0].blog_content
                });
            }
        }

        // Test 5: Check if v_media_with_authors view exists and has data
        console.log('\n🔍 Testing v_media_with_authors view...');
        const { data: viewWithAuthors, error: viewWithAuthorsError } = await supabase
            .from('v_media_with_authors')
            .select('*')
            .limit(5);
        
        if (viewWithAuthorsError) {
            console.error('❌ Error fetching from v_media_with_authors view:', viewWithAuthorsError);
        } else {
            console.log(`✅ Successfully fetched ${viewWithAuthors.length} items from v_media_with_authors view`);
            if (viewWithAuthors.length > 0) {
                console.log('Sample view with authors item:', {
                    id: viewWithAuthors[0].id,
                    title: viewWithAuthors[0].title,
                    type: viewWithAuthors[0].type,
                    has_author: !!viewWithAuthors[0].author_name,
                    has_blog_fields: !!viewWithAuthors[0].blog_excerpt
                });
            }
        }

        // Test 6: Test filtering by type (blogs)
        console.log('\n🔍 Testing blog-specific queries...');
        const { data: blogItems, error: blogError } = await supabase
            .from('v_media_with_authors')
            .select('*')
            .eq('type', 'Blog')
            .limit(5);
        
        if (blogError) {
            console.error('❌ Error fetching blog items:', blogError);
        } else {
            console.log(`✅ Successfully fetched ${blogItems.length} blog items`);
            if (blogItems.length > 0) {
                console.log('Sample blog item:', {
                    id: blogItems[0].id,
                    title: blogItems[0].title,
                    author: blogItems[0].author_name,
                    excerpt: blogItems[0].blog_excerpt ? 'Available' : 'None',
                    content_length: blogItems[0].blog_content ? blogItems[0].blog_content.length : 0
                });
            }
        }

        // Test 7: Test storage bucket existence
        console.log('\n🔍 Testing storage configuration...');
        const { data: buckets, error: bucketError } = await adminSupabase
            .from('storage.buckets')
            .select('*');
        
        if (bucketError) {
            console.error('❌ Error fetching storage buckets:', bucketError);
        } else {
            console.log(`✅ Successfully fetched ${buckets.length} storage buckets`);
            const authorAvatarsBucket = buckets.find(bucket => bucket.id === 'author-avatars');
            if (authorAvatarsBucket) {
                console.log('✅ Found author-avatars storage bucket');
            } else {
                console.log('⚠️  author-avatars storage bucket not found');
            }
        }

        console.log('\n🎉 Media fetching tests completed!');
        
    } catch (error) {
        console.error('💥 Unexpected error during tests:', error);
    }
}

// Run the test
testMediaFetching().then(() => {
    console.log('\n✅ Test script completed successfully!');
}).catch(error => {
    console.error('\n💥 Test script failed:', error);
});