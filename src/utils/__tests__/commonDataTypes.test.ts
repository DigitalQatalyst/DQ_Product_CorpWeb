/**
 * Tests for commonDataTypes utilities
 */

import {
  createServiceBenefit,
  createWhereToStartItem,
  createServiceArea,
  createFaq,
  createMediaItem,
  validateServiceDomainData,
  validateSectorData
} from '../commonDataTypes';

describe('Factory Functions', () => {
  describe('createServiceBenefit', () => {
    it('should create a service benefit object', () => {
      const benefit = createServiceBenefit('Test Title', 'Test Description', 'test-icon');
      
      expect(benefit).toEqual({
        title: 'Test Title',
        description: 'Test Description',
        icon: 'test-icon'
      });
    });
  });

  describe('createWhereToStartItem', () => {
    it('should create a where to start item object', () => {
      const item = createWhereToStartItem('Test Title', 'Test Description', 'test-icon');
      
      expect(item).toEqual({
        title: 'Test Title',
        description: 'Test Description',
        icon: 'test-icon'
      });
    });
  });

  describe('createServiceArea', () => {
    it('should create a service area object', () => {
      const area = createServiceArea('Test Title', 'Test Description', ['Feature 1', 'Feature 2']);
      
      expect(area).toEqual({
        title: 'Test Title',
        description: 'Test Description',
        features: ['Feature 1', 'Feature 2']
      });
    });
  });

  describe('createFaq', () => {
    it('should create a FAQ object', () => {
      const faq = createFaq('Test Question?', 'Test Answer');
      
      expect(faq).toEqual({
        question: 'Test Question?',
        answer: 'Test Answer'
      });
    });
  });

  describe('createMediaItem', () => {
    it('should create a media item with required fields', () => {
      const item = createMediaItem('1', 'Test Title', 'Test Description', '/test.jpg', 'test-slug');
      
      expect(item).toEqual({
        id: '1',
        title: 'Test Title',
        description: 'Test Description',
        imageUrl: '/test.jpg',
        slug: 'test-slug'
      });
    });

    it('should create a media item with optional fields', () => {
      const item = createMediaItem('1', 'Test Title', 'Test Description', '/test.jpg', 'test-slug', {
        category: 'Blog',
        tags: ['tag1', 'tag2'],
        author: 'John Doe'
      });
      
      expect(item).toEqual({
        id: '1',
        title: 'Test Title',
        description: 'Test Description',
        imageUrl: '/test.jpg',
        slug: 'test-slug',
        category: 'Blog',
        tags: ['tag1', 'tag2'],
        author: 'John Doe'
      });
    });
  });
});

describe('Validation Functions', () => {
  describe('validateServiceDomainData', () => {
    it('should return true for valid service domain data', () => {
      const validData = {
        hero: {
          title: 'Test Title',
          subtitle: 'Test Subtitle'
        },
        overview: {
          title: 'Overview Title'
        },
        benefits: [],
        whereToStart: [],
        serviceAreas: [],
        faqs: []
      };

      expect(validateServiceDomainData(validData)).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(validateServiceDomainData(null)).toBe(false);
      expect(validateServiceDomainData(undefined)).toBe(false);
    });

    it('should return false for non-object types', () => {
      expect(validateServiceDomainData('string')).toBe(false);
      expect(validateServiceDomainData(123)).toBe(false);
      expect(validateServiceDomainData(true)).toBe(false);
    });

    it('should return false for missing required fields', () => {
      const invalidData = {
        hero: {
          title: 'Test Title'
          // missing subtitle
        },
        overview: {
          title: 'Overview Title'
        },
        benefits: [],
        whereToStart: [],
        serviceAreas: [],
        faqs: []
      };

      expect(validateServiceDomainData(invalidData)).toBe(false);
    });

    it('should return false for invalid array fields', () => {
      const invalidData = {
        hero: {
          title: 'Test Title',
          subtitle: 'Test Subtitle'
        },
        overview: {
          title: 'Overview Title'
        },
        benefits: 'not an array',
        whereToStart: [],
        serviceAreas: [],
        faqs: []
      };

      expect(validateServiceDomainData(invalidData)).toBe(false);
    });
  });

  describe('validateSectorData', () => {
    it('should return true for valid sector data', () => {
      const validData = {
        id: '1',
        title: 'Test Sector',
        description: 'Test Description',
        slug: 'test-sector',
        overview: {},
        benefits: [],
        solutions: [],
        faqs: []
      };

      expect(validateSectorData(validData)).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(validateSectorData(null)).toBe(false);
      expect(validateSectorData(undefined)).toBe(false);
    });

    it('should return false for non-object types', () => {
      expect(validateSectorData('string')).toBe(false);
      expect(validateSectorData(123)).toBe(false);
    });

    it('should return false for missing required fields', () => {
      const invalidData = {
        id: '1',
        title: 'Test Sector',
        // missing description
        slug: 'test-sector',
        overview: {},
        benefits: [],
        solutions: [],
        faqs: []
      };

      expect(validateSectorData(invalidData)).toBe(false);
    });
  });
});