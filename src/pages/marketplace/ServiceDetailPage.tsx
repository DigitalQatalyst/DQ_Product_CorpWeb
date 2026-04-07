import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { mockServiceData, ServiceItem } from '../../data/mockServiceData';
import {
  CheckCircle,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Home,
} from 'lucide-react';

// Service-specific content configuration to reduce cognitive complexity
const serviceOverviewContent: Record<string, {
  paragraphs: string[];
  keyAreas: string[];
  targetAudience: string[];
  showApproachHeader?: boolean;
}> = {
  'digital-intelligence-strategy': {
    paragraphs: [
      'Our approach is intentionally different from traditional data consulting. We do not produce static data strategies or theoretical data models. Instead, we focus on defining clear data architectures, analytics frameworks, and practical design artifacts (supported by working prototypes) that enable you to move from data chaos to data-driven insights with confidence.',
      'Delivering meaningful data intelligence requires more than implementing analytics tools. It demands a cohesive design that aligns data sources, analytics capabilities, governance frameworks, and operating models within a well-defined Digital Business Platform context.',
      'The service produces implementation-ready specifications and validated prototypes that enable confident investment and execution across:'
    ],
    keyAreas: [
      'Data Architecture & Integration',
      'Analytics & Business Intelligence',
      'AI & Machine Learning Capabilities',
      'Data Governance & Quality'
    ],
    targetAudience: [
      'Need practical data architectures and working analytics prototypes, not theoretical recommendations',
      'Are modernising or scaling data and analytics capabilities',
      'Operate in data-intensive or regulated environments',
      'Want to move from data strategy to data-driven insights with confidence'
    ]
  },
  'digital-core-dws-strategy': {
    paragraphs: [
      'Our approach is intentionally different from traditional workspace consulting. We do not produce static collaboration strategies or theoretical workspace models. Instead, we focus on defining clear workspace architectures, collaboration frameworks, and practical design artifacts (supported by working prototypes) that enable your teams to work efficiently and securely with confidence.',
      'Delivering meaningful workspace transformation requires more than implementing collaboration tools. It demands a cohesive design that aligns workspace technologies, collaboration processes, security frameworks, and productivity models within a well-defined Digital Business Platform context.',
      'The service produces implementation-ready specifications and validated prototypes that enable confident investment and execution across:'
    ],
    keyAreas: [
      'Collaboration Platforms & Tools',
      'Productivity & Communication Systems',
      'Security & Access Management',
      'Workspace Integration & Automation'
    ],
    targetAudience: [
      'Need practical workspace architectures and working collaboration prototypes, not theoretical recommendations',
      'Are modernising or scaling collaboration and productivity capabilities',
      'Operate in distributed or hybrid work environments',
      'Want to move from workspace strategy to seamless collaboration with confidence'
    ]
  },
  'digital-experience-strategy': {
    paragraphs: [
      'Our approach is intentionally different from traditional consulting. We do not produce static strategies or theoretical recommendations. Instead, we focus on defining clear experience models, target architectures, and practical design artifacts—supported by working prototypes—that enable you to move from strategic intent to execution with confidence.',
      'Delivering meaningful digital experience requires more than improving individual channels. It demands a cohesive design that aligns customer journeys, data, platforms, and operating models within a well-defined Digital Business Platform context.',
      'The service produces implementation-ready specifications and validated prototypes that enable confident investment and execution across:'
    ],
    keyAreas: [
      'Digital Experience Platforms (DXP)',
      'Digital Workspace (DWS)',
      'Digital Intelligence & Analytics (DIA)',
      'Security & DevOps (SecDevOps)'
    ],
    targetAudience: [
      'Need practical design artifacts and working prototypes, not theoretical recommendations',
      'Are modernising or scaling digital customer experiences',
      'Operate in regulated or complex enterprise environments',
      'Want to move from strategic intent to execution with confidence'
    ]
  },
  'devops-strategy': {
    showApproachHeader: true,
    paragraphs: [
      'Our approach is intentionally different from traditional security consulting. We do not produce static security policies or theoretical compliance frameworks. Instead, we focus on defining clear security architectures, DevOps practices, and practical design artifacts (supported by working prototypes) that enable you to move from security concerns to secure operations with confidence.',
      'Delivering meaningful security and operational excellence requires more than implementing security tools. It demands a cohesive design that aligns security controls, DevOps practices, compliance requirements, and operating models within a well-defined Digital Business Platform context.',
      'The service produces implementation-ready specifications and validated prototypes that enable confident investment and execution across:'
    ],
    keyAreas: [
      'Security Architecture & Controls',
      'DevOps & CI/CD Pipelines',
      'Compliance & Governance',
      'Infrastructure & Cloud Security'
    ],
    targetAudience: [
      'Need practical security architectures and working DevOps prototypes, not theoretical recommendations',
      'Are modernising or scaling security and operational capabilities',
      'Operate in regulated or high-security environments',
      'Want to move from security strategy to secure operations with confidence'
    ]
  },
  default: {
    paragraphs: [
      'Our approach is intentionally different from traditional enterprise consulting. We do not produce static transformation strategies or theoretical operating models. Instead, we focus on defining clear enterprise architectures, integrated platform designs, and practical design artifacts (supported by working prototypes) that enable you to move from organisational vision to platform execution with confidence.',
      'Delivering meaningful digital transformation requires more than implementing individual solutions. It demands a cohesive design that aligns all four pillars of the Digital Business Platform: customer experiences, employee collaboration, data intelligence, and secure operations within a unified, well-defined enterprise context.',
      'The service produces implementation-ready specifications and validated prototypes that enable confident investment and execution across:'
    ],
    keyAreas: [
      'Digital Experience Platform (DXP)',
      'Digital Workspace (DWS)',
      'Digital Intelligence & Analytics (DIA)',
      'Security & DevOps (SecDevOps)'
    ],
    targetAudience: [
      'Need comprehensive enterprise platform architectures and working prototypes, not theoretical recommendations',
      'Are undertaking large-scale digital transformation across the organisation',
      'Want to integrate customer experience, employee collaboration, data intelligence, and secure operations',
      'Want to move from enterprise vision to platform execution with confidence'
    ]
  }
};

// Helper function to get service content
const getServiceContent = (serviceId: string) => {
  return serviceOverviewContent[serviceId] || serviceOverviewContent.default;
};

const ServiceDetailPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceItem | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    envision: false,
    model: false,
    specify: false,
    prototype: false,
  });
  const [deliveryNotesExpanded, setDeliveryNotesExpanded] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState('visual-strategy-summary');

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  useEffect(() => {
    // Find the service by ID
    const foundService = mockServiceData.find(s => s.id === serviceId);
    setService(foundService || null);
  }, [serviceId]);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h2>
            <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/marketplace/services')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Services
            </button>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'delivery-approach', label: 'Delivery Approach' },
    { id: 'deliverables', label: 'Deliverables' },
    { id: 'required-inputs', label: 'Required Inputs' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-gray-700 flex items-center">
                <Home size={16} className="mr-1" />
                Home
              </Link>
              <ChevronRight size={16} className="text-gray-400" />
              <Link to="/marketplace/services" className="text-gray-500 hover:text-gray-700">
                Services
              </Link>
              <ChevronRight size={16} className="text-gray-400" />
              <span className="text-gray-900 font-medium truncate max-w-[200px]">
                {service.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            {/* Service Header */}
            <div className="bg-gray-100 rounded-lg shadow-sm p-8 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Service Info */}
                <div className="lg:col-span-2">
                  {/* Service Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-sm font-medium">
                      {service.category}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h1>
                  
                  {/* Description */}
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* CTA Button */}
                  <Link
                    to={service.formUrl}
                    className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Request Service
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                </div>

                {/* Right Column - Service Details */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium text-sm">Category:</span>
                        <span className="text-gray-900 font-semibold text-sm">{service.serviceCategory}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium text-sm">Type:</span>
                        <span className="text-gray-900 font-semibold text-sm">Design</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium text-sm">Duration:</span>
                        <span className="text-gray-900 font-semibold text-sm">{service.duration || '1-2 weeks'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium text-sm">Availability:</span>
                        <span className="text-green-600 font-semibold text-sm">{service.serviceAvailability}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium text-sm">Provided by:</span>
                        <span className="text-gray-900 font-semibold text-sm">{service.provider}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

                {/* Tab Content */}
                <div className="p-8">
                    {activeTab === 'overview' && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Service Overview</h2>
                        
                        <div className="prose max-w-none">
                          {(() => {
                            const content = getServiceContent(service.id);
                            return (
                              <>
                                {content.showApproachHeader && (
                                  <h2 className="text-xl font-bold text-gray-900 mb-6">Our Approach</h2>
                                )}
                                
                                {content.paragraphs.map((paragraph, index) => (
                                  <p key={index} className="text-gray-700 mb-6">
                                    {paragraph}
                                  </p>
                                ))}
                                
                                {/* Key Areas */}
                                <div className="space-y-3 mb-8">
                                  {content.keyAreas.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                      <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0" />
                                      <span className="text-gray-700">{item}</span>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Who This Service Is For */}
                                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
                                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Who This Service Is For</h3>
                                  <p className="text-gray-700 mb-4">Best suited for organisations that:</p>
                                  <div className="space-y-2">
                                    {content.targetAudience.map((item, index) => (
                                      <div key={index} className="flex items-start">
                                        <CheckCircle size={16} className="text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {activeTab === 'delivery-approach' && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">How the Service Is Delivered</h2>
                        <p className="text-gray-700 mb-8">
                          The service follows a four-stage design lifecycle, with each stage building toward implementation readiness.
                        </p>
                        
                        {/* Delivery Stages */}
                        <div className="space-y-4">
                          {/* Stage 1: Envision */}
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleStage('envision')}
                              className="w-full bg-orange-50 p-4 border-b border-gray-200 hover:bg-orange-100 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                                    1
                                  </div>
                                  <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Envision</h3>
                                    <p className="text-sm text-gray-600">Strategic clarity and direction</p>
                                  </div>
                                </div>
                                <ChevronDown 
                                  size={20} 
                                  className={`text-gray-500 transition-transform ${
                                    expandedStages.envision ? 'rotate-180' : ''
                                  }`}
                                />
                              </div>
                            </button>
                            {expandedStages.envision && (
                              <div className="p-6">
                                <div className="mb-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">OUTCOME</h4>
                                  <p className="text-gray-700">A clear digital experience vision aligned to business and technology strategy.</p>
                                </div>
                                
                                <div className="mb-4">
                                  <h4 className="font-semibold text-gray-600 mb-3">WHAT'S ACHIEVED</h4>
                                  <div className="space-y-2">
                                    {[
                                      'Experience vision, positioning, and mandate',
                                      'Alignment with business priorities and technology direction',
                                      'Identification of gaps across customer journeys and platforms'
                                    ].map((item, index) => (
                                      <div key={index} className="flex items-start">
                                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold text-gray-600 mb-3">PRIMARY DELIVERABLES</h4>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• Digital Experience Strategy Report (strategic sections)</li>
                                    <li>• Visual Strategy Summary</li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Stage 2: Model */}
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleStage('model')}
                              className="w-full bg-orange-50 p-4 border-b border-gray-200 hover:bg-orange-100 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                                    2
                                  </div>
                                  <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Model</h3>
                                    <p className="text-sm text-gray-600">Target-state design and operating model</p>
                                  </div>
                                </div>
                                <ChevronDown 
                                  size={20} 
                                  className={`text-gray-500 transition-transform ${
                                    expandedStages.model ? 'rotate-180' : ''
                                  }`}
                                />
                              </div>
                            </button>
                            {expandedStages.model && (
                              <div className="p-6">
                                <div className="mb-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">OUTCOME</h4>
                                  <p className="text-gray-700">A defined target state for how digital experience is designed, delivered, and governed.</p>
                                </div>
                                
                                <div className="mb-4">
                                  <h4 className="font-semibold text-gray-600 mb-3">WHAT'S ACHIEVED</h4>
                                  <div className="space-y-2">
                                    {[
                                      'Target capabilities and operating model',
                                      'Platform and enabling technology architecture',
                                      'Governance and operating structures'
                                    ].map((item, index) => (
                                      <div key={index} className="flex items-start">
                                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold text-gray-600 mb-3">PRIMARY DELIVERABLES</h4>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• Digital Experience Strategy Report (target design)</li>
                                    <li>• Architecture and operating model visuals</li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Stage 3: Specify */}
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleStage('specify')}
                              className="w-full bg-orange-50 p-4 border-b border-gray-200 hover:bg-orange-100 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                                    3
                                  </div>
                                  <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Specify</h3>
                                    <p className="text-sm text-gray-600">Build-ready requirements</p>
                                  </div>
                                </div>
                                <ChevronDown 
                                  size={20} 
                                  className={`text-gray-500 transition-transform ${
                                    expandedStages.specify ? 'rotate-180' : ''
                                  }`}
                                />
                              </div>
                            </button>
                            {expandedStages.specify && (
                              <div className="p-6">
                                <div className="mb-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">OUTCOME</h4>
                                  <p className="text-gray-700">Clear, actionable specifications ready to drive implementation.</p>
                                </div>
                                
                                <div className="mb-4">
                                  <h4 className="font-semibold text-gray-600 mb-3">WHAT'S ACHIEVED</h4>
                                  <div className="space-y-2">
                                    {[
                                      'Prioritised roadmap and initiatives',
                                      'Functional and non-functional requirements',
                                      'Experience, data, and integration specifications'
                                    ].map((item, index) => (
                                      <div key={index} className="flex items-start">
                                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold text-gray-600 mb-3">PRIMARY DELIVERABLES</h4>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• Digital Experience Platform Specifications</li>
                                    <li>• Requirements and prioritised feature backlog</li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Stage 4: Prototype */}
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleStage('prototype')}
                              className="w-full bg-orange-50 p-4 border-b border-gray-200 hover:bg-orange-100 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                                    4
                                  </div>
                                  <div className="text-left">
                                    <h3 className="font-bold text-gray-900">Prototype</h3>
                                    <p className="text-sm text-gray-600">Validated experience demonstrations</p>
                                  </div>
                                </div>
                                <ChevronDown 
                                  size={20} 
                                  className={`text-gray-500 transition-transform ${
                                    expandedStages.prototype ? 'rotate-180' : ''
                                  }`}
                                />
                              </div>
                            </button>
                            {expandedStages.prototype && (
                              <div className="p-6">
                                <div className="mb-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">OUTCOME</h4>
                                  <p className="text-gray-700">Validated designs demonstrated through real experience scenarios.</p>
                                </div>
                                
                                <div className="mb-4">
                                  <h4 className="font-semibold text-gray-600 mb-3">WHAT'S ACHIEVED</h4>
                                  <div className="space-y-2">
                                    {[
                                      'Prototypes for priority digital experience use cases',
                                      'Demonstrations across DXP, DWS, SecDevOps, and DIA',
                                      'Validation of assumptions and refinement of designs'
                                    ].map((item, index) => (
                                      <div key={index} className="flex items-start">
                                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold text-gray-600 mb-3">PRIMARY DELIVERABLES</h4>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• Digital Experience Platform Prototype</li>
                                    <li>• Interactive demos and experience simulations</li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'deliverables' && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">What You Receive</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                          {/* Left Column - Deliverables List */}
                          <div className="space-y-4">
                            {/* Visual Strategy Summary */}
                            <button
                              onClick={() => setSelectedDeliverable('visual-strategy-summary')}
                              className={`w-full text-left rounded-lg p-4 transition-all ${
                                selectedDeliverable === 'visual-strategy-summary'
                                  ? 'border-2 border-orange-500 bg-orange-50'
                                  : 'border border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-25'
                              }`}
                            >
                              <h3 className="font-bold text-gray-900 mb-2">Visual Strategy Summary</h3>
                              <p className="text-gray-700 text-sm">
                                A one-page visual overview of the digital experience vision, target state, and key design decisions.
                              </p>
                            </button>

                            {/* Digital Experience Strategy Report */}
                            <button
                              onClick={() => setSelectedDeliverable('strategy-report')}
                              className={`w-full text-left rounded-lg p-4 transition-all ${
                                selectedDeliverable === 'strategy-report'
                                  ? 'border-2 border-orange-500 bg-orange-50'
                                  : 'border border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-25'
                              }`}
                            >
                              <h3 className="font-bold text-gray-900 mb-2">Digital Experience Strategy Report</h3>
                              <p className="text-gray-700 text-sm">
                                A structured document capturing the analysis, strategic decisions, and target design underpinning the recommendations.
                              </p>
                            </button>

                            {/* Digital Experience Platform Specifications */}
                            <button
                              onClick={() => setSelectedDeliverable('platform-specifications')}
                              className={`w-full text-left rounded-lg p-4 transition-all ${
                                selectedDeliverable === 'platform-specifications'
                                  ? 'border-2 border-orange-500 bg-orange-50'
                                  : 'border border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-25'
                              }`}
                            >
                              <h3 className="font-bold text-gray-900 mb-2">Digital Experience Platform Specifications</h3>
                              <p className="text-gray-700 text-sm">
                                Clear requirements and a prioritised feature backlog to guide strategy-aligned implementation.
                              </p>
                            </button>

                            {/* Digital Experience Platform Prototype */}
                            <button
                              onClick={() => setSelectedDeliverable('platform-prototype')}
                              className={`w-full text-left rounded-lg p-4 transition-all ${
                                selectedDeliverable === 'platform-prototype'
                                  ? 'border-2 border-orange-500 bg-orange-50'
                                  : 'border border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-25'
                              }`}
                            >
                              <h3 className="font-bold text-gray-900 mb-2">Digital Experience Platform Prototype</h3>
                              <p className="text-gray-700 text-sm">
                                Interactive screens and demonstrations that simulate real experience scenarios and enable early feedback.
                              </p>
                            </button>
                          </div>

                          {/* Right Column - Dynamic Visual Preview */}
                          <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center min-h-[400px]">
                            {selectedDeliverable === 'visual-strategy-summary' && (
                              <>
                                <div className="text-center mb-4">
                                  <h4 className="font-semibold text-gray-700 mb-2">Visual Infographic Summary</h4>
                                  <p className="text-sm text-gray-600">Visual infographic summary of the practice design</p>
                                </div>
                                
                                <div className="w-full max-w-md">
                                  <img 
                                    src="/images/visual strategy summary.png" 
                                    alt="Visual Strategy Summary - Digital Experience Practice Design"
                                    className="w-full h-auto rounded-lg shadow-lg border border-gray-200"
                                  />
                                </div>
                              </>
                            )}

                            {selectedDeliverable === 'strategy-report' && (
                              <div className="text-center">
                                <h4 className="font-semibold text-gray-700 mb-2">Strategy Report Preview</h4>
                                <p className="text-sm text-gray-600 mb-4">Comprehensive analysis and strategic recommendations</p>
                                <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                                  <p className="text-gray-500 text-sm">Visual preview coming soon</p>
                                </div>
                              </div>
                            )}

                            {selectedDeliverable === 'platform-specifications' && (
                              <div className="text-center">
                                <h4 className="font-semibold text-gray-700 mb-2">Platform Specifications Preview</h4>
                                <p className="text-sm text-gray-600 mb-4">Detailed requirements and feature specifications</p>
                                <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                                  <p className="text-gray-500 text-sm">Visual preview coming soon</p>
                                </div>
                              </div>
                            )}

                            {selectedDeliverable === 'platform-prototype' && (
                              <>
                                <div className="text-center mb-4">
                                  <h4 className="font-semibold text-gray-700 mb-2">Platform Prototype Preview</h4>
                                  <p className="text-sm text-gray-600">Interactive demonstration of the digital experience platform</p>
                                </div>
                                
                                <div className="w-full max-w-md">
                                  <img 
                                    src="/images/dxp-prototype-preview.png" 
                                    alt="Digital Experience Platform Prototype Preview"
                                    className="w-full h-auto rounded-lg shadow-lg border border-gray-200"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Delivery Notes - Full Width at Bottom */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setDeliveryNotesExpanded(!deliveryNotesExpanded)}
                            className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-gray-900">Delivery Notes</h3>
                              <ChevronDown 
                                size={20} 
                                className={`text-gray-500 transition-transform ${
                                  deliveryNotesExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </button>
                          {deliveryNotesExpanded && (
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                              <div className="mb-4">
                                <h4 className="font-semibold text-gray-900 mb-3">What to expect during delivery:</h4>
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full mt-0.5 flex-shrink-0"></div>
                                    <span className="text-gray-700 text-sm">Delivered using Qatalyst design standards and patterns</span>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full mt-0.5 flex-shrink-0"></div>
                                    <span className="text-gray-700 text-sm">Majority of analysis and documentation completed off-site</span>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full mt-0.5 flex-shrink-0"></div>
                                    <span className="text-gray-700 text-sm">On-site or live working sessions scheduled where appropriate</span>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full mt-0.5 flex-shrink-0"></div>
                                    <span className="text-gray-700 text-sm">Required inputs confirmed during onboarding before delivery begins</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'required-inputs' && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">What We Need From You</h2>
                        
                        <p className="text-gray-700 mb-8 text-lg">
                          To deliver a tailored Digital Experience Strategy, we require the following materials from your organisation before commencement:
                        </p>

                        {/* Input Categories Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          {/* Business Vision */}
                          <div className="border border-gray-200 rounded-lg p-6 bg-white">
                            <h3 className="font-bold text-gray-900 mb-4">Business Vision</h3>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 text-sm">Strategy</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 text-sm">Business model</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 text-sm">Value streams</span>
                              </div>
                            </div>
                          </div>

                          {/* Enterprise Assets */}
                          <div className="border border-gray-200 rounded-lg p-6 bg-white">
                            <h3 className="font-bold text-gray-900 mb-4">Enterprise Assets</h3>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 text-sm">Business</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 text-sm">Data</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 text-sm">Application</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 text-sm">Technology</span>
                              </div>
                            </div>
                          </div>

                          {/* Experience Assets */}
                          <div className="border border-gray-200 rounded-lg p-6 bg-white">
                            <h3 className="font-bold text-gray-900 mb-4">Experience Assets</h3>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 text-sm">Customer segments</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 text-sm">Journeys</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 text-sm">Touchpoints</span>
                              </div>
                            </div>
                          </div>

                          {/* Transformation Portfolio */}
                          <div className="border border-gray-200 rounded-lg p-6 bg-white">
                            <h3 className="font-bold text-gray-900 mb-4">Transformation Portfolio</h3>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 text-sm">Roadmaps</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 text-sm">Initiatives</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700 text-sm">Requirements</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Important Note */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                          <div className="flex">
                            <div className="ml-3">
                              <p className="text-sm text-yellow-700">
                                <strong>Note:</strong> All required input materials must be provided before commencement of the Digital Experience Strategy service. Incomplete inputs may delay delivery or reduce the quality of strategic recommendations.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* CTA Section */}
                        <div className="bg-white border-2 border-orange-200 rounded-lg p-8 text-center">
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Ready to Design Your Digital Experience Practice?
                          </h3>
                          <p className="text-gray-700 mb-6 text-base">
                            Get implementation-ready specifications and validated prototypes that enable confident investment across your Digital Business Platform.
                          </p>
                          <Link
                            to={service.formUrl}
                            className="inline-flex items-center px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors text-lg"
                          >
                            Request Service
                            <ArrowRight size={20} className="ml-2" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
          </div>
      </main>
      
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default ServiceDetailPage;
