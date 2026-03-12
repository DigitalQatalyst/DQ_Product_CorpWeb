import { mediaService } from './supabase';

// Test data for blog creation with rich content
const sampleBlogContent = `
<p>This is the opening paragraph of our test blog post. It introduces the main topic and sets the stage for what readers can expect to learn from this comprehensive guide.</p>

<p>In the second paragraph, we dive deeper into the subject matter. This paragraph provides context and background information that helps readers understand the importance of the topic we're discussing.</p>

<h2>Understanding the Core Concepts</h2>

<p>The third paragraph begins to explore the core concepts. We break down complex ideas into digestible pieces, making sure that readers can follow along regardless of their prior knowledge level.</p>

<p>Here in the fourth paragraph, we continue building on those concepts. We provide practical examples and real-world applications that demonstrate how these ideas work in practice.</p>

<h2>Practical Applications and Benefits</h2>

<p>The fifth paragraph shifts focus to practical applications. We show readers how they can apply what they've learned in their own work or personal projects.</p>

<p>In our sixth paragraph, we discuss the benefits and advantages of implementing these concepts. We highlight the positive outcomes that readers can expect to see.</p>

<h2>Implementation Strategies</h2>

<p>The seventh paragraph provides actionable strategies for implementation. We give step-by-step guidance that readers can follow to achieve their goals.</p>

<p>Finally, in our eighth paragraph, we wrap up with a strong conclusion that reinforces the key takeaways and encourages readers to take action on what they've learned.</p>
`;

export interface TestBlogData {
  title: string;
  slug: string;
  excerpt: string;
  bodyHtml: string;
  heroImage: string;
  category: string;
  authorId: string;
  readTime: number;
  publishedAt: string;
  tags: string[];
  focusKeyword: string;
  relatedKeywords: string[];
  seoTitle: string;
  seoDescription: string;
}

export const createTestBlogData = (authorId: string): TestBlogData => ({
  title: 'Test Blog Post: Complete Content Creation and Retrieval',
  slug: 'test-blog-post-complete-content-creation',
  excerpt: 'This is a comprehensive test blog post designed to validate the complete blog creation and retrieval workflow. It includes rich HTML content, proper metadata, and all required fields for a successful blog publication.',
  bodyHtml: sampleBlogContent,
  heroImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop',
  category: 'Digital Transformation',
  authorId: authorId,
  readTime: 8,
  publishedAt: new Date().toISOString(),
  tags: ['Test', 'Blog Creation', 'Content Management', 'Digital Transformation'],
  focusKeyword: 'blog creation test',
  relatedKeywords: ['content management', 'blog workflow', 'test automation', 'digital publishing'],
  seoTitle: 'Test Blog Post: Complete Content Creation Guide | DigitalQatalyst',
  seoDescription: 'Comprehensive test blog post demonstrating complete content creation workflow with rich HTML content, proper metadata, and SEO optimization for digital publishing platforms.'
});

export async function testBlogCreation(authorId: string) {
  console.log('🧪 Starting Blog Creation Test...');
  
  try {
    // Step 1: Create test blog data
    const testData = createTestBlogData(authorId);
    console.log('📝 Test data prepared:', {
      title: testData.title,
      slug: testData.slug,
      bodyLength: testData.bodyHtml.length,
      authorId: testData.authorId
    });

    // Step 2: Create the blog post
    console.log('🚀 Creating blog post...');
    const createdBlog = await mediaService.createMediaItem({
      title: testData.title,
      slug: testData.slug,
      summary: testData.excerpt,
      bodyHtml: testData.bodyHtml,
      body: testData.bodyHtml, // Ensure both fields are set
      type: 'Blog',
      heroImage: testData.heroImage,
      category: testData.category,
      authorId: testData.authorId,
      readTime: testData.readTime,
      publishedAt: testData.publishedAt,
      tags: testData.tags,
      focusKeyword: testData.focusKeyword,
      relatedKeywords: testData.relatedKeywords,
      seoTitle: testData.seoTitle,
      seoDescription: testData.seoDescription,
      status: 'Published',
      visibility: 'Public',
      language: 'en',
      featured: true
    });

    console.log('✅ Blog created successfully:', {
      id: createdBlog.id,
      title: createdBlog.title,
      slug: createdBlog.slug,
      type: createdBlog.type,
      bodyHtmlLength: createdBlog.bodyHtml?.length || 0,
      bodyLength: createdBlog.body?.length || 0
    });

    // Step 3: Test retrieval by ID
    console.log('🔍 Testing retrieval by ID...');
    const retrievedById = await mediaService.getMediaItemById(createdBlog.id);
    console.log('✅ Retrieved by ID:', {
      id: retrievedById.id,
      title: retrievedById.title,
      bodyHtmlLength: retrievedById.bodyHtml?.length || 0,
      bodyLength: retrievedById.body?.length || 0
    });

    // Step 4: Test retrieval by slug
    console.log('🔍 Testing retrieval by slug...');
    const retrievedBySlug = await mediaService.getMediaItemBySlug(testData.slug);
    console.log('✅ Retrieved by slug:', {
      id: retrievedBySlug.id,
      title: retrievedBySlug.title,
      slug: retrievedBySlug.slug,
      bodyHtmlLength: retrievedBySlug.bodyHtml?.length || 0,
      bodyLength: retrievedBySlug.body?.length || 0
    });

    // Step 5: Validate content integrity
    console.log('🔍 Validating content integrity...');
    const contentValidation = {
      titleMatch: retrievedBySlug.title === testData.title,
      slugMatch: retrievedBySlug.slug === testData.slug,
      bodyHtmlExists: !!retrievedBySlug.bodyHtml && retrievedBySlug.bodyHtml.length > 0,
      bodyExists: !!retrievedBySlug.body && retrievedBySlug.body.length > 0,
      categoryMatch: retrievedBySlug.category === testData.category,
      tagsMatch: JSON.stringify(retrievedBySlug.tags?.sort()) === JSON.stringify(testData.tags.sort()),
      typeMatch: retrievedBySlug.type === 'Blog'
    };

    console.log('📊 Content validation results:', contentValidation);

    // Step 6: Check if body content has the expected paragraphs
    const bodyContent = retrievedBySlug.bodyHtml || retrievedBySlug.body || '';
    const paragraphCount = (bodyContent.match(/<p>/g) || []).length;
    const headingCount = (bodyContent.match(/<h2>/g) || []).length;
    
    console.log('📝 Content structure analysis:', {
      paragraphCount,
      headingCount,
      totalLength: bodyContent.length,
      hasOpeningParagraph: bodyContent.includes('This is the opening paragraph'),
      hasClosingParagraph: bodyContent.includes('Finally, in our eighth paragraph')
    });

    // Step 7: Test blog page URL
    const blogUrl = `/blog/${testData.slug}`;
    console.log('🌐 Blog should be accessible at:', blogUrl);

    return {
      success: true,
      blogId: createdBlog.id,
      slug: testData.slug,
      url: blogUrl,
      validation: contentValidation,
      contentAnalysis: {
        paragraphCount,
        headingCount,
        totalLength: bodyContent.length
      }
    };

  } catch (error) {
    console.error('❌ Blog creation test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
}

export async function testBlogRetrieval(slug: string) {
  console.log('🧪 Starting Blog Retrieval Test for slug:', slug);
  
  try {
    // Test retrieval by slug
    const blog = await mediaService.getMediaItemBySlug(slug);
    
    console.log('✅ Blog retrieved successfully:', {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      type: blog.type,
      status: blog.status,
      visibility: blog.visibility
    });

    // Analyze content
    const bodyContent = blog.bodyHtml || blog.body || '';
    const analysis = {
      hasContent: bodyContent.length > 0,
      paragraphCount: (bodyContent.match(/<p>/g) || []).length,
      headingCount: (bodyContent.match(/<h[1-6]>/g) || []).length,
      wordCount: bodyContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length,
      characterCount: bodyContent.length
    };

    console.log('📊 Content analysis:', analysis);

    return {
      success: true,
      blog,
      analysis
    };

  } catch (error) {
    console.error('❌ Blog retrieval test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Helper function to run complete blog workflow test
export async function runCompleteBlogTest(authorId: string) {
  console.log('🚀 Running Complete Blog Workflow Test...');
  console.log('=====================================');
  
  // Step 1: Create blog
  const creationResult = await testBlogCreation(authorId);
  
  if (!creationResult.success) {
    console.log('❌ Test failed at creation stage');
    return creationResult;
  }

  console.log('=====================================');
  
  // Step 2: Test retrieval
  const retrievalResult = await testBlogRetrieval(creationResult.slug!);
  
  if (!retrievalResult.success) {
    console.log('❌ Test failed at retrieval stage');
    return retrievalResult;
  }

  console.log('=====================================');
  console.log('🎉 Complete Blog Workflow Test PASSED!');
  console.log('📝 Summary:');
  console.log(`   - Blog ID: ${creationResult.blogId}`);
  console.log(`   - Slug: ${creationResult.slug}`);
  console.log(`   - URL: ${creationResult.url}`);
  console.log(`   - Paragraphs: ${retrievalResult.analysis?.paragraphCount}`);
  console.log(`   - Word Count: ${retrievalResult.analysis?.wordCount}`);
  console.log('=====================================');

  return {
    success: true,
    creation: creationResult,
    retrieval: retrievalResult
  };
}