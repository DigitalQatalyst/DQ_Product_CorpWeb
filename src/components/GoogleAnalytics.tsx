import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize Google Analytics with direct approach
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId) {
    console.warn('Google Analytics Measurement ID is not configured');
    return;
  }

  console.log('🔍 Initializing Google Analytics:', measurementId);

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

    // Send initial events after a short delay
    setTimeout(() => {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
      
      gtag('event', 'session_start');
    }, 1000);
  };
  
  script.onerror = () => {
    console.error('❌ Failed to load Google Analytics script');
  };
  
  document.head.appendChild(script);
};

// Track page views
export const trackPageView = (path: string) => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId || !window.gtag) {
    return;
  }

  window.gtag('config', measurementId, {
    page_path: path,
  });
};

// Track custom events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId || !window.gtag) {
    return;
  }

  window.gtag('event', eventName, eventParams);
};

// Component to handle route changes
export function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Initialize GA on mount
    initGA();
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
