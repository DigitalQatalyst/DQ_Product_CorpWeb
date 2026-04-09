/**
 * Common data type definitions to reduce duplication across data files
 */

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  category?: string;
  tags?: string[];
  publishedDate?: string;
  author?: string;
  readTime?: string;
}

export interface ServiceBenefit {
  title: string;
  description: string;
  icon: string;
}

export interface WhereToStartItem {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceArea {
  title: string;
  description: string;
  features: string[];
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDomainData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  overview: {
    title: string;
    description: string;
    keyPoints: string[];
  };
  benefits: ServiceBenefit[];
  whereToStart: WhereToStartItem[];
  serviceAreas: ServiceArea[];
  faqs: ServiceFaq[];
}

export interface SectorData {
  id: string;
  title: string;
  description: string;
  icon: string;
  backgroundImage: string;
  slug: string;
  overview: {
    title: string;
    description: string;
    keyPoints: string[];
  };
  benefits: ServiceBenefit[];
  solutions: ServiceArea[];
  caseStudies?: MediaItem[];
  faqs: ServiceFaq[];
}

/**
 * Factory function to create service benefit
 */
export function createServiceBenefit(
  title: string, 
  description: string, 
  icon: string
): ServiceBenefit {
  return { title, description, icon };
}

/**
 * Factory function to create where to start item
 */
export function createWhereToStartItem(
  title: string, 
  description: string, 
  icon: string
): WhereToStartItem {
  return { title, description, icon };
}

/**
 * Factory function to create service area
 */
export function createServiceArea(
  title: string, 
  description: string, 
  features: string[]
): ServiceArea {
  return { title, description, features };
}

/**
 * Factory function to create FAQ
 */
export function createFaq(question: string, answer: string): ServiceFaq {
  return { question, answer };
}

/**
 * Factory function to create media item
 */
export function createMediaItem(
  id: string,
  title: string,
  description: string,
  imageUrl: string,
  slug: string,
  options?: Partial<MediaItem>
): MediaItem {
  return {
    id,
    title,
    description,
    imageUrl,
    slug,
    ...options
  };
}

/**
 * Validate service domain data structure
 */
export function validateServiceDomainData(data: any): data is ServiceDomainData {
  return !!(
    data &&
    data.hero &&
    data.hero.title &&
    data.hero.subtitle &&
    data.overview &&
    data.overview.title &&
    data.benefits &&
    Array.isArray(data.benefits) &&
    data.whereToStart &&
    Array.isArray(data.whereToStart) &&
    data.serviceAreas &&
    Array.isArray(data.serviceAreas) &&
    data.faqs &&
    Array.isArray(data.faqs)
  );
}

/**
 * Validate sector data structure
 */
export function validateSectorData(data: any): data is SectorData {
  return !!(
    data &&
    data.id &&
    data.title &&
    data.description &&
    data.slug &&
    data.overview &&
    data.benefits &&
    Array.isArray(data.benefits) &&
    data.solutions &&
    Array.isArray(data.solutions) &&
    data.faqs &&
    Array.isArray(data.faqs)
  );
}