import { runCompleteBlogTest } from './testBlogCreation';

// Test runner function that can be called from the browser console or a component
export async function runBlogTestWithSampleAuthor() {
  console.log('🧪 Blog Test Runner Starting...');
  
  try {
    // First, let's try to get an existing author
    const { authorService } = await import('./supabase');
    const authors = await authorService.getAuthors();
    
    if (authors.length === 0) {
      console.log('❌ No authors found. Please create an author first.');
      console.log('💡 You can create an author in the Author Management section.');
      return {
        success: false,
        error: 'No authors available for testing'
      };
    }

    // Use the first available author
    const testAuthor = authors[0];
    console.log('👤 Using author for test:', {
      id: testAuthor.id,
      name: testAuthor.name,
      title: testAuthor.title
    });

    // Run the complete blog test
    const result = await runCompleteBlogTest(testAuthor.id);
    
    if (result.success) {
      console.log('🎉 Blog test completed successfully!');
      console.log('🌐 You can now visit the blog at: /blog/' + result.creation?.slug);
    } else {
      console.log('❌ Blog test failed:', result.error);
    }

    return result;

  } catch (error) {
    console.error('❌ Test runner failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Function to test blog retrieval only (if you already have a blog)
export async function testExistingBlog(slug: string) {
  console.log('🔍 Testing existing blog with slug:', slug);
  
  try {
    const { testBlogRetrieval } = await import('./testBlogCreation');
    const result = await testBlogRetrieval(slug);
    
    if (result.success) {
      console.log('✅ Blog retrieval test passed!');
      console.log('📊 Blog details:', {
        title: result.blog?.title,
        type: result.blog?.type,
        status: result.blog?.status,
        wordCount: result.analysis?.wordCount,
        paragraphs: result.analysis?.paragraphCount
      });
    } else {
      console.log('❌ Blog retrieval test failed:', result.error);
    }

    return result;

  } catch (error) {
    console.error('❌ Blog retrieval test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).runBlogTest = runBlogTestWithSampleAuthor;
  (window as any).testExistingBlog = testExistingBlog;
  console.log('🔧 Blog test functions available in console:');
  console.log('   - runBlogTest() - Create and test a new blog');
  console.log('   - testExistingBlog("slug") - Test an existing blog');
}