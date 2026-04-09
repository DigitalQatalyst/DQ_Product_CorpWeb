/**
 * Common page layout utilities to reduce duplication
 */

export interface PageHero {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  gradient?: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  publishedDate?: string;
}

/**
 * Generate standard breadcrumbs
 */
export function generateBreadcrumbs(path: string[]): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
  
  let currentPath = "";
  for (let i = 0; i < path.length; i++) {
    currentPath += `/${path[i].toLowerCase().replace(/\s+/g, '-')}`;
    breadcrumbs.push({
      label: path[i],
      href: i === path.length - 1 ? "#" : currentPath
    });
  }
  
  return breadcrumbs;
}

/**
 * Format page title for SEO
 */
export function formatPageTitle(title: string, siteName = "DigitalQatalyst"): string {
  return `${title} | ${siteName}`;
}

/**
 * Generate page description from content
 */
export function generatePageDescription(content: string, maxLength = 160): string {
  const cleanContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  return cleanContent.substring(0, maxLength - 3).trim() + '...';
}

/**
 * Common page wrapper props
 */
export interface PageWrapperProps {
  title: string;
  description?: string;
  hero?: PageHero;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  children: React.ReactNode;
}

/**
 * Common loading state component props
 */
export interface LoadingStateProps {
  message?: string;
  className?: string;
}

/**
 * Common error state component props
 */
export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string, baseUrl = "https://digitalqatalyst.com"): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Extract reading time from content
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Common article/blog metadata
 */
export interface ArticleMetadata extends PageMetadata {
  readingTime?: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
}

/**
 * Generate article schema markup
 */
export function generateArticleSchema(metadata: ArticleMetadata): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": metadata.title,
    "description": metadata.description,
    "author": {
      "@type": "Organization",
      "name": metadata.author || "DigitalQatalyst"
    },
    "publisher": {
      "@type": "Organization",
      "name": "DigitalQatalyst",
      "logo": {
        "@type": "ImageObject",
        "url": "https://digitalqatalyst.com/logo.png"
      }
    },
    "datePublished": metadata.publishedDate,
    "image": metadata.featuredImage,
    "keywords": metadata.keywords?.join(', ')
  };
}