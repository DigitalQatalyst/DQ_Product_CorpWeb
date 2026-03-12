import { BlogPost, BlogAuthor } from '../../data/mockBlogs';

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  heroImage: string;
  category: string;
  tags: string[];
  publishDate: string;
  readTime: number;
  author: string;
  authorRole: string;
  authorBio: string;
  authorAvatar: string;
  authorLinkedIn?: string;
  featured: boolean;
  highlights?: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  relatedKeywords?: string[];
}

export function mapFormDataToBlogPost(formData: any, id: string): BlogPost {
  // Create author object
  const author: BlogAuthor = {
    id: generateAuthorId(formData.author),
    name: formData.author,
    title: formData.authorRole,
    avatar: formData.authorAvatar,
    bio: formData.authorBio,
  };

  // Parse related keywords if it's a string
  let relatedKeywords: string[] = [];
  if (formData.relatedKeywords) {
    if (typeof formData.relatedKeywords === 'string') {
      relatedKeywords = formData.relatedKeywords
        .split(',')
        .map((keyword: string) => keyword.trim())
        .filter((keyword: string) => keyword.length > 0);
    } else if (Array.isArray(formData.relatedKeywords)) {
      relatedKeywords = formData.relatedKeywords;
    }
  }

  return {
    id,
    slug: formData.slug,
    title: formData.title,
    excerpt: formData.excerpt || formData.summary,
    content: formData.bodyHtml || formData.body,
    heroImage: formData.heroImage || formData.thumbnailUrl,
    category: formData.category,
    tags: Array.isArray(formData.tags) ? formData.tags : [],
    publishDate: formatPublishDate(formData.publishedAt),
    readTime: parseInt(formData.readTime) || calculateReadTime(formData.bodyHtml || formData.body),
    author,
    featured: formData.featured || false,
    seoTitle: formData.seoTitle,
    seoDescription: formData.seoDescription,
    focusKeyword: formData.focusKeyword,
    relatedKeywords,
  };
}

function generateAuthorId(authorName: string): string {
  // Generate a consistent ID based on author name
  const nameMap: Record<string, string> = {
    'Dr. Stéphane Niango': '1',
    'Kaylynn Océanne': '2',
    'Michael Rodriguez': '3',
    'Dr. Amira Hassan': '4',
  };
  
  return nameMap[authorName] || '5'; // Default to '5' for guest authors
}

function formatPublishDate(dateString: string): string {
  if (!dateString) return new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function calculateReadTime(content: string): number {
  if (!content) return 1;
  
  // Remove HTML tags and count words
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.trim().split(/\s+/).length;
  
  // Average reading speed is 200-250 words per minute
  // We'll use 225 words per minute
  const readTime = Math.ceil(wordCount / 225);
  
  return Math.max(1, readTime); // Minimum 1 minute
}

export function getBlogHighlights(highlights?: string, content?: string): string[] {
  if (highlights && highlights.trim()) {
    return highlights
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }
  
  // Auto-generate from content headings if no highlights provided
  if (content) {
    const headingRegex = /<h[2-3][^>]*>(.*?)<\/h[2-3]>/gi;
    const matches = content.match(headingRegex);
    
    if (matches) {
      return matches
        .map(match => match.replace(/<[^>]*>/g, '').trim())
        .filter(heading => heading.length > 0)
        .slice(0, 6); // Limit to 6 highlights
    }
  }
  
  return [
    'Key insights and analysis',
    'Strategic implications',
    'Future outlook',
    'Actionable recommendations'
  ];
}