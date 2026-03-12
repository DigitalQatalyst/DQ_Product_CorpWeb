# Sanity CMS Integration Guide

## Quick Start

Your DTMI folder is now fully integrated with Sanity CMS! 

### 1. Configure Environment Variables

Create a `.env` file in your project root:

```env
VITE_SANITY_PROJECT_ID=dnylqqoa
VITE_SANITY_DATASET=production
VITE_SANITY_TOKEN=your-optional-token
```

### 2. Use the LatestArticles Component

The `LatestArticles` component is ready to use in your `DtmiLandingPage.tsx`:

```tsx
import { LatestArticles } from "./components/LatestArticles";

const DtmiLandingPage = () => {
  return (
    <div>
      <LatestArticles />
    </div>
  );
};
```

## Features

✅ **Automatic Article Fetching** - Fetches posts from Sanity CMS
✅ **Category Filter Pills** - Interactive category filtering
✅ **LQIP Support** - Low-quality image placeholders for better UX
✅ **Optimized Images** - Automatic image optimization via Sanity CDN
✅ **Author Information** - Displays author name and avatar
✅ **Reading Time** - Shows estimated reading time
✅ **Responsive Design** - Mobile-friendly grid layout

## API Structure

```
src/pages/dtmi/api/
├── sanityClient.ts    # Sanity client configuration
├── types.ts           # TypeScript types
├── queries.ts         # GROQ queries
├── index.ts           # API functions
├── hooks.ts           # React hooks
└── README.md          # Detailed documentation
```

## Available Hooks

```tsx
// Fetch all articles
const { data, loading, error } = useLatestArticles();

// Filter by category
const { data } = useFilteredArticles({ category: 'digital-economy-40', limit: 6 });

// Get all categories for filters
const { data: categories } = useAllCategories();

// Get single article
const { data: article } = useArticleBySlug('digital-transformation');

// Search articles
const { data: results } = useSearchArticles('AI');
```

## Query Structure

Your Sanity query matches this structure:

```groq
*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  title,
  subtitle,
  slug,
  publishedAt,
  minread,
  mainImage { ... },
  "mainImageUrl": mainImage.asset->url + "?w=1600&auto=format",
  "mainImageLqip": mainImage.asset->metadata.lqip,
  "author": author->{ ... },
  "categories": categories[]->{ ... },
  summaryoverviewdescription,
  body,
  summaryinsights
}
```

## Example: Custom Article List

```tsx
import { useFilteredArticles, useAllCategories } from './api/hooks';

export const MyArticleList = () => {
  const [category, setCategory] = useState('');
  const { data: categories } = useAllCategories();
  const { data: articles, loading } = useFilteredArticles({ 
    category: category || undefined 
  });

  return (
    <div>
      {/* Filter Pills */}
      <div className="flex gap-2">
        <button onClick={() => setCategory('')}>All</button>
        {categories.map(cat => (
          <button key={cat._id} onClick={() => setCategory(cat.slug)}>
            {cat.title}
          </button>
        ))}
      </div>

      {/* Articles */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        articles.map(article => (
          <article key={article._id}>
            <img src={article.mainImageUrl} alt={article.title} />
            <h2>{article.title}</h2>
            <p>{article.subtitle}</p>
            <span>{article.minread} min read</span>
          </article>
        ))
      )}
    </div>
  );
};
```

## Troubleshooting

**Articles not loading?**
- Check your `.env` file has correct Sanity credentials
- Verify your Sanity project ID is correct
- Check browser console for errors

**Images not displaying?**
- Ensure images are published in Sanity Studio
- Check image asset URLs in the response

**Categories not showing?**
- Verify categories are created in Sanity Studio
- Check that articles have categories assigned

## Next Steps

1. Update your `.env` with Sanity credentials
2. Replace the existing `<LatestArticles />` component in `DtmiLandingPage.tsx`
3. Customize the styling to match your design
4. Add click handlers to navigate to article detail pages
