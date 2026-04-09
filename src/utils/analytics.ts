// Google Analytics 4 Configuration and Event Tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// GA4 Configuration
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

// Initialize Google Analytics - optimized for static script
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('GA4 Measurement ID not found. Please set VITE_GA_MEASUREMENT_ID in your environment variables.');
    return;
  }

  // Check if gtag is already available (from static script)
  if (globalThis.gtag && typeof globalThis.gtag === 'function') {
    return;
  }

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  globalThis.dataLayer = globalThis.dataLayer || [];
  globalThis.gtag = function gtag(...args: unknown[]) {
    globalThis.dataLayer.push(args);
  };

  globalThis.gtag('js', new Date());
  globalThis.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: globalThis.location.href,
    send_page_view: true,
  });
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (!globalThis.gtag || typeof globalThis.gtag !== 'function') {
    console.warn('Google Analytics not initialized');
    return;
  }
  
  globalThis.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title,
    page_location: globalThis.location.href,
  });
};

// Track blog-specific events
export const trackBlogEvent = (eventName: string, parameters: {
  blog_title?: string;
  blog_category?: string;
  blog_author?: string;
  blog_id?: string;
  engagement_time?: number;
  scroll_depth?: number;
}) => {
  if (!globalThis.gtag || typeof globalThis.gtag !== 'function') {
    console.warn('Google Analytics not initialized');
    return;
  }

  globalThis.gtag('event', eventName, {
    event_category: 'Blog',
    ...parameters,
  });
};

// Track conversion events
export const trackConversion = (eventName: string, parameters: {
  value?: number;
  currency?: string;
  conversion_type?: string;
  source_page?: string;
}) => {
  if (!globalThis.gtag || typeof globalThis.gtag !== 'function') {
    console.warn('Google Analytics not initialized');
    return;
  }

  globalThis.gtag('event', eventName, {
    event_category: 'Conversion',
    ...parameters,
  });
};

// Track user engagement
export const trackEngagement = (eventName: string, parameters: {
  engagement_time_msec?: number;
  page_title?: string;
  page_location?: string;
}) => {
  if (!globalThis.gtag || typeof globalThis.gtag !== 'function') {
    console.warn('Google Analytics not initialized');
    return;
  }

  globalThis.gtag('event', eventName, {
    event_category: 'Engagement',
    ...parameters,
  });
};

// Track search events
export const trackSearch = (searchTerm: string, results?: number) => {
  if (!globalThis.gtag || typeof globalThis.gtag !== 'function') {
    console.warn('Google Analytics not initialized');
    return;
  }

  globalThis.gtag('event', 'search', {
    search_term: searchTerm,
    results_count: results,
  });
};

// Track newsletter signup
export const trackNewsletterSignup = (source: string) => {
  trackConversion('newsletter_signup', {
    conversion_type: 'newsletter',
    source_page: source,
  });
};

// Track contact form submission
export const trackContactForm = (formType: string) => {
  trackConversion('contact_form_submit', {
    conversion_type: 'contact',
    source_page: formType,
  });
};

// Track file downloads
export const trackDownload = (fileName: string, fileType: string) => {
  if (!globalThis.gtag || typeof globalThis.gtag !== 'function') {
    console.warn('Google Analytics not initialized');
    return;
  }

  globalThis.gtag('event', 'file_download', {
    event_category: 'Downloads',
    file_name: fileName,
    file_type: fileType,
  });
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText?: string) => {
  if (!globalThis.gtag || typeof globalThis.gtag !== 'function') {
    console.warn('Google Analytics not initialized');
    return;
  }

  globalThis.gtag('event', 'click', {
    event_category: 'External Links',
    event_label: url,
    link_text: linkText,
  });
};

// Track social media clicks
export const trackSocialClick = (platform: string, action: string) => {
  if (!globalThis.gtag || typeof globalThis.gtag !== 'function') {
    console.warn('Google Analytics not initialized');
    return;
  }

  globalThis.gtag('event', 'social_click', {
    event_category: 'Social Media',
    social_platform: platform,
    social_action: action,
  });
};