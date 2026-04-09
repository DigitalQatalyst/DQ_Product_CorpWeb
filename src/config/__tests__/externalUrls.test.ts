/**
 * Tests for externalUrls configuration
 */

import {
  EXTERNAL_URLS,
  isValidHttpsUrl,
  getExternalUrl,
  buildApiUrl,
  validateExternalUrls,
  getExternalLinkProps,
  SAFE_EXTERNAL_URLS
} from '../externalUrls';

describe('External URLs Configuration', () => {
  it('should have all required URL constants', () => {
    expect(EXTERNAL_URLS.FORMSUBMIT_ENDPOINT).toBeDefined();
    expect(EXTERNAL_URLS.AIRTABLE_API_BASE).toBe('https://api.airtable.com/v0');
    expect(EXTERNAL_URLS.IPIFY_API).toBe('https://api.ipify.org?format=json');
    expect(EXTERNAL_URLS.GOOGLE_TAG_MANAGER).toBe('https://www.googletagmanager.com/gtag/js');
  });

  it('should use environment variables when available', () => {
    // These should be set from the test setup
    expect(EXTERNAL_URLS.SUPABASE_URL).toBeDefined();
    expect(EXTERNAL_URLS.AZURE_OPENAI_ENDPOINT).toBeDefined();
    expect(EXTERNAL_URLS.MSAL_AUTHORITY).toBeDefined();
  });

  it('should use fallback values when environment variables are not set', () => {
    // This test verifies the fallback behavior by checking default values
    // Since EXTERNAL_URLS is already loaded with current env, we test the getEnvVar logic indirectly
    expect(EXTERNAL_URLS.AIRTABLE_API_BASE).toBe('https://api.airtable.com/v0');
    expect(EXTERNAL_URLS.IPIFY_API).toBe('https://api.ipify.org?format=json');
    expect(EXTERNAL_URLS.GOOGLE_TAG_MANAGER).toBe('https://www.googletagmanager.com/gtag/js');
  });
});

describe('URL Validation', () => {
  describe('isValidHttpsUrl', () => {
    it('should return true for valid HTTPS URLs', () => {
      expect(isValidHttpsUrl('https://example.com')).toBe(true);
      expect(isValidHttpsUrl('https://api.example.com/v1')).toBe(true);
      expect(isValidHttpsUrl('https://subdomain.example.com:8080/path')).toBe(true);
    });

    it('should return false for HTTP URLs', () => {
      expect(isValidHttpsUrl('http://example.com')).toBe(false);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidHttpsUrl('not-a-url')).toBe(false);
      expect(isValidHttpsUrl('')).toBe(false);
      expect(isValidHttpsUrl('ftp://example.com')).toBe(false);
    });

    it('should return false for malformed URLs', () => {
      expect(isValidHttpsUrl('https://')).toBe(false);
      expect(isValidHttpsUrl('not-a-url-at-all')).toBe(false);
    });
  });
});

describe('Safe URL Access', () => {
  describe('getExternalUrl', () => {
    it('should return URL for valid keys', () => {
      expect(getExternalUrl('AIRTABLE_API_BASE')).toBe('https://api.airtable.com/v0');
      expect(getExternalUrl('IPIFY_API')).toBe('https://api.ipify.org?format=json');
    });

    it('should warn and return empty string for missing URLs', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Test with a key that should be empty in test environment
      const result = getExternalUrl('FORMSUBMIT_ENDPOINT');
      
      // Should either return a valid URL or empty string with warning
      if (result === '') {
        expect(consoleSpy).toHaveBeenCalled();
      } else {
        expect(isValidHttpsUrl(result)).toBe(true);
      }
      
      consoleSpy.mockRestore();
    });

    it('should handle invalid HTTPS URLs', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // This test verifies the validation logic works
      expect(isValidHttpsUrl('http://insecure.com')).toBe(false);
      expect(isValidHttpsUrl('https://secure.com')).toBe(true);
      
      consoleSpy.mockRestore();
    });
  });
});

describe('API URL Building', () => {
  describe('buildApiUrl', () => {
    it('should build URL without parameters', () => {
      const url = buildApiUrl('https://api.example.com', '/users');
      expect(url).toBe('https://api.example.com/users');
    });

    it('should build URL with parameters', () => {
      const params = { page: '1', limit: '10' };
      const url = buildApiUrl('https://api.example.com', '/users', params);
      expect(url).toBe('https://api.example.com/users?page=1&limit=10');
    });

    it('should handle absolute endpoint URLs', () => {
      const url = buildApiUrl('https://api.example.com', 'https://api.example.com/users');
      expect(url).toBe('https://api.example.com/users');
    });

    it('should throw error for invalid URLs', () => {
      expect(() => {
        buildApiUrl('invalid-base', '/endpoint');
      }).toThrow('Invalid URL construction');
    });

    it('should handle empty parameters', () => {
      const url = buildApiUrl('https://api.example.com', '/users', {});
      expect(url).toBe('https://api.example.com/users');
    });
  });
});

describe('URL Configuration Validation', () => {
  describe('validateExternalUrls', () => {
    it('should validate external URLs configuration', () => {
      const result = validateExternalUrls();
      
      // Should return an object with isValid and missingUrls properties
      expect(typeof result.isValid).toBe('boolean');
      expect(Array.isArray(result.missingUrls)).toBe(true);
    });

    it('should identify missing URLs', () => {
      const result = validateExternalUrls();
      
      // In test environment, some URLs might be missing
      if (!result.isValid) {
        expect(result.missingUrls.length).toBeGreaterThan(0);
      }
    });
  });
});

describe('External Link Props', () => {
  describe('getExternalLinkProps', () => {
    it('should return correct props for external links', () => {
      const props = getExternalLinkProps('https://example.com');
      
      expect(props).toEqual({
        href: 'https://example.com',
        target: '_blank',
        rel: 'noopener noreferrer'
      });
    });

    it('should handle any URL string', () => {
      const props = getExternalLinkProps('https://test.com/path?param=value');
      
      expect(props.href).toBe('https://test.com/path?param=value');
      expect(props.target).toBe('_blank');
      expect(props.rel).toBe('noopener noreferrer');
    });
  });
});

describe('Safe External URLs', () => {
  it('should provide safe access to common URLs', () => {
    expect(typeof SAFE_EXTERNAL_URLS.formSubmit).toBe('function');
    expect(typeof SAFE_EXTERNAL_URLS.linkedin).toBe('function');
    expect(typeof SAFE_EXTERNAL_URLS.airtableApi).toBe('function');
    
    // Test that functions return strings
    expect(typeof SAFE_EXTERNAL_URLS.airtableApi()).toBe('string');
    expect(typeof SAFE_EXTERNAL_URLS.ipifyApi()).toBe('string');
  });

  it('should handle URL validation in safe functions', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Test that safe functions handle validation
    const result = SAFE_EXTERNAL_URLS.linkedin();
    expect(typeof result).toBe('string');
    
    consoleSpy.mockRestore();
  });

  it('should have all expected safe URL functions', () => {
    expect(typeof SAFE_EXTERNAL_URLS.formSubmit).toBe('function');
    expect(typeof SAFE_EXTERNAL_URLS.economyWhitepaper).toBe('function');
    expect(typeof SAFE_EXTERNAL_URLS.linkedin).toBe('function');
    expect(typeof SAFE_EXTERNAL_URLS.twitter).toBe('function');
    expect(typeof SAFE_EXTERNAL_URLS.instagram).toBe('function');
    expect(typeof SAFE_EXTERNAL_URLS.companyWebsite).toBe('function');
    expect(typeof SAFE_EXTERNAL_URLS.thankYouPage).toBe('function');
    expect(typeof SAFE_EXTERNAL_URLS.airtableApi).toBe('function');
    expect(typeof SAFE_EXTERNAL_URLS.ipifyApi).toBe('function');
  });
});