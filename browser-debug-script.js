// Browser Console Debug Script for Job Listings
// Copy and paste this into your browser console at http://localhost:3000/jobs

console.log('=== Job Listings Debug Script ===');

// Check if the service is available
if (typeof window !== 'undefined') {
  console.log('✓ Running in browser');
  
  // Try to access the Supabase client
  const checkSupabase = async () => {
    try {
      // Import the service dynamically
      const { getPublicJobPostings } = await import('./src/services/jobPostingService.ts');
      
      console.log('✓ Service imported successfully');
      
      // Fetch jobs
      console.log('Fetching jobs...');
      const result = await getPublicJobPostings();
      
      console.log('=== Fetch Result ===');
      console.log('Error:', result.error || 'None');
      console.log('Data count:', result.data?.length || 0);
      console.log('Jobs:', result.data);
      
      if (result.data && result.data.length > 0) {
        console.log('=== First Job Details ===');
        const firstJob = result.data[0];
        console.log('ID:', firstJob.id);
        console.log('Title:', firstJob.title);
        console.log('Status:', firstJob.status);
        console.log('Requirements type:', typeof firstJob.requirements);
        console.log('Requirements:', firstJob.requirements);
        console.log('Responsibilities type:', typeof firstJob.responsibilities);
        console.log('Responsibilities:', firstJob.responsibilities);
      }
      
      return result;
    } catch (error) {
      console.error('✗ Error:', error);
      return null;
    }
  };
  
  // Run the check
  checkSupabase().then(result => {
    if (result && result.data && result.data.length > 0) {
      console.log('✓ Jobs fetched successfully!');
    } else {
      console.log('✗ No jobs found or error occurred');
      console.log('Possible issues:');
      console.log('1. RLS policies blocking access');
      console.log('2. No jobs with status="open" in database');
      console.log('3. Supabase connection issue');
      console.log('\nNext steps:');
      console.log('- Run verify_jobs_simple.sql in Supabase');
      console.log('- Check Network tab for API errors');
      console.log('- Try running temp_disable_rls.sql (testing only)');
    }
  });
} else {
  console.log('✗ Not running in browser');
}

// Also check localStorage for Supabase session
console.log('=== Supabase Session ===');
const supabaseKeys = Object.keys(localStorage).filter(key => key.includes('supabase'));
console.log('Supabase keys in localStorage:', supabaseKeys);
supabaseKeys.forEach(key => {
  console.log(`${key}:`, localStorage.getItem(key)?.substring(0, 100) + '...');
});
