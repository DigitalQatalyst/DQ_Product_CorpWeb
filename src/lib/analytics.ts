// Google Analytics 4 utility functions
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID!, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom events for DigitalQatalyst
export const trackButtonClick = (buttonName: string, location: string) => {
  event({
    action: 'click',
    category: 'Button',
    label: `${buttonName} - ${location}`,
  });
};

export const trackFormSubmission = (formName: string) => {
  event({
    action: 'submit',
    category: 'Form',
    label: formName,
  });
};

export const trackPageView = (pageName: string) => {
  event({
    action: 'page_view',
    category: 'Navigation',
    label: pageName,
  });
};

export const trackServiceInteraction = (serviceName: string, action: string) => {
  event({
    action: action,
    category: 'Service',
    label: serviceName,
  });
};

export const trackProductInteraction = (productName: string, action: string) => {
  event({
    action: action,
    category: 'Product',
    label: productName,
  });
};