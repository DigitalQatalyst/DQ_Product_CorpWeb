# Google Analytics 4 (GA4) Setup Guide

## Overview
This guide walks you through setting up Google Analytics 4 for the DigitalQatalyst website to track blog performance and user engagement.

## Step 1: Create GA4 Property

### 1.1 Google Analytics Account Setup
1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring" or "Create Property"

### 1.2 Property Configuration
```
Property Details:
├── Property name: "DigitalQatalyst Corporate Website"
├── Reporting time zone: [Your Business Timezone]
├── Currency: [Your Business Currency]
└── Industry Category: "Technology" or "Professional Services"

Data Stream Setup:
├── Platform: Web
├── Website URL: https://digitalqatalyst.com
├── Stream name: "DigitalQatalyst Web Stream"
└── Enhanced measurement: Enable all options
```

### 1.3 Get Measurement ID
After creating the property, copy your **Measurement ID** (format: G-XXXXXXXXXX)

## Step 2: Environment Configuration

### 2.1 Add GA4 Measurement ID
Create or update your `.env` file:
```bash
# Google Analytics 4 Configuration
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 2.2 Restart Development Server
```bash
npm run dev
# or
yarn dev
```

## Step 3: Verify Installation

### 3.1 Real-time Reports
1. Go to Google Analytics → Reports → Realtime
2. Navigate to your website
3. Verify that your visit appears in real-time data

### 3.2 Debug with GA Debugger
1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
2. Enable the debugger
3. Check browser console for GA4 events

## Step 4: Blog-Specific Tracking Events

### 4.1 Automatic Events
The following events are tracked automatically:
- `page_view` - When users visit any page
- `blog_view` - When users view a blog post
- `blog_scroll_25/50/75/90` - Scroll depth milestones
- `blog_time_spent` - Time spent reading
- `blog_engagement` - Overall engagement metrics

### 4.2 Manual Events
Track these events manually in your components:
```typescript
import { trackBlogEvent, trackConversion } from '../utils/analytics';

// Track newsletter signup
trackConversion('newsletter_signup', {
  conversion_type: 'newsletter',
  source_page: 'blog_post',
});

// Track social media share
trackBlogEvent('blog_share', {
  blog_id: 'blog-id',
  blog_title: 'Blog Title',
});
```

## Step 5: Enhanced Ecommerce Setup (Optional)

### 5.1 Conversion Goals
Set up conversion goals in GA4:
1. Go to Configure → Events
2. Click "Create event"
3. Set up conversions for:
   - Newsletter signups
   - Contact form submissions
   - Resource downloads
   - Consultation requests

### 5.2 Custom Dimensions
Create custom dimensions for better blog tracking:
```
Custom Dimensions:
├── blog_category (Event-scoped)
├── blog_author (Event-scoped)
├── blog_reading_time (Event-scoped)
└── user_engagement_level (User-scoped)
```

## Step 6: Google Search Console Integration

### 6.1 Link Properties
1. Go to GA4 → Admin → Property Settings
2. Click "Search Console links"
3. Link your Search Console property
4. Enable data sharing

### 6.2 Verify Integration
Check that organic search data flows from Search Console to GA4.

## Step 7: Custom Reports and Dashboards

### 7.1 Blog Performance Report
Create a custom report for blog analytics:
```
Dimensions:
├── Page title and screen name
├── Blog category (custom dimension)
├── Blog author (custom dimension)
└── Source/Medium

Metrics:
├── Views
├── Engaged sessions
├── Average engagement time
├── Scroll depth (custom metric)
└── Conversions
```

### 7.2 Looker Studio Dashboard
1. Go to [Looker Studio](https://datastudio.google.com/)
2. Create new report
3. Connect GA4 data source
4. Build blog performance dashboard

## Step 8: Data Privacy and Compliance

### 8.1 Cookie Consent
Implement cookie consent banner:
```typescript
// Add to your cookie consent implementation
const handleAnalyticsConsent = (consent: boolean) => {
  if (consent) {
    initGA();
  } else {
    // Disable analytics
    window.gtag('consent', 'update', {
      analytics_storage: 'denied'
    });
  }
};
```

### 8.2 Data Retention
Configure data retention in GA4:
1. Go to Admin → Data Settings → Data Retention
2. Set retention period (recommended: 26 months)
3. Enable "Reset on new activity"

## Step 9: Monitoring and Alerts

### 9.1 Intelligence Alerts
Set up alerts for:
- Significant traffic increases/decreases
- Conversion rate changes
- Technical issues (high bounce rate)

### 9.2 Regular Reporting
Schedule weekly/monthly reports:
- Blog performance summary
- Top-performing content
- Conversion funnel analysis
- User behavior insights

## Troubleshooting

### Common Issues
1. **Events not tracking**: Check console for errors, verify Measurement ID
2. **Real-time data missing**: Ensure ad blockers are disabled
3. **Conversion tracking**: Verify event names match GA4 configuration

### Debug Commands
```javascript
// Check if GA4 is loaded
console.log(window.gtag);

// Check dataLayer
console.log(window.dataLayer);

// Test event tracking
window.gtag('event', 'test_event', {
  event_category: 'Test',
  event_label: 'Manual Test'
});
```

## Key Metrics to Monitor

### Blog Performance KPIs
- **Organic Traffic Growth**: Month-over-month increase
- **Engagement Rate**: Time on page, scroll depth
- **Conversion Rate**: Newsletter signups, contact forms
- **Content Performance**: Top-performing blog posts
- **User Journey**: Blog → conversion funnel

### SEO Performance
- **Keyword Rankings**: Track target keywords
- **Click-Through Rate**: From search results
- **Bounce Rate**: Content quality indicator
- **Return Visitors**: Content stickiness

## Next Steps
1. Complete GA4 property setup
2. Add Measurement ID to environment variables
3. Deploy to production
4. Verify tracking in real-time reports
5. Set up custom reports and dashboards
6. Monitor performance weekly

For additional support, refer to [Google Analytics Help Center](https://support.google.com/analytics/) or contact the development team.