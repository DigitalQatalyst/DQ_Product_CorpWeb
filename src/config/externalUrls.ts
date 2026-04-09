/**
 * External URL configuration to address SonarQube security hotspots
 * Centralizes hardcoded URLs and makes them configurable via environment variables
 */

// Environment variable helpers
const getEnvVar = (key: string, fallback?: string): string => {
  return import.meta.env[key] || fallback || '';
};

/**
 * External service URLs configuration
 */
export const EXTERNAL_URLS = {
  // Form submission endpoints
  FORMSUBMIT_ENDPOINT: getEnvVar('VITE_FORMSUBMIT_ENDPOINT', 'https://formsubmit.co/info@digitalqatalyst.com'),
  
  // API endpoints
  AIRTABLE_API_BASE: 'https://api.airtable.com/v0',
  IPIFY_API: 'https://api.ipify.org?format=json',
  
  // Whitepaper and document URLs
  ECONOMY_40_WHITEPAPER: getEnvVar(
    'VITE_ECONOMY_40_WHITEPAPER_URL',
    'https://digital-qatalyst.shorthandstories.com/9e1cfaa6-d95f-4c07-af12-2bc59b0e3f1e/index.html'
  ),
  
  // CDN and external scripts
  GOOGLE_TAG_MANAGER: 'https://www.googletagmanager.com/gtag/js',
  
  // Social media links
  LINKEDIN_URL: getEnvVar('VITE_LINKEDIN_URL', 'https://www.linkedin.com/company/digitalqatalyst'),
  TWITTER_URL: getEnvVar('VITE_TWITTER_URL', 'https://twitter.com/digitalqatalyst'),
  INSTAGRAM_URL: getEnvVar('VITE_INSTAGRAM_URL', 'https://www.instagram.com/digitalqatalyst'),
  
  // Company URLs
  COMPANY_WEBSITE: getEnvVar('VITE_COMPANY_WEBSITE', 'https://digitalqatalyst.com'),
  THANK_YOU_PAGE: getEnvVar('VITE_THANK_YOU_PAGE', 'https://digitalqatalyst.com/thank-you'),
  
  // Azure/Microsoft endpoints
  AZURE_OPENAI_ENDPOINT: getEnvVar('VITE_AZURE_OPENAI_ENDPOINT'),
  MSAL_AUTHORITY: getEnvVar('VITE_MSAL_AUTHORITY'),
  
  // Supabase
  SUPABASE_URL: getEnvVar('VITE_SUPABASE_URL'),
} as const;

/**
 * URL validation and safety checks
 */
export function isValidHttpsUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Safe URL getter with validation
 */
export function getExternalUrl(key: keyof typeof EXTERNAL_URLS): string {
  const url = EXTERNAL_URLS[key];
  
  if (!url) {
    console.warn(`External URL not configured: ${key}`);
    return '';
  }
  
  if (!isValidHttpsUrl(url)) {
    console.warn(`Invalid HTTPS URL for ${key}: ${url}`);
    return '';
  }
  
  return url;
}

/**
 * Build safe API URL with parameters
 */
export function buildApiUrl(baseUrl: string, endpoint: string, params?: Record<string, string>): string {
  try {
    const url = new URL(endpoint, baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return url.toString();
  } catch (error) {
    console.error('Failed to build API URL:', { baseUrl, endpoint, params, error });
    throw new Error(`Invalid URL construction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate external URL configuration
 */
export function validateExternalUrls(): { isValid: boolean; missingUrls: string[] } {
  const requiredUrls = [
    'SUPABASE_URL',
    'AZURE_OPENAI_ENDPOINT',
    'MSAL_AUTHORITY'
  ] as const;
  
  const missingUrls: string[] = [];
  
  for (const urlKey of requiredUrls) {
    if (!EXTERNAL_URLS[urlKey]) {
      missingUrls.push(urlKey);
    }
  }
  
  return {
    isValid: missingUrls.length === 0,
    missingUrls
  };
}

/**
 * Safe external link props for React components
 */
export function getExternalLinkProps(url: string) {
  return {
    href: url,
    target: '_blank',
    rel: 'noopener noreferrer'
  };
}

/**
 * Common external URLs for easy access
 */
export const SAFE_EXTERNAL_URLS = {
  formSubmit: () => getExternalUrl('FORMSUBMIT_ENDPOINT'),
  economyWhitepaper: () => getExternalUrl('ECONOMY_40_WHITEPAPER'),
  linkedin: () => getExternalUrl('LINKEDIN_URL'),
  twitter: () => getExternalUrl('TWITTER_URL'),
  instagram: () => getExternalUrl('INSTAGRAM_URL'),
  companyWebsite: () => getExternalUrl('COMPANY_WEBSITE'),
  thankYouPage: () => getExternalUrl('THANK_YOU_PAGE'),
  airtableApi: () => getExternalUrl('AIRTABLE_API_BASE'),
  ipifyApi: () => getExternalUrl('IPIFY_API')
} as const;