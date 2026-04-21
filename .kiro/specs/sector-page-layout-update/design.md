# Design Document

## Overview

This document outlines the design for updating the service sector detail page layout. The new design transforms the current basic 4-section layout into a comprehensive, user-friendly experience with enhanced navigation, richer content sections, and improved visual hierarchy.

**Note**: This is a prototype implementation. Backend integrations (API endpoints, form submissions, email notifications) will be implemented in a future phase. The contact form will display UI/UX only without actual submission functionality.

## Architecture

### Component Structure

```
src/app/services/sectors/[sectorId]/page.tsx (Main Page)
├── SectorHero (Enhanced with breadcrumb)
├── SectorOverview (Enhanced with image)
├── SectorBenefits (New component)
├── SectorWhereToStart (New component)
├── SectorFocusAreas (New component)
├── SectorContactForm (Replaces SectorCta)
└── SectorSidebar (New component - sticky navigation)
```

### File Organization

**New Components:**
- `src/features/services/components/sector/SectorBenefits.tsx`
- `src/features/services/components/sector/SectorWhereToStart.tsx`
- `src/features/services/components/sector/SectorFocusAreas.tsx`
- `src/features/services/components/sector/SectorContactForm.tsx`
- `src/features/services/components/sector/SectorSidebar.tsx`

**Modified Components:**
- `src/features/services/components/sector/SectorHero.tsx` (add breadcrumb)
- `src/features/services/components/sector/SectorOverview.tsx` (add image layout)

**Removed Components:**
- `src/features/services/components/sector/SectorContent.tsx` (split into Benefits and FocusAreas)
- `src/features/services/components/sector/SectorCta.tsx` (replaced by ContactForm)

**Data Structure:**
- `src/features/services/data/sectors.data.ts` (extend SectorData interface)

## Data Model

### Extended SectorData Interface

```typescript
export interface BenefitCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface WhereToStartCard {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
}

export interface FocusArea {
  title: string;
  description: string;
  features: string[];
  icon?: LucideIcon;
}

export interface SectorData {
  // Existing fields
  id: string;
  name: string;
  title: string;
  subtitle: string;
  focus: string;
  corePillars: CorePillar[];
  whyReasons: WhyReason[];
  technologies: string[];
  benefits: string[]; // Keep for backward compatibility
  useCases: string[]; // Keep for backward compatibility
  stats: [Stat, Stat, Stat];
  heroImage: string;
  
  // New fields
  overviewImage?: string; // Image for overview section
  benefitCards?: BenefitCard[]; // Structured benefits with icons
  whereToStart?: WhereToStartCard[]; // Guidance cards
  focusAreas?: FocusArea[]; // Detailed focus area cards
}
```

### Data Migration Strategy

1. **Backward Compatibility**: Keep existing `benefits` and `useCases` arrays
2. **Optional Fields**: New fields are optional to avoid breaking existing sectors
3. **Fallback Logic**: Components will use new structured data if available, otherwise fall back to existing arrays
4. **Gradual Migration**: Update sector data incrementally

## Component Designs

### 1. SectorHero (Enhanced)

**Purpose**: Display hero banner with breadcrumb navigation

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ [Background Image with Overlay]                 │
│                                                  │
│ Home > Services > Sector Name                   │
│                                                  │
│           Sector Title (Large)                  │
│         Sector Subtitle (Medium)                │
│                                                  │
│         [Explore Resources Button]              │
└─────────────────────────────────────────────────┘
```

**Key Features**:
- Breadcrumb navigation above title
- Maintains existing hero styling
- Responsive text sizing
- Coral/secondary color for button

**Props**: `{ sector: SectorData }`

---

### 2. SectorOverview (Enhanced)

**Purpose**: Provide overview with description and supporting image

**Layout (Desktop)**:
```
┌─────────────────────────────────────────────────┐
│                                                  │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │                  │  │                  │    │
│  │  Description     │  │  Overview Image  │    │
│  │  Text Content    │  │                  │    │
│  │                  │  │                  │    │
│  └──────────────────┘  └──────────────────┘    │
│                                                  │
│  Core Pillars (existing layout)                 │
│  Why Reasons (existing layout)                  │
│  Stats (existing layout)                        │
└─────────────────────────────────────────────────┘
```

**Layout (Mobile)**: Stack vertically - Image, then Description

**Key Features**:
- Two-column layout on desktop (60/40 split)
- Image on right, text on left
- Fallback to text-only if no image provided
- Maintains existing core pillars, why reasons, and stats sections

**Props**: `{ sector: SectorData }`

---

### 3. SectorBenefits (New)

**Purpose**: Display key benefits as icon cards in a grid

**Layout**:
```
┌─────────────────────────────────────────────────┐
│           Key Benefits (Heading)                 │
│                                                  │
│  ┌──────┐  ┌──────┐  ┌──────┐                  │
│  │ Icon │  │ Icon │  │ Icon │                  │
│  │Title │  │Title │  │Title │                  │
│  │Desc  │  │Desc  │  │Desc  │                  │
│  └──────┘  └──────┘  └──────┘                  │
│                                                  │
│  ┌──────┐  ┌──────┐  ┌──────┐                  │
│  │ Icon │  │ Icon │  │ Icon │                  │
│  │Title │  │Title │  │Title │                  │
│  │Desc  │  │Desc  │  │Desc  │                  │
│  └──────┘  └──────┘  └──────┘                  │
└─────────────────────────────────────────────────┘
```

**Grid Layout**:
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

**Card Design**:
- Icon container: 64x64px, `bg-secondary/10`, rounded-xl
- Icon: 32px, coral color, strokeWidth 1.5
- Title: font-bold, text-foreground
- Description: text-muted-foreground, text-sm
- Card: hover:shadow-md transition
- Padding: p-6

**Data Source**:
- Use `sector.benefitCards` if available
- Fallback to parsing `sector.benefits` array

**Props**: `{ sector: SectorData }`

---

### 4. SectorWhereToStart (New)

**Purpose**: Guide users on initial steps or entry points

**Layout**:
```
┌─────────────────────────────────────────────────┐
│         Where to Start (Heading)                 │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Icon   │  │   Icon   │  │   Icon   │      │
│  │          │  │          │  │          │      │
│  │  Title   │  │  Title   │  │  Title   │      │
│  │          │  │          │  │          │      │
│  │Description│ │Description│ │Description│      │
│  │          │  │          │  │          │      │
│  │[Learn →] │  │[Learn →] │  │[Learn →] │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘
```

**Grid Layout**:
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

**Card Design**:
- Icon container: 64x64px, `bg-secondary/10`, rounded-xl, centered
- Icon: 32px, coral color, strokeWidth 1.5
- Title: font-bold, text-foreground, text-center
- Description: text-muted-foreground, text-sm, text-center
- Optional link: "Learn more →" with coral color
- Card: bg-muted/30, rounded-lg, p-6
- Hover effect: hover:shadow-lg, hover:-translate-y-1

**Data Source**: `sector.whereToStart` (optional)

**Conditional Rendering**: Only render if `whereToStart` data exists

**Props**: `{ sector: SectorData }`

---

### 5. SectorFocusAreas (New)

**Purpose**: Display detailed information about key focus areas

**Layout**:
```
┌─────────────────────────────────────────────────┐
│        Key Focus Areas (Heading)                 │
│                                                  │
│  ┌─────────────────┐  ┌─────────────────┐      │
│  │ Icon  Title     │  │ Icon  Title     │      │
│  │                 │  │                 │      │
│  │ Description     │  │ Description     │      │
│  │                 │  │                 │      │
│  │ • Feature 1     │  │ • Feature 1     │      │
│  │ • Feature 2     │  │ • Feature 2     │      │
│  │ • Feature 3     │  │ • Feature 3     │      │
│  └─────────────────┘  └─────────────────┘      │
│                                                  │
│  ┌─────────────────┐  ┌─────────────────┐      │
│  │ Icon  Title     │  │ Icon  Title     │      │
│  │ Description...  │  │ Description...  │      │
│  └─────────────────┘  └─────────────────┘      │
└─────────────────────────────────────────────────┘
```

**Grid Layout**:
- Desktop: 2 columns
- Tablet: 2 columns
- Mobile: 1 column

**Card Design**:
- Icon: 24px, coral color, inline with title
- Title: font-bold, text-lg, text-foreground
- Description: text-muted-foreground, mb-4
- Features: Bulleted list with CheckCircle icons (coral)
- Card: border, rounded-lg, p-6, hover:shadow-md
- Background: bg-background

**Data Source**:
- Use `sector.focusAreas` if available
- Fallback to parsing `sector.useCases` array

**Props**: `{ sector: SectorData }`

---

### 6. SectorContactForm (New)

**Purpose**: Contact form with CTA for consultation requests

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ [Background Image with Overlay]                 │
│                                                  │
│     Ready to Transform with [Sector]?           │
│     Our experts are ready to help...            │
│                                                  │
│  ┌─────────────────────────────────────┐        │
│  │  Name: [____________]               │        │
│  │  Email: [____________]              │        │
│  │  Phone: [____________]              │        │
│  │  Message: [___________________]     │        │
│  │           [___________________]     │        │
│  │                                     │        │
│  │  [Submit Request Button]            │        │
│  └─────────────────────────────────────┘        │
└─────────────────────────────────────────────────┘
```

**Form Fields**:
- Name (required)
- Email (required, validated)
- Phone (optional)
- Message (required, textarea)

**Validation**:
- Client-side validation with error messages
- Email format validation
- Required field indicators

**Submission** (Prototype):
- Form displays validation and UI states
- Success message shown on valid submission (no actual API call)
- Button shows loading state for UX demonstration
- No backend integration in this phase

**Styling**:
- Background: Form_background.jpg with primary overlay
- Form container: bg-white, rounded-lg, p-8, max-w-2xl
- Button: bg-secondary (coral), hover effect
- Inputs: shadcn/ui Input component
- Textarea: shadcn/ui Textarea component

**Props**: `{ sectorName: string }`

---

### 7. SectorSidebar (New)

**Purpose**: Sticky navigation for quick section jumping

**Layout (Desktop)**:
```
┌──────────────┐
│ On This Page │
│              │
│ • Overview   │
│ • Benefits   │
│ • Start      │
│ • Focus      │
│ • Contact    │
└──────────────┘
```

**Behavior**:
- Fixed/sticky positioning on desktop (right side)
- Hidden on tablet and mobile (< 1024px)
- Highlights current section based on scroll position
- Smooth scroll to section on click
- Uses IntersectionObserver for active section detection

**Styling**:
- Position: sticky, top-24
- Width: 200px
- Background: bg-background/80, backdrop-blur
- Border: border-l-2 border-muted
- Links: text-muted-foreground, hover:text-foreground
- Active link: text-secondary, font-semibold, border-l-2 border-secondary

**Section IDs**:
- `#overview`
- `#benefits`
- `#where-to-start`
- `#focus-areas`
- `#contact`

**Props**: None (reads from DOM)

---

## Layout Integration

### Page Structure

```typescript
// src/app/services/sectors/[sectorId]/page.tsx

export default async function Page({ params }: Props) {
  const { sectorId } = await params;
  const sector = getSectorData(sectorId);
  if (!sector) notFound();
  
  return (
    <div className="min-h-screen bg-background">
      <SectorHero sector={sector} />
      
      <div className="relative">
        {/* Main Content */}
        <div className="lg:pr-64">
          <section id="overview">
            <SectorOverview sector={sector} />
          </section>
          
          <section id="benefits">
            <SectorBenefits sector={sector} />
          </section>
          
          {sector.whereToStart && (
            <section id="where-to-start">
              <SectorWhereToStart sector={sector} />
            </section>
          )}
          
          {sector.focusAreas && (
            <section id="focus-areas">
              <SectorFocusAreas sector={sector} />
            </section>
          )}
          
          <section id="contact">
            <SectorContactForm sectorName={sector.name} />
          </section>
        </div>
        
        {/* Sidebar Navigation */}
        <div className="hidden lg:block fixed right-8 top-24 w-56">
          <SectorSidebar />
        </div>
      </div>
    </div>
  );
}
```

## Visual Design System

### Color Palette

- **Primary (Navy)**: `#1e3a8a` - Badges, text accents
- **Secondary (Coral)**: `#FF6B4D` - Icons, buttons, active states
- **Background**: `bg-background` - Main page background
- **Muted**: `bg-muted/30` - Section alternating backgrounds
- **Foreground**: `text-foreground` - Primary text
- **Muted Foreground**: `text-muted-foreground` - Secondary text

### Typography

- **Hero Title**: text-3xl md:text-5xl, font-bold
- **Section Headings**: text-3xl md:text-4xl, font-bold
- **Card Titles**: text-lg, font-bold
- **Body Text**: text-base, leading-relaxed
- **Card Descriptions**: text-sm, text-muted-foreground

### Spacing

- **Section Padding**: py-20
- **Container**: container mx-auto px-4
- **Card Padding**: p-6
- **Grid Gaps**: gap-6 (desktop), gap-4 (mobile)

### Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Icon Styling (Consistent Across Platform)

- **Container**: 64x64px, bg-secondary/10, rounded-xl
- **Icon**: 32px, text-secondary, strokeWidth={1.5}
- **Hover**: No additional effects on container

## Implementation Phases

### Phase 1: Component Creation
1. Create SectorBenefits component
2. Create SectorWhereToStart component
3. Create SectorFocusAreas component
4. Create SectorContactForm component (UI only, no backend)
5. Create SectorSidebar component

### Phase 2: Component Enhancement
1. Add breadcrumb to SectorHero
2. Add image layout to SectorOverview
3. Update page.tsx with new layout

### Phase 3: Data Migration
1. Extend SectorData interface
2. Add sample data for one sector (e.g., Infrastructure)
3. Test with new data structure
4. Gradually migrate remaining sectors

### Phase 4: Testing & Optimization
1. Test responsive layouts
2. Test sidebar navigation
3. Optimize images
4. Performance testing
5. Accessibility audit

### Future Phase: Backend Integration (Not in Prototype)
1. Create `/api/contact` endpoint
2. Implement form submission logic
3. Add email notification system
4. Connect form to backend

## Technical Considerations

### Performance

- **Image Optimization**: Use Next.js Image component with proper sizing
- **Lazy Loading**: Images below fold should lazy load
- **Code Splitting**: Components loaded on demand
- **Intersection Observer**: Efficient scroll detection for sidebar

### Accessibility

- **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
- **ARIA Labels**: Navigation landmarks, form labels
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus Management**: Visible focus indicators
- **Alt Text**: All images have descriptive alt text

### SEO

- **Structured Data**: Add JSON-LD for organization/service
- **Meta Tags**: Proper title, description per sector
- **Heading Structure**: Logical h1-h6 hierarchy
- **Internal Links**: Breadcrumb navigation

### Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Fallbacks**: Graceful degradation for older browsers
- **Progressive Enhancement**: Core content accessible without JS

## Success Metrics

- **User Engagement**: Time on page, scroll depth
- **Conversion**: Contact form submissions
- **Performance**: LCP < 2.5s, CLS < 0.1
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile Usage**: 50%+ mobile traffic support

## Future Enhancements (Post-Prototype)

- **Backend Integration**: Connect contact form to API endpoint
- **Email Notifications**: Automated email responses
- **Form Data Storage**: Database integration for submissions
- **Video Integration**: Hero video backgrounds
- **Interactive Demos**: Embedded product demos
- **Case Studies**: Sector-specific success stories
- **Resource Downloads**: Whitepapers, guides
- **Live Chat**: Real-time consultation widget
