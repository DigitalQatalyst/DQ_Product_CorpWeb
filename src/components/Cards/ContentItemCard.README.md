# ContentItemCard Component

A redesigned card component for displaying various types of content items across the platform, including articles, blogs, case studies, research reports, expert interviews, podcasts, videos, white papers, and prediction analysis.

## Features

- **Large Image Display**: 4:3 aspect ratio with hover zoom effect
- **Bookmark Functionality**: Save items for later with visual feedback
- **Content Type Badges**: Color-coded badges for each content type
- **Media Type Support**: Special play button overlay for videos and podcasts
- **Responsive Design**: Works seamlessly across all device sizes
- **Hover Effects**: Smooth shadow lift and image zoom on hover

## Content Types

The component supports 9 different content types, each with unique styling:

| Type | Badge Color | Use Case |
|------|-------------|----------|
| Article | Blue | News articles and blog posts |
| Blog | Green | Blog entries and opinion pieces |
| Case Study | Purple | Success stories and case studies |
| Prediction Analysis | Orange | Market predictions and forecasts |
| Expert Interview | Red | Interviews with industry experts |
| Podcast | Pink | Audio content and podcasts |
| Video | Yellow | Video content and tutorials |
| White Paper | Indigo | In-depth research papers |
| Research Report | Rose | Research findings and reports |

## Usage

### Basic Example

```tsx
import { ContentItemCard } from './Cards/ContentItemCard';

<ContentItemCard
  id="1"
  type="Article"
  title="The Future of Digital Cognitive Organizations"
  description="Download this comprehensive white paper to understand how AI is shaping new..."
  imageUrl="https://example.com/image.jpg"
  source="Digital Business Platform"
  date="Apr 20, 2025"
  isBookmarked={false}
  onToggleBookmark={() => handleBookmark('1')}
  onClick={() => navigate('/article/1')}
/>
```

### With State Management

```tsx
import { useState } from 'react';
import { ContentItemCard } from './Cards/ContentItemCard';

function MyComponent() {
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());

  const handleToggleBookmark = (id: string) => {
    setBookmarkedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <ContentItemCard
      id="1"
      type="Video"
      title="How to Build a Digital Platform"
      description="Step-by-step guide..."
      imageUrl="https://example.com/video-thumb.jpg"
      source="Digital Business Platform"
      date="Apr 20, 2025"
      isBookmarked={bookmarkedItems.has('1')}
      onToggleBookmark={() => handleToggleBookmark('1')}
      onClick={() => console.log('Video clicked')}
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Unique identifier for the content item |
| type | ContentType | Yes | Type of content (Article, Blog, etc.) |
| title | string | Yes | Title of the content item |
| description | string | Yes | Brief description or excerpt |
| imageUrl | string | Yes | URL of the thumbnail image |
| source | string | Yes | Source or publisher name |
| date | string | Yes | Publication date (formatted) |
| isBookmarked | boolean | No | Whether the item is bookmarked (default: false) |
| onToggleBookmark | () => void | No | Callback when bookmark is toggled |
| onClick | () => void | No | Callback when card is clicked |

## Integration Points

### KnowledgeHub Component
The ContentItemCard is used in the KnowledgeHub component to display news, events, and resources:

```tsx
<ContentItemCard
  id={item.id}
  type="Article"
  title={item.title}
  description={item.excerpt}
  imageUrl={item.imageUrl}
  source={item.source}
  date={formatDate(item.date)}
  isBookmarked={bookmarkedItems.has(item.id)}
  onToggleBookmark={() => handleToggleBookmark(item.id)}
  onClick={() => navigate(`/media/article/${item.id}`)}
/>
```

### MarketplaceGrid Component
The ContentItemCard is used in the MarketplaceGrid for knowledge-hub marketplace items:

```tsx
<ContentItemCard
  id={item.id}
  type={getContentType(item.mediaType)}
  title={item.title}
  description={item.description}
  imageUrl={item.imageUrl}
  source={item.provider?.name}
  date={formatDate(item.date)}
  isBookmarked={bookmarkedItems.includes(item.id)}
  onToggleBookmark={() => onToggleBookmark(item.id)}
  onClick={() => navigate(`/media/${typeSlug}/${item.id}`)}
/>
```

## Styling

The component uses Tailwind CSS for styling with the following key features:

- **Card Container**: White background with rounded corners and shadow
- **Image**: Aspect ratio 4:3 with object-cover and zoom on hover
- **Bookmark Button**: Circular button with white background in top-right corner
- **Play Button**: Centered overlay for video and podcast types
- **Type Badge**: Rounded pill with type-specific background colors
- **Title**: Bold, 2-line clamp with minimum height
- **Description**: 2-line clamp with gray text
- **Date**: Small gray text at the bottom

## Accessibility

- Bookmark button includes proper `aria-label` attributes
- Images include alt text from the title
- Keyboard navigation supported through onClick handlers
- Color contrast meets WCAG AA standards

## Examples

See `src/pages/ContentShowcase.tsx` for a complete example showcasing all content types.

## Migration Guide

If you're migrating from KnowledgeHubCard or other card components:

1. Import the new component:
   ```tsx
   import { ContentItemCard, ContentType } from './Cards/ContentItemCard';
   ```

2. Map your content type to ContentType:
   ```tsx
   const getContentType = (mediaType?: string): ContentType => {
     const type = (mediaType || '').toLowerCase();
     if (type.includes('article')) return 'Article';
     if (type.includes('video')) return 'Video';
     // ... etc
     return 'Article'; // default
   };
   ```

3. Update your rendering:
   ```tsx
   <ContentItemCard
     id={item.id}
     type={getContentType(item.mediaType)}
     title={item.title}
     description={item.description}
     imageUrl={item.imageUrl}
     source={item.source}
     date={formatDate(item.date)}
     isBookmarked={bookmarkedItems.has(item.id)}
     onToggleBookmark={() => handleToggleBookmark(item.id)}
     onClick={() => handleClick(item)}
   />
   ```
