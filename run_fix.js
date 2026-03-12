#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = envVars.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local');
  console.log('Found URL:', SUPABASE_URL ? 'Yes' : 'No');
  console.log('Found Service Key:', SUPABASE_SERVICE_KEY ? 'Yes' : 'No');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQL(sql) {
  try {
    // Use the raw SQL execution through Supabase
    const { data, error } = await supabase.from('_').select('*').limit(0);
    
    // Since Supabase doesn't have direct SQL execution, we'll use RPC
    // But first let's try a simple query to test connection
    const { data: testData, error: testError } = await supabase
      .from('media_items')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Connection test failed:', testError);
      return false;
    }
    
    console.log('Connection successful, but Supabase client cannot execute raw SQL directly.');
    console.log('Please run the SQL manually in your Supabase dashboard or use psql.');
    console.log('\nSQL to execute:');
    console.log('================');
    console.log(sql);
    console.log('================');
    
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

async function runFix() {
  try {
    console.log('Reading SQL fix file...');
    const sqlContent = fs.readFileSync('fix_update_media_item.sql', 'utf8');
    
    console.log('Testing Supabase connection...');
    await executeSQL(sqlContent);
    
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

runFix();