# Google Analytics 4 Implementation

## Overview
This application uses Google Analytics 4 (GA4) to track user interactions and page views.

## Setup
1. Add your GA4 Measurement ID to the `.env` file:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. The analytics are automatically initialized in the root layout.

## Tracked Events

### Button Clicks
- **Hero Section**: "Explore Services" and "Explore Products" buttons
- **Header**: "Get In Touch" buttons (Desktop, Mobile, Mobile Menu)
- **Service Cards**: Service interaction buttons
- **Product Cards**: Product interaction buttons

### Page Views
- Automatic page view tracking on route changes
- Custom page view events for specific sections

### Form Submissions
- Contact forms
- Newsletter signups
- Service inquiry forms

## Custom Events

### trackButtonClick(buttonName, location)
Tracks button clicks with context about where the button was clicked.

### trackFormSubmission(formName)
Tracks form submissions with the form identifier.

### trackServiceInteraction(serviceName, action)
Tracks interactions with service-related content.

### trackProductInteraction(productName, action)
Tracks interactions with product-related content.

## Usage Example

```typescript
import { trackButtonClick, trackFormSubmission } from '@/lib/analytics';

// Track a button click
const handleClick = () => {
  trackButtonClick('Download Brochure', 'Product Page');
};

// Track a form submission
const handleSubmit = () => {
  trackFormSubmission('Contact Form');
};
```

## Privacy Compliance
- Analytics data collection is mentioned in the privacy policy
- No personally identifiable information is tracked
- Users can opt-out through browser settings or ad blockers