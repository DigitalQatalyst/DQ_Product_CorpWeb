import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize Google Analytics - optimized for static script
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId) {
    console.warn('Google Analytics Measurement ID is not configured');
    return;
  }

  // Check if gtag is already available (from static script)
  if (window.gtag) {
    console.log('✅ Google Analytics already loaded via static script');
    return;
  }

  console.log('🔍 Initializing Google Analytics dynamically:', measurementId);

  // Initialize dataLayer FIRST
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  // Load gtag.js script with error handling
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.onload = () => {
    console.log('✅ Google Analytics loaded successfully');
    
    // Initialize GA after script loads
    gtag('js', new Date());
    
    // Configuration
    gtag('config', measurementId, {
      send_page_view: true
    });
  };
  
  script.onerror = () => {
    console.error('❌ Failed to load Google Analytics script');
  };
  
  document.head.appendChild(script);
};

// Track page views
export const trackPageView = (path: string) => {
  if (!window.gtag) {
    console.warn('Google Analytics not initialized');
    return;
  }

  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;

  window.gtag('config', measurementId, {
    page_path: path,
  });
};

// Track custom events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (!window.gtag) {
    console.warn('Google Analytics not initialized');
    return;
  }

  window.gtag('event', eventName, eventParams);
};

// Component to handle route changes
export function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Only initialize if gtag is not already available
    if (!window.gtag) {
      initGA();
    } else {
      console.log('✅ Google Analytics already available');
    }
  }, []);

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

// Type declarations for window.gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
