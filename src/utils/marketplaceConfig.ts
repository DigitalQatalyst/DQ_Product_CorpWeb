import * as React from 'react';
import { ReactNode } from 'react';
import { DollarSign, Calendar, Clock, Users, MapPin, CheckCircle, BarChart, Award, FileText, Info, BookOpen, ClipboardList, Building, FileType, Bookmark, TrendingUp } from 'lucide-react';
import { mockCourses, providers } from './mockData';
import { mockFinancialServices, mockNonFinancialServices, mockKnowledgeHubItems, mockKnowledgeHubFilterOptions } from './mockMarketplaceData';
// Define a Tab type for consistency across marketplace pages
export interface MarketplaceTab {
  id: string;
  label: string;
  icon?: any;
  iconBgColor?: string;
  iconColor?: string;
  renderContent?: (item: any, marketplaceType: string) => React.ReactNode;
}
// Configuration type definitions
export interface AttributeConfig {
  key: string;
  label: string;
  icon: ReactNode;
  formatter?: (value: any) => string;
}
export interface TabConfig {
  id: string;
  label: string;
  icon?: any;
  iconBgColor?: string;
  iconColor?: string;
  renderContent?: (item: any, marketplaceType: string) => React.ReactNode;
}
export interface FilterCategoryConfig {
  id: string;
  title: string;
  options: {
    id: string;
    name: string;
  }[];
}
export interface MarketplaceConfig {
  id: string;
  title: string;
  description: string;
  route: string;
  primaryCTA: string;
  secondaryCTA: string;
  itemName: string;
  itemNamePlural: string;
  attributes: AttributeConfig[];
  detailSections: string[];
  tabs: TabConfig[];
  summarySticky?: boolean;
  filterCategories: FilterCategoryConfig[];
  // Knowledge Hub specific filter categories
  writtenFilterCategories?: FilterCategoryConfig[];
  multimediaFilterCategories?: FilterCategoryConfig[];
  // New fields for GraphQL integration
  mapListResponse?: (data: any[]) => any[];
  mapDetailResponse?: (data: any) => any;
  mapFilterResponse?: (data: any) => FilterCategoryConfig[];
  // Mock data for fallback and schema reference
  mockData?: {
    items: any[];
    filterOptions: any;
    providers: any[];
  };
}
// Mock data for financial services
export const mockFinancialServicesData = {
  items: mockFinancialServices,
  filterOptions: {
    categories: [{
      id: 'loans',
      name: 'Loans'
    }, {
      id: 'financing',
      name: 'Financing'
    }, {
      id: 'insurance',
      name: 'Insurance'
    }, {
      id: 'creditcard',
      name: 'Credit Card'
    }],
    serviceTypes: [{
      id: 'financing',
      name: 'Financing'
    }, {
      id: 'credit',
      name: 'Credit'
    }, {
      id: 'riskmanagement',
      name: 'Risk Management'
    }]
  },
  providers: providers
};
// Mock data for non-financial services
export const mockNonFinancialServicesData = {
  items: mockNonFinancialServices,
  filterOptions: {
    categories: [{
      id: 'consultancy',
      name: 'Consultancy'
    }, {
      id: 'technology',
      name: 'Technology'
    }, {
      id: 'research',
      name: 'Research'
    }, {
      id: 'export',
      name: 'Export'
    }],
    serviceTypes: [{
      id: 'advisory',
      name: 'Advisory'
    }, {
      id: 'implementation',
      name: 'Implementation'
    }, {
      id: 'information',
      name: 'Information'
    }, {
      id: 'program',
      name: 'Program'
    }],
    deliveryModes: [{
      id: 'online',
      name: 'Online'
    }, {
      id: 'inperson',
      name: 'In-person'
    }, {
      id: 'hybrid',
      name: 'Hybrid'
    }]
  },
  providers: providers
};
// Mock data for courses
export const mockCoursesData = {
  items: mockCourses,
  filterOptions: {
    categories: [{
      id: 'entrepreneurship',
      name: 'Entrepreneurship'
    }, {
      id: 'finance',
      name: 'Finance'
    }, {
      id: 'marketing',
      name: 'Marketing'
    }, {
      id: 'technology',
      name: 'Technology'
    }, {
      id: 'operations',
      name: 'Operations'
    }],
    deliveryModes: [{
      id: 'online',
      name: 'Online'
    }, {
      id: 'inperson',
      name: 'In-person'
    }, {
      id: 'hybrid',
      name: 'Hybrid'
    }],
    businessStages: [{
      id: 'conception',
      name: 'Conception'
    }, {
      id: 'growth',
      name: 'Growth'
    }, {
      id: 'maturity',
      name: 'Maturity'
    }, {
      id: 'restructuring',
      name: 'Restructuring'
    }]
  },
  providers: providers
};
// Mock data for Knowledge Hub
export const mockKnowledgeHubData = {
  items: mockKnowledgeHubItems,
  filterOptions: mockKnowledgeHubFilterOptions,
  providers: providers
};
// Define marketplace configurations
export const marketplaceConfig: Record<string, MarketplaceConfig> = {
  courses: {
    id: 'courses',
    title: 'Learning & Development',
    description: 'Discover and enroll in courses tailored for SMEs to help grow your business',
    route: '/marketplace/courses',
    primaryCTA: 'Enroll Now',
    secondaryCTA: 'View Details',
    itemName: 'Course',
    itemNamePlural: 'Courses',
    attributes: [{
      key: 'duration',
      label: 'Duration',
      icon: React.createElement(Clock, { size: 18, className: "mr-2" })
    }, {
      key: 'startDate',
      label: 'Starts',
      icon: React.createElement(Calendar, { size: 18, className: "mr-2" })
    }, {
      key: 'price',
      label: 'Cost',
      icon: React.createElement(DollarSign, { size: 18, className: "mr-2" })
    }, {
      key: 'location',
      label: 'Location',
      icon: React.createElement(MapPin, { size: 18, className: "mr-2" })
    }],
    detailSections: ['description', 'learningOutcomes', 'schedule', 'provider', 'related'],
    tabs: [{
      id: 'about',
      label: 'About This Service',
      icon: Info,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }, {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar,
      iconBgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }, {
      id: 'learning_outcomes',
      label: 'Learning Outcomes',
      icon: BookOpen,
      iconBgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }, {
      id: 'provider',
      label: 'About Provider',
      icon: Building,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }],
    summarySticky: true,
    filterCategories: [{
      id: 'category',
      title: 'Course Category',
      options: [{
        id: 'entrepreneurship',
        name: 'Entrepreneurship'
      }, {
        id: 'finance',
        name: 'Finance'
      }, {
        id: 'marketing',
        name: 'Marketing'
      }, {
        id: 'technology',
        name: 'Technology'
      }, {
        id: 'operations',
        name: 'Operations'
      }]
    }, {
      id: 'deliveryMode',
      title: 'Delivery Mode',
      options: [{
        id: 'online',
        name: 'Online'
      }, {
        id: 'inperson',
        name: 'In-person'
      }, {
        id: 'hybrid',
        name: 'Hybrid'
      }]
    }, {
      id: 'duration',
      title: 'Duration',
      options: [{
        id: 'short',
        name: 'Short (<1 week)'
      }, {
        id: 'medium',
        name: 'Medium (1-4 weeks)'
      }, {
        id: 'long',
        name: 'Long (1+ month)'
      }]
    }, {
      id: 'businessStage',
      title: 'Business Stage',
      options: [{
        id: 'conception',
        name: 'Conception'
      }, {
        id: 'growth',
        name: 'Growth'
      }, {
        id: 'maturity',
        name: 'Maturity'
      }, {
        id: 'restructuring',
        name: 'Restructuring'
      }]
    }],
    // Data mapping functions
    mapListResponse: data => {
      return data.map((item: any) => ({
        ...item,
        // Transform any fields if needed
        tags: item.tags || [item.category, item.deliveryMode].filter(Boolean)
      }));
    },
    mapDetailResponse: data => {
      return {
        ...data,
        // Transform any fields if needed
        highlights: data.highlights || data.learningOutcomes || []
      };
    },
    mapFilterResponse: data => {
      return [{
        id: 'category',
        title: 'Course Category',
        options: data.categories || []
      }, {
        id: 'deliveryMode',
        title: 'Delivery Mode',
        options: data.deliveryModes || []
      }, {
        id: 'duration',
        title: 'Duration',
        options: [{
          id: 'short',
          name: 'Short (<1 week)'
        }, {
          id: 'medium',
          name: 'Medium (1-4 weeks)'
        }, {
          id: 'long',
          name: 'Long (1+ month)'
        }]
      }, {
        id: 'businessStage',
        title: 'Business Stage',
        options: data.businessStages || []
      }];
    },
    // Mock data for fallback and schema reference
    mockData: mockCoursesData
  },
  financial: {
    id: 'financial',
    title: 'Financial Services ',
    description: 'Access financial products and services to support your business growth',
    route: '/marketplace/financial',
    primaryCTA: 'Apply Now',
    secondaryCTA: 'View Details',
    itemName: 'Financial Service',
    itemNamePlural: 'Financial Services',
    attributes: [{
      key: 'amount',
      label: 'Amount',
      icon: React.createElement(DollarSign, { size: 18, className: "mr-2" })
    }, {
      key: 'duration',
      label: 'Repayment Term',
      icon: React.createElement(Calendar, { size: 18, className: "mr-2" })
    }, {
      key: 'eligibility',
      label: 'Eligibility',
      icon: React.createElement(CheckCircle, { size: 18, className: "mr-2" })
    }, {
      key: 'interestRate',
      label: 'Interest Rate',
      icon: React.createElement(BarChart, { size: 18, className: "mr-2" })
    }],
    detailSections: ['description', 'eligibility', 'terms', 'provider', 'related'],
    tabs: [{
      id: 'about',
      label: 'About This Service',
      icon: Info,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }, {
      id: 'eligibility_terms',
      label: 'Eligibility & Terms',
      icon: CheckCircle,
      iconBgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }, {
      id: 'application_process',
      label: 'Application Process',
      icon: ClipboardList,
      iconBgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }, {
      id: 'required_documents',
      label: 'Required Documents',
      icon: FileText,
      iconBgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    }, {
      id: 'provider',
      label: 'About Provider',
      icon: Building,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }],
    summarySticky: true,
    filterCategories: [{
      id: 'category',
      title: 'Service Category',
      options: [{
        id: 'loans',
        name: 'Loans'
      }, {
        id: 'financing',
        name: 'Financing'
      }, {
        id: 'insurance',
        name: 'Insurance'
      }, {
        id: 'creditcard',
        name: 'Credit Card'
      }]
    }, {
      id: 'serviceType',
      title: 'Service Type',
      options: [{
        id: 'financing',
        name: 'Financing'
      }, {
        id: 'credit',
        name: 'Credit'
      }, {
        id: 'riskmanagement',
        name: 'Risk Management'
      }]
    }],
    // Data mapping functions
    mapListResponse: data => {
      return data.map((item: any) => ({
        ...item,
        // Transform any fields if needed
        tags: item.tags || [item.category, item.serviceType].filter(Boolean)
      }));
    },
    mapDetailResponse: data => {
      return {
        ...data,
        // Transform any fields if needed
        highlights: data.highlights || data.details || []
      };
    },
    mapFilterResponse: data => {
      return [{
        id: 'category',
        title: 'Service Category',
        options: data.categories || []
      }, {
        id: 'serviceType',
        title: 'Service Type',
        options: data.serviceTypes || []
      }];
    },
    // Mock data for fallback and schema reference
    mockData: mockFinancialServicesData
  },
  'non-financial': {
    id: 'non-financial',
    title: 'Design & Deploy Services',
    description: 'Discover DigitalQatalyst\'s comprehensive digital transformation services',
    route: '/marketplace/services',
    primaryCTA: 'Request Service',
    secondaryCTA: 'View Details',
    itemName: 'Service',
    itemNamePlural: 'Services',
    attributes: [{
      key: 'category',
      label: 'Service Type',
      icon: React.createElement(Award, { size: 18, className: "mr-2" })
    }, {
      key: 'serviceCategory',
      label: 'Category',
      icon: React.createElement(Users, { size: 18, className: "mr-2" })
    }, {
      key: 'serviceAvailability',
      label: 'Availability',
      icon: React.createElement(CheckCircle, { size: 18, className: "mr-2" })
    }, {
      key: 'serviceReadiness',
      label: 'Readiness',
      icon: React.createElement(Clock, { size: 18, className: "mr-2" })
    }],
    detailSections: ['description', 'deliveryDetails', 'provider', 'related'],
    tabs: [{
      id: 'design-services',
      label: 'Design Services',
      icon: Info,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }, {
      id: 'deploy-services-saas',
      label: 'Deploy Services (SaaS)',
      icon: CheckCircle,
      iconBgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }, {
      id: 'deploy-services-onprem',
      label: 'Deploy Services (On-Prem)',
      icon: Building,
      iconBgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }],
    summarySticky: true,
    filterCategories: [{
      id: 'serviceCategory',
      title: 'Service Category',
      options: [{
        id: 'strategy-architecture',
        name: 'Strategy & Architecture'
      }, {
        id: 'user-experience',
        name: 'User Experience'
      }, {
        id: 'data-analytics',
        name: 'Data & Analytics'
      }, {
        id: 'devops-automation',
        name: 'DevOps & Automation'
      }, {
        id: 'system-integration',
        name: 'System Integration'
      }, {
        id: 'infrastructure',
        name: 'Infrastructure'
      }]
    }, {
      id: 'serviceAvailability',
      title: 'Service Availability',
      options: [{
        id: 'available',
        name: 'Available'
      }, {
        id: 'limited',
        name: 'Limited'
      }, {
        id: 'coming-soon',
        name: 'Coming Soon'
      }]
    }, {
      id: 'serviceReadiness',
      title: 'Service Readiness',
      options: [{
        id: 'ready',
        name: 'Ready'
      }, {
        id: 'in-development',
        name: 'In Development'
      }, {
        id: 'planning',
        name: 'Planning'
      }]
    }, {
      id: 'economicSector',
      title: 'Economic Sector',
      options: [{
        id: 'cross-sector',
        name: 'Cross-Sector'
      }, {
        id: 'primary',
        name: 'Primary'
      }, {
        id: 'secondary',
        name: 'Secondary'
      }, {
        id: 'tertiary',
        name: 'Tertiary'
      }, {
        id: 'quaternary',
        name: 'Quaternary'
      }]
    }],
    // Data mapping functions
    mapListResponse: data => {
      return data.map((item: any) => ({
        ...item,
        // Transform any fields if needed
        tags: item.tags || [item.category, item.serviceCategory, item.serviceAvailability].filter(Boolean)
      }));
    },
    mapDetailResponse: data => {
      return {
        ...data,
        // Transform any fields if needed
        highlights: data.highlights || data.details || []
      };
    },
    mapFilterResponse: data => {
      return [{
        id: 'serviceCategory',
        title: 'Service Category',
        options: data.serviceCategories || []
      }, {
        id: 'serviceAvailability',
        title: 'Service Availability',
        options: data.serviceAvailability || []
      }, {
        id: 'serviceReadiness',
        title: 'Service Readiness',
        options: data.serviceReadiness || []
      }, {
        id: 'economicSector',
        title: 'Economic Sector',
        options: data.economicSectors || []
      }];
    },
    // Mock data for fallback and schema reference
    mockData: {
      items: [],
      filterOptions: {
        serviceCategories: [{
          id: 'strategy-architecture',
          name: 'Strategy & Architecture'
        }, {
          id: 'user-experience',
          name: 'User Experience'
        }, {
          id: 'data-analytics',
          name: 'Data & Analytics'
        }, {
          id: 'devops-automation',
          name: 'DevOps & Automation'
        }, {
          id: 'system-integration',
          name: 'System Integration'
        }, {
          id: 'infrastructure',
          name: 'Infrastructure'
        }],
        serviceAvailability: [{
          id: 'available',
          name: 'Available'
        }, {
          id: 'limited',
          name: 'Limited'
        }, {
          id: 'coming-soon',
          name: 'Coming Soon'
        }],
        serviceReadiness: [{
          id: 'ready',
          name: 'Ready'
        }, {
          id: 'in-development',
          name: 'In Development'
        }, {
          id: 'planning',
          name: 'Planning'
        }],
        economicSectors: [{
          id: 'cross-sector',
          name: 'Cross-Sector'
        }, {
          id: 'primary',
          name: 'Primary'
        }, {
          id: 'secondary',
          name: 'Secondary'
        }, {
          id: 'tertiary',
          name: 'Tertiary'
        }, {
          id: 'quaternary',
          name: 'Quaternary'
        }]
      },
      providers: []
    }
  },
  'dtmi': {
    id: 'dtmi',
    title: 'Explore Insights',
    description: 'Discover valuable perspectives and expert-driven content to guide your digital transformation journey.',
    route: '/marketplace/dtmi',
    primaryCTA: 'Access Now',
    secondaryCTA: 'View Details',
    itemName: 'Knowledge Hub',
    itemNamePlural: 'Knowledge Hub',
    attributes: [{
      key: 'mediaType',
      label: 'Type',
      icon: React.createElement(FileType, { size: 18, className: "mr-2" })
    }, {
      key: 'domain',
      label: 'Domain',
      icon: React.createElement(Bookmark, { size: 18, className: "mr-2" })
    }, {
      key: 'businessStage',
      label: 'Business Stage',
      icon: React.createElement(TrendingUp, { size: 18, className: "mr-2" })
    }, {
      key: 'date',
      label: 'Published',
      icon: React.createElement(Calendar, { size: 18, className: "mr-2" })
    }],
    detailSections: ['description', 'content', 'provider', 'related'],
    tabs: [{
      id: 'about',
      label: 'About This Resource',
      icon: Info,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }, {
      id: 'content',
      label: 'Content',
      icon: FileText,
      iconBgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }, {
      id: 'provider',
      label: 'About Provider',
      icon: Building,
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }],
    summarySticky: true,
    // Written content filters
    writtenFilterCategories: [{
      id: 'contentType',
      title: 'Content Type',
      options: [{
        id: 'article',
        name: 'Articles'
      }, {
        id: 'blog',
        name: 'Blogs'
      }, {
        id: 'whitepaper',
        name: 'Whitepapers'
      }, {
        id: 'prediction',
        name: 'Prediction Analysis'
      }, {
        id: 'report',
        name: 'Research Reports'
      }, {
        id: 'interview',
        name: 'Expert Interviews'
      }, {
        id: 'casestudy',
        name: 'Case Studies'
      }]
    }, {
      id: 'format',
      title: 'Format',
      options: [{
        id: 'quickreads',
        name: 'Quick Reads'
      }, {
        id: 'indepth',
        name: 'In-Depth Reports'
      }, {
        id: 'interactive',
        name: 'Interactive Tools'
      }, {
        id: 'templates',
        name: 'Downloadable Templates'
      }, {
        id: 'live',
        name: 'Live Events'
      }]
    }, {
      id: 'category',
      title: 'Category',
      isNested: true,
      options: [{
        id: 'perspectives',
        name: 'Digital Perspectives',
        children: [{
          id: 'd1-e40',
          name: 'D1 - Digital Economy 4.0 (E4.0)'
        }, {
          id: 'd2-dco',
          name: 'D2 - Digital Cognitive Organisation (DCO)'
        }, {
          id: 'd3-dbp',
          name: 'D3 - Digital Business Platform (DBP)'
        }, {
          id: 'd4-dt20',
          name: 'D4 - Digital Transformation 2.0 (DT2.0)'
        }, {
          id: 'd5-worker',
          name: 'D5 - Digital Worker & Digital Workspace'
        }, {
          id: 'd6-accelerators',
          name: 'D6 - Digital Accelerators (Tools)'
        }]
      }, {
        id: 'functional',
        name: 'Digital Functional Streams & Domains',
        children: [{
          id: 'frontend',
          name: 'Digital Front-end',
          children: [{
            id: 'channels',
            name: 'Digital Channels'
          }, {
            id: 'experience',
            name: 'Digital Experience'
          }, {
            id: 'services',
            name: 'Digital Services'
          }, {
            id: 'marketing',
            name: 'Digital Marketing'
          }]
        }, {
          id: 'core',
          name: 'Digital Core',
          children: [{
            id: 'workspace',
            name: 'Digital Workspace'
          }, {
            id: 'core-systems',
            name: 'Digital Core'
          }, {
            id: 'gprc',
            name: 'Digital GPRC'
          }, {
            id: 'backoffice',
            name: 'Digital Back-Office'
          }]
        }, {
          id: 'enablers',
          name: 'Digital Enablers',
          children: [{
            id: 'interops',
            name: 'Digital InterOps'
          }, {
            id: 'security',
            name: 'Digital Security'
          }, {
            id: 'intelligence',
            name: 'Digital Intelligence'
          }, {
            id: 'it',
            name: 'Digital IT'
          }]
        }]
      }, {
        id: 'sectors',
        name: 'Digital Sectors',
        children: [{
          id: 'experience40',
          name: 'Cross-Sector Domain (Experience4.0)'
        }, {
          id: 'agility40',
          name: 'Cross-Sector Domain (Agility4.0)'
        }, {
          id: 'farming40',
          name: 'Primary Sector (Farming4.0)'
        }, {
          id: 'plant40',
          name: 'Secondary Sector (Plant4.0)'
        }, {
          id: 'infrastructure40',
          name: 'Secondary Sector (Infrastructure4.0)'
        }, {
          id: 'government40',
          name: 'Tertiary Sector (Government4.0)'
        }, {
          id: 'hospitality40',
          name: 'Tertiary Sector (Hospitality4.0)'
        }, {
          id: 'retail40',
          name: 'Tertiary Sector (Retail4.0)'
        }, {
          id: 'service40',
          name: 'Quaternary Sector (Service4.0)'
        }, {
          id: 'logistics40',
          name: 'Quaternary Sector (Logistics4.0)'
        }, {
          id: 'wellness40',
          name: 'Quinary Sector (Wellness4.0)'
        }]
      }]
    }, {
      id: 'popularity',
      title: 'Popularity',
      options: [{
        id: 'latest',
        name: 'Latest'
      }, {
        id: 'trending',
        name: 'Trending'
      }, {
        id: 'downloaded',
        name: 'Most Downloaded'
      }, {
        id: 'editors',
        name: "Editor's Pick"
      }]
    }],
    // Multimedia content filters
    multimediaFilterCategories: [{
      id: 'contentType',
      title: 'Content Type',
      options: [{
        id: 'video',
        name: 'Videos'
      }, {
        id: 'podcast',
        name: 'Podcasts'
      }]
    }, {
      id: 'format',
      title: 'Format',
      options: [{
        id: 'interactive',
        name: 'Interactive Tools'
      }, {
        id: 'recorded',
        name: 'Recorded Media'
      }, {
        id: 'live',
        name: 'Live Events'
      }]
    }, {
      id: 'category',
      title: 'Category',
      isNested: true,
      options: [{
        id: 'perspectives',
        name: 'Digital Perspectives',
        children: [{
          id: 'd1-e40',
          name: 'D1 - Digital Economy 4.0 (E4.0)'
        }, {
          id: 'd2-dco',
          name: 'D2 - Digital Cognitive Organisation (DCO)'
        }, {
          id: 'd3-dbp',
          name: 'D3 - Digital Business Platform (DBP)'
        }, {
          id: 'd4-dt20',
          name: 'D4 - Digital Transformation 2.0 (DT2.0)'
        }, {
          id: 'd5-worker',
          name: 'D5 - Digital Worker & Digital Workspace'
        }, {
          id: 'd6-accelerators',
          name: 'D6 - Digital Accelerators (Tools)'
        }]
      }, {
        id: 'functional',
        name: 'Digital Functional Streams & Domains',
        children: [{
          id: 'frontend',
          name: 'Digital Front-end',
          children: [{
            id: 'channels',
            name: 'Digital Channels'
          }, {
            id: 'experience',
            name: 'Digital Experience'
          }, {
            id: 'services',
            name: 'Digital Services'
          }, {
            id: 'marketing',
            name: 'Digital Marketing'
          }]
        }, {
          id: 'core',
          name: 'Digital Core',
          children: [{
            id: 'workspace',
            name: 'Digital Workspace'
          }, {
            id: 'core-systems',
            name: 'Digital Core'
          }, {
            id: 'gprc',
            name: 'Digital GPRC'
          }, {
            id: 'backoffice',
            name: 'Digital Back-Office'
          }]
        }, {
          id: 'enablers',
          name: 'Digital Enablers',
          children: [{
            id: 'interops',
            name: 'Digital InterOps'
          }, {
            id: 'security',
            name: 'Digital Security'
          }, {
            id: 'intelligence',
            name: 'Digital Intelligence'
          }, {
            id: 'it',
            name: 'Digital IT'
          }]
        }]
      }, {
        id: 'sectors',
        name: 'Digital Sectors',
        children: [{
          id: 'experience40',
          name: 'Cross-Sector Domain (Experience4.0)'
        }, {
          id: 'agility40',
          name: 'Cross-Sector Domain (Agility4.0)'
        }, {
          id: 'farming40',
          name: 'Primary Sector (Farming4.0)'
        }, {
          id: 'plant40',
          name: 'Secondary Sector (Plant4.0)'
        }, {
          id: 'infrastructure40',
          name: 'Secondary Sector (Infrastructure4.0)'
        }, {
          id: 'government40',
          name: 'Tertiary Sector (Government4.0)'
        }, {
          id: 'hospitality40',
          name: 'Tertiary Sector (Hospitality4.0)'
        }, {
          id: 'retail40',
          name: 'Tertiary Sector (Retail4.0)'
        }, {
          id: 'service40',
          name: 'Quaternary Sector (Service4.0)'
        }, {
          id: 'logistics40',
          name: 'Quaternary Sector (Logistics4.0)'
        }, {
          id: 'wellness40',
          name: 'Quinary Sector (Wellness4.0)'
        }]
      }]
    }, {
      id: 'popularity',
      title: 'Popularity',
      options: [{
        id: 'latest',
        name: 'Latest'
      }, {
        id: 'trending',
        name: 'Trending'
      }, {
        id: 'downloaded',
        name: 'Most Downloaded'
      }, {
        id: 'editors',
        name: "Editor's Pick"
      }]
    }],
    // Legacy filterCategories for backward compatibility
    filterCategories: [{
      id: 'mediaType',
      title: 'Content Type',
      options: [{
        id: 'article',
        name: 'Articles'
      }, {
        id: 'blog',
        name: 'Blogs'
      }, {
        id: 'whitepaper',
        name: 'Whitepapers'
      }, {
        id: 'prediction',
        name: 'Prediction Analysis'
      }, {
        id: 'report',
        name: 'Research Reports'
      }, {
        id: 'interview',
        name: 'Expert Interviews'
      }, {
        id: 'video',
        name: 'Videos'
      }, {
        id: 'podcast',
        name: 'Podcasts'
      }, {
        id: 'casestudy',
        name: 'Case Studies'
      }]
    }, {
      id: 'category',
      title: 'Category',
      isNested: true,
      options: [{
        id: 'perspectives',
        name: 'Digital Perspectives',
        children: [{
          id: 'd1-e40',
          name: 'D1 - Digital Economy 4.0 (E4.0)'
        }, {
          id: 'd2-dco',
          name: 'D2 - Digital Cognitive Organisation (DCO)'
        }, {
          id: 'd3-dbp',
          name: 'D3 - Digital Business Platform (DBP)'
        }, {
          id: 'd4-dt20',
          name: 'D4 - Digital Transformation 2.0 (DT2.0)'
        }, {
          id: 'd5-worker',
          name: 'D5 - Digital Worker & Digital Workspace'
        }, {
          id: 'd6-accelerators',
          name: 'D6 - Digital Accelerators (Tools)'
        }]
      }, {
        id: 'functional',
        name: 'Digital Functional Streams & Domains',
        children: [{
          id: 'frontend',
          name: 'Digital Front-end',
          children: [{
            id: 'channels',
            name: 'Digital Channels'
          }, {
            id: 'experience',
            name: 'Digital Experience'
          }, {
            id: 'services',
            name: 'Digital Services'
          }, {
            id: 'marketing',
            name: 'Digital Marketing'
          }]
        }, {
          id: 'core',
          name: 'Digital Core',
          children: [{
            id: 'workspace',
            name: 'Digital Workspace'
          }, {
            id: 'core-systems',
            name: 'Digital Core'
          }, {
            id: 'gprc',
            name: 'Digital GPRC'
          }, {
            id: 'backoffice',
            name: 'Digital Back-Office'
          }]
        }, {
          id: 'enablers',
          name: 'Digital Enablers',
          children: [{
            id: 'interops',
            name: 'Digital InterOps'
          }, {
            id: 'security',
            name: 'Digital Security'
          }, {
            id: 'intelligence',
            name: 'Digital Intelligence'
          }, {
            id: 'it',
            name: 'Digital IT'
          }]
        }]
      }, {
        id: 'sectors',
        name: 'Digital Sectors',
        children: [{
          id: 'experience40',
          name: 'Cross-Sector Domain (Experience4.0)'
        }, {
          id: 'agility40',
          name: 'Cross-Sector Domain (Agility4.0)'
        }, {
          id: 'farming40',
          name: 'Primary Sector (Farming4.0)'
        }, {
          id: 'plant40',
          name: 'Secondary Sector (Plant4.0)'
        }, {
          id: 'infrastructure40',
          name: 'Secondary Sector (Infrastructure4.0)'
        }, {
          id: 'government40',
          name: 'Tertiary Sector (Government4.0)'
        }, {
          id: 'hospitality40',
          name: 'Tertiary Sector (Hospitality4.0)'
        }, {
          id: 'retail40',
          name: 'Tertiary Sector (Retail4.0)'
        }, {
          id: 'service40',
          name: 'Quaternary Sector (Service4.0)'
        }, {
          id: 'logistics40',
          name: 'Quaternary Sector (Logistics4.0)'
        }, {
          id: 'wellness40',
          name: 'Quinary Sector (Wellness4.0)'
        }]
      }]
    }, {
      id: 'format',
      title: 'Format',
      options: [{
        id: 'quickreads',
        name: 'Quick Reads'
      }, {
        id: 'indepth',
        name: 'In-Depth Reports'
      }, {
        id: 'interactive',
        name: 'Interactive Tools'
      }, {
        id: 'templates',
        name: 'Downloadable Templates'
      }, {
        id: 'recorded',
        name: 'Recorded Media'
      }, {
        id: 'live',
        name: 'Live Events'
      }]
    }, {
      id: 'popularity',
      title: 'Popularity',
      options: [{
        id: 'latest',
        name: 'Latest'
      }, {
        id: 'trending',
        name: 'Trending'
      }, {
        id: 'downloaded',
        name: 'Most Downloaded'
      }, {
        id: 'editors',
        name: "Editor's Pick"
      }]
    }],
    // Data mapping functions
    mapListResponse: data => {
      return data.map((item: any) => ({
        ...item,
        // Transform any fields if needed
        tags: item.tags || [item.mediaType, item.domain].filter(Boolean)
      }));
    },
    mapDetailResponse: data => {
      return {
        ...data,
        // Transform any fields if needed
        highlights: data.highlights || []
      };
    },
    mapFilterResponse: data => {
      return [{
        id: 'mediaType',
        title: 'Media Type',
        options: data.mediaTypes || []
      }, {
        id: 'businessStage',
        title: 'Business Stage',
        options: data.businessStages || []
      }, {
        id: 'domain',
        title: 'Domain',
        options: data.domains || []
      }, {
        id: 'format',
        title: 'Format',
        options: data.formats || []
      }, {
        id: 'popularity',
        title: 'Popularity',
        options: data.popularity || []
      }];
    },
    // Mock data for fallback and schema reference
    mockData: mockKnowledgeHubData
  }
};
// Helper to get config by marketplace type
export const getMarketplaceConfig = (type: string): MarketplaceConfig => {
  const config = marketplaceConfig[type];
  if (!config) {
    throw new Error(`No configuration found for marketplace type: ${type}`);
  }
  return config;
};
