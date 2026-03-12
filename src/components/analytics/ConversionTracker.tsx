// Conversion Tracking Component
import React from 'react';
import { trackNewsletterSignup, trackContactForm, trackDownload, trackSocialClick } from '../../utils/analytics';

interface ConversionTrackerProps {
  children: React.ReactNode;
  type: 'newsletter' | 'contact' | 'download' | 'social';
  source?: string;
  fileName?: string;
  fileType?: string;
  platform?: string;
  action?: string;
}

export const ConversionTracker: React.FC<ConversionTrackerProps> = ({
  children,
  type,
  source = '',
  fileName = '',
  fileType = '',
  platform = '',
  action = '',
}) => {
  const handleClick = () => {
    switch (type) {
      case 'newsletter':
        trackNewsletterSignup(source);
        break;
      case 'contact':
        trackContactForm(source);
        break;
      case 'download':
        trackDownload(fileName, fileType);
        break;
      case 'social':
        trackSocialClick(platform, action);
        break;
    }
  };

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
};

// Usage Examples:
/*
// Newsletter signup tracking
<ConversionTracker type="newsletter" source="blog_sidebar">
  <button>Subscribe to Newsletter</button>
</ConversionTracker>

// Contact form tracking
<ConversionTracker type="contact" source="contact_page">
  <button>Send Message</button>
</ConversionTracker>

// File download tracking
<ConversionTracker type="download" fileName="whitepaper.pdf" fileType="pdf">
  <a href="/downloads/whitepaper.pdf">Download Whitepaper</a>
</ConversionTracker>

// Social media tracking
<ConversionTracker type="social" platform="linkedin" action="share">
  <button>Share on LinkedIn</button>
</ConversionTracker>
*/