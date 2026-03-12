# Requirements Document

## Introduction

Fix pagination and content mapping issues in the Knowledge Hub marketplace route (/marketplace/knowledge-hub) where only 3 cards show on the first page while others appear on subsequent pages, and improve content prioritization for dynamically fetched items.

## Glossary

- **Knowledge_Hub**: The marketplace section displaying educational content items like articles, blogs, case studies, and prediction analyses
- **DTMI**: Digital Transformation Maturity Index - internal marketplace type identifier for knowledge hub
- **Keyset_Pagination**: Cursor-based pagination using published_at and id for stable ordering
- **Content_Item**: Individual pieces of content (articles, blogs, videos, etc.) displayed as cards
- **Page_Size**: Number of content items displayed per page
- **Dynamic_Content**: Content fetched from Supabase database vs static/mock content
- **Priority_Content**: Special content items that should appear first (e.g., prediction analysis)

## Requirements

### Requirement 1: Fix Pagination Display Issues

**User Story:** As a user browsing the knowledge hub, I want to see the correct number of content items per page consistently, so that I can efficiently browse through available content.

#### Acceptance Criteria

1. WHEN the knowledge hub page loads initially, THE System SHALL display the calculated number of items per page based on screen size
2. WHEN the page size is calculated as 12 items (3 columns × 4 rows), THE System SHALL fetch and display exactly 12 items on the first page
3. WHEN navigating between pages, THE System SHALL maintain consistent item counts per page
4. WHEN the screen size changes, THE System SHALL recalculate page size and adjust content display accordingly
5. IF the calculated page size is 0 or invalid, THEN THE System SHALL use a default minimum page size of 6 items

### Requirement 2: Improve Content Ordering and Prioritization

**User Story:** As a user, I want to see the most relevant and priority content first, so that I can quickly access important resources.

#### Acceptance Criteria

1. WHEN fetching content items, THE System SHALL prioritize dynamically fetched content over static fallback content
2. WHEN displaying content items, THE System SHALL show prediction analysis items at the top of the first page
3. WHEN multiple priority items exist, THE System SHALL order them by published date (newest first)
4. WHEN mixing priority and regular content, THE System SHALL maintain chronological ordering within each group
5. WHEN no dynamic content is available, THE System SHALL gracefully fall back to mock content with clear indication

### Requirement 3: Optimize Content Fetching Logic

**User Story:** As a user, I want content to load quickly and reliably, so that I can browse without delays or errors.

#### Acceptance Criteria

1. WHEN the page loads, THE System SHALL fetch content with the correct page size limit
2. WHEN page size is calculated, THE System SHALL use that size for the initial content fetch
3. WHEN content fetching fails, THE System SHALL retry once before falling back to mock data
4. WHEN using keyset pagination, THE System SHALL maintain cursor consistency across page navigation
5. WHEN filters are applied, THE System SHALL reset to page 1 and fetch content with new criteria

### Requirement 4: Enhance Content Mapping Consistency

**User Story:** As a user, I want all content items to display consistently with proper metadata, so that I can make informed decisions about what to read.

#### Acceptance Criteria

1. WHEN mapping database items to cards, THE System SHALL ensure all required fields are populated
2. WHEN content items lack thumbnails, THE System SHALL provide appropriate fallback images
3. WHEN content types are mapped, THE System SHALL use consistent type categorization
4. WHEN displaying dates, THE System SHALL format them consistently across all content items
5. WHEN content has tags, THE System SHALL display them in a standardized format