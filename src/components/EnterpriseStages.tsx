import React, { useEffect, useState, useRef } from 'react'
import { useQuery } from '@apollo/client/react'
import {
  Lightbulb,
  Code,
  Rocket,
  TrendingUp,
  BarChart3,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  CheckCircle,
  Grid,
  List,
  ExternalLink,
  BookOpen,
  Users,
  Search,
  RefreshCw,
  Building,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FadeInUpOnScroll, HorizontalScrollReveal } from './AnimationUtils'
import { GET_ALL_COURSES, GET_PRODUCTS } from '../services/marketplaceQueries'

// Minimal query result typings
interface GetProductsData {
  products: { items: any[] }
}
interface GetCoursesData {
  courses: { items: any[] }
}
// Define service data types
interface ServiceItem {
  id: string
  title: string
  desc: string
  type:
    | 'financial'
    | 'nonfinancial'
    | 'courses'
    | 'media'
    | 'industry'
    | 'sector'
  cost?: string
  level?: string
  delivery?: string
  provider?: string
  providerLogo?: string
  cta: string
  tags?: string[]
  url: string
}
// NOTE: Static sample data replaced by API-driven data within AvailableServices
// Available Services component
interface AvailableServicesProps {
  stageId: string
}
const AvailableServices: React.FC<AvailableServicesProps> = ({ stageId }) => {
  // State for filters, sort, and view
  const [marketplaceFilters, setMarketplaceFilters] = useState<string[]>([
    'all',
  ])
  const [viewMode, setViewMode] = useState('grid')
  const [filteredServices, setFilteredServices] = useState<ServiceItem[]>([])
  const [allServices, setAllServices] = useState<ServiceItem[]>([])
  const [visibleCount, setVisibleCount] = useState(8)
  // Load API data (products and courses) and map into unified items filtered by stage
  const { data: productData } = useQuery<GetProductsData>(GET_PRODUCTS)
  const { data: courseData } = useQuery<GetCoursesData>(GET_ALL_COURSES)

  useEffect(() => {
    const normalize = (value?: string | null) => (value || '').toLowerCase().trim()
    const currentStage = normalize(stageId)

    const mappedProducts: ServiceItem[] = (productData?.products?.items || [])
      .map((p: any) => {
        // Determine financial vs non-financial using facetValues ids (66 financial, 67 non-financial) like MarketplacePage
        const has66 = p.facetValues?.some((fv: any) => String(fv?.id) === '66')
        const has67 = p.facetValues?.some((fv: any) => String(fv?.id) === '67')
        const type: ServiceItem['type'] = has67 ? 'nonfinancial' : has66 ? 'financial' : 'nonfinancial'

        // Derive stage from facetValues (preferred) or customFields fallback
        const stageFacet = p?.facetValues?.find((fv: any) => normalize(fv?.facet?.code) === 'business-stage')
        const facetStageName = normalize(stageFacet?.name)
        const facetStageCode = normalize(stageFacet?.code)
        const productStage = normalize(p?.customFields?.BusinessStage)
        const stageCandidates = [currentStage]
        const matchesStage =
          !currentStage ||
          stageCandidates.includes(facetStageName) ||
          stageCandidates.includes(facetStageCode) ||
          stageCandidates.includes(productStage)
        if (!matchesStage) return null

        const routeType = type === 'nonfinancial' ? 'non-financial' : type
        return {
          id: String(p.id),
          title: p.name,
          desc: p.description || 'Service description not available',
          type,
          cost: p?.customFields?.Cost != null ? String(p.customFields.Cost) : undefined,
          provider: p?.customFields?.Partner || 'Khalifa Fund',
          providerLogo: p?.customFields?.logoUrl || '/mzn_logo.png',
          cta: 'Apply',
          tags: [p?.customFields?.Addtags].filter(Boolean),
          url: `/marketplace/${routeType}/${p.id}`,
        } as ServiceItem
      })
      .filter(Boolean) as ServiceItem[]

    const mappedCourses: ServiceItem[] = (courseData?.courses?.items || [])
      .map((c: any) => {
        const courseStage = normalize(c?.businessStage)
        const matchesStage =
          !currentStage ||
          courseStage === currentStage ||
          courseStage.includes(currentStage) ||
          currentStage.includes(courseStage)
        if (!matchesStage) return null
        return {
          id: String(c.id),
          title: c.name,
          desc: c.description || 'Course description not available',
          type: 'courses',
          cost: c?.cost != null ? String(c.cost) : undefined,
          level: c?.duration,
          provider: c?.partner || 'Khalifa Fund Academy',
          providerLogo: c?.logoUrl || '/mzn_logo.png',
          cta: 'Enroll',
          tags: [c?.serviceCategory, c?.pricingModel].filter(Boolean),
          url: `/courses/${c.id}`,
        } as ServiceItem
      })
      .filter(Boolean) as ServiceItem[]

    const combined = [...mappedProducts, ...mappedCourses]
    setAllServices(combined)
  }, [productData, courseData, stageId])
  // Filter services based on selected filters
  useEffect(() => {
    if (allServices.length === 0) {
      setFilteredServices([])
      return
    }
    let filtered = [...allServices]
    // Apply marketplace filters
    if (!marketplaceFilters.includes('all')) {
      filtered = filtered.filter((service) =>
        marketplaceFilters.includes(service.type),
      )
    }
    setFilteredServices(filtered)
  }, [allServices, stageId, marketplaceFilters])
  // Handle marketplace filter change
  const handleMarketplaceFilterChange = (value: string) => {
    if (value === 'all') {
      setMarketplaceFilters(['all'])
    } else {
      const newFilters = marketplaceFilters.includes('all')
        ? [value]
        : marketplaceFilters.includes(value)
          ? marketplaceFilters.filter((f) => f !== value)
          : [...marketplaceFilters, value]
      if (newFilters.length === 0) {
        setMarketplaceFilters(['all'])
      } else {
        setMarketplaceFilters(newFilters)
      }
    }
  }
  // Reset all filters
  const resetFilters = () => {
    setMarketplaceFilters(['all'])
  }
  // Load more services
  const loadMore = () => {
    setVisibleCount((prev) => prev + 8)
  }
  // Create filter options for PillFilters (built from available data, keeping expected labels)
  const marketplaceOptions = [
    { value: 'all', label: 'All' },
    { value: 'financial', label: 'Financial' },
    { value: 'nonfinancial', label: 'Non-financial' },
    { value: 'courses', label: 'Courses' },
    { value: 'media', label: 'Media' },
  ].filter((opt) => {
    if (opt.value === 'all') return true
    return allServices.some((s) => s.type === (opt.value as any))
  })
  return (
    <div className="mt-6 bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Available Services
          </h3>
          <p className="text-gray-600 mt-1">
            Tools, programs, and content to help you validate your idea.
          </p>
        </div>
        {/* Filters section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-gray-700 min-w-[100px]">
              Marketplace:
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                {marketplaceOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleMarketplaceFilterChange(option.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${marketplaceFilters.includes(option.value) ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Active filters and reset */}
          {!marketplaceFilters.includes('all') && (
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-gray-500">
                <span className="font-medium">{filteredServices.length}</span>{' '}
                services found
              </div>
              <button
                onClick={resetFilters}
                className="text-sm text-secondary hover:text-secondary/80 flex items-center"
              >
                <RefreshCw size={14} className="mr-1" />
                Reset filters
              </button>
            </div>
          )}
        </div>
        {/* View mode controls */}
        <div className="flex justify-end items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-secondary/10 text-secondary' : 'text-gray-500 hover:bg-gray-100'}`}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-secondary/10 text-secondary' : 'text-gray-500 hover:bg-gray-100'}`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
        {/* Service cards */}
        {filteredServices.length > 0 ? (
          <div>
            <div
              className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}
            >
              {filteredServices.slice(0, visibleCount).map((service) => (
                <div
                  key={service.id}
                  className={`bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-secondary/30 focus-within:ring-2 focus-within:ring-secondary ${viewMode === 'list' ? 'flex' : ''}`}
                >
                  <a
                    href={service.url}
                    className="block p-5 h-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex flex-col h-full">
                      {/* Eyebrow */}
                      <div className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                        {service.type === 'financial'
                          ? 'Financial'
                          : service.type === 'nonfinancial'
                            ? 'Non-financial'
                            : service.type === 'courses'
                              ? 'Course'
                              : service.type === 'media'
                                ? 'Media'
                                : service.type === 'industry'
                                  ? 'Industry'
                                  : 'Sector'}
                      </div>
                      {/* Title */}
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {service.title}
                      </h4>
                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-3">
                        {service.desc}
                      </p>
                      {/* Meta information */}
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs">
                        {service.delivery && (
                          <div className="flex items-center text-gray-600">
                            <Users size={14} className="mr-1" />
                            {service.delivery}
                          </div>
                        )}
                        {service.level && (
                          <div className="flex items-center text-gray-600">
                            <BookOpen size={14} className="mr-1" />
                            {service.level}
                          </div>
                        )}
                        {/* Service Cost currently hidden from the UI */}
                        {/* {service.cost && (
                          <div className="flex items-center text-gray-600">
                            <DollarSign size={14} className="mr-1" />
                            {service.cost}
                          </div>
                        )} */}
                        {service.provider && (
                          <div className="flex items-center text-gray-600">
                            {service.providerLogo ? (
                              <img 
                                src={service.providerLogo} 
                                alt={`${service.provider} logo`}
                                className="w-4 h-4 mr-1 rounded-sm object-contain"
                                onError={(e) => {
                                  // Fallback to Building icon if logo fails to load
                                  e.currentTarget.style.display = 'none'
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                }}
                              />
                            ) : null}
                            <Building size={14} className={`mr-1 ${service.providerLogo ? 'hidden' : ''}`} />
                            {service.provider}
                          </div>
                        )}
                      </div>
                      {/* Tags */}
                      {service.tags && service.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {service.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* CTA */}
                      <div className="mt-auto">
                        <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary/90 transition-colors">
                          {service.cta}
                          <ExternalLink size={14} className="ml-1.5" />
                        </button>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            {/* Load more button */}
            {filteredServices.length > visibleCount && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMore}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                >
                  Load more
                  <span className="ml-2 text-gray-500 text-xs">
                    ({filteredServices.length - visibleCount} remaining)
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No services match your filters
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters to find services for {stageId}.
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            >
              <RefreshCw size={16} className="mr-2" />
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
// Stage popup component
interface StagePopupProps {
  stage: {
    id: string
    title: string
    description: string
    benefits: string[]
    icon: React.ReactNode
    ctaText: string
    path: string
    detailedDescription?: string
    services?: {
      title: string
      description: string
    }[]
  }
  onClose: () => void
  onCTAClick: () => void
}
const StagePopup: React.FC<StagePopupProps> = ({
  stage,
  onClose,
  onCTAClick,
}) => {
  // Prevent clicks inside the popup from closing it
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
        onClick={handleContentClick}
      >
        <div className="relative">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-secondary/10 p-3 rounded-full mr-4 text-secondary">
                {stage.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {stage.title} Stage
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close popup"
            >
              <X size={24} />
            </button>
          </div>
          {/* Content */}
          <div className="p-6">
            {/* Detailed description */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                About this stage
              </h4>
              <p className="text-gray-600">
                {stage.detailedDescription || stage.description}
              </p>
            </div>
            {/* Benefits */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Key Benefits
              </h4>
              <ul className="space-y-2">
                {stage.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle
                      size={18}
                      className="text-green-500 mr-2 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Available Services Section */}
            <AvailableServices stageId={stage.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
interface StageCardProps {
  title: string
  description: string
  benefits: string[]
  icon: React.ReactNode
  ctaText: string
  onClick: () => void
  onShowDetails: () => void
  index: number
  activeIndex: number
  setActiveIndex: (index: number) => void
}
const StageCard: React.FC<StageCardProps> = ({
  title,
  description,
  benefits,
  icon,
  ctaText,
  onClick,
  onShowDetails,
  index,
  activeIndex,
  setActiveIndex,
}) => {
  const isActive = index === activeIndex
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 min-w-[300px] flex-shrink-0 md:min-w-0 relative ${isActive ? 'shadow-lg transform scale-105 md:scale-100 border-2 border-secondary' : 'hover:shadow-lg hover:-translate-y-1'}`}
      onMouseEnter={() => setActiveIndex(index)}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div
            className={`p-3 rounded-full mr-4 transition-colors duration-300 ${isActive ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary'}`}
          >
            {icon}
          </div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Key Benefits:</h4>
          <ul className="text-gray-600 space-y-1">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-start">
                <span
                  className={`mr-2 transition-colors duration-300 ${isActive ? 'text-secondary' : 'text-secondary'}`}
                >
                  •
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onShowDetails()
          }}
          className={`mt-auto text-white font-medium py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center overflow-hidden group ${isActive ? 'bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary/80' : 'bg-secondary hover:bg-secondary/90'}`}
        >
          {ctaText}
          <ArrowRight
            size={16}
            className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>
      {/* Stage number indicator */}
      <div
        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-600'}`}
      >
        {index + 1}
      </div>
    </div>
  )
}
const EnterpriseStages: React.FC = () => {
  const navigate = useNavigate()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [activePopup, setActivePopup] = useState<string | null>(null)
  // Scroll left/right controls
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      })
    }
  }
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      })
    }
  }
  // Animate timeline when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      {
        threshold: 0.2,
      },
    )
    if (timelineRef.current) {
      observer.observe(timelineRef.current)
    }
    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current)
      }
    }
  }, [])
  const stages = [
    {
      id: 'assessment',
      title: 'Assessment',
      description: 'Evaluate your digital maturity and identify opportunities',
      detailedDescription:
        'The Assessment stage is where your digital transformation journey begins. We conduct a comprehensive evaluation of your current digital capabilities, identify gaps, and uncover opportunities for improvement. Our expert team analyzes your technology stack, processes, and organizational readiness to create a clear roadmap for transformation.',
      benefits: [
        'Digital maturity assessment',
        'Technology stack evaluation',
        'Opportunity identification',
      ],
      icon: <Search size={24} className="transition-colors duration-300" />,
      ctaText: 'Start Assessment',
      path: '/stages/assessment',
      services: [
        {
          title: 'Idea Validation Workshop',
          description:
            'Interactive sessions with industry experts to test and refine your business concept',
        },
        {
          title: 'Market Research Toolkit',
          description:
            'Access to comprehensive market analysis tools and data sources',
        },
        {
          title: 'Business Model Design',
          description:
            'Guided process to develop your business model canvas and value proposition',
        },
      ],
    },
    {
      id: 'strategy',
      title: 'Strategy',
      description: 'Develop a comprehensive digital transformation roadmap',
      detailedDescription:
        'The Strategy stage focuses on creating a tailored digital transformation roadmap aligned with your business objectives. We work with your leadership team to define clear goals, prioritize initiatives, and establish success metrics. Our strategic approach ensures your transformation delivers measurable business value.',
      benefits: [
        'Custom transformation roadmap',
        'Strategic alignment workshops',
        'ROI modeling and planning',
      ],
      icon: <Lightbulb size={24} className="transition-colors duration-300" />,
      ctaText: 'Build Strategy',
      path: '/stages/strategy',
      services: [
        {
          title: 'Business Registration Fast-Track',
          description:
            'Streamlined process for registering your business in Abu Dhabi',
        },
        {
          title: 'Startup Funding Network',
          description:
            'Access to angel investors, seed funding, and early-stage grants',
        },
        {
          title: 'Workspace Solutions',
          description:
            'Flexible office space options from co-working to dedicated facilities',
        },
      ],
    },
    {
      id: 'design',
      title: 'Design',
      description: 'Architect your Digital Business Platform (DBP)',
      detailedDescription:
        "The Design stage is where we architect your Digital Business Platform. Our team designs scalable, future-proof solutions that integrate seamlessly with your existing systems. We focus on creating user-centric experiences and robust technical architectures that support your business goals.",
      benefits: [
        'DBP architecture design',
        'User experience optimization',
        'System integration planning',
      ],
      icon: <Code size={24} className="transition-colors duration-300" />,
      ctaText: 'Design Solution',
      path: '/stages/design',
      services: [
        {
          title: 'Growth Capital Solutions',
          description:
            'Specialized financing options for scaling businesses, including equity and debt',
        },
        {
          title: 'Marketing Acceleration Program',
          description:
            'Comprehensive marketing support to drive customer acquisition and retention',
        },
        {
          title: 'Talent Acquisition Services',
          description:
            'Recruitment assistance to build your team with the right skills and experience',
        },
      ],
    },
    {
      id: 'implementation',
      title: 'Implementation',
      description: 'Build and deploy your digital solutions',
      detailedDescription:
        'The Implementation stage brings your digital transformation to life. Our experienced development teams build, test, and deploy your solutions using agile methodologies. We ensure smooth rollout with minimal disruption to your operations while maintaining the highest quality standards.',
      benefits: [
        'Agile development process',
        'Quality assurance testing',
        'Phased deployment approach',
      ],
      icon: <Rocket size={24} className="transition-colors duration-300" />,
      ctaText: 'Start Building',
      path: '/stages/implementation',
      services: [
        {
          title: 'Global Market Entry Program',
          description:
            'Specialized support for entering international markets with local expertise',
        },
        {
          title: 'Product Diversification Strategy',
          description:
            'Expert guidance on expanding your product or service offerings',
        },
        {
          title: 'Partnership & Alliance Development',
          description:
            'Facilitated connections with potential strategic partners and distributors',
        },
      ],
    },
    {
      id: 'optimization',
      title: 'Optimization',
      description: 'Continuously improve and scale your digital capabilities',
      detailedDescription:
        'The Optimization stage ensures your digital solutions deliver maximum value. We monitor performance, gather user feedback, and implement continuous improvements. Our data-driven approach identifies opportunities to enhance efficiency, reduce costs, and scale your digital capabilities as your business grows.',
      benefits: [
        'Performance monitoring',
        'Continuous improvement cycles',
        'Scalability enhancements',
      ],
      icon: <TrendingUp size={24} className="transition-colors duration-300" />,
      ctaText: 'Optimize Performance',
      path: '/stages/optimization',
      services: [
        {
          title: 'Business Process Reengineering',
          description:
            'Expert analysis and redesign of core business processes for maximum efficiency',
        },
        {
          title: 'Technology Integration Solutions',
          description:
            'Implementation support for advanced business systems and automation',
        },
        {
          title: 'Cost Optimization Audit',
          description:
            'Comprehensive review of expenses with actionable cost reduction recommendations',
        },
      ],
    },
    {
      id: 'evolution',
      title: 'Evolution',
      description: 'Innovate and adapt to emerging technologies',
      detailedDescription:
        'The Evolution stage keeps your organization at the forefront of digital innovation. We help you adopt emerging technologies, explore new business models, and stay competitive in a rapidly changing landscape. Our forward-thinking approach ensures your digital transformation remains relevant and impactful.',
      benefits: [
        'Emerging technology adoption',
        'Innovation workshops',
        'Future-readiness planning',
      ],
      icon: <Award size={24} className="transition-colors duration-300" />,
      ctaText: 'Drive Innovation',
      path: '/stages/evolution',
      services: [
        {
          title: 'Digital Transformation Roadmap',
          description:
            'Strategic planning and implementation support for digital transformation initiatives',
        },
        {
          title: 'Business Model Innovation Lab',
          description:
            'Collaborative workshops to redesign and future-proof your business model',
        },
        {
          title: 'Sustainability Integration Program',
          description:
            'Expert guidance on incorporating sustainable practices into your business operations',
        },
      ],
    },
  ]
  // Handle opening a popup
  const handleOpenPopup = (stageId: string) => {
    setActivePopup(stageId)
  }
  // Handle closing the popup
  const handleClosePopup = () => {
    setActivePopup(null)
  }
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Digital Transformation Journey
          </h2>
          <div className="relative">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions for every stage of your digital transformation
            </p>
          </div>
        </FadeInUpOnScroll>
        {/* Timeline connector (visible on desktop) */}
        <div
          ref={timelineRef}
          className="hidden lg:block relative max-w-6xl mx-auto h-2 bg-gray-200 rounded-full my-12"
        >
          <div
            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-secondary via-secondary/80 to-secondary/60 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: isInView
                ? `${((activeIndex + 1) / stages.length) * 100}%`
                : '0%',
            }}
          ></div>
          {/* Stage markers */}
          {stages.map((_, index) => (
            <div
              key={index}
              className={`absolute top-0 transform -translate-y-1/2 w-6 h-6 rounded-full transition-all duration-500 ${index <= activeIndex ? 'bg-secondary border-2 border-white' : 'bg-gray-300'}`}
              style={{
                left: `calc(${(index / (stages.length - 1)) * 100}% - 12px)`,
                transform: 'translateY(-50%)',
                transition: 'background-color 0.5s ease-out',
              }}
              onClick={() => setActiveIndex(index)}
            ></div>
          ))}
        </div>
        {/* Scroll Controls - Desktop */}
        <div className="hidden md:flex justify-end mb-4 space-x-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-6 gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {stages.map((stage, index) => (
            <HorizontalScrollReveal
              key={stage.id}
              direction={index % 2 === 0 ? 'left' : 'right'}
              distance={50}
              threshold={0.2}
            >
              <StageCard
                title={stage.title}
                description={stage.description}
                benefits={stage.benefits}
                icon={stage.icon}
                ctaText={stage.ctaText}
                onClick={() => navigate(stage.path)} // Clicking the card now navigates
                onShowDetails={() => handleOpenPopup(stage.id)} // Button now opens popup
                index={index}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            </HorizontalScrollReveal>
          ))}
        </div>
        {/* Mobile Scroll Indicator */}
        <div className="flex md:hidden justify-center mt-4">
          <div className="flex space-x-1">
            {stages.map((_, index) => (
              <button
                key={index}
                className={`h-1 rounded-full w-6 transition-all duration-300 ${index === activeIndex ? 'bg-secondary w-10' : 'bg-gray-300'}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to stage ${index + 1}`}
              />
            ))}
          </div>
        </div>
        {/* Stage Popups */}
        {activePopup && (
          <StagePopup
            stage={stages.find((stage) => stage.id === activePopup)!}
            onClose={handleClosePopup}
            onCTAClick={() => {
              const stage = stages.find((stage) => stage.id === activePopup)!
              handleClosePopup()
              navigate(stage.path)
            }}
          />
        )}
      </div>
      {/* Add animations for popup */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
export default EnterpriseStages
