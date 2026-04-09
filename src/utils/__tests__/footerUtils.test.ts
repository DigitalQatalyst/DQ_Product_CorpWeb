/**
 * Tests for footerUtils
 */

import { Target } from 'lucide-react';
import {
  createFooterLink,
  createFooterSection,
  createSocialLink,
  COMMON_FOOTER_SECTIONS,
  createInitialNewsletterState,
  setNewsletterSubmittingState,
  setNewsletterSuccessState,
  setNewsletterErrorState,
  toggleAccordionSection,
  FOOTER_BREAKPOINTS,
  FOOTER_STYLES,
  validateFooterConfig,
  type FooterLink,
  type FooterSection,
  type SocialLink,
  type NewsletterState,
  type AccordionState
} from '../footerUtils';

describe('Footer Factory Functions', () => {
  describe('createFooterLink', () => {
    it('should create a footer link with default external false', () => {
      const link = createFooterLink('Home', '/');
      
      expect(link).toEqual({
        label: 'Home',
        href: '/',
        external: false
      });
    });

    it('should create an external footer link', () => {
      const link = createFooterLink('External', 'https://example.com', true);
      
      expect(link).toEqual({
        label: 'External',
        href: 'https://example.com',
        external: true
      });
    });
  });

  describe('createFooterSection', () => {
    it('should create a footer section', () => {
      const links: FooterLink[] = [
        createFooterLink('Link 1', '/link1'),
        createFooterLink('Link 2', '/link2')
      ];
      const section = createFooterSection('Test Section', links);
      
      expect(section).toEqual({
        title: 'Test Section',
        links
      });
    });
  });

  describe('createSocialLink', () => {
    it('should create a social link', () => {
      const link = createSocialLink('LinkedIn', 'https://linkedin.com', Target);
      
      expect(link).toEqual({
        name: 'LinkedIn',
        href: 'https://linkedin.com',
        icon: Target
      });
    });
  });
});

describe('Common Footer Sections', () => {
  it('should have services section with correct structure', () => {
    expect(COMMON_FOOTER_SECTIONS.services).toBeDefined();
    expect(COMMON_FOOTER_SECTIONS.services.title).toBe('Services');
    expect(Array.isArray(COMMON_FOOTER_SECTIONS.services.links)).toBe(true);
    expect(COMMON_FOOTER_SECTIONS.services.links.length).toBeGreaterThan(0);
  });

  it('should have company section with correct structure', () => {
    expect(COMMON_FOOTER_SECTIONS.company).toBeDefined();
    expect(COMMON_FOOTER_SECTIONS.company.title).toBe('Company');
    expect(Array.isArray(COMMON_FOOTER_SECTIONS.company.links)).toBe(true);
  });

  it('should have resources section with correct structure', () => {
    expect(COMMON_FOOTER_SECTIONS.resources).toBeDefined();
    expect(COMMON_FOOTER_SECTIONS.resources.title).toBe('Resources');
    expect(Array.isArray(COMMON_FOOTER_SECTIONS.resources.links)).toBe(true);
  });

  it('should have legal section with correct structure', () => {
    expect(COMMON_FOOTER_SECTIONS.legal).toBeDefined();
    expect(COMMON_FOOTER_SECTIONS.legal.title).toBe('Legal');
    expect(Array.isArray(COMMON_FOOTER_SECTIONS.legal.links)).toBe(true);
  });
});

describe('Newsletter State Management', () => {
  describe('createInitialNewsletterState', () => {
    it('should create initial newsletter state', () => {
      const state = createInitialNewsletterState();
      
      expect(state).toEqual({
        email: '',
        isValid: true,
        isSubmitted: false,
        isSubmitting: false,
        error: null
      });
    });
  });

  describe('setNewsletterSubmittingState', () => {
    it('should set submitting state', () => {
      const initialState = createInitialNewsletterState();
      const submittingState = setNewsletterSubmittingState(initialState);
      
      expect(submittingState).toEqual({
        ...initialState,
        isSubmitting: true,
        error: null
      });
    });
  });

  describe('setNewsletterSuccessState', () => {
    it('should set success state and clear email', () => {
      const initialState: NewsletterState = {
        email: 'test@example.com',
        isValid: true,
        isSubmitted: false,
        isSubmitting: true,
        error: null
      };
      const successState = setNewsletterSuccessState(initialState);
      
      expect(successState).toEqual({
        email: '',
        isValid: true,
        isSubmitted: true,
        isSubmitting: false,
        error: null
      });
    });
  });

  describe('setNewsletterErrorState', () => {
    it('should set error state', () => {
      const initialState = createInitialNewsletterState();
      const errorMessage = 'Invalid email';
      const errorState = setNewsletterErrorState(initialState, errorMessage);
      
      expect(errorState).toEqual({
        ...initialState,
        isSubmitting: false,
        isSubmitted: false,
        error: errorMessage
      });
    });
  });
});

describe('Accordion State Management', () => {
  describe('toggleAccordionSection', () => {
    it('should toggle section from false to true', () => {
      const initialState: AccordionState = { section1: false };
      const newState = toggleAccordionSection(initialState, 'section1');
      
      expect(newState).toEqual({ section1: true });
    });

    it('should toggle section from true to false', () => {
      const initialState: AccordionState = { section1: true };
      const newState = toggleAccordionSection(initialState, 'section1');
      
      expect(newState).toEqual({ section1: false });
    });

    it('should add new section as true if not exists', () => {
      const initialState: AccordionState = {};
      const newState = toggleAccordionSection(initialState, 'newSection');
      
      expect(newState).toEqual({ newSection: true });
    });

    it('should preserve other sections', () => {
      const initialState: AccordionState = { section1: true, section2: false };
      const newState = toggleAccordionSection(initialState, 'section1');
      
      expect(newState).toEqual({ section1: false, section2: false });
    });
  });
});

describe('Footer Constants', () => {
  it('should have correct breakpoint classes', () => {
    expect(FOOTER_BREAKPOINTS.mobile).toBe('md:hidden');
    expect(FOOTER_BREAKPOINTS.desktop).toBe('hidden md:block');
    expect(FOOTER_BREAKPOINTS.accordion).toBe('block md:hidden');
  });

  it('should have footer styles defined', () => {
    expect(FOOTER_STYLES.container).toBeDefined();
    expect(FOOTER_STYLES.section).toBeDefined();
    expect(FOOTER_STYLES.sectionTitle).toBeDefined();
    expect(FOOTER_STYLES.link).toBeDefined();
    expect(FOOTER_STYLES.newsletter).toBeDefined();
    expect(FOOTER_STYLES.accordion).toBeDefined();
  });

  it('should have newsletter styles', () => {
    expect(FOOTER_STYLES.newsletter.container).toBeDefined();
    expect(FOOTER_STYLES.newsletter.input).toBeDefined();
    expect(FOOTER_STYLES.newsletter.button).toBeDefined();
    expect(FOOTER_STYLES.newsletter.error).toBeDefined();
    expect(FOOTER_STYLES.newsletter.success).toBeDefined();
  });

  it('should have accordion styles', () => {
    expect(FOOTER_STYLES.accordion.button).toBeDefined();
    expect(FOOTER_STYLES.accordion.content).toBeDefined();
    expect(FOOTER_STYLES.accordion.border).toBeDefined();
  });
});

describe('Footer Validation', () => {
  describe('validateFooterConfig', () => {
    it('should return true for valid config', () => {
      const validConfig = {
        sections: [],
        socialLinks: []
      };
      
      expect(validateFooterConfig(validConfig)).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(validateFooterConfig(null)).toBe(false);
      expect(validateFooterConfig(undefined)).toBe(false);
    });

    it('should return false for non-object types', () => {
      expect(validateFooterConfig('string')).toBe(false);
      expect(validateFooterConfig(123)).toBe(false);
      expect(validateFooterConfig(true)).toBe(false);
    });

    it('should return false for missing sections', () => {
      const invalidConfig = {
        socialLinks: []
      };
      
      expect(validateFooterConfig(invalidConfig)).toBe(false);
    });

    it('should return false for missing socialLinks', () => {
      const invalidConfig = {
        sections: []
      };
      
      expect(validateFooterConfig(invalidConfig)).toBe(false);
    });

    it('should return false for non-array sections', () => {
      const invalidConfig = {
        sections: 'not an array',
        socialLinks: []
      };
      
      expect(validateFooterConfig(invalidConfig)).toBe(false);
    });

    it('should return false for non-array socialLinks', () => {
      const invalidConfig = {
        sections: [],
        socialLinks: 'not an array'
      };
      
      expect(validateFooterConfig(invalidConfig)).toBe(false);
    });
  });
});