/**
 * DigitalQatalyst Brand Configuration
 * Central source of truth for brand identity, colors, and messaging
 */

export const BRAND = {
  name: 'DigitalQatalyst',
  shortName: 'DQ',
  tagline: 'Catalyzing Digital Transformation',
  description: 'Your partner in digital transformation. We help businesses accelerate their digital journey through innovative solutions, expert consulting, and cutting-edge technology.',
  
  // Contact Information
  contact: {
    email: 'info@digitalqatalyst.com',
    phone: '+971 XX XXX XXXX',
    address: 'Abu Dhabi, UAE',
  },

  // Social Media
  social: {
    linkedin: 'https://linkedin.com/company/digitalqatalyst',
    twitter: 'https://twitter.com/digitalqatalyst',
    facebook: 'https://facebook.com/digitalqatalyst',
    instagram: 'https://instagram.com/digitalqatalyst',
  },

  // Brand Colors (matching Tailwind config)
  colors: {
    primary: '#FF6B4D',
    secondary: '#030F35',
    accent: '#FF6B4D',
    teal: '#00D4C5',
    purple: '#8B5CF6',
  },

  // Typography
  fonts: {
    display: 'Plus Jakarta Sans, sans-serif',
    body: 'DM Sans, sans-serif',
  },
} as const;

export const COMPANY_INFO = {
  legalName: 'DigitalQatalyst LLC',
  founded: '2020',
  headquarters: 'Abu Dhabi, UAE',
  industry: 'Digital Transformation & Technology Consulting',
} as const;

export const SEO_DEFAULTS = {
  title: 'DigitalQatalyst - Digital Transformation Platform',
  description: 'Your partner in digital transformation. Explore our services, products, and resources to accelerate your digital journey.',
  keywords: 'digital transformation, technology consulting, digital solutions, UAE, Abu Dhabi, innovation',
  ogImage: '/og-image.png',
} as const;
