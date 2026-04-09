import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  cloneElement,
  Component,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  DollarSign,
  Briefcase,
  Users,
  Newspaper,
  Lightbulb,
  TrendingUp,
  Briefcase as JobIcon,
  Globe,
  Calendar,
  BookIcon,
  Award,
  Clock,
  Compass,
  HeartHandshake,
  Building,
  Lock,
  ArrowRight,
  ChevronRight,
  Landmark,
  GraduationCap,
  BarChart,
  CreditCard,
  PiggyBank,
  LineChart,
  BadgeDollarSign,
  Wallet,
  Calculator,
  Receipt,
  Coins,
  BriefcaseBusiness,
  Target,
  BarChart2,
  Network,
  PieChart,
  ClipboardList,
  Handshake,
  BarChartHorizontal,
  Building2,
  Share2,
  Store,
  Truck,
  ShoppingBag,
  Megaphone,
  Rocket,
  PanelRight,
  Laptop,
  FileCode,
  Database,
  FileText,
  Presentation,
  BookMarked,
  GraduationCap as GraduationCapIcon,
  Layers,
  LayoutPanelLeft,
  Gauge,
  Microscope,
  BookCopy,
  Library,
  ChevronLeft,
  Package,
} from "lucide-react";
import {
  FadeInUpOnScroll,
  StaggeredFadeIn,
  AnimatedCounter,
  useInView,
} from "./AnimationUtils";
import ClientLogosCarousel from "./ClientLogosCarousel";

// Service Category Card Component
const ServiceCard = ({
  service,
  onClick,
  isComingSoon = false,
}: {
  service: any;
  onClick: () => void;
  isComingSoon?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all duration-500 transform p-6 h-full min-h-[290px] flex flex-col ${isComingSoon
          ? "bg-gray-50 border-gray-200 opacity-75 hover:opacity-85"
          : "bg-white border-gray-200 hover:shadow-lg hover:-translate-y-1 hover:scale-102 cursor-pointer hover:border-primary/20"
        }`}
      onClick={isComingSoon ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full relative">
        {isComingSoon && (
          <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full text-gray-800 flex items-center animate-pulse">
            <Clock size={12} className="mr-1" />
            Coming Soon
          </div>
        )}
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 ${
            isHovered ? "transform -translate-y-1" : ""
          } ${
            isComingSoon 
              ? "bg-gray-100" 
              : "bg-primary/5 border border-primary/10"
          }`}
        >
          <div
            className={isComingSoon ? "text-gray-400" : "text-primary"}
          >
            {cloneElement(service.icon, {
              size: 24,
              className: isComingSoon ? "text-gray-400" : "text-primary",
            })}
          </div>
        </div>
        <h2 className="font-display text-lg font-semibold text-gray-900 mb-2 whitespace-nowrap overflow-hidden truncate">
          {service.title}
        </h2>
        <p className="font-body text-sm text-gray-600 mb-6 flex-grow line-clamp-4 min-h-[5rem]">
          {service.description}
        </p>
        <button
          className={`mt-auto px-4 py-2.5 rounded-lg font-medium w-full transition-all duration-300 flex items-center justify-center ${isComingSoon
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary-600"
            }`}
          disabled={isComingSoon}
          onClick={(e) => {
            if (!isComingSoon) {
              e.stopPropagation();
              onClick();
            }
          }}
        >
          {isComingSoon ? <Lock size={14} className="mr-2" /> : "Explore Now"}
          {!isComingSoon && (
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          )}
        </button>
      </div>
    </div>
  );
};

// Category Header Component - Fixed TypeScript Error
const CategoryHeader = ({
  icon,
  title,
  count = null,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number | null;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ref, isInView] = useInView({
    threshold: 0.1,
  });

  return (
    <div
      className="mb-6"
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600">
          {icon}
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-800 group relative">
          {title}
          <span
            className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group"
            style={{
              width: isHovered ? "100%" : "0%",
            }}
          ></span>
        </h2>
      </div>
      {count !== null && (
        <div className="ml-13 text-gray-600">
          <span className="font-semibold mr-1">
            <AnimatedCounter value={count} />+
          </span>
          services available in this category
        </div>
      )}
    </div>
  );
};

// Carousel Component
const ServiceCarousel = ({
  services,
  handleServiceClick,
}: {
  services: any[];
  handleServiceClick: (path: string) => void;
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  // Update visible count based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const totalSlides = Math.ceil(services.length / visibleCount);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const scrollAmount = index * carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    const nextIndex = Math.min(activeIndex + 1, totalSlides - 1);
    setActiveIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = Math.max(activeIndex - 1, 0);
    setActiveIndex(prevIndex);
    scrollToIndex(prevIndex);
  };

  // Handle scroll event to update active index
  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollPosition = carouselRef.current.scrollLeft;
        const slideWidth = carouselRef.current.offsetWidth;
        const newIndex = Math.round(scrollPosition / slideWidth);
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }
      }
    };
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
      return () => carousel.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex]);

  return (
    <div className="relative">
      {/* Mobile: Vertical Stack */}
      <div className="block sm:hidden">
        <div className="space-y-6">
          {services.map((service, index) => (
            <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
              <ServiceCard
                service={service}
                onClick={() => handleServiceClick(service.path)}
                isComingSoon={!service.isActive}
              />
            </FadeInUpOnScroll>
          ))}
        </div>
      </div>

      {/* Desktop/Tablet: Horizontal Carousel */}
      <div className="hidden sm:block">
        {/* Carousel container */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-6 gap-6 justify-center"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Create pages of cards */}
          {Array.from({
            length: totalSlides,
          }).map((_, pageIndex) => (
            <div
              key={`page-${pageIndex}`}
              className="flex-shrink-0 w-full flex gap-6 snap-center justify-center"
            >
              {services
                .slice(pageIndex * visibleCount, (pageIndex + 1) * visibleCount)
                .map((service, serviceIndex) => (
                  <div key={service.id} className={`flex-shrink-0 w-80 max-w-sm`}>
                    <FadeInUpOnScroll
                      delay={(serviceIndex % visibleCount) * 0.1}
                    >
                      <ServiceCard
                        service={service}
                        onClick={() => handleServiceClick(service.path)}
                        isComingSoon={!service.isActive}
                      />
                    </FadeInUpOnScroll>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Handle hash scrolling on component mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#services-marketplaces") {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById("services-marketplaces");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, []);

  // Define all services with categories
  const allServices = useMemo(() => {
    return {
      marketplaces: [
        {
          id: "services-marketplace",
          title: "Services Marketplace",
          description:
            "Maximize ROI with our affordable, data-driven and architecture-led digital transformation services",
          icon: <Briefcase />,
          path: "/marketplace/services",
          gradientFrom: "from-primary",
          gradientTo: "to-primary-600",
          isActive: true,
        },
        {
          id: "products-marketplace",
          title: "Products Marketplace",
          description:
            "Discover digital products engineered for your organization's success in the digital economy",
          icon: <Package />,
          path: "/products",
          gradientFrom: "from-primary",
          gradientTo: "to-primary-600",
          isActive: true,
        },
        {
          id: "careers-marketplace",
          title: "Careers Marketplace",
          description:
            "Discover exciting career opportunities and join our team of digital transformation experts",
          icon: <Users />,
          path: "/careers",
          gradientFrom: "from-primary",
          gradientTo: "to-primary-600",
          isActive: true,
        },
      ],
      finance: [
        {
          id: "funding",
          title: "Business Funding",
          description:
            "Access loans, grants, and investment opportunities tailored for Abu Dhabi businesses",
          icon: <DollarSign />,
          path: "/marketplace/financial",
          gradientFrom: "from-blue-600",
          gradientTo: "to-blue-400",
          isActive: true,
        },
        {
          id: "financial",
          title: "Financial Services",
          description:
            "Access financial products to fuel your business growth and sustainability",
          icon: <Landmark />,
          path: "/marketplace/financial",
          gradientFrom: "from-blue-600",
          gradientTo: "to-blue-400",
          isActive: true,
        },
        {
          id: "investments",
          title: "Investment Marketplace",
          description:
            "Find investment opportunities and funding options for your business",
          icon: <TrendingUp />,
          path: "/investments",
          gradientFrom: "from-blue-600",
          gradientTo: "to-blue-400",
          isActive: false,
        },
        {
          id: "grants",
          title: "Grants Directory",
          description:
            "Find grants and funding opportunities for your business",
          icon: <Award />,
          path: "/grants",
          gradientFrom: "from-blue-600",
          gradientTo: "to-blue-400",
          isActive: false,
        },
        {
          id: "credit-cards",
          title: "Business Credit Cards",
          description:
            "Compare and apply for business credit cards with special benefits",
          icon: <CreditCard />,
          path: "/credit-cards",
          gradientFrom: "from-blue-600",
          gradientTo: "to-blue-400",
          isActive: false,
        },
        {
          id: "savings",
          title: "Business Savings",
          description:
            "Explore savings accounts and investment vehicles for your enterprise",
          icon: <BadgeDollarSign />,
          path: "/savings",
          gradientFrom: "from-blue-600",
          gradientTo: "to-blue-400",
          isActive: false,
        },
      ],
      advisory: [
        {
          id: "business-services",
          title: "Business Services",
          description:
            "Find professional services to support and grow your business",
          icon: <Briefcase />,
          path: "/marketplace/services",
          gradientFrom: "from-purple-600",
          gradientTo: "to-purple-400",
          isActive: true,
        },
        {
          id: "mentorship",
          title: "Expert Mentorship",
          description:
            "Connect with experienced business mentors who can guide your growth strategy",
          icon: <HeartHandshake />,
          path: "/marketplace/mentorship",
          gradientFrom: "from-purple-600",
          gradientTo: "to-purple-400",
          isActive: false,
        },
        {
          id: "opportunities",
          title: "Strategy Advisory",
          description:
            "Discover new business opportunities and strategic partnerships",
          icon: <Lightbulb />,
          path: "/opportunities",
          gradientFrom: "from-purple-600",
          gradientTo: "to-purple-400",
          isActive: false,
        },
        {
          id: "performance",
          title: "Performance Analytics",
          description:
            "Data-driven insights to optimize your business performance",
          icon: <Target />,
          path: "/performance",
          gradientFrom: "from-purple-600",
          gradientTo: "to-purple-400",
          isActive: false,
        },
        {
          id: "market-research",
          title: "Market Research",
          description:
            "In-depth market analysis and consumer behavior insights",
          icon: <BarChart2 />,
          path: "/market-research",
          gradientFrom: "from-purple-600",
          gradientTo: "to-purple-400",
          isActive: false,
        },
      ],
      growth: [
        {
          id: "communities",
          title: "Business Communities",
          description:
            "Connect with business networks and expand your professional connections",
          icon: <Users />,
          path: "https://ujs.qxk.mybluehost.me/website_e550b4e3/",
          gradientFrom: "from-teal-600",
          gradientTo: "to-teal-400",
          isActive: true,
        },
        {
          id: "events",
          title: "Networking Events",
          description:
            "Discover and join business events and networking opportunities",
          icon: <Calendar />,
          path: "/events",
          gradientFrom: "from-teal-600",
          gradientTo: "to-teal-400",
          isActive: true,
        },
        {
          id: "expansion",
          title: "Global Expansion",
          description:
            "Leverage Abu Dhabi's strategic location to expand your business internationally",
          icon: <Compass />,
          path: "/marketplace/expansion",
          gradientFrom: "from-teal-600",
          gradientTo: "to-teal-400",
          isActive: false,
        },
        {
          id: "jobs",
          title: "Jobs Marketplace",
          description: "Find talent or explore career opportunities",
          icon: <JobIcon />,
          path: "/jobs",
          gradientFrom: "from-teal-600",
          gradientTo: "to-teal-400",
          isActive: false,
        },
        {
          id: "performance-metrics",
          title: "Performance Metrics",
          description:
            "Track and analyze key performance indicators for your business",
          icon: <BarChartHorizontal />,
          path: "/performance-metrics",
          gradientFrom: "from-teal-600",
          gradientTo: "to-teal-400",
          isActive: false,
        },
        {
          id: "franchising",
          title: "Franchising Opportunities",
          description:
            "Explore franchising options to scale your business model",
          icon: <Building2 />,
          path: "/franchising",
          gradientFrom: "from-teal-600",
          gradientTo: "to-teal-400",
          isActive: false,
        },
        {
          id: "corporate-venturing",
          title: "Corporate Venturing",
          description:
            "Collaborate with established corporations for innovation and growth",
          icon: <Share2 />,
          path: "/corporate-venturing",
          gradientFrom: "from-teal-600",
          gradientTo: "to-teal-400",
          isActive: false,
        },
      ],
      learning: [
        {
          id: "courses",
          title: "Learning & Development",
          description:
            "Discover courses and training programs to enhance your business skills",
          icon: <BookOpen />,
          path: "/marketplace/courses",
          gradientFrom: "from-amber-600",
          gradientTo: "to-amber-400",
          isActive: true,
        },
        {
          id: "news",
          title: "Knowledge Hub",
          description:
            "Stay updated with the latest business news and industry insights",
          icon: <Newspaper />,
          path: '/marketplace/knowledge-hub',
          gradientFrom: 'from-amber-600',
          gradientTo: 'to-amber-400',
          isActive: true,
        },
        {
          id: "digital",
          title: "Digital Solutions",
          description: "Explore digital tools and solutions for your business",
          icon: <Globe />,
          path: "/digital-services",
          gradientFrom: "from-amber-600",
          gradientTo: "to-amber-400",
          isActive: false,
        },
        {
          id: "law",
          title: "Legal & Compliance",
          description: "Access resources on UAE business laws and regulations",
          icon: <BookIcon />,
          path: "/law",
          gradientFrom: "from-amber-600",
          gradientTo: "to-amber-400",
          isActive: false,
        },
        {
          id: "marketing",
          title: "Marketing Academy",
          description:
            "Learn effective marketing strategies for business growth",
          icon: <Megaphone />,
          path: "/marketing-academy",
          gradientFrom: "from-amber-600",
          gradientTo: "to-amber-400",
          isActive: false,
        },
        {
          id: "startup",
          title: "Startup Accelerator",
          description:
            "Accelerate your startup growth with specialized programs",
          icon: <Rocket />,
          path: "/startup-accelerator",
          gradientFrom: "from-amber-600",
          gradientTo: "to-amber-400",
          isActive: false,
        },
        {
          id: "innovation",
          title: "Innovation Lab",
          description:
            "Explore innovation methodologies and creative problem-solving",
          icon: <PanelRight />,
          path: "/innovation-lab",
          gradientFrom: "from-amber-600",
          gradientTo: "to-amber-400",
          isActive: false,
        },
        {
          id: "tech-training",
          title: "Technology Training",
          description:
            "Develop technical skills essential for digital transformation",
          icon: <Laptop />,
          path: "/tech-training",
          gradientFrom: "from-amber-600",
          gradientTo: "to-amber-400",
          isActive: false,
        },
      ],
    };
  }, []);

  // Function to handle service click
  // const handleServiceClick = (path: string) => {
  //   navigate(path)
  // }
  const handleServiceClick = (path: string) => {
    if (path.startsWith("http")) {
      window.open(path, "_blank", "noopener,noreferrer");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Marketplaces by Category */}
        <div id="services-marketplaces" className="mb-16">
          <FadeInUpOnScroll className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">
              Explore Our Digital Transformation Marketplaces
            </h2>
            <div className="relative">
              <p className="font-body text-lg text-gray-600 max-w-3xl mx-auto">
                Find expert solutions and resources tailored for your business
                needs.
              </p>
            </div>
          </FadeInUpOnScroll>

          {/* Digital Marketplaces - Category Header Removed */}
          <div className="mb-10">
            {/* CategoryHeader removed since we only have one category */}
            <ServiceCarousel
              services={allServices.marketplaces}
              handleServiceClick={handleServiceClick}
            />
          </div>

          {/* COMMENTED OUT - Original Categories (can be reused later) */}
          {/* Finance & Funding Category */}
          {/* <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<DollarSign size={24} />}
                title="Finance & Funding"
                count={6}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={allServices.finance}
              handleServiceClick={handleServiceClick}
            />
          </div> */}

          {/* Advisory & Expertise Category */}
          {/* <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<BarChart size={24} />}
                title="Advisory & Expertise"
                count={5}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={allServices.advisory}
              handleServiceClick={handleServiceClick}
            />
          </div> */}

          {/* Growth & Expansion Category */}
          {/* <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<Globe size={24} />}
                title="Growth & Expansion"
                count={7}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={allServices.growth}
              handleServiceClick={handleServiceClick}
            />
          </div> */}

          {/* Learning & Enablement Category */}
          {/* <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<GraduationCap size={24} />}
                title="Learning & Enablement"
                count={8}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={allServices.learning}
              handleServiceClick={handleServiceClick}
            />
          </div> */}
        </div>
      </div>

      {/* Client Logos Carousel */}
      <ClientLogosCarousel />

      {/* Add keyframes for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
