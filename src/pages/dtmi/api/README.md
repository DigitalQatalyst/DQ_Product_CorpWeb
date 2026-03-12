# DTMI Sanity API

This folder contains all Sanity CMS integration for the DTMI landing page.

## Setup

1. Add your Sanity credentials to `.env`:
```env
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_TOKEN=your-token (optional, for authenticated requests)
```

2. Import and use in your components:

```tsx
import { useLatestArticles } from './api/hooks';

const MyComponent = () => {
  const { data, loading, error } = useLatestArticles();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data.map(article => (
        <div key={article._id}>
          <h2>{article.title}</h2>
          <p>{article.subtitle}</p>
          <img src={article.mainImageUrl} alt={article.title} />
        </div>
      ))}
    </div>
  );
};
```

## Available Hooks

- `useLatestArticles()` - Fetch all latest articles (posts)
- `useArticleBySlug(slug)` - Fetch single article by slug
- `useFilteredArticles(filters)` - Fetch filtered articles by category
- `useAllCategories()` - Fetch all categories for filter pills
- `useSearchArticles(searchTerm)` - Search articles

## Filtering with Category Pills

```tsx
import { useState } from 'react';
import { useFilteredArticles, useAllCategories } from './api/hooks';

const ArticlesWithFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const { data: categories } = useAllCategories();
  const { data: articles } = useFilteredArticles({ 
    category: selectedCategory || undefined,
    limit: 6 
  });

  return (
    <div>
      {/* Category Pills */}
      <button onClick={() => setSelectedCategory('')}>All</button>
      {categories.map(cat => (
        <button 
          key={cat._id} 
          onClick={() => setSelectedCategory(cat.slug)}
        >
          {cat.title}
        </button>
      ))}
      
      {/* Articles */}
      {articles.map(article => (
        <div key={article._id}>{article.title}</div>
      ))}
    </div>
  );
};
```

## Article Data Structure

Each article includes:
- `_id` - Unique identifier
- `title` - Article title
- `subtitle` - Article subtitle/excerpt
- `slug` - URL slug
- `publishedAt` - Publication date
- `minread` - Reading time in minutes
- `mainImageUrl` - Optimized image URL (1600px width)
- `mainImageLqip` - Low-quality image placeholder (base64)
- `author` - Author object with name, slug, and imageUrl
- `categories` - Array of category objects
- `summaryoverviewdescription` - Portable Text summary
- `body` - Portable Text content
- `summaryinsights` - Array of insight strings

## Direct API Calls

If you prefer not to use hooks:

```tsx
import { fetchLatestArticles, fetchFilteredArticles } from './api';

// In an async function
const articles = await fetchLatestArticles();
const filtered = await fetchFilteredArticles({ category: 'digital-economy-40' });
```
