# Google Analytics 4 (GA4) Setup Guide

## Overview
This guide will help you set up Google Analytics 4 for your DigitalQatalyst website to track page views, user behavior, and custom events.

## Step 1: Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **Admin** (gear icon in the bottom left)
4. In the **Account** column, select your account or create a new one
5. In the **Property** column, click **Create Property**
6. Fill in the property details:
   - **Property name**: DigitalQatalyst Website
   - **Reporting time zone**: Select your timezone
   - **Currency**: Select your currency
7. Click **Next**
8. Fill in business information and click **Create**
9. Accept the Terms of Service

## Step 2: Set Up a Data Stream

1. After creating the property, you'll be prompted to set up a data stream
2. Select **Web** as the platform
3. Enter your website details:
   - **Website URL**: https://digitalqatalyst.com (or your domain)
   - **Stream name**: DigitalQatalyst Main Website
4. Click **Create stream**

## Step 3: Get Your Measurement ID

1. After creating the stream, you'll see your **Measurement ID**
2. It will look like: `G-XXXXXXXXXX`
3. Copy this Measurement ID

## Step 4: Add Measurement ID to Your Project

1. Open your `.env` file
2. Find the line:
   ```
   VITE_GA_MEASUREMENT_ID=YOUR_GA4_MEASUREMENT_ID_HERE
   ```
3. Replace `YOUR_GA4_MEASUREMENT_ID_HERE` with your actual Measurement ID:
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
4. Save the file

## Step 5: Restart Your Development Server

After updating the `.env` file, restart your development server:

```bash
npm run dev
```

## Step 6: Verify Installation

### Method 1: Using Google Analytics Real-Time Reports
1. Go to your Google Analytics property
2. Click on **Reports** > **Realtime**
3. Open your website in a browser
4. You should see your visit appear in the real-time report within a few seconds

### Method 2: Using Browser Developer Tools
1. Open your website
2. Open browser DevTools (F12 or right-click > Inspect)
3. Go to the **Network** tab
4. Filter by "google-analytics" or "gtag"
5. Navigate to different pages
6. You should see requests being sent to Google Analytics

### Method 3: Using Google Tag Assistant
1. Install the [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Open your website
3. Click the Tag Assistant icon
4. Click **Enable** and refresh the page
5. You should see your GA4 tag listed and working

## What's Being Tracked

### Automatic Tracking
- **Page Views**: Every time a user navigates to a new page
- **Session Start**: When a user first visits your site
- **First Visit**: When a user visits for the first time
- **Engagement**: User interactions with your site

### Custom Events (Available)
You can track custom events using the `trackEvent` function:

```typescript
import { trackEvent } from './components/GoogleAnalytics';

// Example: Track button click
trackEvent('button_click', {
  button_name: 'Get Started',
  page: '/services'
});

// Example: Track form submission
trackEvent('form_submit', {
  form_name: 'Contact Form',
  form_location: '/consultation'
});

// Example: Track whitepaper download
trackEvent('whitepaper_download', {
  whitepaper_title: 'The Rise of Economy 4.0',
  user_email: 'user@example.com'
});
```

## Recommended Custom Events to Track

### 1. Whitepaper Access
Already implemented in `WhitepaperAccessModal.tsx`. You can enhance it:

```typescript
trackEvent('whitepaper_access', {
  whitepaper_title: whitepaperTitle,
  user_name: formData.fullName,
  user_email: formData.email
});
```

### 2. Product Interest
Track when users view product details:

```typescript
trackEvent('product_view', {
  product_name: product.name,
  product_code: product.code,
  category: product.category
});
```

### 3. Service Requests
Track when users submit service requests:

```typescript
trackEvent('service_request', {
  service_name: data.serviceInterest,
  company: data.company,
  industry: data.industry
});
```

### 4. Newsletter Signup
Track newsletter subscriptions:

```typescript
trackEvent('newsletter_signup', {
  source: 'footer',
  email: email
});
```

## Privacy Considerations

### GDPR Compliance
If you have users from the EU, you should:
1. Add a cookie consent banner
2. Only load GA4 after user consent
3. Provide an opt-out mechanism

### Data Anonymization
GA4 automatically anonymizes IP addresses, but you can enhance privacy:

```typescript
gtag('config', GA_MEASUREMENT_ID, {
  anonymize_ip: true,
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});
```

## Troubleshooting

### GA4 Not Tracking
1. **Check Measurement ID**: Ensure it's correct in `.env`
2. **Check Browser Console**: Look for errors related to gtag
3. **Ad Blockers**: Disable ad blockers for testing
4. **Dev Server**: Make sure you restarted after updating `.env`

### Events Not Showing
1. **Wait 24-48 hours**: Some reports take time to populate
2. **Check Real-Time**: Events should appear immediately in real-time reports
3. **Check Event Name**: Ensure event names don't have spaces or special characters

### Multiple Tracking Codes
If you see duplicate page views:
1. Check that GA4 is only initialized once
2. Ensure no other GA scripts are in `index.html`
3. Check for conflicting analytics plugins

## Advanced Configuration

### Enhanced Measurement
In GA4, go to **Admin** > **Data Streams** > Your stream > **Enhanced measurement**

Enable these for automatic tracking:
- ✅ Page views
- ✅ Scrolls
- ✅ Outbound clicks
- ✅ Site search
- ✅ Video engagement
- ✅ File downloads

### Custom Dimensions
Create custom dimensions in GA4 for better segmentation:
1. Go to **Admin** > **Custom definitions**
2. Click **Create custom dimension**
3. Examples:
   - User Type (Logged In / Guest)
   - Product Category
   - Service Interest
   - Industry

### Conversion Events
Mark important events as conversions:
1. Go to **Admin** > **Events**
2. Find your event (e.g., `form_submit`, `whitepaper_access`)
3. Toggle **Mark as conversion**

## Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [GA4 Best Practices](https://support.google.com/analytics/answer/9267735)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your Measurement ID is correct
3. Test in an incognito window (to avoid ad blockers)
4. Check Google Analytics real-time reports
