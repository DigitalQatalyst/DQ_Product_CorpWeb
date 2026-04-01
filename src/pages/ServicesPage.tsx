import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { useNavigate, Link } from "react-router-dom";
import ModernDQChatbot from "../components/ModernDQChatbot";
import DiscoverProducts from "../components/DiscoverProducts";
import { 
  Palette, 
  Rocket, 
  DollarSign, 
  Clock, 
  TrendingUp,
  Target,
  Zap,
  Brain,
  Sprout,
  Factory,
  Building2,
  Landmark,
  Hotel,
  ShoppingBag,
  Users,
  Truck,
  Heart,
  Mountain,
  ArrowRight
} from "lucide-react";

export default function ServicesPage() {
  const navigate = useNavigate();

  const mainServices = [
    {
      icon: Palette,
      title: "Design 4.0",
      description: "End-to-end digital design services that create seamless experiences aligned with your business goals, enhancing customer engagement and operational efficiency.",
      slug: "design-4-0",
    },
    {
      icon: Rocket,
      title: "Deploy 4.0",
      description: "Fast-track deployment with our ready-to-launch services, driving digital transformation and streamlining operations for seamless execution.",
      slug: "deploy-4-0",
    }
  ];

  const valueProps = [
    {
      icon: DollarSign,
      title: "Save Money",
      description: "Cut costs on your digital projects by optimizing your strategy, reducing capital spending by up to 50%."
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Speed up your digital transformation with over 1000 ready-to-use practices and solutions."
    },
    {
      icon: TrendingUp,
      title: "Improve Market Share",
      description: "Leverage digital transformation to capture new market segments and strengthen your competitive edge."
    }
  ];

  const coreServices = {
    crossSector: [
      {
        icon: Target,
        title: "Experience 4.0",
        description: "Creating smooth, enjoyable experiences across all digital channels.",
      },
      {
        icon: Zap,
        title: "Agility 4.0",
        description: "Helping businesses become more flexible and responsive to changes and challenges.",
      },
      {
        icon: Brain,
        title: "Intelligence 4.0",
        description: "Leverage AI and analytics to gain actionable insights, driving smarter decision-making and business strategies.",
      },
      {
        icon: Users,
        title: "Workspace 4.0",
        description: "Transform your digital workplace with collaborative tools and technologies that enhance productivity and employee engagement.",
      },
      {
        icon: Building2,
        title: "Backoffice 4.0",
        description: "Streamline back-office operations with automation and intelligent systems to improve efficiency and reduce operational costs.",
      }
    ],
    primary: [
      {
        icon: Mountain,
        title: "Mining 4.0",
        description: "Revolutionize mining operations with smart technologies for enhanced safety, efficiency, and sustainable resource extraction.",
      },
      {
        icon: Sprout,
        title: "Farming 4.0",
        description: "Transform agricultural practices with precision farming, IoT sensors, and data analytics to optimize yields and sustainability.",
      }
    ],
    secondary: [
      {
        icon: Truck,
        title: "Logistics 4.0",
        description: "Improve supply chain operations and logistics management for greater speed, flexibility, and cost efficiency.",
      },
      {
        icon: Building2,
        title: "Infrastructure 4.0",
        description: "Revamp infrastructure and asset management with innovative tools to drive sustainability and improve operational performance.",
      },
      {
        icon: Factory,
        title: "Plant 4.0",
        description: "Optimize manufacturing plants and supply chains with advanced technology to increase efficiency and flexibility.",
      }
    ],
    tertiary: [
      {
        icon: Users,
        title: "Services 4.0",
        description: "Enhance service delivery and boost customer satisfaction with smarter processes and real-time insights.",
      },
      {
        icon: Landmark,
        title: "Governance 4.0",
        description: "Establish robust governance frameworks to ensure compliance, risk management, and strategic alignment across your organization.",
      },
      {
        icon: ShoppingBag,
        title: "Retail 4.0",
        description: "Reimagine retail experiences and optimize merchandising strategies to meet the evolving needs of consumers.",
      }
    ],
    quaternary: [
      {
        icon: Hotel,
        title: "Hospitality 4.0",
        description: "Elevate guest experiences and operational efficiency by integrating cutting-edge technology across hospitality services.",
      },
      {
        icon: Heart,
        title: "Wellness 4.0",
        description: "Transform wellness and healthcare services by leveraging technology to enhance patient care and improve overall well-being.",
      }
    ]
  };

  // Main service card for Design 4.0 and Deploy 4.0
  const MainServiceCard = ({ icon: Icon, title, description, slug }: any) => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        {description}
      </p>
      <button
        onClick={() => slug && navigate(`/services/${slug}`)}
        className="px-5 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-all text-sm"
      >
        Browse Services
      </button>
    </div>
  );

  // Sector service card with link button
  const ServiceCard = ({ icon: Icon, title, description }: any) => {
    const handleLearnMore = () => {
      // Convert title to URL-friendly slug (e.g., "Experience 4.0" -> "experience-4-0")
      const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '-');
      navigate(`/services/${slug}`);
    };

    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {description}
        </p>
        <button 
          onClick={handleLearnMore}
          className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all text-sm"
        >
          Browse Services
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-secondary-900 text-white overflow-hidden" style={{ height: "100vh" }}>
        <div className="absolute inset-0">
          <img 
            src="/images/Service_landing_hero_image.png" 
            alt="Services hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary-900/70"></div>
        </div>
        <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Accelerate Your Digital Transformation
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Drive growth, enhance customer experiences, and stay ahead of the competition with DQ's transformation services.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => navigate('/marketplace/services')}
                className="h-14 px-8 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-all transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2"
              >
                Browse Services
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Marketplace Introduction */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Implement Services
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              DT2.0 is DQ's approach to digital transformation, split into Design—creating blueprints for strategy—and Deploy—executing those plans for seamless, efficient implementation.
            </p>
          </div>

          {/* Featured Service Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Design Services</h3>
              <p className="text-gray-600 text-sm mb-4">
                End-to-end digital design services that create seamless experiences aligned with your business goals, enhancing customer engagement and operational efficiency.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Digital Experience</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Digital Core</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Connected Intelligence</span>
              </div>
              <Link 
                to="/services/design-4-0" 
                className="inline-flex items-center gap-1 text-primary hover:text-primary-600 font-medium text-sm transition-colors"
              >
                Read more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Deploy Services (SaaS & On-Prem)</h3>
              <p className="text-gray-600 text-sm mb-4">
                Rapidly deploy and scale your digital solutions with flexible options, from cloud-based SaaS solutions to on-prem services that ensure full control and compliance.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Cloud Native</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">SaaS Solutions</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">On-Premises</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Enterprise</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Compliance</span>
              </div>
              <Link 
                to="/services/deploy-4-0" 
                className="inline-flex items-center gap-1 text-primary hover:text-primary-600 font-medium text-sm transition-colors"
              >
                Read more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Work With Us
            </h2>
            <p className="text-lg text-gray-600">
              At DQ, we simplify digital transformation. From crafting strategies to implementing seamless experiences, our services drive efficiency, accelerate growth, and ensure long-term success.
            </p>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => {
              const Icon = prop.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-md transition-all duration-300">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {prop.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tailored Services for Your Industry Needs
            </h2>
            <p className="text-lg text-gray-600">
              From optimizing customer experiences to boosting operational efficiency, our services are designed to drive transformation with adaptable, innovative strategies.
            </p>
          </div>

          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Cross-Sector Domain */}
            <div className="bg-white p-8 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                CROSS-SECTOR DOMAIN
              </h3>
              <p className="text-gray-600 mb-4">
                Common Digital Business Platforms enabling Experience,
                Agility, Intelligence, and Workspace transformation across
                industries.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Experience 4.0</div>
                  <Link
                    to="/services/experience-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Agility 4.0</div>
                  <Link
                    to="/services/agility-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Intelligence 4.0</div>
                  <Link
                    to="/services/intelligence-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Workspace 4.0</div>
                  <Link
                    to="/services/workspace-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Governance 4.0</div>
                  <Link
                    to="/services/governance-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Backoffice 4.0</div>
                  <Link
                    to="/services/backoffice-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>

            {/* Primary Sector */}
            <div className="bg-white p-8 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                PRIMARY SECTOR
              </h3>
              <p className="text-gray-600 mb-4">
                Field and resource industries accelerating digital harvesting
                and operational efficiency.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Mining 4.0</div>
                  <Link
                    to="/services/mining-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Farming 4.0</div>
                  <Link
                    to="/services/farming-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>

            {/* Secondary Sector */}
            <div className="bg-white p-8 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                SECONDARY SECTOR
              </h3>
              <p className="text-gray-600 mb-4">
                Production and infrastructure sectors modernising facilities,
                logistics, and industrial systems.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Plant 4.0</div>
                  <Link
                    to="/services/plant-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Logistics 4.0</div>
                  <Link
                    to="/services/logistics-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Infrastructure 4.0</div>
                  <Link
                    to="/services/infrastructure-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>

            {/* Tertiary Sector */}
            <div className="bg-white p-8 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                TERTIARY SECTOR
              </h3>
              <p className="text-gray-600 mb-4">
                Transaction-based industries transforming government, retail,
                and service ecosystems.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Government 4.0</div>
                  <Link
                    to="/services/government-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Services 4.0</div>
                  <Link
                    to="/services/service-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Retail 4.0</div>
                  <Link
                    to="/services/retail-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>

            {/* Quaternary Sector */}
            <div className="bg-white p-8 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                QUATERNARY SECTOR
              </h3>
              <p className="text-gray-600 mb-4">
                Hospitality industries redefined through intelligent
                ecosystems and enhanced guest experiences.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Hospitality 4.0</div>
                  <Link
                    to="/services/hospitality-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>

            {/* Quinary Sector */}
            <div className="bg-white p-8 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                QUINARY SECTOR
              </h3>
              <p className="text-gray-600 mb-4">
                Healthcare and wellbeing industries transforming patient care
                and wellness services through advanced technology.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="px-4 py-3 bg-secondary/5 text-secondary rounded-full text-sm font-medium border border-secondary/10">
                  <div className="mb-1">Wellness 4.0</div>
                  <Link
                    to="/services/wellness-4-0"
                    className="text-primary hover:text-primary-600 text-xs font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Banner */}
      <section className="py-16 bg-gradient-to-r from-secondary-900 to-secondary-700">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Services Marketplace
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Browse our comprehensive marketplace of digital transformation services and solutions designed to help your business thrive in the digital era.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => navigate('/marketplace/services')}
                className="h-14 px-8 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-all shadow-lg transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                Browse Services
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <DiscoverProducts />

      <Footer />
      
      {/* DQ AI Chatbot */}
      <ModernDQChatbot />
    </div>
  );
}
