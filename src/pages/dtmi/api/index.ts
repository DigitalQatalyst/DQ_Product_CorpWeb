import { sanityClient } from './sanityClient';
import { queries } from './queries';
import type { Article, Category } from './types';

// Fetch functions with error handling

export const fetchLatestArticles = async (): Promise<Article[]> => {
  try {
    const data = await sanityClient.fetch<Article[]>(queries.latestArticles);
    return data;
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    return [];
  }
};

export const fetchArticleBySlug = async (slug: string): Promise<Article | null> => {
  try {
    const data = await sanityClient.fetch<Article>(queries.articleBySlug(slug));
    return data;
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    return null;
  }
};

export const fetchFilteredArticles = async (filters: {
  category?: string;
  limit?: number;
}): Promise<Article[]> => {
  try {
    const data = await sanityClient.fetch<Article[]>(queries.filteredArticles(filters));
    return data;
  } catch (error) {
    console.error('Error fetching filtered articles:', error);
    return [];
  }
};

export const fetchAllCategories = async (): Promise<Category[]> => {
  try {
    const data = await sanityClient.fetch<Category[]>(queries.allCategories);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const searchArticles = async (searchTerm: string): Promise<Article[]> => {
  try {
    const data = await sanityClient.fetch<Article[]>(queries.searchArticles(searchTerm));
    return data;
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
};

// Re-export utilities
export { sanityClient };
export * from './types';
