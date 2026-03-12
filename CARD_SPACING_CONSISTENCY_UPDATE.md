# Card Spacing and Text Truncation Update

## Overview
Updated all marketplace and content cards to ensure consistent spacing and text truncation across the application. All card titles and descriptions now display exactly 2 lines with proper truncation.

## Changes Made

### 1. ContentItemCard (`src/components/Cards/ContentItemCard.tsx`)

#### Spacing Updates
- Increased spacing between type badge/source and title from `mb-2` to `mb-3`
- Increased spacing between title and description from implicit to `mb-3`
- Increased spacing between description and date from `mb-2` to `mb-3`

#### Text Truncation
- **Title**: Fixed to exactly 2 lines with `minHeight: '2.75rem'` (44px)
- **Description**: Fixed to exactly 2 lines with `minHeight: '2.5rem'` (40px)
- Added `truncate` class to source text to prevent overflow

#### Before:
```tsx
<h3 className="font-bold text-gray-900 text-base line-clamp-2 leading-snug min-h-[44px]">
  {title}
</h3>
<p className="text-sm text-gray-600 line-clamp-2 mb-2 min-h-[40px]">
  {description}
</p>
```

#### After:
```tsx
<h3 className="font-bold text-gray-900 text-base line-clamp-2 leading-snug mb-3" style={{ minHeight: '2.75rem' }}>
  {title}
</h3>
<p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3" style={{ minHeight: '2.5rem' }}>
  {description}
</p>
```

### 2. MarketplaceCard (`src/components/Cards/MarketplaceCard.tsx`)

#### Spacing Updates
- Increased spacing between header section and description from `mb-3` to `mb-4`
- Increased spacing between description and tags/actions from `mb-3` to `mb-4`
- Added `mb-1` spacing between title and provider name

#### Text Truncation
- **Title**: Fixed to exactly 2 lines with `minHeight: '2.75rem'`
- **Description**: Changed from 3 lines to 2 lines with `minHeight: '2.5rem'`
- Added `truncate` class to provider name to prevent overflow

#### Layout Improvements
- Removed `min-h-[64px]` from title container for cleaner layout
- Simplified flex structure for better alignment

#### Before:
```tsx
<div className="flex-grow min-h-[64px] flex flex-col justify-center">
  <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[44px] leading-snug">
    {item.title}
  </h3>
  <p className="text-sm text-gray-500 min-h-[20px]">
    {item.provider.name}
  </p>
</div>
<div className="mb-3">
  <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px] leading-relaxed">
    {item.description}
  </p>
</div>
```

#### After:
```tsx
<div className="flex-grow flex flex-col justify-center">
  <h3 className="font-bold text-gray-900 line-clamp-2 leading-snug mb-1" style={{ minHeight: '2.75rem' }}>
    {item.title}
  </h3>
  <p className="text-sm text-gray-500 truncate">
    {item.provider.name}
  </p>
</div>
<div className="mb-4">
  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed" style={{ minHeight: '2.5rem' }}>
    {item.description}
  </p>
</div>
```

### 3. MediaCard (`src/components/Cards/MediaCard.tsx`)

#### Spacing Updates
- Increased spacing between type label and title from `mb-1.5` to `mb-2`
- Increased spacing between title and description from implicit to `mb-3`
- Increased spacing for title/description container from `mb-2` to `mb-3`

#### Text Truncation
- **Title**: Fixed to exactly 2 lines with `minHeight: '2.75rem'`
- **Description**: Fixed to exactly 2 lines with `minHeight: '2.5rem'`

#### Before:
```tsx
<h3
  className={`${designTokens.typography.title.size} ${designTokens.typography.title.weight} ${designTokens.typography.title.color} ${designTokens.typography.title.lineHeight} line-clamp-2`}
  style={{
    minHeight: 'calc(2 * 1.375rem)',
  }}
>
  {title}
</h3>
{description && (
  <p
    className={`${designTokens.typography.description.size} ${designTokens.typography.description.color} ${designTokens.typography.description.lineHeight} line-clamp-2 mb-2`}
    style={{
      minHeight: 'calc(2 * 1.25rem)',
    }}
  >
    {description}
  </p>
)}
```

#### After:
```tsx
<h3
  className={`${designTokens.typography.title.size} ${designTokens.typography.title.weight} ${designTokens.typography.title.color} ${designTokens.typography.title.lineHeight} line-clamp-2 mb-3`}
  style={{
    minHeight: '2.75rem',
  }}
>
  {title}
</h3>
{description && (
  <p
    className={`${designTokens.typography.description.size} ${designTokens.typography.description.color} ${designTokens.typography.description.lineHeight} line-clamp-2`}
    style={{
      minHeight: '2.5rem',
    }}
  >
    {description}
  </p>
)}
```

### 4. CourseCard (`src/components/CourseCard.tsx`)

#### Spacing Updates
- Increased spacing between header section and description from `mb-3` to `mb-4`
- Increased spacing between description and tags/actions from `mb-3` to `mb-4`
- Added `mb-1` spacing between title and provider name

#### Text Truncation
- **Title**: Fixed to exactly 2 lines with `minHeight: '2.75rem'`
- **Description**: Changed from 3 lines to 2 lines with `minHeight: '2.5rem'`
- Added `truncate` class to provider name

#### Layout Improvements
- Removed `min-h-[64px]` from title container
- Simplified flex structure

## Design Specifications

### Text Heights
- **Title (2 lines)**: `2.75rem` (44px) - Accommodates bold text with `leading-snug`
- **Description (2 lines)**: `2.5rem` (40px) - Accommodates regular text with `leading-relaxed`

### Spacing Scale
- **Small gap**: `mb-1` (4px) - Between closely related items (title → provider)
- **Medium gap**: `mb-3` (12px) - Between content sections (badge → title, title → description)
- **Large gap**: `mb-4` (16px) - Between major sections (header → description, description → actions)

### Text Truncation Classes
- `line-clamp-2`: Truncates text to exactly 2 lines with ellipsis
- `truncate`: Single-line truncation with ellipsis
- `leading-snug`: Tighter line height for titles (1.375)
- `leading-relaxed`: More comfortable line height for descriptions (1.625)

## Visual Consistency Benefits

1. **Predictable Layout**: All cards have consistent heights for title and description sections
2. **Better Alignment**: Cards in a grid align perfectly regardless of content length
3. **Improved Readability**: Consistent spacing makes content easier to scan
4. **Professional Appearance**: Uniform truncation prevents ragged edges
5. **Responsive Design**: Fixed heights work across all screen sizes

## Testing Recommendations

1. **Content Variations**: Test with short, medium, and long titles/descriptions
2. **Grid Layout**: Verify alignment in 1, 2, and 3 column grids
3. **Overflow Handling**: Confirm ellipsis appears correctly for truncated text
4. **Spacing Consistency**: Check that gaps between elements are uniform
5. **Cross-browser**: Test in Chrome, Firefox, Safari, and Edge
6. **Accessibility**: Verify screen readers handle truncated text properly

## Browser Compatibility

- `line-clamp-2`: Supported in all modern browsers (Chrome 51+, Firefox 68+, Safari 5+)
- `minHeight` inline styles: Universal support
- Flexbox layout: Universal support in modern browsers

## Future Enhancements

1. Consider adding tooltips for truncated text on hover
2. Implement "Read more" functionality for descriptions
3. Add animation for hover states
4. Consider dynamic line clamping based on viewport size
