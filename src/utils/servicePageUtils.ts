/**
 * Service page utility functions to reduce code duplication
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

export interface ServiceIcon {
  [key: string]: React.ComponentType<any>;
}

export const SERVICE_ICONS: ServiceIcon = {
  'experience-4-0': Target,
  'agility-4-0': Zap,
  'farming-4-0': Sprout,
  'plant-4-0': Factory,
  'infrastructure-4-0': Building2,
  'government-4-0': Landmark,
  'hospitality-4-0': Hotel,
  'retail-4-0': ShoppingBag,
  'service-4-0': Users,
  'logistics-4-0': Truck,
  'wellness-4-0': Heart,
  'design-4-0': Rocket
};

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface ServiceHero {
  title: string;
  subtitle: string;
  backgroundImage: string;
  breadcrumbs: BreadcrumbItem[];
}

/**
 * Generate breadcrumbs for service pages
 */
export function generateServiceBreadcrumbs(serviceTitle: string): BreadcrumbItem[] {
  return [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: serviceTitle, href: "#" }
  ];
}

/**
 * Get service icon component
 */
export function getServiceIcon(serviceKey: string): React.ComponentType<any> {
  return SERVICE_ICONS[serviceKey] || Target;
}

/**
 * Format service title for display
 */
export function formatServiceTitle(title: string): string {
  return title.replace(/4\.0/g, '4.0').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Generate service slug from title
 */
export function generateServiceSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Common FAQ structure
 */
export interface ServiceFaq {
  question: string;
  answer: string;
}

/**
 * Common methodology step structure
 */
export interface MethodologyStep {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  details?: string[];
}

/**
 * Common service benefit structure
 */
export interface ServiceBenefit {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

/**
 * Validate service data structure
 */
export function validateServiceData(data: any): boolean {
  return !!(
    data &&
    data.hero &&
    data.hero.title &&
    data.hero.subtitle &&
    data.overview &&
    data.benefits
  );
}

/**
 * Get default service background image
 */
export function getDefaultServiceBackground(serviceKey: string): string {
  const backgrounds: { [key: string]: string } = {
    'experience-4-0': '/images/experience-bg.jpg',
    'agility-4-0': '/images/agility-bg.jpg',
    'design-4-0': '/images/design-bg.jpg'
  };
  
  return backgrounds[serviceKey] || '/images/default-service-bg.jpg';
}