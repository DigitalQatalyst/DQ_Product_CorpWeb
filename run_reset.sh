#!/bin/bash

# Load environment variables
source .env.local

# Extract connection details from DATABASE_URL
DB_URL="$DATABASE_URL"

if [ -z "$DB_URL" ]; then
    echo "DATABASE_URL not found in .env.local"
    exit 1
fi

echo "WARNING: This will DROP ALL DATA in your media system tables!"
echo "Are you sure you want to continue? (type 'yes' to confirm)"
read -r confirmation

if [ "$confirmation" != "yes" ]; then
    echo "Operation cancelled."
    exit 0
fi

echo "Resetting database schema..."
psql "$DB_URL" -f reset_database.sql

if [ $? -eq 0 ]; then
    echo "Database reset completed successfully!"
    
    # Test the functions
    echo "Testing functions..."
    psql "$DB_URL" -c "SELECT public.normalize_slug('Test Slug With Spaces!');"
    
    echo "Checking function signatures..."
    psql "$DB_URL" -c "SELECT routine_name, routine_type FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('create_media_item', 'update_media_item', 'get_media_item_full', 'normalize_slug') ORDER BY routine_name;"
    
    echo "Checking tables..."
    psql "$DB_URL" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%media%' ORDER BY table_name;"
    
else
    echo "Database reset failed!"
    exit 1
fi