/**
 * Tests for servicePageUtils
 */

import { 
  Target, 
  Zap, 
  Rocket,
  Sprout, 
  Factory, 
  Building2, 
  Landmark, 
  Hotel, 
  ShoppingBag, 
  Users, 
  Truck, 
  Heart 
} from "lucide-react";

import {
  SERVICE_ICONS,
  generateServiceBreadcrumbs,
  getServiceIcon,
  formatServiceTitle,
  generateServiceSlug,
  validateServiceData,
  getDefaultServiceBackground,
  type BreadcrumbItem,
  type ServiceHero,
  type ServiceFaq,
  type MethodologyStep,
  type ServiceBenefit
} from '../servicePageUtils';

describe('Service Icons', () => {
  it('should have correct icon mappings', () => {
    expect(SERVICE_ICONS['experience-4-0']).toBe(Target);
    expect(SERVICE_ICONS['agility-4-0']).toBe(Zap);
    expect(SERVICE_ICONS['farming-4-0']).toBe(Sprout);
    expect(SERVICE_ICONS['plant-4-0']).toBe(Factory);
    expect(SERVICE_ICONS['infrastructure-4-0']).toBe(Building2);
    expect(SERVICE_ICONS['government-4-0']).toBe(Landmark);
    expect(SERVICE_ICONS['hospitality-4-0']).toBe(Hotel);
    expect(SERVICE_ICONS['retail-4-0']).toBe(ShoppingBag);
    expect(SERVICE_ICONS['service-4-0']).toBe(Users);
    expect(SERVICE_ICONS['logistics-4-0']).toBe(Truck);
    expect(SERVICE_ICONS['wellness-4-0']).toBe(Heart);
    expect(SERVICE_ICONS['design-4-0']).toBe(Rocket);
  });
});

describe('Service Utility Functions', () => {
  describe('generateServiceBreadcrumbs', () => {
    it('should generate correct breadcrumbs for service', () => {
      const breadcrumbs = generateServiceBreadcrumbs('Experience 4.0');
      
      expect(breadcrumbs).toEqual([
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "Experience 4.0", href: "#" }
      ]);
    });

    it('should handle different service titles', () => {
      const breadcrumbs = generateServiceBreadcrumbs('Agility 4.0');
      
      expect(breadcrumbs[2].label).toBe('Agility 4.0');
    });
  });

  describe('getServiceIcon', () => {
    it('should return correct icon for known service', () => {
      expect(getServiceIcon('experience-4-0')).toBe(Target);
      expect(getServiceIcon('agility-4-0')).toBe(Zap);
      expect(getServiceIcon('design-4-0')).toBe(Rocket);
    });

    it('should return default Target icon for unknown service', () => {
      expect(getServiceIcon('unknown-service')).toBe(Target);
      expect(getServiceIcon('')).toBe(Target);
    });
  });

  describe('formatServiceTitle', () => {
    it('should format service title correctly', () => {
      expect(formatServiceTitle('experience 4.0')).toBe('Experience 4.0');
      expect(formatServiceTitle('agility 4.0')).toBe('Agility 4.0');
    });

    it('should handle titles without 4.0', () => {
      expect(formatServiceTitle('digital transformation')).toBe('Digital Transformation');
    });

    it('should handle mixed case', () => {
      expect(formatServiceTitle('eXpErIeNcE 4.0')).toBe('EXpErIeNcE 4.0');
    });

    it('should handle empty string', () => {
      expect(formatServiceTitle('')).toBe('');
    });
  });

  describe('generateServiceSlug', () => {
    it('should generate correct slug from title', () => {
      expect(generateServiceSlug('Experience 4.0')).toBe('experience-40');
      expect(generateServiceSlug('Agility 4.0')).toBe('agility-40');
    });

    it('should handle spaces and special characters', () => {
      expect(generateServiceSlug('Digital Transformation & Innovation')).toBe('digital-transformation--innovation');
    });

    it('should handle multiple spaces', () => {
      expect(generateServiceSlug('Service   With   Spaces')).toBe('service-with-spaces');
    });

    it('should handle empty string', () => {
      expect(generateServiceSlug('')).toBe('');
    });

    it('should convert to lowercase', () => {
      expect(generateServiceSlug('UPPERCASE SERVICE')).toBe('uppercase-service');
    });
  });

  describe('validateServiceData', () => {
    it('should return true for valid service data', () => {
      const validData = {
        hero: {
          title: 'Test Service',
          subtitle: 'Test Subtitle'
        },
        overview: {
          title: 'Overview'
        },
        benefits: []
      };
      
      expect(validateServiceData(validData)).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(validateServiceData(null)).toBe(false);
      expect(validateServiceData(undefined)).toBe(false);
    });

    it('should return false for non-object types', () => {
      expect(validateServiceData('string')).toBe(false);
      expect(validateServiceData(123)).toBe(false);
      expect(validateServiceData(true)).toBe(false);
      expect(validateServiceData([])).toBe(false);
    });

    it('should return false for missing hero', () => {
      const invalidData = {
        overview: {},
        benefits: []
      };
      
      expect(validateServiceData(invalidData)).toBe(false);
    });

    it('should return false for invalid hero', () => {
      const invalidData = {
        hero: 'not an object',
        overview: {},
        benefits: []
      };
      
      expect(validateServiceData(invalidData)).toBe(false);
    });

    it('should return false for hero without title', () => {
      const invalidData = {
        hero: {
          subtitle: 'Test Subtitle'
        },
        overview: {},
        benefits: []
      };
      
      expect(validateServiceData(invalidData)).toBe(false);
    });

    it('should return false for hero without subtitle', () => {
      const invalidData = {
        hero: {
          title: 'Test Title'
        },
        overview: {},
        benefits: []
      };
      
      expect(validateServiceData(invalidData)).toBe(false);
    });

    it('should return false for missing overview', () => {
      const invalidData = {
        hero: {
          title: 'Test Title',
          subtitle: 'Test Subtitle'
        },
        benefits: []
      };
      
      expect(validateServiceData(invalidData)).toBe(false);
    });

    it('should return false for missing benefits', () => {
      const invalidData = {
        hero: {
          title: 'Test Title',
          subtitle: 'Test Subtitle'
        },
        overview: {}
      };
      
      expect(validateServiceData(invalidData)).toBe(false);
    });
  });

  describe('getDefaultServiceBackground', () => {
    it('should return specific background for known services', () => {
      expect(getDefaultServiceBackground('experience-4-0')).toBe('/images/experience-bg.jpg');
      expect(getDefaultServiceBackground('agility-4-0')).toBe('/images/agility-bg.jpg');
      expect(getDefaultServiceBackground('design-4-0')).toBe('/images/design-bg.jpg');
    });

    it('should return default background for unknown services', () => {
      expect(getDefaultServiceBackground('unknown-service')).toBe('/images/default-service-bg.jpg');
      expect(getDefaultServiceBackground('')).toBe('/images/default-service-bg.jpg');
    });
  });
});

describe('Type Definitions', () => {
  it('should define BreadcrumbItem interface correctly', () => {
    const breadcrumb: BreadcrumbItem = {
      label: 'Test',
      href: '/test'
    };
    
    expect(breadcrumb.label).toBe('Test');
    expect(breadcrumb.href).toBe('/test');
  });

  it('should define ServiceHero interface correctly', () => {
    const hero: ServiceHero = {
      title: 'Test Hero',
      subtitle: 'Test Subtitle',
      backgroundImage: '/bg.jpg',
      breadcrumbs: []
    };
    
    expect(hero.title).toBe('Test Hero');
    expect(hero.subtitle).toBe('Test Subtitle');
    expect(hero.backgroundImage).toBe('/bg.jpg');
    expect(Array.isArray(hero.breadcrumbs)).toBe(true);
  });

  it('should define ServiceFaq interface correctly', () => {
    const faq: ServiceFaq = {
      question: 'What is this?',
      answer: 'This is a test.'
    };
    
    expect(faq.question).toBe('What is this?');
    expect(faq.answer).toBe('This is a test.');
  });

  it('should define MethodologyStep interface correctly', () => {
    const step: MethodologyStep = {
      title: 'Step 1',
      description: 'First step',
      icon: Target,
      details: ['Detail 1', 'Detail 2']
    };
    
    expect(step.title).toBe('Step 1');
    expect(step.description).toBe('First step');
    expect(step.icon).toBe(Target);
    expect(step.details).toEqual(['Detail 1', 'Detail 2']);
  });

  it('should define ServiceBenefit interface correctly', () => {
    const benefit: ServiceBenefit = {
      title: 'Benefit 1',
      description: 'First benefit',
      icon: Target
    };
    
    expect(benefit.title).toBe('Benefit 1');
    expect(benefit.description).toBe('First benefit');
    expect(benefit.icon).toBe(Target);
  });
});