/**
 * Tests for serviceDetailUtils
 */

import { Target } from 'lucide-react';
import {
  createServiceCta,
  createServiceFaq,
  createServiceStat,
  createServiceCard,
  createBlueprintSection,
  createIndustryExpertise,
  COMMON_SERVICE_FAQS,
  COMMON_SERVICE_CTAS,
  COMMON_SERVICE_STATS,
  validateServiceDetailContent,
  type ServiceCta,
  type ServiceFaq,
  type ServiceStat,
  type ServiceCard,
  type ServiceBlueprintSection,
  type ServiceIndustryExpertise,
  type ServiceDetailContent
} from '../serviceDetailUtils';

describe('Service Detail Factory Functions', () => {
  describe('createServiceCta', () => {
    it('should create a service CTA', () => {
      const cta = createServiceCta('Get Started', '/consultation');
      
      expect(cta).toEqual({
        label: 'Get Started',
        href: '/consultation'
      });
    });
  });

  describe('createServiceFaq', () => {
    it('should create a service FAQ', () => {
      const faq = createServiceFaq('What is this?', 'This is a test.');
      
      expect(faq).toEqual({
        question: 'What is this?',
        answer: 'This is a test.'
      });
    });
  });

  describe('createServiceStat', () => {
    it('should create a service stat', () => {
      const stat = createServiceStat('99%', 'Success Rate');
      
      expect(stat).toEqual({
        value: '99%',
        label: 'Success Rate'
      });
    });
  });

  describe('createServiceCard', () => {
    it('should create a service card', () => {
      const card = createServiceCard(Target, 'Test Card', 'Test Description');
      
      expect(card).toEqual({
        icon: Target,
        title: 'Test Card',
        description: 'Test Description'
      });
    });
  });

  describe('createBlueprintSection', () => {
    it('should create a blueprint section', () => {
      const primaryCta = createServiceCta('Primary', '/primary');
      const secondaryCta = createServiceCta('Secondary', '/secondary');
      const faqs = [createServiceFaq('Q1?', 'A1')];
      
      const section = createBlueprintSection(
        'Test Title',
        'Test Description',
        primaryCta,
        secondaryCta,
        faqs,
        '/primary.jpg',
        '/overlay.jpg'
      );
      
      expect(section).toEqual({
        title: 'Test Title',
        description: 'Test Description',
        primaryCta,
        secondaryCta,
        faqs,
        imagePrimary: '/primary.jpg',
        imageOverlay: '/overlay.jpg'
      });
    });
  });

  describe('createIndustryExpertise', () => {
    it('should create industry expertise section', () => {
      const cards = [createServiceCard(Target, 'Card 1', 'Description 1')];
      
      const expertise = createIndustryExpertise(
        'Expertise Title',
        'Expertise Description',
        'Learn More',
        cards
      );
      
      expect(expertise).toEqual({
        title: 'Expertise Title',
        description: 'Expertise Description',
        ctaLabel: 'Learn More',
        cards
      });
    });
  });
});

describe('Common Service Data', () => {
  describe('COMMON_SERVICE_FAQS', () => {
    it('should have whatIsDBP FAQ', () => {
      const faq = COMMON_SERVICE_FAQS.whatIsDBP;
      
      expect(faq.question).toBe('What is a DBP?');
      expect(faq.answer).toContain('Digital Business Platform');
    });

    it('should generate whatMakesDifferent FAQ with service name', () => {
      const serviceName = 'Test Service';
      const faq = COMMON_SERVICE_FAQS.whatMakesDifferent(serviceName);
      
      expect(faq.question).toContain(serviceName);
      expect(faq.answer).toContain(serviceName);
    });

    it('should generate whatDeliverables FAQ with service name', () => {
      const serviceName = 'Test Service';
      const faq = COMMON_SERVICE_FAQS.whatDeliverables(serviceName);
      
      expect(faq.question).toContain(serviceName);
      expect(faq.answer).toContain('discovery workshops');
    });
  });

  describe('COMMON_SERVICE_CTAS', () => {
    it('should have getStarted CTA', () => {
      expect(COMMON_SERVICE_CTAS.getStarted).toEqual({
        label: 'Get Started',
        href: '/consultation'
      });
    });

    it('should have exploreServices CTA', () => {
      expect(COMMON_SERVICE_CTAS.exploreServices).toEqual({
        label: 'Explore Service Domains',
        href: '/services'
      });
    });

    it('should have bookConsultation CTA', () => {
      expect(COMMON_SERVICE_CTAS.bookConsultation).toEqual({
        label: 'Book Consultation',
        href: '/consultation'
      });
    });

    it('should have learnMore CTA', () => {
      expect(COMMON_SERVICE_CTAS.learnMore).toEqual({
        label: 'Learn More',
        href: '#overview'
      });
    });
  });

  describe('COMMON_SERVICE_STATS', () => {
    it('should have traditionalSuccessRate stat', () => {
      expect(COMMON_SERVICE_STATS.traditionalSuccessRate).toEqual({
        value: '30%',
        label: 'Approximate success rate of traditional digital transformations.'
      });
    });

    it('should have ourSuccessRate stat', () => {
      expect(COMMON_SERVICE_STATS.ourSuccessRate).toEqual({
        value: '99%',
        label: 'Success rate of transformations with our approach.'
      });
    });

    it('should have platformsDesigned stat', () => {
      expect(COMMON_SERVICE_STATS.platformsDesigned).toEqual({
        value: '100+',
        label: 'Digital Business Platforms designed to date.'
      });
    });

    it('should have yearsExperience stat', () => {
      expect(COMMON_SERVICE_STATS.yearsExperience).toEqual({
        value: '15+',
        label: 'Years designing Digital Business Platforms globally.'
      });
    });
  });
});

describe('Service Detail Validation', () => {
  describe('validateServiceDetailContent', () => {
    it('should return true for valid service detail content', () => {
      const validContent: ServiceDetailContent = {
        hero: {
          title: 'Test Service',
          subtitle: 'Test Subtitle',
          backgroundImage: '/bg.jpg',
          breadcrumbs: []
        },
        blueprintSection: {
          title: 'Blueprint',
          description: 'Description',
          primaryCta: createServiceCta('Primary', '/primary'),
          secondaryCta: createServiceCta('Secondary', '/secondary'),
          faqs: [],
          imagePrimary: '/primary.jpg',
          imageOverlay: '/overlay.jpg'
        },
        stats: [createServiceStat('99%', 'Success')],
        industryExpertise: {
          title: 'Expertise',
          description: 'Description',
          ctaLabel: 'Learn More',
          cards: [createServiceCard(Target, 'Card', 'Description')]
        }
      };
      
      expect(validateServiceDetailContent(validContent)).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(validateServiceDetailContent(null)).toBe(false);
      expect(validateServiceDetailContent(undefined)).toBe(false);
    });

    it('should return false for non-object types', () => {
      expect(validateServiceDetailContent('string')).toBe(false);
      expect(validateServiceDetailContent(123)).toBe(false);
      expect(validateServiceDetailContent(true)).toBe(false);
    });

    it('should return false for missing hero', () => {
      const invalidContent = {
        blueprintSection: {},
        stats: [],
        industryExpertise: { cards: [] }
      };
      
      expect(validateServiceDetailContent(invalidContent)).toBe(false);
    });

    it('should return false for invalid hero', () => {
      const invalidContent = {
        hero: 'not an object',
        blueprintSection: {},
        stats: [],
        industryExpertise: { cards: [] }
      };
      
      expect(validateServiceDetailContent(invalidContent)).toBe(false);
    });

    it('should return false for hero without title', () => {
      const invalidContent = {
        hero: { subtitle: 'Test' },
        blueprintSection: {},
        stats: [],
        industryExpertise: { cards: [] }
      };
      
      expect(validateServiceDetailContent(invalidContent)).toBe(false);
    });

    it('should return false for missing blueprintSection', () => {
      const invalidContent = {
        hero: { title: 'Test' },
        stats: [],
        industryExpertise: { cards: [] }
      };
      
      expect(validateServiceDetailContent(invalidContent)).toBe(false);
    });

    it('should return false for missing stats', () => {
      const invalidContent = {
        hero: { title: 'Test' },
        blueprintSection: {},
        industryExpertise: { cards: [] }
      };
      
      expect(validateServiceDetailContent(invalidContent)).toBe(false);
    });

    it('should return false for non-array stats', () => {
      const invalidContent = {
        hero: { title: 'Test' },
        blueprintSection: {},
        stats: 'not an array',
        industryExpertise: { cards: [] }
      };
      
      expect(validateServiceDetailContent(invalidContent)).toBe(false);
    });

    it('should return false for missing industryExpertise', () => {
      const invalidContent = {
        hero: { title: 'Test' },
        blueprintSection: {},
        stats: []
      };
      
      expect(validateServiceDetailContent(invalidContent)).toBe(false);
    });

    it('should return false for invalid industryExpertise', () => {
      const invalidContent = {
        hero: { title: 'Test' },
        blueprintSection: {},
        stats: [],
        industryExpertise: 'not an object'
      };
      
      expect(validateServiceDetailContent(invalidContent)).toBe(false);
    });

    it('should return false for industryExpertise without cards', () => {
      const invalidContent = {
        hero: { title: 'Test' },
        blueprintSection: {},
        stats: [],
        industryExpertise: { title: 'Test' }
      };
      
      expect(validateServiceDetailContent(invalidContent)).toBe(false);
    });

    it('should return false for industryExpertise with non-array cards', () => {
      const invalidContent = {
        hero: { title: 'Test' },
        blueprintSection: {},
        stats: [],
        industryExpertise: { cards: 'not an array' }
      };
      
      expect(validateServiceDetailContent(invalidContent)).toBe(false);
    });
  });
});