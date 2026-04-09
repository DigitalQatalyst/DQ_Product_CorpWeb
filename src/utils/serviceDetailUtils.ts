/**
 * Service detail page utilities to reduce duplication
 */

import { BreadcrumbItem } from './pageLayoutUtils';

export interface ServiceHero {
  title: string;
  subtitle: string;
  backgroundImage: string;
  breadcrumbs: BreadcrumbItem[];
}

export interface ServiceCta {
  label: string;
  href: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceBlueprintSection {
  title: string;
  description: string;
  primaryCta: ServiceCta;
  secondaryCta: ServiceCta;
  faqs: ServiceFaq[];
  imagePrimary: string;
  imageOverlay: string;
}

export interface ServiceStat {
  value: string;
  label: string;
}

export interface ServiceCard {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

export interface ServiceIndustryExpertise {
  title: string;
  description: string;
  ctaLabel: string;
  cards: ServiceCard[];
}

export interface ServiceDetailContent {
  hero: ServiceHero;
  blueprintSection: ServiceBlueprintSection;
  stats: ServiceStat[];
  industryExpertise: ServiceIndustryExpertise;
}

/**
 * Create service CTA
 */
export function createServiceCta(label: string, href: string): ServiceCta {
  return { label, href };
}

/**
 * Create service FAQ
 */
export function createServiceFaq(question: string, answer: string): ServiceFaq {
  return { question, answer };
}

/**
 * Create service stat
 */
export function createServiceStat(value: string, label: string): ServiceStat {
  return { value, label };
}

/**
 * Create service card
 */
export function createServiceCard(
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
  title: string,
  description: string
): ServiceCard {
  return { icon, title, description };
}

/**
 * Create blueprint section
 */
export function createBlueprintSection(
  title: string,
  description: string,
  primaryCta: ServiceCta,
  secondaryCta: ServiceCta,
  faqs: ServiceFaq[],
  imagePrimary: string,
  imageOverlay: string
): ServiceBlueprintSection {
  return {
    title,
    description,
    primaryCta,
    secondaryCta,
    faqs,
    imagePrimary,
    imageOverlay
  };
}

/**
 * Create industry expertise section
 */
export function createIndustryExpertise(
  title: string,
  description: string,
  ctaLabel: string,
  cards: ServiceCard[]
): ServiceIndustryExpertise {
  return {
    title,
    description,
    ctaLabel,
    cards
  };
}

/**
 * Common FAQ data for services
 */
export const COMMON_SERVICE_FAQS = {
  whatIsDBP: createServiceFaq(
    "What is a DBP?",
    "A Digital Business Platform (DBP) is a modular architecture that connects strategy, design, and delivery so every initiative ties back to measurable outcomes."
  ),
  
  whatMakesDifferent: (serviceName: string) => createServiceFaq(
    `What makes ${serviceName} different from traditional approaches?`,
    `Unlike traditional approaches, ${serviceName} uses data-driven methodologies, TOGAF frameworks, and lifecycle management to ensure holistic, scalable, and future-ready digital transformations.`
  ),
  
  whatDeliverables: (serviceName: string) => createServiceFaq(
    `What deliverables can I expect from a ${serviceName} project?`,
    "Expect discovery workshops, operating model blueprints, capability maps, and prioritized execution roadmaps that accelerate decision-making."
  )
};

/**
 * Common CTAs for services
 */
export const COMMON_SERVICE_CTAS = {
  getStarted: createServiceCta("Get Started", "/consultation"),
  exploreServices: createServiceCta("Explore Service Domains", "/services"),
  bookConsultation: createServiceCta("Book Consultation", "/consultation"),
  learnMore: createServiceCta("Learn More", "#overview")
};

/**
 * Common stats for services
 */
export const COMMON_SERVICE_STATS = {
  traditionalSuccessRate: createServiceStat(
    "30%", 
    "Approximate success rate of traditional digital transformations."
  ),
  
  ourSuccessRate: createServiceStat(
    "99%", 
    "Success rate of transformations with our approach."
  ),
  
  platformsDesigned: createServiceStat(
    "100+", 
    "Digital Business Platforms designed to date."
  ),
  
  yearsExperience: createServiceStat(
    "15+", 
    "Years designing Digital Business Platforms globally."
  )
};

/**
 * Validate service detail content
 */
export function validateServiceDetailContent(content: unknown): content is ServiceDetailContent {
  if (!content || typeof content !== 'object') return false;
  
  const obj = content as Record<string, unknown>;
  
  return !!(
    obj.hero &&
    typeof obj.hero === 'object' &&
    obj.hero !== null &&
    (obj.hero as Record<string, unknown>).title &&
    obj.blueprintSection &&
    obj.stats &&
    Array.isArray(obj.stats) &&
    obj.industryExpertise &&
    typeof obj.industryExpertise === 'object' &&
    obj.industryExpertise !== null &&
    (obj.industryExpertise as Record<string, unknown>).cards &&
    Array.isArray((obj.industryExpertise as Record<string, unknown>).cards)
  );
}