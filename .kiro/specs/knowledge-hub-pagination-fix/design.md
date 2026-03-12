# Design Document

## Overview

This design addresses critical pagination bugs and content mapping issues in the Knowledge Hub marketplace. The main problem is that the page size calculation happens after the initial content fetch, causing inconsistent item counts. We'll fix the initialization order, improve content prioritization, and enhance the overall user experience.

## Architecture

The Knowledge Hub uses a three-layer architecture:
1. **Presentation Layer**: MarketplacePage component with responsive grid layout
2. **Service Layer**: knowledgeHubGrid service for data fetching and mapping
3. **Data Layer**: Supabase v_media_public view with keyset pagination

The fix involves coordinating these layers to ensure proper initialization timing and consistent data flow.

## Components and Interfaces

### MarketplacePage Component Enhancements

**Current Issues:**
- `khPageSize` is 0 during initial render, causing incorrect fetch limits
- Page size calculation happens after first fetch
- Inconsistent fallback handling

**Design Changes:**
```typescript
interface PageSizeConfig {
  columns: number;
  rowsPerPage: number;
  computedSize: number;
  isInitialized: boolean;
}

interface ContentFetchState {
  isInitialLoad: boolean;
  hasValidPageSize: boolean;
  retryCount: number;
}
```

### Enhanced Content Prioritization

**Priority System:**
1. **Tier 1**: Prediction Analysis items (always first)
2. **Tier 2**: Recently published dynamic content (< 30 days)
3. **Tier 3**: Older dynamic content
4. **Tier 4**: Fallback/mock content (clearly marked)

**Implementation:**
```typescript
interface PriorityContent {
  tier: 1 | 2 | 3 | 4;
  item: PublicMediaItem;
  publishedAt: Date;
  isPredictionAnalysis: boolean;
}
```

### Improved Content Mapping

**Enhanced Mapping Function:**
```typescript
interface EnhancedContentCard {
  // Existing fields
  id: string;
  title: string;
  description: string;
  // New fields for better UX
  priority: number;
  contentSource: 'dynamic' | 'fallback';
  thumbnailFallback: string;
  formattedDate: string;
  displayTags: string[];
}
```

## Data Models

### Page Size Calculation Model

```typescript
interface ResponsivePageSize {
  breakpoint: 'sm' | 'md' | 'lg' | 'xl';
  columns: number;
  rowsPerPage: number;
  minPageSize: number;
  maxPageSize: number;
}

const PAGE_SIZE_CONFIG: ResponsivePageSize[] = [
  { breakpoint: 'sm', columns: 1, rowsPerPage: 6, minPageSize: 6, maxPageSize: 6 },
  { breakpoint: 'md', columns: 2, rowsPerPage: 4, minPageSize: 8, maxPageSize: 8 },
  { breakpoint: 'lg', columns: 3, rowsPerPage: 4, minPageSize: 12, maxPageSize: 12 },
  { breakpoint: 'xl', columns: 3, rowsPerPage: 4, minPageSize: 12, maxPageSize: 12 }
];
```

### Content Fetching Model

```typescript
interface FetchParams {
  limit: number; // Always > 0
  after?: string;
  tag?: string;
  q?: string;
  subMarketplace?: 'written' | 'multimedia';
  includePriority: boolean;
}

interface FetchResult {
  items: PublicMediaItem[];
  nextCursor: string | null;
  totalCount?: number;
  hasMore: boolean;
  source: 'database' | 'fallback' | 'mixed';
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing all properties identified in the prework, I found several areas where properties can be consolidated:

**Consolidation Opportunities:**
- Properties 1.1 and 1.2 both test page size calculation and display - can be combined into one comprehensive property
- Properties 2.3 and 2.4 both test chronological ordering - can be combined into one ordering property
- Properties 4.2, 4.3, 4.4, and 4.5 all test content mapping consistency - can be combined into one comprehensive mapping property

**Final Property Set:**
After consolidation, we have 12 unique properties that provide comprehensive validation coverage without redundancy.

Property 1: Page size calculation and display consistency
*For any* screen size configuration, the system should calculate the correct page size and display exactly that number of items on initial load
**Validates: Requirements 1.1, 1.2**

Property 2: Pagination consistency across navigation
*For any* page navigation sequence, each page should maintain consistent item counts (except the last page which may have fewer items)
**Validates: Requirements 1.3**

Property 3: Responsive page size recalculation
*For any* screen size change, the system should recalculate page size and adjust content display to match the new configuration
**Validates: Requirements 1.4**

Property 4: Invalid page size fallback
*For any* invalid or zero page size calculation, the system should use the default minimum page size of 6 items
**Validates: Requirements 1.5**

Property 5: Dynamic content prioritization
*For any* mix of dynamic and static content, dynamic content should appear before static content in the display order
**Validates: Requirements 2.1**

Property 6: Prediction analysis priority placement
*For any* content set containing prediction analysis items, those items should appear at the top of the first page
**Validates: Requirements 2.2**

Property 7: Chronological ordering within content groups
*For any* set of content items, items within the same priority tier should be ordered by published date (newest first)
**Validates: Requirements 2.3, 2.4**

Property 8: Graceful fallback to mock content
*For any* scenario where no dynamic content is available, the system should display mock content with clear indication of its fallback nature
**Validates: Requirements 2.5**

Property 9: Correct fetch parameters
*For any* content fetch operation, the limit parameter should match the calculated page size and be greater than zero
**Validates: Requirements 3.1, 3.2**

Property 10: Fetch retry and fallback behavior
*For any* content fetch failure, the system should retry exactly once before falling back to mock data
**Validates: Requirements 3.3**

Property 11: Keyset pagination cursor consistency
*For any* page navigation sequence, cursors should be properly maintained and used for consistent pagination results
**Validates: Requirements 3.4**

Property 12: Filter application behavior
*For any* filter change, the system should reset to page 1 and fetch content using the new filter criteria
**Validates: Requirements 3.5**

Property 13: Complete content mapping
*For any* database item mapped to a card, all required fields should be populated with appropriate values or fallbacks
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

## Error Handling

### Page Size Calculation Errors
- **Invalid Screen Dimensions**: Use default configuration for medium screens (2 columns × 4 rows = 8 items)
- **Zero or Negative Page Size**: Apply minimum page size of 6 items
- **Calculation Overflow**: Cap at maximum page size of 24 items

### Content Fetching Errors
- **Network Failures**: Retry once with exponential backoff, then use cached/fallback content
- **Invalid Cursor**: Reset pagination to first page and log warning
- **Empty Results**: Display "No content available" message with refresh option
- **Malformed Data**: Skip invalid items and log errors for monitoring

### Content Mapping Errors
- **Missing Required Fields**: Use fallback values (e.g., "Untitled" for missing titles)
- **Invalid Dates**: Use current date and log warning
- **Broken Image URLs**: Use content-type-specific fallback images
- **Invalid Content Types**: Default to "Article" type

## Testing Strategy

### Dual Testing Approach
We'll use both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** will focus on:
- Specific page size calculations for known screen dimensions
- Edge cases like empty content arrays and network failures
- Integration between components during page navigation
- Fallback behavior with mock data scenarios

**Property-Based Tests** will focus on:
- Universal properties that hold across all screen sizes and content combinations
- Comprehensive input coverage through randomization of screen dimensions, content sets, and user interactions
- Validation of ordering and prioritization rules across many generated scenarios

### Property-Based Testing Configuration
- **Testing Library**: We'll use Vitest with fast-check for property-based testing
- **Test Iterations**: Minimum 100 iterations per property test to ensure thorough coverage
- **Test Tagging**: Each property test will be tagged with: **Feature: knowledge-hub-pagination-fix, Property {number}: {property_text}**

### Testing Implementation Requirements
- Each correctness property must be implemented as a single property-based test
- Property tests should generate realistic test data (screen sizes, content items, user interactions)
- Unit tests should complement property tests by testing specific integration scenarios
- All tests must reference their corresponding design document properties
- Test failures should provide clear information about which property was violated and with what inputs