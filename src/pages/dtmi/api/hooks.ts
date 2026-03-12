import { useState, useEffect } from 'react';
import {
  fetchLatestArticles,
  fetchArticleBySlug,
  fetchFilteredArticles,
  fetchAllCategories,
  searchArticles,
} from './index';
import type { Article, Category } from './types';

// Custom hooks for data fetching

export const useLatestArticles = () => {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchLatestArticles()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};

export const useArticleBySlug = (slug: string) => {
  const [data, setData] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) return;
    
    setLoading(true);
    fetchArticleBySlug(slug)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [slug]);

  return { data, loading, error };
};

export const useFilteredArticles = (filters: {
  category?: string;
  limit?: number;
}) => {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchFilteredArticles(filters)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [filters.category, filters.limit]);

  return { 
    data, 
    loading, 
    error, 
    refetch: () => {
      setLoading(true);
      fetchFilteredArticles(filters)
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  };
};

export const useAllCategories = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAllCategories()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};

export const useSearchArticles = (searchTerm: string) => {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setData([]);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(() => {
      searchArticles(searchTerm)
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return { data, loading, error };
};
