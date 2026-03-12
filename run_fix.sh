#!/bin/bash

# Load environment variables
source .env.local

# Extract connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_URL="$DATABASE_URL"

if [ -z "$DB_URL" ]; then
    echo "DATABASE_URL not found in .env.local"
    exit 1
fi

echo "Running SQL fix against database..."
psql "$DB_URL" -f fix_update_media_item.sql

if [ $? -eq 0 ]; then
    echo "SQL fix completed successfully!"
    
    # Test the function
    echo "Testing normalize_slug function..."
    psql "$DB_URL" -c "SELECT public.normalize_slug('Test Slug With Spaces!');"
    
    echo "Testing function signatures..."
    psql "$DB_URL" -c "SELECT routine_name, routine_type FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('create_media_item', 'update_media_item', 'get_media_item_full', 'normalize_slug');"
    
else
    echo "SQL fix failed!"
    exit 1
fi