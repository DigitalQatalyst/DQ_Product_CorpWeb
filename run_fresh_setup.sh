#!/bin/bash

# Fresh Blog System Setup Script
# This script runs the complete database reset for the blog system

echo "🚀 Starting fresh blog system reset..."
echo "====================================="

# Check if required environment variables are set
if [ -z "$SUPABASE_DB_URL" ] && [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo "❌ Required environment variables not found!"
    echo "Please set either:"
    echo "  - SUPABASE_DB_URL (full database connection string)"
    echo "  - SUPABASE_PROJECT_ID and SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    echo "For local Supabase setup, you can use the connection string from your Supabase dashboard"
    exit 1
fi

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ psql is not installed or not in PATH"
    echo "For Supabase projects, you typically connect through the dashboard SQL editor"
    echo ""
    echo "📋 Manual setup instructions:"
    echo "1. Go to your Supabase dashboard"
    echo "2. Navigate to SQL Editor"
    echo "3. Copy the content from fresh_blog_system_reset.sql"
    echo "4. Execute the script to reset your database"
    echo ""
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Execute the SQL script
echo "⏳ Executing database reset script..."
echo ""

if [ ! -f "fresh_blog_system_reset.sql" ]; then
    echo "❌ SQL script file not found: fresh_blog_system_reset.sql"
    exit 1
fi

# Attempt to execute the SQL script
if [ -n "$SUPABASE_DB_URL" ]; then
    # Using direct database URL
    psql "$SUPABASE_DB_URL" -f fresh_blog_system_reset.sql
    RESULT=$?
else
    # Using project ID method (requires additional setup)
    echo "❌ For Supabase projects, the direct database URL is usually needed"
    echo "Please set SUPABASE_DB_URL with your database connection string"
    RESULT=1
fi

if [ $RESULT -eq 0 ]; then
    echo ""
    echo "✅ Database reset completed successfully!"
    echo ""
    echo "✨ What was set up:"
    echo "   • Clean media_items base table"
    echo "   • Dedicated authors table with profiles"
    echo "   • Dedicated blogs table with 1:1 relationship"
    echo "   • Separate tables for each media type"
    echo "   • Storage buckets for media management"
    echo "   • Views for unified content access"
    echo "   • Helper functions for blog operations"
    echo "   • RLS policies for security"
    echo "   • Sample authors and taxonomies"
    echo ""
    echo "🎉 Your blog system is now ready for use!"
    echo "Remember to restart your application to pick up the new schema."
else
    echo ""
    echo "❌ Database reset failed!"
    echo ""
    echo "📋 Alternative manual setup:"
    echo "1. Go to your Supabase dashboard"
    echo "2. Navigate to SQL Editor"
    echo "3. Copy the entire content from fresh_blog_system_reset.sql"
    echo "4. Execute the script in the SQL editor"
    echo ""
    exit 1
fi