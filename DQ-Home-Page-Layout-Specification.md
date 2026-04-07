# DigitalQatalyst Home Page Layout Specification
## Section-by-Section Design Document

---

## Overview
This document provides a comprehensive layout specification for the DigitalQatalyst corporate website home page, detailing each section from header to footer with precise design requirements, content structure, and interactive elements.

**Page URL**: `/` (Root homepage)  
**Page Type**: Landing Page / Corporate Homepage  
**Target Audience**: C-suite executives, transformation leaders, technology teams, existing clients  
**Primary Goals**: Brand awareness, lead generation, service discovery, trust building  

---

## Page Structure Overview

```
┌─────────────────────────────────────────────────────────────┐
│ 1. HEADER NAVIGATION                                        │
├─────────────────────────────────────────────────────────────┤
│ 2. HERO SECTION                                             │
├─────────────────────────────────────────────────────────────┤
│ 3. TRANSFORMATION STATS SECTION                             │
├─────────────────────────────────────────────────────────────┤
│ 4. PROOF & TRUST SECTION                                    │
├─────────────────────────────────────────────────────────────┤
│ 5. DIGITAL MATURITY ASSESSMENT SECTION                      │
├─────────────────────────────────────────────────────────────┤
│ 6. SERVICES MARKETPLACES SECTION                            │
├─────────────────────────────────────────────────────────────┤
│ 7. KNOWLEDGE HUB SECTION                                    │
├─────────────────────────────────────────────────────────────┤
│ 8. CALL TO ACTION SECTION                                   │
├─────────────────────────────────────────────────────────────┤
│ 9. FOOTER                                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Section 1: Header Navigation

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ [LOGO]              [NAV MENU]           [USER ACTIONS]     │
│                                                             │
│ DQ Logo    Home Services Products About   Login | Profile   │
└─────────────────────────────────────────────────────────────┘
```

### Design Specifications
- **Background**: `bg-secondary-900` (Dark navy)
- **Height**: Fixed header, sticky positioning
- **Container**: `container mx-auto px-4 md:px-6 py-3`
- **Text Color**: White (`text-white`)

### Content Elements
1. **Logo Section** (Left)
   - DQ Logo (SVG format): `/logo/dq-logo-white.svg`
   - Fallback: `/Dark-Light logo/DQ Logo Dark.png`
   - Dimensions: `h-12`
   - Link: Routes to `/`

2. **Navigation Menu** (Center)
   - Home, Services, Products, About, Knowledge Hub
   - Responsive: Desktop horizontal, Mobile hamburger menu
   - Active state styling with hover effects

3. **User Actions** (Right)
   - Authentication state-dependent
   - Login button or User profile dropdown
   - Notifications menu (for authenticated users)

### Interactive Elements
- **Mobile Drawer**: Slide-out navigation for mobile devices
- **Profile Dropdown**: User account management
- **Notifications Menu**: Real-time notifications display
- **Explore Dropdown**: Services and products quick access

---

## Section 2: Hero Section

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    FULL VIEWPORT HEIGHT                     │
│                                                             │
│                    [ANIMATED HEADLINE]                      │
│                    [SUBHEADLINE TEXT]                       │
│                                                             │
│                    [AI PROMPT INTERFACE]                    │
│                                                             │
│                    [CTA BUTTONS]                            │
│                                                             │
│                    [SCROLL INDICATOR]                       │
└─────────────────────────────────────────────────────────────┘
```

### Design Specifications
- **Background**: 
  - Gradient: `bg-gradient-to-r from-secondary-900 via-secondary-800 to-secondary-700`
  - Background Image: `/images/landingpage_hero.png` with overlay
  - Animated gradient overlay with pulse effect
- **Height**: `100vh` (Full viewport height)
- **Text Color**: White
- **Container**: `container mx-auto px-4 h-full flex flex-col justify-center items-center`

### Content Elements

#### 2.1 Main Headline
- **Text**: "Design and Operate Your Digital Business Platform"
- **Typography**: 
  - Desktop: `text-4xl md:text-5xl lg:text-6xl font-bold`
  - Font: `font-display`
  - Animation: `AnimatedText` component with staggered reveal
- **Color**: `text-white`
- **Spacing**: `mb-4 leading-snug`

#### 2.2 Subheadline
- **Text**: "From strategy and architecture to platforms and execution; we design, deploy, and operate your transformation with clarity, speed, and control."
- **Typography**: `text-xl text-white/90`
- **Font**: `font-body`
- **Animation**: `FadeInUpOnScroll` with 0.8s delay
- **Spacing**: `mb-8`

#### 2.3 AI Prompt Interface
- **Container**: `w-full max-w-3xl mb-10`
- **Background**: `bg-white rounded-lg shadow-lg`
- **Interactive States**: Focus scaling and shadow enhancement
- **Components**:
  - Input field with placeholder: "Ask about our digital transformation services..."
  - Submit button with Send icon
  - Suggestion pills (animated on focus)
  - Integration with ModernDQChatbot component

#### 2.4 Call-to-Action Buttons
- **Layout**: Horizontal flex on desktop, vertical stack on mobile
- **Primary CTA**: 
  - Text: "Explore Our Services"
  - Style: `bg-primary hover:bg-primary-600 text-white`
  - Icon: ArrowRight with hover animation
  - Action: Navigate to `/services`
- **Secondary CTA**:
  - Text: "Explore Our Products" 
  - Style: `bg-white text-secondary-900 hover:bg-gray-50`
  - Action: Navigate to `/products`

#### 2.5 Scroll Indicator
- **Position**: `absolute bottom-8 left-1/2 transform -translate-x-1/2`
- **Animation**: `animate-bounce`
- **Icon**: ChevronDown
- **Action**: Smooth scroll to next section

### Interactive Elements
- **AI Prompt Submission**: Triggers ModernDQChatbot with user query
- **Suggestion Pills**: Pre-defined prompts with staggered animations
- **CTA Button Hover Effects**: Scale and ripple animations
- **Background Animation**: Zoom effect on load, gradient pulse

---

## Section 3: Transformation Stats Section

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [LEFT CONTENT]                    [RIGHT VIDEO PLAYER]     │
│                                                             │
│  • Welcome Text                    ┌─────────────────────┐  │
│  • Main Headline                   │                     │  │
│  • Description                     │   VIDEO PLAYER     │  │
│  • CTA Button                      │   with Controls     │  │
│                                    │                     │  │
│                                    └─────────────────────┘  │
│                                    Caption Text             │
└─────────────────────────────────────────────────────────────┘
```

### Design Specifications
- **Background**: `bg-white`
- **Padding**: `py-16`
- **Container**: `container mx-auto px-4 md:px-6`
- **Layout**: `grid lg:grid-cols-2 gap-12 items-center`

### Content Elements

#### 3.1 Left Content Column
- **Welcome Badge**: 
  - Text: "WELCOME TO THE FUTURE OF DIGITAL TRANSFORMATION"
  - Style: `text-sm font-medium text-primary uppercase tracking-wide`
- **Main Headline**:
  - Text: "Approximately 70% of Digital Transformation initiatives fail"
  - Typography: `text-3xl md:text-4xl font-bold text-gray-900 leading-tight`
- **Description**:
  - Text: "DQ ensures you are not part of the statistics by guiding you through a data-driven transformation that delivers measurable results."
  - Style: `text-lg text-gray-600 leading-relaxed`
- **CTA Button**:
  - Text: "Book Your Free Consultation"
  - Style: `bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg`
  - Animation: `transform hover:scale-105 shadow-lg hover:shadow-xl`
  - Action: Navigate to `/consultation`

#### 3.2 Right Video Player Column
- **Container**: `relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl`
- **Video Source**: `/videos/Why Work with Us - DQ.mp4`
- **Poster Image**: `/images/Landing page video thumbnail.png`
- **Controls**: Custom video controls with play/pause, volume, progress bar
- **Caption**: "Watch how we turn digital disruption into opportunity"

### Interactive Elements
- **Custom Video Player**: Play/pause overlay, volume control with slider, progress tracking
- **Volume Control**: Hover-activated vertical slider
- **Play Button Overlay**: Large centered play button when paused
- **Progress Bar**: Interactive seeking capability

---

## Section 4: Proof & Trust Section

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [SECTION HEADER]                         │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   IMPACT STATS  │  │  TESTIMONIALS   │  │  PARTNERS   │  │
│  │                 │  │                 │  │             │  │
│  │  • 3X Faster    │  │  • Client       │  │ • Strategic │  │
│  │  • 99% Success  │  │    Quotes       │  │   Partners  │  │
│  │  • 100+ Platforms│  │  • Video        │  │ • Logos     │  │
│  │  • 15+ Years    │  │    Testimonials │  │   Grid      │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Design Specifications
- **Background**: Gradient from `#FEF7F5` to `#F6F8FF`
- **Padding**: `py-20`
- **Container**: `container mx-auto px-4`

### Content Elements

#### 4.1 Impact Statistics
- **Layout**: Grid of 4 statistics cards
- **Animation**: `AnimatedCounter` with scroll-triggered activation
- **Statistics**:
  1. **3X**: "Transform 3X faster with optimized processes"
  2. **99%**: "99% success rate in delivering on time and to specification"
  3. **100+**: "100+ digital business platforms designed for scalability"
  4. **15+**: "Over 15 years of proven expertise in digital transformation"

#### 4.2 Client Testimonials
- **Format**: Carousel with video testimonials
- **Features**:
  - Video thumbnail with hover-to-play
  - Client information overlay
  - Success metrics display
  - Modal popup for full video playback
- **Navigation**: Arrow controls and dot indicators
- **Auto-play**: 5-second intervals

#### 4.3 Strategic Partners
- **Layout**: Logo grid with categories
- **Categories**:
  - Government Bodies (25+)
  - Financial Partners (50+)
  - Service Providers (500+)
  - Business Network (5000+)
- **Logos**: Technology partners (Microsoft, AWS, Google Cloud, etc.)

### Interactive Elements
- **Testimonial Carousel**: Auto-advancing with manual controls
- **Video Modal**: Full-screen video playback
- **Partner Logo Hover**: Subtle scaling and shadow effects
- **Statistics Animation**: Count-up animation on scroll into view

---

## Section 5: Digital Maturity Assessment Section

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [SECTION HEADER]                         │
│                                                             │
│                ┌─────────────────────────┐                  │
│                │                         │                  │
│                │    ASSESSMENT CARD      │                  │
│                │                         │                  │
│                │  • AI-Powered Analysis  │                  │
│                │  • DQ Framework         │                  │
│                │  • Strategic Insights   │                  │
│                │                         │                  │
│                │    [START BUTTON]       │                  │
│                │                         │                  │
│                └─────────────────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Design Specifications
- **Background**: Linear gradient from `#FEF7F5` to `#F6F8FF`
- **Padding**: `py-20`
- **Container**: `container mx-auto px-4`

### Content Elements

#### 5.1 Section Header
- **Main Title**: "How Digitally Mature is Your Organization?"
- **Typography**: `text-3xl font-bold text-gray-900 mb-3`
- **Description**: "Our digital maturity assessment provides a comprehensive analysis of your current digital state and offers tailored recommendations to accelerate your transformation journey."
- **Style**: `text-lg text-gray-600 max-w-3xl mx-auto mb-6`

#### 5.2 Assessment Preview Card
- **Container**: `bg-white rounded-2xl shadow-xl p-8 md:p-12`
- **Layout**: 3-column grid showcasing features
- **Feature Cards**:
  1. **AI-Powered Analysis**: BrainCircuit icon, blue theme
  2. **DQ Framework**: Target icon, indigo theme  
  3. **Strategic Insights**: Sparkles icon, purple theme

#### 5.3 Call-to-Action
- **Button Text**: "Unlock Your Digital Maturity"
- **Style**: `bg-primary text-white font-semibold rounded-xl hover:bg-primary-600`
- **Animation**: `transform hover:scale-105 shadow-lg`
- **Icon**: ArrowRight
- **Action**: Triggers assessment flow

### Interactive Elements
- **Assessment Flow**: Multi-step form with progress tracking
- **AI Integration**: OpenAI service for maturity analysis
- **Results Visualization**: Radar chart with DBP Tower scores
- **Lead Capture**: Email collection before showing results

---

## Section 6: Services Marketplaces Section

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [SECTION HEADER]                         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   SERVICE   │  │   PRODUCT   │  │   CAREERS   │         │
│  │ MARKETPLACE │  │ MARKETPLACE │  │ MARKETPLACE │         │
│  │             │  │             │  │             │         │
│  │ • Icon      │  │ • Icon      │  │ • Icon      │         │
│  │ • Title     │  │ • Title     │  │ • Title     │         │
│  │ • Description│  │ • Description│  │ • Description│        │
│  │ • CTA Button│  │ • CTA Button│  │ • CTA Button│         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Design Specifications
- **Background**: `bg-white`
- **Padding**: `py-12`
- **Container**: `container mx-auto px-4`
- **Section ID**: `services-marketplaces` (for hash navigation)

### Content Elements

#### 6.1 Section Header
- **Title**: "Explore Our Digital Transformation Marketplaces"
- **Typography**: `text-3xl font-bold text-gray-900 mb-3`
- **Description**: "Find expert solutions and resources tailored for your business needs."
- **Style**: `text-lg text-gray-600 max-w-3xl mx-auto`

#### 6.2 Marketplace Cards
**Services Marketplace**:
- **Icon**: Briefcase
- **Title**: "Services Marketplace"
- **Description**: "Maximize ROI with our affordable, data-driven and architecture-led digital transformation services"
- **Action**: Navigate to `/marketplace/services`

**Products Marketplace**:
- **Icon**: Package
- **Title**: "Products Marketplace" 
- **Description**: "Discover digital products engineered for your organization's success in the digital economy"
- **Action**: Navigate to `/products`

**Careers Marketplace**:
- **Icon**: Users
- **Title**: "Careers Marketplace"
- **Description**: "Discover exciting career opportunities and join our team of digital transformation experts"
- **Action**: Navigate to `/careers`

### Interactive Elements
- **Card Hover Effects**: Scale, shadow, and icon animation
- **Responsive Carousel**: Desktop grid, mobile carousel
- **Coming Soon States**: Disabled cards with lock icons
- **Navigation**: Smooth scrolling to section via hash links

---

## Section 7: Knowledge Hub Section

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [SECTION HEADER]                         │
│                                                             │
│                    [SEGMENTED TABS]                         │
│                 Articles | Blogs | Events                   │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   CONTENT   │  │   CONTENT   │  │   CONTENT   │         │
│  │    CARD     │  │    CARD     │  │    CARD     │         │
│  │             │  │             │  │             │         │
│  │ • Image     │  │ • Image     │  │ • Image     │         │
│  │ • Title     │  │ • Title     │  │ • Title     │         │
│  │ • Excerpt   │  │ • Excerpt   │  │ • Excerpt   │         │
│  │ • Metadata  │  │ • Metadata  │  │ • Metadata  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│                    [PAGINATION]                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Design Specifications
- **Background**: `bg-gray-50`
- **Padding**: `py-16`
- **Container**: `container mx-auto px-4`

### Content Elements

#### 7.1 Section Header
- **Title**: "Stay Informed with Our Latest Digital Transformation Insights"
- **Typography**: `text-3xl font-bold text-gray-900 mb-3`
- **Description**: "Gain Actionable Insights to Lead Your Organization into the Next Phase of Digital Growth."

#### 7.2 Segmented Tabs
- **Design**: Rounded pill navigation with animated indicator
- **Tabs**: Articles, Blogs, Events
- **Animation**: Smooth sliding background indicator
- **Icons**: Newspaper, BookOpen, Calendar

#### 7.3 Content Grid
- **Layout**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Items per Page**: 6
- **Card Components**: ContentItemCard with hover effects
- **Content Types**:
  - **Articles**: DTMI thought leadership pieces
  - **Blogs**: Company blog posts
  - **Events**: Coming soon placeholder

#### 7.4 Pagination
- **Controls**: Previous/Next buttons with page numbers
- **Style**: Centered with disabled states
- **Navigation**: Updates content without page reload

### Interactive Elements
- **Tab Switching**: Animated transitions between content types
- **Content Cards**: Hover scaling and bookmark functionality
- **Pagination**: Smooth content updates
- **Bookmark System**: Local storage for saved items

---

## Section 8: Call to Action Section

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [LEFT CONTENT]                    [RIGHT FORM]             │
│                                                             │
│  • Main Headline                   ┌─────────────────────┐  │
│  • Description                     │                     │  │
│  • Benefits List                   │   CONTACT FORM      │  │
│    ✓ Unlock Efficiency             │                     │  │
│    ✓ Drive Innovation              │ • Name & Email      │  │
│    ✓ Achieve Growth                │ • Company & Phone   │  │
│                                    │ • Sector & Interest │  │
│                                    │ • Message           │  │
│                                    │                     │  │
│                                    │   [SUBMIT BUTTON]   │  │
│                                    └─────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Design Specifications
- **Background**: 
  - Image: `/images/Form_background.jpg`
  - Overlay: `bg-secondary-900/75`
- **Padding**: `py-20`
- **Container**: `container mx-auto px-4`
- **Layout**: `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`

### Content Elements

#### 8.1 Left Content Column
- **Main Headline**: "Your Path to Digital Excellence Starts Here"
- **Typography**: `text-3xl md:text-4xl lg:text-5xl font-bold text-white`
- **Description**: Value proposition and partnership messaging
- **Benefits List**: 3 key benefits with CheckCircle icons
- **Text Color**: White with opacity variations

#### 8.2 Right Form Column
- **Container**: `bg-white rounded-xl shadow-2xl p-8`
- **Title**: "Claim Your Free Consultation Today"
- **Form Fields**:
  - Name (required)
  - Email (required, validated)
  - Company Name
  - Phone Number (validated)
  - Sector Interest (dropdown)
  - General Interest (dropdown)
  - Message (required, textarea)

#### 8.3 Form Validation
- **Email Validation**: Real-time regex validation
- **Phone Validation**: Digits only, 7-15 characters
- **Required Fields**: Visual indicators and error states
- **Success State**: Confirmation message with checkmark

### Interactive Elements
- **Form Submission**: Dual integration (Airtable + FormSubmit)
- **Real-time Validation**: Field-level error display
- **Loading States**: Spinner during submission
- **Toast Notifications**: Success/error feedback
- **Privacy Notice**: GDPR-compliant disclosure

---

## Section 9: Footer

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [COMPANY INFO]  [QUICK LINKS]  [SERVICES]  [CONTACT]      │
│                                                             │
│  • Logo          • About        • Digital   • Address      │
│  • Description   • Services     • Strategy  • Phone        │
│  • Social Links  • Products     • Platform  • Email        │
│                  • Careers      • Advisory  • Hours        │
│                  • Contact      • Training                 │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  [COPYRIGHT]                              [LEGAL LINKS]    │
│  © 2024 DigitalQatalyst                   Privacy | Terms  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Design Specifications
- **Background**: `bg-secondary-900` (Dark navy)
- **Text Color**: White with opacity variations
- **Padding**: `py-12` main content, `py-6` bottom bar
- **Container**: `container mx-auto px-4`

### Content Elements

#### 9.1 Main Footer Content
- **Company Information**: Logo, mission statement, social media links
- **Quick Links**: Navigation to main pages
- **Services**: Links to service categories
- **Contact Information**: Address, phone, email, business hours

#### 9.2 Bottom Bar
- **Copyright**: Current year and company name
- **Legal Links**: Privacy Policy, Terms of Service
- **Layout**: Flex justify-between for alignment

### Interactive Elements
- **Social Media Links**: External links with hover effects
- **Newsletter Signup**: Email collection form
- **Link Hover States**: Color transitions and underlines
- **Responsive Collapse**: Mobile-friendly accordion sections

---

## Technical Implementation Notes

### Performance Optimizations
- **Lazy Loading**: Images and videos load on scroll
- **Code Splitting**: Component-level splitting for large sections
- **Animation Performance**: CSS transforms and GPU acceleration
- **Image Optimization**: WebP format with fallbacks

### Accessibility Features
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Tab order and focus management
- **Color Contrast**: WCAG AA compliance for text readability

### Responsive Design
- **Breakpoints**: Mobile-first approach with Tailwind breakpoints
- **Flexible Layouts**: CSS Grid and Flexbox for adaptability
- **Touch Interactions**: Mobile-optimized button sizes and gestures
- **Performance**: Optimized for mobile networks and devices

### Analytics Integration
- **Google Analytics 4**: Page views and user interactions
- **Custom Events**: Form submissions, video plays, CTA clicks
- **Conversion Tracking**: Lead generation and engagement metrics
- **Heat Mapping**: User behavior analysis integration points

---

## Content Management

### Dynamic Content Areas
- **Hero Section**: Editable headline and description
- **Statistics**: Updatable metrics and achievements
- **Testimonials**: CMS-managed client stories
- **Knowledge Hub**: Blog and article integration

### SEO Optimization
- **Meta Tags**: Dynamic title and description
- **Structured Data**: Organization and service markup
- **Open Graph**: Social media sharing optimization
- **Sitemap**: Automated generation for search engines

### Internationalization
- **Language Support**: Multi-language content structure
- **RTL Support**: Right-to-left language compatibility
- **Currency**: Regional pricing and contact information
- **Cultural Adaptation**: Region-specific content variations

---

This specification provides a comprehensive layout guide for the DigitalQatalyst home page, ensuring consistent implementation across all sections while maintaining the brand identity and user experience goals.