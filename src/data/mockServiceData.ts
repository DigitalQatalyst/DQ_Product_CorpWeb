export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  provider: string;
  category: 'Design Services' | 'Deploy Services (SaaS)' | 'Deploy Services (On-Prem)';
  tags: string[];
  serviceCategory: string;
  serviceAvailability: string;
  serviceReadiness: string;
  economicSector: string;
  formUrl: string;
  facetValues: Array<{
    code: string;
    name: string;
  }>;
  // Extended details for detail page
  fullDescription?: string;
  keyFeatures?: string[];
  deliverables?: string[];
  targetAudience?: string[];
  prerequisites?: string[];
  duration?: string;
  pricing?: string;
  relatedServices?: string[];
}

export const mockServiceData: ServiceItem[] = [
  // Card 1: Digital Workspace Strategy
  {
    id: 'digital-core-dws-strategy',
    title: 'Digital Workspace Strategy',
    description: 'Enable seamless collaboration and productivity across your organisation. We deliver clear workspace architectures, collaboration frameworks, and practical design artifacts (supported by working prototypes) that enable your teams to work efficiently and securely across your Digital Business Platform.',
    provider: 'DigitalQatalyst',
    category: 'Design Services',
    tags: ['Core Systems', 'Cloud Architecture', 'Compliance'],
    serviceCategory: 'Digital Core / DWS',
    serviceAvailability: 'Available',
    serviceReadiness: 'Ready to Order',
    economicSector: 'Government 4.0',
    formUrl: '/forms/service-request?service=Digital Workspace Strategy',
    facetValues: [
      { code: 'service-category', name: 'Digital Core / DWS' },
      { code: 'service-availability', name: 'Available' },
      { code: 'service-readiness', name: 'Ready to Order' },
      { code: 'economic-sector', name: 'Government 4.0' }
    ],
    fullDescription: 'Our Digital Workspace Strategy service helps organizations design and implement robust workspace platforms that drive collaboration and productivity while ensuring security and compliance. We leverage industry best practices and cutting-edge technologies to create scalable, secure, and future-proof digital workspace foundations for your enterprise.',
    keyFeatures: [
      'Comprehensive assessment of current digital infrastructure',
      'Cloud-native architecture design and implementation',
      'Regulatory compliance framework integration',
      'Legacy system modernization roadmap',
      'Security-first approach with zero-trust architecture'
    ],
    deliverables: [
      'Digital Core Architecture Blueprint',
      'Technology Stack Recommendations',
      'Implementation Roadmap',
      'Compliance Assessment Report',
      'ROI Analysis and Business Case'
    ],
    targetAudience: [
      'Government agencies seeking digital transformation',
      'Large enterprises with legacy systems',
      'Organizations requiring regulatory compliance',
      'Companies planning cloud migration'
    ],
    prerequisites: [
      'Executive sponsorship for digital transformation',
      'Access to current system documentation',
      'Stakeholder availability for workshops'
    ],
    duration: '1-2 weeks',
    pricing: 'Contact for custom quote',
    relatedServices: ['digital-organisation-strategy', 'devops-strategy']
  },
  
  // Card 2: Digital Organisation Strategy
  {
    id: 'digital-organisation-strategy',
    title: 'Digital Organisation Strategy',
    description: 'Transform your entire organisation with a comprehensive Digital Business Platform strategy. We deliver clear enterprise architectures, transformation roadmaps, and practical design artifacts (supported by working prototypes) that enable your organisation to execute confidently across all four platform pillars: Digital Experience, Digital Workspace, Digital Intelligence & Analytics, and SecDevOps.',
    provider: 'DigitalQatalyst',
    category: 'Design Services',
    tags: ['Strategy', 'Architecture', 'Digital Transformation'],
    serviceCategory: 'Digital Core / DWS',
    serviceAvailability: 'Available',
    serviceReadiness: 'Ready to Order',
    economicSector: 'Service 4.0',
    formUrl: '/forms/service-request?service=Digital Organisation Strategy',
    facetValues: [
      { code: 'service-category', name: 'Digital Core / DWS' },
      { code: 'service-availability', name: 'Available' },
      { code: 'service-readiness', name: 'Ready to Order' },
      { code: 'economic-sector', name: 'Service 4.0' }
    ],
    fullDescription: 'Transform your organization into a Digital Cognitive Organization (DCO) with our comprehensive Digital Organisation Strategy service. We help you reimagine your business processes, organizational structure, and technology landscape to thrive in the digital economy.',
    keyFeatures: [
      'Digital maturity assessment and benchmarking',
      'Operating model design for digital-first organizations',
      'Change management and cultural transformation',
      'Digital capability building and upskilling programs',
      'Governance framework for digital initiatives'
    ],
    deliverables: [
      'Digital Maturity Assessment Report',
      'Target Operating Model Design',
      'Digital Transformation Roadmap',
      'Change Management Strategy',
      'Digital Governance Framework'
    ],
    targetAudience: [
      'C-suite executives driving digital transformation',
      'Organizations undergoing digital disruption',
      'Companies seeking competitive advantage through digital',
      'Enterprises planning organizational restructuring'
    ],
    prerequisites: [
      'Leadership commitment to digital transformation',
      'Cross-functional team participation',
      'Budget allocation for transformation initiatives'
    ],
    duration: '2-3 weeks',
    pricing: 'Contact for custom quote',
    relatedServices: ['digital-core-dws-strategy', 'digital-experience-strategy']
  },
  
  // Card 3: Digital Intelligence Strategy
  {
    id: 'digital-intelligence-strategy',
    title: 'Digital Intelligence Strategy',
    description: 'Transform data into actionable intelligence. We deliver clear data models, analytics architectures, and practical design artifacts (supported by working prototypes) that enable your organisation to make data-driven decisions with confidence across your Digital Business Platform.',
    provider: 'DigitalQatalyst',
    category: 'Design Services',
    tags: ['AI/ML', 'Data Integration', 'Analytics Platform'],
    serviceCategory: 'Connected Intelligence',
    serviceAvailability: 'Available',
    serviceReadiness: 'Ready to Order',
    economicSector: 'Infrastructure 4.0',
    formUrl: '/forms/service-request?service=Digital Intelligence Strategy',
    facetValues: [
      { code: 'service-category', name: 'Connected Intelligence' },
      { code: 'service-availability', name: 'Available' },
      { code: 'service-readiness', name: 'Ready to Order' },
      { code: 'economic-sector', name: 'Infrastructure 4.0' }
    ],
    fullDescription: 'Unlock the power of your data with our Digital Intelligence Strategy service. We design comprehensive data and AI architectures that enable advanced analytics, machine learning, and intelligent automation to drive data-driven decision making across your organization.',
    keyFeatures: [
      'Data strategy and governance framework',
      'AI/ML use case identification and prioritization',
      'Data platform architecture design',
      'Analytics and BI capability assessment',
      'Ethical AI and responsible data practices'
    ],
    deliverables: [
      'Data Strategy Document',
      'AI/ML Use Case Portfolio',
      'Data Platform Architecture Blueprint',
      'Data Governance Framework',
      'Implementation Roadmap with Quick Wins'
    ],
    targetAudience: [
      'Organizations seeking data-driven transformation',
      'Companies exploring AI/ML adoption',
      'Enterprises with fragmented data landscapes',
      'Businesses requiring advanced analytics capabilities'
    ],
    prerequisites: [
      'Access to existing data sources and systems',
      'Data stakeholder availability',
      'Understanding of business objectives'
    ],
    duration: '1-2 weeks',
    pricing: 'Contact for custom quote',
    relatedServices: ['digital-core-dws-strategy', 'digital-experience-strategy']
  },
  
  // Card 4: Digital Experience Strategy
  {
    id: 'digital-experience-strategy',
    title: 'Digital Experience Strategy',
    description: 'Move from strategic intent to execution with confidence. We deliver clear experience models, target architectures, and practical design artifacts—supported by working prototypes—that enable your organisation to invest decisively across your Digital Business Platform.',
    provider: 'DigitalQatalyst',
    category: 'Design Services',
    tags: ['Design', 'Available', 'Digital Experience'],
    serviceCategory: 'Digital Experience',
    serviceAvailability: 'Available',
    serviceReadiness: 'Ready to Order',
    economicSector: 'Retail 4.0',
    formUrl: '/forms/service-request?service=Digital Experience Strategy',
    facetValues: [
      { code: 'service-category', name: 'Digital Experience' },
      { code: 'service-availability', name: 'Available' },
      { code: 'service-readiness', name: 'Ready to Order' },
      { code: 'economic-sector', name: 'Retail 4.0' }
    ],
    fullDescription: 'Create exceptional digital experiences that delight customers and drive business growth. Our Digital Experience Strategy service helps you design user-centered digital touchpoints that improve engagement, accelerate channel adoption, and build lasting customer relationships.',
    keyFeatures: [
      'Customer journey mapping and analysis',
      'Omnichannel experience design',
      'UX/UI strategy and design systems',
      'Personalization and engagement optimization',
      'Digital experience platform selection'
    ],
    deliverables: [
      'Customer Journey Maps',
      'Digital Experience Architecture',
      'Design System and Style Guide',
      'Personalization Strategy',
      'Platform Recommendation Report'
    ],
    targetAudience: [
      'Retail and e-commerce businesses',
      'Customer-centric organizations',
      'Companies with multiple digital channels',
      'Businesses seeking improved customer engagement'
    ],
    prerequisites: [
      'Customer research and insights',
      'Access to analytics data',
      'Stakeholder alignment on experience goals'
    ],
    duration: '1-2 weeks',
    pricing: 'Contact for custom quote',
    relatedServices: ['digital-organisation-strategy', 'digital-intelligence-strategy']
  },
  
  // Card 5: SecDevOps Strategy
  {
    id: 'devops-strategy',
    title: 'SecDevOps Strategy',
    description: 'Build security into every layer of your digital platform. We deliver clear security architectures, DevOps frameworks, and practical design artifacts (supported by working prototypes) that enable your organisation to deploy securely and operate confidently across your Digital Business Platform.',
    provider: 'DigitalQatalyst',
    category: 'Design Services',
    tags: ['DevOps', 'CI/CD', 'Automation', 'Security'],
    serviceCategory: 'Connected Intelligence',
    serviceAvailability: 'Available',
    serviceReadiness: 'Ready to Order',
    economicSector: 'Plant 4.0',
    formUrl: '/forms/service-request?service=SecDevOps Strategy',
    facetValues: [
      { code: 'service-category', name: 'Connected Intelligence' },
      { code: 'service-availability', name: 'Available' },
      { code: 'service-readiness', name: 'Ready to Order' },
      { code: 'economic-sector', name: 'Plant 4.0' }
    ],
    fullDescription: 'Accelerate your software delivery with our SecDevOps Strategy service. We help you design and implement a Digital Enabler Platform (DEP) that enables continuous integration, continuous delivery, and automated operations for faster, more reliable software releases.',
    keyFeatures: [
      'DevOps maturity assessment',
      'CI/CD pipeline design and implementation',
      'Infrastructure as Code (IaC) strategy',
      'DevSecOps integration',
      'Site Reliability Engineering (SRE) practices'
    ],
    deliverables: [
      'DevOps Maturity Assessment Report',
      'CI/CD Pipeline Architecture',
      'IaC Templates and Standards',
      'DevSecOps Implementation Guide',
      'SRE Playbooks and Runbooks'
    ],
    targetAudience: [
      'Software development organizations',
      'Companies seeking faster time-to-market',
      'Enterprises with complex deployment needs',
      'Organizations adopting cloud-native practices'
    ],
    prerequisites: [
      'Development team participation',
      'Access to current development processes',
      'Infrastructure access for assessment'
    ],
    duration: '1-2 weeks',
    pricing: 'Contact for custom quote',
    relatedServices: ['digital-core-dws-strategy', 'digital-intelligence-strategy']
  }
];

export const serviceCategories = [
  'Digital Experience',
  'Digital Core / DWS',
  'Connected Intelligence'
];

export const serviceAvailability = [
  'Available',
  'Coming Soon'
];

export const serviceReadiness = [
  'Ready to Order',
  'Has Dependency'
];

export const economicSectors = [
  'Agility 4.0',
  'Experience 4.0',
  'Farming 4.0',
  'Government 4.0',
  'Hospitality 4.0',
  'Infrastructure 4.0',
  'Logistics 4.0',
  'Plant 4.0',
  'Retail 4.0',
  'Service 4.0',
  'Wellness 4.0'
];