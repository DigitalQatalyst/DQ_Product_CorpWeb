# Implementation Tasks

## Phase 1: Component Creation

### Task 1.1: Create SectorBenefits Component
**Status**: pending
**Priority**: high
**Estimated Time**: 1 hour

**Description**: Create a new component to display key benefits as icon cards in a responsive grid.

**Acceptance Criteria**:
- Component renders benefits in 3-column grid (desktop), 2-column (tablet), 1-column (mobile)
- Each card displays icon (64x64px container, coral color), title, and description
- Icons use consistent styling: bg-secondary/10, rounded-xl, 32px icon size, strokeWidth 1.5
- Cards have hover effect: hover:shadow-md transition
- Component uses sector.benefitCards if available, falls back to parsing sector.benefits array
- Proper TypeScript types for props

**Files to Create**:
- `src/features/services/components/sector/SectorBenefits.tsx`

**Dependencies**: None

---

### Task 1.2: Create SectorWhereToStart Component
**Status**: pending
**Priority**: high
**Estimated Time**: 1 hour

**Description**: Create a new component to display "Where to Start" guidance cards.

**Acceptance Criteria**:
- Component renders cards in 3-column grid (desktop), 2-column (tablet), 1-column (mobile)
- Each card displays centered icon, title, description, and optional "Learn more" link
- Icon styling: 64x64px container, bg-secondary/10, rounded-xl, 32px coral icon
- Cards have bg-muted/30 background with hover effects: hover:shadow-lg, hover:-translate-y-1
- Text is center-aligned
- Optional link displays with arrow icon in coral color
- Component only renders if sector.whereToStart data exists
- Proper TypeScript types for props

**Files to Create**:
- `src/features/services/components/sector/SectorWhereToStart.tsx`

**Dependencies**: None

---

### Task 1.3: Create SectorFocusAreas Component
**Status**: pending
**Priority**: high
**Estimated Time**: 1.5 hours

**Description**: Create a new component to display detailed focus area cards with feature lists.

**Acceptance Criteria**:
- Component renders cards in 2-column grid (desktop/tablet), 1-column (mobile)
- Each card displays icon (24px, inline with title), title, description, and feature list
- Features displayed as bulleted list with CheckCircle icons (coral color)
- Cards have border, rounded-lg, p-6, hover:shadow-md
- Component uses sector.focusAreas if available, falls back to parsing sector.useCases array
- Proper TypeScript types for props

**Files to Create**:
- `src/features/services/components/sector/SectorFocusAreas.tsx`

**Dependencies**: None

---

### Task 1.4: Create SectorContactForm Component
**Status**: pending
**Priority**: high
**Estimated Time**: 2 hours

**Description**: Create a new contact form component with validation (UI only, no backend integration).

**Acceptance Criteria**:
- Form displays on background image with primary overlay
- Form fields: Name (required), Email (required), Phone (optional), Message (required textarea)
- Client-side validation with error messages
- Email format validation
- Required field indicators
- Submit button with loading state (simulated)
- Success message displayed after validation (no actual API call)
- Form uses shadcn/ui Input and Textarea components
- Form container: bg-white, rounded-lg, p-8, max-w-2xl, centered
- Button: bg-secondary (coral) with hover effect
- Proper TypeScript types for form data

**Files to Create**:
- `src/features/services/components/sector/SectorContactForm.tsx`

**Dependencies**: shadcn/ui form components

---

### Task 1.5: Create SectorSidebar Component
**Status**: pending
**Priority**: medium
**Estimated Time**: 2 hours

**Description**: Create a sticky sidebar navigation component for quick section jumping.

**Acceptance Criteria**:
- Sidebar displays "On This Page" heading with section links
- Links: Overview, Benefits, Where to Start, Focus Areas, Contact
- Sticky positioning on desktop (top-24), hidden on tablet/mobile (< 1024px)
- Highlights current section based on scroll position using IntersectionObserver
- Smooth scroll to section on link click
- Styling: bg-background/80, backdrop-blur, border-l-2 border-muted
- Active link: text-secondary, font-semibold, border-l-2 border-secondary
- Inactive links: text-muted-foreground, hover:text-foreground
- Proper TypeScript types

**Files to Create**:
- `src/features/services/components/sector/SectorSidebar.tsx`

**Dependencies**: None

---

## Phase 2: Component Enhancement

### Task 2.1: Add Breadcrumb to SectorHero
**Status**: pending
**Priority**: high
**Estimated Time**: 30 minutes

**Description**: Enhance SectorHero component to include breadcrumb navigation.

**Acceptance Criteria**:
- Breadcrumb displays above title: "Home > Services > [Sector Name]"
- Links are functional (Home → "/", Services → "/services")
- Current sector name is not a link
- Breadcrumb uses text-white/80 color
- Separator uses ">" character
- Responsive: maintains visibility on mobile
- Proper spacing between breadcrumb and title

**Files to Modify**:
- `src/features/services/components/sector/SectorHero.tsx`

**Dependencies**: Next.js Link component

---

### Task 2.2: Add Image Layout to SectorOverview
**Status**: pending
**Priority**: medium
**Estimated Time**: 1 hour

**Description**: Enhance SectorOverview component to include image alongside description.

**Acceptance Criteria**:
- Two-column layout on desktop: 60% text, 40% image
- Image displays on right side using Next.js Image component
- Mobile layout: stacks vertically (image first, then text)
- Fallback to text-only layout if sector.overviewImage is not provided
- Image has rounded corners (rounded-lg)
- Maintains existing core pillars, why reasons, and stats sections below
- Proper image optimization and sizing

**Files to Modify**:
- `src/features/services/components/sector/SectorOverview.tsx`

**Dependencies**: Next.js Image component

---

### Task 2.3: Update Page Layout with New Components
**Status**: pending
**Priority**: high
**Estimated Time**: 1 hour

**Description**: Update the main sector page to integrate all new components with proper layout and sidebar.

**Acceptance Criteria**:
- Page structure includes all sections with proper IDs: #overview, #benefits, #where-to-start, #focus-areas, #contact
- Main content has lg:pr-64 padding to accommodate sidebar
- Sidebar positioned fixed on right side (desktop only)
- Conditional rendering for optional sections (whereToStart, focusAreas)
- Proper section ordering: Hero, Overview, Benefits, WhereToStart, FocusAreas, ContactForm
- Remove old SectorContent and SectorCta components
- Clean imports and exports

**Files to Modify**:
- `src/app/services/sectors/[sectorId]/page.tsx`

**Files to Delete**:
- `src/features/services/components/sector/SectorContent.tsx`
- `src/features/services/components/sector/SectorCta.tsx`

**Dependencies**: All Phase 1 and Phase 2 tasks completed

---

## Phase 3: Data Migration

### Task 3.1: Extend SectorData Interface
**Status**: pending
**Priority**: high
**Estimated Time**: 30 minutes

**Description**: Extend the SectorData TypeScript interface to support new data structures.

**Acceptance Criteria**:
- Add BenefitCard interface: { icon: LucideIcon; title: string; description: string; }
- Add WhereToStartCard interface: { icon: LucideIcon; title: string; description: string; link?: string; }
- Add FocusArea interface: { title: string; description: string; features: string[]; icon?: LucideIcon; }
- Extend SectorData interface with optional fields: overviewImage?, benefitCards?, whereToStart?, focusAreas?
- Keep existing fields for backward compatibility
- Export all new interfaces
- Proper TypeScript documentation comments

**Files to Modify**:
- `src/features/services/data/sectors.data.ts`

**Dependencies**: None

---

### Task 3.2: Add Sample Data for Infrastructure Sector
**Status**: pending
**Priority**: high
**Estimated Time**: 1 hour

**Description**: Create sample data for the Infrastructure sector using the new data structure.

**Acceptance Criteria**:
- Add overviewImage field with appropriate image path
- Create benefitCards array with 6 benefit cards (icons, titles, descriptions)
- Create whereToStart array with 3 guidance cards
- Create focusAreas array with 4 focus area cards (each with 3-4 features)
- Use appropriate Lucide icons for all cards
- Content is relevant to Infrastructure 4.0 sector
- Data validates against new TypeScript interfaces

**Files to Modify**:
- `src/features/services/data/sectors.data.ts` (infrastructure sector data)

**Dependencies**: Task 3.1 completed

---

### Task 3.3: Test with New Data Structure
**Status**: pending
**Priority**: high
**Estimated Time**: 30 minutes

**Description**: Test the Infrastructure sector page with new data structure and verify all components render correctly.

**Acceptance Criteria**:
- Infrastructure sector page loads without errors
- All new sections render with sample data
- Sidebar navigation works correctly
- Responsive layouts work on mobile, tablet, desktop
- Images load and display properly
- No TypeScript errors
- No console errors or warnings

**Files to Test**:
- `/services/sectors/infrastructure-4-0` page

**Dependencies**: Tasks 3.1, 3.2, and all Phase 1-2 tasks completed

---

## Phase 4: Testing & Optimization

### Task 4.1: Test Responsive Layouts
**Status**: pending
**Priority**: high
**Estimated Time**: 1 hour

**Description**: Test all components across different viewport sizes and devices.

**Acceptance Criteria**:
- Test on mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- All grids adapt correctly (3→2→1 columns, 2→1 columns)
- Sidebar hidden on mobile/tablet, visible on desktop
- Text remains readable at all sizes
- Images scale appropriately
- No horizontal scrolling on any viewport
- Touch targets are at least 44x44px on mobile
- Form is usable on mobile devices

**Test Devices**:
- Mobile: iPhone, Android
- Tablet: iPad
- Desktop: 1920x1080, 1366x768

**Dependencies**: All previous tasks completed

---

### Task 4.2: Test Sidebar Navigation
**Status**: pending
**Priority**: high
**Estimated Time**: 30 minutes

**Description**: Test sidebar navigation functionality and scroll behavior.

**Acceptance Criteria**:
- Sidebar highlights correct section as user scrolls
- Clicking sidebar links smoothly scrolls to sections
- IntersectionObserver works correctly
- Active state updates properly
- Sidebar remains sticky during scroll
- No performance issues with scroll detection
- Works correctly when sections are added/removed

**Dependencies**: Task 1.5 and 2.3 completed

---

### Task 4.3: Optimize Images
**Status**: pending
**Priority**: medium
**Estimated Time**: 30 minutes

**Description**: Ensure all images are optimized for web delivery.

**Acceptance Criteria**:
- All images use Next.js Image component
- Proper sizes attribute for responsive images
- Hero images have priority loading
- Below-fold images lazy load
- Images are compressed and optimized
- WebP format used where supported
- Alt text provided for all images

**Dependencies**: Tasks 2.2 and 3.2 completed

---

### Task 4.4: Performance Testing
**Status**: pending
**Priority**: medium
**Estimated Time**: 1 hour

**Description**: Test page performance and optimize as needed.

**Acceptance Criteria**:
- Lighthouse performance score > 90
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- No unnecessary re-renders
- Smooth scroll performance
- Fast page load on 3G connection

**Tools**: Chrome DevTools, Lighthouse

**Dependencies**: All previous tasks completed

---

### Task 4.5: Accessibility Audit
**Status**: pending
**Priority**: high
**Estimated Time**: 1 hour

**Description**: Audit page for accessibility compliance and fix issues.

**Acceptance Criteria**:
- Proper heading hierarchy (h1 → h2 → h3)
- All interactive elements keyboard accessible
- Visible focus indicators on all focusable elements
- ARIA labels for navigation landmarks
- Form labels properly associated with inputs
- Color contrast meets WCAG AA standards (4.5:1 for text)
- Alt text for all images
- Screen reader testing passes
- No accessibility errors in axe DevTools

**Tools**: axe DevTools, NVDA/JAWS screen reader

**Dependencies**: All previous tasks completed

---

## Summary

**Total Tasks**: 15
- Phase 1: 5 tasks (Component Creation)
- Phase 2: 3 tasks (Component Enhancement)
- Phase 3: 3 tasks (Data Migration)
- Phase 4: 5 tasks (Testing & Optimization)

**Estimated Total Time**: 14.5 hours

**Critical Path**:
1. Phase 1 tasks (can be done in parallel)
2. Phase 2 tasks (sequential, depends on Phase 1)
3. Phase 3 tasks (sequential, depends on Phase 2)
4. Phase 4 tasks (can be done in parallel, depends on Phase 3)

**Priority Order**:
1. High priority: Tasks 1.1-1.4, 2.1, 2.3, 3.1-3.3, 4.1, 4.2, 4.5
2. Medium priority: Tasks 1.5, 2.2, 4.3, 4.4
