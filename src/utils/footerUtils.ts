/**
 * Footer utility functions to reduce duplication
 */

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/**
 * Create footer link
 */
export function createFooterLink(
  label: string, 
  href: string, 
  external = false
): FooterLink {
  return { label, href, external };
}

/**
 * Create footer section
 */
export function createFooterSection(
  title: string, 
  links: FooterLink[]
): FooterSection {
  return { title, links };
}

/**
 * Create social link
 */
export function createSocialLink(
  name: string,
  href: string,
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
): SocialLink {
  return { name, href, icon };
}

/**
 * Common footer sections data
 */
export const COMMON_FOOTER_SECTIONS = {
  services: createFooterSection("Services", [
    createFooterLink("Experience 4.0", "/services/experience-4-0"),
    createFooterLink("Agility 4.0", "/services/agility-4-0"),
    createFooterLink("Design 4.0", "/services/design-4-0"),
    createFooterLink("Farming 4.0", "/services/farming-4-0"),
    createFooterLink("Plant 4.0", "/services/plant-4-0"),
    createFooterLink("Infrastructure 4.0", "/services/infrastructure-4-0")
  ]),
  
  company: createFooterSection("Company", [
    createFooterLink("About Us", "/about"),
    createFooterLink("Careers", "/careers"),
    createFooterLink("Contact", "/contact"),
    createFooterLink("Blog", "/blog"),
    createFooterLink("News", "/news")
  ]),
  
  resources: createFooterSection("Resources", [
    createFooterLink("Knowledge Hub", "/knowledge-hub"),
    createFooterLink("Case Studies", "/case-studies"),
    createFooterLink("Whitepapers", "/whitepapers"),
    createFooterLink("Webinars", "/webinars"),
    createFooterLink("Documentation", "/docs")
  ]),
  
  legal: createFooterSection("Legal", [
    createFooterLink("Privacy Policy", "/privacy-policy"),
    createFooterLink("Terms of Service", "/terms"),
    createFooterLink("Cookie Policy", "/cookies"),
    createFooterLink("Data Protection", "/data-protection")
  ])
};

/**
 * Newsletter subscription state management
 */
export interface NewsletterState {
  email: string;
  isValid: boolean;
  isSubmitted: boolean;
  isSubmitting: boolean;
  error: string | null;
}

export function createInitialNewsletterState(): NewsletterState {
  return {
    email: '',
    isValid: true,
    isSubmitted: false,
    isSubmitting: false,
    error: null
  };
}

export function setNewsletterSubmittingState(state: NewsletterState): NewsletterState {
  return {
    ...state,
    isSubmitting: true,
    error: null
  };
}

export function setNewsletterSuccessState(state: NewsletterState): NewsletterState {
  return {
    ...state,
    isSubmitting: false,
    isSubmitted: true,
    error: null,
    email: '' // Clear email on success
  };
}

export function setNewsletterErrorState(state: NewsletterState, error: string): NewsletterState {
  return {
    ...state,
    isSubmitting: false,
    isSubmitted: false,
    error
  };
}

/**
 * Accordion section state management
 */
export interface AccordionState {
  [key: string]: boolean;
}

export function toggleAccordionSection(
  state: AccordionState, 
  sectionKey: string
): AccordionState {
  return {
    ...state,
    [sectionKey]: !state[sectionKey]
  };
}

/**
 * Footer responsive breakpoints
 */
export const FOOTER_BREAKPOINTS = {
  mobile: 'md:hidden',
  desktop: 'hidden md:block',
  accordion: 'block md:hidden'
};

/**
 * Common footer styles
 */
export const FOOTER_STYLES = {
  container: 'bg-secondary-900 text-white',
  section: 'space-y-4',
  sectionTitle: 'font-semibold text-base text-white mb-4',
  link: 'text-gray-300 hover:text-white transition-colors duration-200 text-sm',
  externalLink: 'inline-flex items-center gap-1',
  socialLink: 'text-gray-300 hover:text-white transition-colors duration-200',
  newsletter: {
    container: 'space-y-4',
    input: 'w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
    button: 'w-full bg-primary hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2',
    error: 'text-red-400 text-sm',
    success: 'text-green-400 text-sm'
  },
  accordion: {
    button: 'w-full py-4 flex items-center justify-between text-left',
    content: 'pb-4',
    border: 'border-b border-gray-600 last:border-b-0'
  }
};

/**
 * Validate footer configuration
 */
export function validateFooterConfig(config: unknown): boolean {
  if (!config || typeof config !== 'object') return false;
  
  const obj = config as Record<string, unknown>;
  
  return !!(
    obj.sections &&
    Array.isArray(obj.sections) &&
    obj.socialLinks &&
    Array.isArray(obj.socialLinks)
  );
}