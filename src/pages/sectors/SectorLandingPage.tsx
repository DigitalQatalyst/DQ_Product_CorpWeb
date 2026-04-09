import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { ArrowRight, CheckCircle, TrendingUp, Users, Zap } from 'lucide-react';
import { listPublicMedia } from '../../services/knowledgeHubGrid';

interface MediaItem {
  id: string;
  title: string;
  summary: string | null;
  type: string | null;
  thumbnail_url?: string | null;
  published_at: string | null;
  provider?: {
    name: string;
  };
}

interface SectorData {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  focus: string;
  corePillars?: {
    title: string;
    description: string;
  }[];
  whyReasons?: {
    title: string;
    description: string;
    icon: string;
  }[];
  technologies: string[];
  benefits: string[];
  useCases: string[];
  stats: {
    label: string;
    value: string;
  }[];
  heroImage: string;
  color: string;
}

const sectorsData: Record<string, SectorData> = {
  'agility': {
    id: 'agility',
    name: 'Agility 4.0',
    title: 'Agility 4.0: Empowering Organizational Adaptability in the Digital Economy',
    subtitle: 'Empowering organizations to quickly adapt to changing market conditions, evolving customer needs, and rapid technological shifts',
    focus: 'Agility 4.0 is the framework that empowers organizations to quickly adapt to changing market conditions, evolving customer needs, and rapid technological shifts. In the Digital Economy 4.0, businesses must be flexible, adaptive, and capable of making decisions quickly to stay competitive.',
    corePillars: [
      {
        title: 'Agile Methodologies',
        description: 'Approaches like Scrum and Kanban that enable flexibility and iterative development.'
      },
      {
        title: 'DevOps',
        description: 'Bridging development and operations to streamline the software delivery process.'
      },
      {
        title: 'Lean Practices',
        description: 'Focusing on efficiency by eliminating waste and maximizing value.'
      }
    ],
    whyReasons: [
      {
        title: 'Reduce Time-to-Market',
        description: 'Achieve faster product delivery with shorter development cycles.',
        icon: 'TrendingUp'
      },
      {
        title: 'Increase Productivity',
        description: 'Streamline workflows and remove friction to improve overall team efficiency.',
        icon: 'Zap'
      },
      {
        title: 'Cut Costs',
        description: 'Eliminate inefficiencies and focus on high-value work to reduce operational expenses.',
        icon: 'CheckCircle'
      },
      {
        title: 'Foster Innovation',
        description: 'Leverage continuous feedback and iteration to stay competitive and drive innovation.',
        icon: 'Users'
      }
    ],
    technologies: [
      'AI & Machine Learning',
      'Cloud Computing',
      'Automation Tools',
      'Collaborative Platforms',
      'DevOps & CI/CD',
      'Agile Project Management'
    ],
    benefits: [
      'Increased Speed: Agile teams deliver solutions faster with shorter iteration cycles and quicker feedback loops',
      'Cost Efficiency: By eliminating waste and focusing on the most valuable tasks, organizations reduce operational costs',
      'Better Customer Experiences: Continuous customer feedback allows businesses to create products that better meet customer expectations',
      'Enhanced Collaboration: Agile practices break down silos, encouraging cross-functional collaboration',
      'Scalability: As businesses grow, Agility 4.0 enables them to scale processes while maintaining speed and efficiency',
      'Foster Innovation: Continuous feedback and iteration drive innovation, keeping businesses competitive'
    ],
    useCases: [
      'Agile Transformation in Software Development: Many organizations adopt Agile to streamline their software development processes, resulting in faster product iterations and higher-quality releases',
      'DevOps for Continuous Deployment: By combining Agile and DevOps, companies automate testing, deployment, and monitoring, achieving faster and more reliable releases',
      'Automated Testing for Quicker Feedback: Agile teams use automated testing to identify issues early in the development process, reducing time spent on manual testing',
      'Cloud-Native Application Development: Leveraging cloud technologies enables organizations to develop scalable applications that can be updated and deployed quickly',
      'Real-Time Feedback Loops: With Agile practices, teams collect feedback from customers continuously, allowing them to adapt and improve products in real time'
    ],
    stats: [
      { label: 'Faster Time-to-Market', value: '40%' },
      { label: 'Increased Productivity', value: '35%' },
      { label: 'Reduced Costs', value: '30%' }
    ],
    heroImage: '/images/agility-hero.png',
    color: 'from-blue-600 to-cyan-600'
  },
  'experience': {
    id: 'experience',
    name: 'Experience 4.0',
    title: 'Experience 4.0: Enhancing Customer Experiences in the Digital Economy',
    subtitle: 'Deliver seamless, personalized, and intelligent customer journeys across every digital touchpoint',
    focus: 'Experience 4.0 helps organizations engage customers more effectively in the Digital Economy. It integrates personalization, AI-driven insights, and connected digital platforms to create seamless, high-impact experiences.',
    corePillars: [
      {
        title: 'AI & Personalization Engines',
        description: 'Deliver tailored experiences by analyzing customer data in real-time.'
      },
      {
        title: 'Customer Experience (CX) Platforms',
        description: 'Unify customer data and interactions across all digital and physical channels.'
      },
      {
        title: 'Interactive & Immersive Technologies',
        description: 'Use AR, VR, and intelligent interfaces to create engaging, next-generation experiences.'
      }
    ],
    whyReasons: [
      {
        title: 'Increase Customer Satisfaction',
        description: 'Create personalized experiences that delight customers and exceed expectations.',
        icon: 'TrendingUp'
      },
      {
        title: 'Improve Conversion Rates',
        description: 'Reduce friction across digital touchpoints and optimize engagement flows.',
        icon: 'Zap'
      },
      {
        title: 'Strengthen Customer Retention',
        description: 'Build loyalty through consistent and meaningful interactions.',
        icon: 'CheckCircle'
      },
      {
        title: 'Gain Real-Time Insights',
        description: 'Leverage behavioral data to drive smarter business decisions.',
        icon: 'Users'
      }
    ],
    technologies: [
      'AI & Machine Learning: Deliver tailored experiences by analyzing customer data in real-time',
      'Data Analytics & Behavioral Insights: Transform customer data into actionable intelligence',
      'Chatbots & Virtual Assistants: Provide instant, 24/7 support across digital channels',
      'Augmented & Virtual Reality (AR/VR): Create immersive experiences that enhance product interaction',
      'Omnichannel Engagement: Engage customers seamlessly across every touchpoint'
    ],
    benefits: [
      'Increase Customer Satisfaction: Create personalized experiences that delight customers',
      'Boost Revenue Growth: Optimized journeys lead to higher conversions and upselling opportunities',
      'Reduce Customer Churn: Consistent engagement strengthens long-term loyalty',
      'Improve Operational Efficiency: Automation reduces manual effort while improving service speed',
      'Enable Better Decision-Making: Real-time insights enable proactive and strategic actions',
      'Enhance Brand Loyalty: Build long-term trust through consistent, valuable interactions'
    ],
    useCases: [
      'AI-Powered Personalization: Improve product recommendations for higher sales',
      'Virtual Showrooms & AR Visualization: Let customers explore products in immersive digital environments',
      'Intelligent Customer Support: Resolve queries instantly with chatbots and automation',
      'Predictive Customer Analytics: Anticipate needs and behavior before customers take action',
      'Omnichannel Engagement: Ensure seamless interaction across all customer touchpoints'
    ],
    stats: [
      { label: 'Achieve up to 45% increase in customer satisfaction', value: '45%' },
      { label: 'Boost conversion rates by up to 38%', value: '38%' },
      { label: 'Improve customer retention by up to 42%', value: '42%' }
    ],
    heroImage: '/images/experience 4.0-hero.png',
    color: 'from-purple-600 to-primary-600'
  },
  'farming': {
    id: 'farming',
    name: 'Farming 4.0',
    title: 'Farming 4.0',
    subtitle: 'Modernizing Agriculture Through Digital Innovation',
    focus: 'Farming 4.0 modernizes agriculture using technologies like precision farming, IoT sensors, and data analytics to enhance crop production, resource efficiency, and sustainability.',
    corePillars: [
      {
        title: 'AI & Machine Learning',
        description: 'Automates decision-making and improves efficiency.'
      },
      {
        title: 'Precision Agriculture with IoT Sensors',
        description: 'Monitors soil conditions and optimizes irrigation.'
      },
      {
        title: 'Drone-Based Monitoring',
        description: 'Tracks crop health using aerial imagery.'
      }
    ],
    whyReasons: [
      {
        title: 'Increase Yield',
        description: 'Boost crop yield through optimized farming techniques.',
        icon: 'TrendingUp'
      },
      {
        title: 'Improve Resource Efficiency',
        description: 'Reduce waste and optimize resource usage.',
        icon: 'Zap'
      },
      {
        title: 'Enhance Sustainability',
        description: 'Integrate sustainable practices for long-term viability.',
        icon: 'CheckCircle'
      }
    ],
    technologies: [
      'AI & Machine Learning: Automates decision-making and enhances operational efficiency',
      'Cloud Computing: Scalable infrastructure for remote farms',
      'Automation Tools: Streamline tasks for higher-value work',
      'Collaborative Platforms: Seamless communication and teamwork',
      'DevOps & CI/CD: Continuous integration for faster releases',
      'Agile Project Management: Plan, track, and deliver flexibly'
    ],
    benefits: [
      'Optimized Crop Yields: Improve crop production with smarter farming techniques',
      'Efficient Resource Management: Use data-driven insights to optimize resources like water and fertilizer',
      'Reduced Environmental Impact: Minimize resource usage and environmental harm',
      'Real-Time Monitoring and Alerts: Monitor crop conditions and receive alerts for better decision-making',
      'Improved Sustainability Practices: Implement long-term, sustainable farming techniques',
      'Enhanced Supply Chain Transparency: Trace products from farm to table with blockchain technology'
    ],
    useCases: [
      'Precision Agriculture with IoT Sensors: Use IoT to monitor soil conditions and optimize irrigation',
      'Drone-Based Crop Monitoring and Analysis: Track crop health using drones and aerial imagery',
      'AI-Powered Yield Prediction: Use machine learning algorithms to predict crop yields based on environmental factors',
      'Automated Irrigation Systems: Implement automated irrigation to reduce water usage and improve crop health',
      'Blockchain-Based Food Traceability: Ensure transparency and traceability from farm to table with blockchain technology'
    ],
    stats: [
      { label: 'Yield Improvement', value: '25%' },
      { label: 'Resource Efficiency', value: '35%' },
      { label: 'Cost Reduction', value: '28%' }
    ],
    heroImage: '/images/farming-hero.svg',
    color: 'from-green-600 to-emerald-600'
  },
  'government': {
    id: 'government',
    name: 'Government 4.0',
    title: 'Government 4.0',
    subtitle: 'Digital Transformation in the Public Sector',
    focus: 'Digital transformation in the public sector. This sector aims to enhance public administration and citizen services through e-government solutions, data-driven decision-making, and digital engagement platforms.',
    technologies: [
      'Blockchain for Transparency',
      'Cloud Computing',
      'AI for Smart Governance',
      'Cybersecurity Solutions',
      'Data Analytics & BI',
      'Digital Identity Systems'
    ],
    benefits: [
      'Improved transparency and accountability',
      'Enhanced citizen engagement',
      'Streamlined public services',
      'Data-driven policy making',
      'Reduced bureaucracy',
      'Increased operational efficiency'
    ],
    useCases: [
      'E-government portals and services',
      'Smart city infrastructure management',
      'Digital identity and authentication',
      'Blockchain-based public records',
      'AI-powered citizen service chatbots'
    ],
    stats: [
      { label: 'Service Efficiency', value: '50%' },
      { label: 'Citizen Satisfaction', value: '42%' },
      { label: 'Cost Savings', value: '35%' }
    ],
    heroImage: '/images/government-hero.png',
    color: 'from-indigo-600 to-blue-600'
  },
  'hospitality': {
    id: 'hospitality',
    name: 'Hospitality 4.0',
    title: 'Hospitality 4.0',
    subtitle: 'Digitizing the Hospitality Industry',
    focus: 'This sector involves digitizing the hospitality industry (hotels, restaurants, resorts, etc.), providing seamless experiences for customers and enhancing back-office operations.',
    technologies: [
      'AI-Driven Service Automation',
      'Internet of Things (IoT)',
      'Predictive Analytics',
      'Digital Booking Systems',
      'Contactless Technologies',
      'Smart Room Controls'
    ],
    benefits: [
      'Personalized guest experiences',
      'Contactless check-in and services',
      'Optimized operations and staffing',
      'Enhanced safety and hygiene',
      'Improved revenue management',
      'Real-time guest feedback'
    ],
    useCases: [
      'Smart hotel rooms with IoT controls',
      'AI-powered concierge services',
      'Contactless payment and check-in',
      'Predictive maintenance for facilities',
      'Dynamic pricing and revenue optimization'
    ],
    stats: [
      { label: 'Guest Satisfaction', value: '48%' },
      { label: 'Operational Efficiency', value: '40%' },
      { label: 'Revenue Growth', value: '32%' }
    ],
    heroImage: '/images/hospitality-hero.png',
    color: 'from-orange-600 to-red-600'
  },
  'infrastructure': {
    id: 'infrastructure',
    name: 'Infrastructure 4.0',
    title: 'Infrastructure 4.0',
    subtitle: 'Modernizing Physical Infrastructure',
    focus: 'The modernization of physical infrastructure (e.g., smart cities, transportation networks, utilities) through IoT, automation, and data systems. This aims to improve operational efficiency, resource management, and overall sustainability.',
    technologies: [
      'Smart Grids',
      'IoT Sensors',
      'AI & Predictive Analytics',
      'Big Data Analytics',
      'Digital Twins',
      'Energy Management Systems'
    ],
    benefits: [
      'Optimized resource management',
      'Improved sustainability',
      'Reduced operational costs',
      'Enhanced public safety',
      'Real-time monitoring and control',
      'Predictive maintenance'
    ],
    useCases: [
      'Smart city infrastructure management',
      'Intelligent transportation systems',
      'Smart grid energy distribution',
      'Water management and conservation',
      'Digital twin simulations for urban planning'
    ],
    stats: [
      { label: 'Energy Efficiency', value: '45%' },
      { label: 'Cost Reduction', value: '38%' },
      { label: 'Sustainability', value: '52%' }
    ],
    heroImage: '/images/infrastructure-hero.png',
    color: 'from-gray-600 to-slate-600'
  },
  'logistics': {
    id: 'logistics',
    name: 'Logistics 4.0',
    title: 'Logistics 4.0',
    subtitle: 'Digital Transformation in Supply Chains',
    focus: 'Digital transformation in supply chains and logistics. This sector focuses on optimizing route planning, warehouse management, and real-time tracking of goods and shipments to enhance efficiency, reduce costs, and improve service delivery.',
    technologies: [
      'Blockchain',
      'AI & Machine Learning',
      'IoT Tracking Devices',
      'Robotics & Automation',
      'Autonomous Vehicles',
      'Warehouse Management Systems'
    ],
    benefits: [
      'Optimized route planning',
      'Real-time shipment tracking',
      'Reduced delivery times',
      'Lower operational costs',
      'Enhanced supply chain visibility',
      'Improved inventory management'
    ],
    useCases: [
      'Autonomous delivery vehicles',
      'Blockchain-based supply chain tracking',
      'AI-powered demand forecasting',
      'Robotic warehouse automation',
      'Real-time fleet management'
    ],
    stats: [
      { label: 'Delivery Speed', value: '35%' },
      { label: 'Cost Reduction', value: '42%' },
      { label: 'Accuracy', value: '48%' }
    ],
    heroImage: '/images/logistics-hero.png',
    color: 'from-yellow-600 to-orange-600'
  },
  'plant': {
    id: 'plant',
    name: 'Plant 4.0',
    title: 'Plant 4.0',
    subtitle: 'Digitizing Manufacturing Plants',
    focus: 'Refers to digitizing manufacturing plants and industrial facilities by integrating smart factory solutions that use automation, robotics, and AI to streamline production processes, reduce downtime, and increase efficiency.',
    technologies: [
      'Industrial IoT (IIoT)',
      'AI & Machine Learning',
      'Robotics & Automation',
      'Predictive Maintenance',
      '3D Printing',
      'Digital Twins'
    ],
    benefits: [
      'Increased production efficiency',
      'Reduced downtime',
      'Predictive maintenance',
      'Quality control automation',
      'Flexible manufacturing',
      'Real-time production monitoring'
    ],
    useCases: [
      'Smart factory automation',
      'Predictive maintenance systems',
      'Digital twin simulations',
      'Robotic assembly lines',
      'AI-powered quality control'
    ],
    stats: [
      { label: 'Production Efficiency', value: '55%' },
      { label: 'Downtime Reduction', value: '48%' },
      { label: 'Quality Improvement', value: '40%' }
    ],
    heroImage: '/images/plant-hero.png',
    color: 'from-teal-600 to-cyan-600'
  },
  'retail': {
    id: 'retail',
    name: 'Retail 4.0',
    title: 'Retail 4.0',
    subtitle: 'Transforming the Retail Industry',
    focus: 'This sector is focused on transforming the retail industry through digital tools, creating personalized shopping experiences, improving supply chain management, and integrating online and offline customer journeys.',
    technologies: [
      'E-commerce Platforms',
      'AI-Driven Recommendations',
      'Augmented Reality',
      'Virtual Fitting Rooms',
      'IoT Sensors',
      'Customer Analytics'
    ],
    benefits: [
      'Personalized shopping experiences',
      'Seamless omnichannel integration',
      'Improved inventory management',
      'Enhanced customer insights',
      'Increased sales conversion',
      'Reduced operational costs'
    ],
    useCases: [
      'AI-powered product recommendations',
      'Virtual try-on and fitting rooms',
      'Smart shelves and inventory tracking',
      'Personalized marketing campaigns',
      'Cashierless checkout systems'
    ],
    stats: [
      { label: 'Sales Growth', value: '38%' },
      { label: 'Customer Engagement', value: '45%' },
      { label: 'Conversion Rate', value: '42%' }
    ],
    heroImage: '/images/retail-hero.png',
    color: 'from-primary-600 to-orange-600'
  },
  'service': {
    id: 'service',
    name: 'Services 4.0',
    title: 'Services 4.0',
    subtitle: 'Digitization of Service-Based Industries',
    focus: 'Refers to the digitization of service-based industries, enhancing the customer experience by offering automation, AI-driven service management, and seamless interactions between customers and service providers.',
    technologies: [
      'AI & Machine Learning',
      'Automation Platforms',
      'Chatbots & Virtual Assistants',
      'Service Management Systems',
      'CRM Platforms',
      'Predictive Analytics'
    ],
    benefits: [
      'Faster service delivery',
      'Personalized customer interactions',
      'Automated service processes',
      'Improved customer satisfaction',
      'Reduced operational costs',
      'Enhanced service quality'
    ],
    useCases: [
      'AI-powered customer service chatbots',
      'Automated service ticketing systems',
      'Predictive service maintenance',
      'Personalized service recommendations',
      'Self-service portals'
    ],
    stats: [
      { label: 'Service Speed', value: '50%' },
      { label: 'Customer Satisfaction', value: '46%' },
      { label: 'Cost Efficiency', value: '40%' }
    ],
    heroImage: '/images/service-hero.png',
    color: 'from-violet-600 to-purple-600'
  },
  'wellness': {
    id: 'wellness',
    name: 'Wellness 4.0',
    title: 'Wellness 4.0',
    subtitle: 'Digitizing Health and Wellness Services',
    focus: 'Focuses on digitizing health and wellness services, promoting a healthier lifestyle through AI-driven health monitoring, wearable devices, and telemedicine.',
    technologies: [
      'IoT Wearables',
      'AI & Machine Learning',
      'Telemedicine Platforms',
      'Health Monitoring Devices',
      'Predictive Health Analytics',
      'Mobile Health Apps'
    ],
    benefits: [
      'Personalized health insights',
      'Remote health monitoring',
      'Early disease detection',
      'Improved patient outcomes',
      'Accessible healthcare services',
      'Preventive care focus'
    ],
    useCases: [
      'Wearable health monitoring devices',
      'AI-powered health diagnostics',
      'Telemedicine consultations',
      'Personalized fitness and nutrition plans',
      'Predictive health risk assessment'
    ],
    stats: [
      { label: 'Health Outcomes', value: '42%' },
      { label: 'Patient Engagement', value: '55%' },
      { label: 'Cost Savings', value: '38%' }
    ],
    heroImage: '/images/wellness-hero.png',
    color: 'from-emerald-600 to-green-600'
  }
};

export const SectorLandingPage: React.FC = () => {
  const { sectorId } = useParams<{ sectorId: string }>();
  const sector = sectorId ? sectorsData[sectorId] : null;
  const [featuredArticles, setFeaturedArticles] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured articles for sectors
  useEffect(() => {
    const fetchArticles = async () => {
      if (sector?.id === 'agility' || sector?.id === 'experience' || sector?.id === 'farming') {
        try {
          setLoading(true);
          const tag = sector.id === 'agility' ? 'agility-40' : sector.id === 'experience' ? 'experience-40' : 'farming-40';
          const response = await listPublicMedia({
            limit: 3,
            subMarketplace: 'written',
            tag: tag
          });
          
          if (response.items && response.items.length > 0) {
            setFeaturedArticles(response.items.slice(0, 3));
          }
        } catch (error) {
          console.error('Error fetching articles:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArticles();
  }, [sector?.id]);

  if (!sector) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sector Not Found</h1>
            <p className="text-gray-600 mb-6">The sector you're looking for doesn't exist.</p>
            <Link to="/dtmi" className="text-primary hover:text-primary-600 font-semibold">
              Return to DTMI
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Helper function to get media type label
  const getMediaTypeLabel = (type: string | null) => {
    if (!type) return 'Article';
    const typeMap: Record<string, string> = {
      'article': 'Article',
      'blog': 'Blog',
      'interview': 'Expert Interview',
      'whitepaper': 'Whitepaper',
      'report': 'Report',
      'casestudy': 'Case Study',
      'prediction': 'Prediction Analysis'
    };
    return typeMap[type] || 'Article';
  };

  // Helper function to get media type color
  const getMediaTypeColor = (type: string | null) => {
    if (!type) return 'text-primary';
    const colorMap: Record<string, string> = {
      'article': 'text-primary',
      'blog': 'text-primary',
      'interview': 'text-orange-600',
      'whitepaper': 'text-purple-600',
      'report': 'text-green-600',
      'casestudy': 'text-indigo-600',
      'prediction': 'text-red-600'
    };
    return colorMap[type] || 'text-primary';
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-secondary-900 to-secondary-700 text-white py-16 overflow-hidden min-h-[400px] flex items-center">
        {/* Hero Background Image with Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 via-secondary-800/90 to-secondary-700/85"></div>
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {sector.title}
            </h1>
            <p className="text-base md:text-lg text-white/95 mb-8 leading-relaxed max-w-3xl mx-auto">
              {sector.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/marketplace/dtmi"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-600 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm"
              >
                Explore Resources
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              {sector.id === 'experience' && (
                <Link
                  to="#what-is"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md text-white rounded-lg font-medium hover:bg-white/25 transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:-translate-y-0.5 text-sm"
                >
                  Discover How It Works
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What is [Sector] Section */}
      <section id="what-is" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
              {sector.id === 'experience' ? 'What Is Experience 4.0?' : `What is ${sector.name}?`}
            </h2>
            <p className="text-lg text-secondary-700 leading-relaxed mb-6">
              {sector.focus}
            </p>
            <p className="text-lg text-secondary-700 leading-relaxed mb-6">
              At the core of {sector.name} are:
            </p>
            <div className="space-y-4 mb-6">
              {sector.corePillars && sector.corePillars.map((pillar, index) => (
                <div key={index} className="flex items-start gap-4 p-5 bg-secondary-50 rounded-xl border border-secondary-100">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-secondary-900 mb-2">{pillar.title}</h3>
                    <p className="text-secondary-700">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why [Sector] Section */}
      <section className="py-20 bg-secondary-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6 text-center">
              {sector.id === 'experience' ? 'Why It Matters?' : `Why ${sector.name}?`}
            </h2>
            <p className="text-lg text-secondary-700 leading-relaxed mb-12 text-center max-w-3xl mx-auto">
              {sector.id === 'agility' 
                ? 'In today\'s rapidly changing business landscape, organizations that can adapt quickly and efficiently will thrive. Agility 4.0 helps businesses:'
                : sector.id === 'experience'
                ? 'Modern customers expect speed, relevance, and consistency. Experience 4.0 helps organizations:'
                : 'In today\'s evolving agricultural landscape, technology adoption is key to staying competitive. Farming 4.0 enables businesses to enhance crop production, improve efficiency, and promote sustainability.'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {sector.whyReasons && sector.whyReasons.map((reason, index) => {
                // Map icon names to icon components
                const IconComponent = 
                  reason.icon === 'TrendingUp' ? TrendingUp :
                  reason.icon === 'Zap' ? Zap :
                  reason.icon === 'CheckCircle' ? CheckCircle :
                  reason.icon === 'Users' ? Users :
                  CheckCircle; // Default fallback
                
                return (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-secondary-100">
                    <IconComponent className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-secondary-900 mb-1 text-base">{reason.title}</h3>
                      <p className="text-secondary-700 text-sm">{reason.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-lg text-secondary-700 leading-relaxed text-center max-w-3xl mx-auto mb-12">
              Adopting Agility 4.0 enables businesses to stay ahead of market demands and technological advancements, ensuring growth and long-term success.
            </p>
            
            {/* Enhanced Stats with Hover Effects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group relative text-center p-6 bg-gradient-to-br from-white to-secondary-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-secondary-100 hover:border-primary hover:-translate-y-2 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-3 group-hover:scale-105 transition-transform duration-300">
                    {sector.stats[0].value}
                  </div>
                  <div className="text-secondary-900 font-bold text-base mb-2">{sector.stats[0].label}</div>
                  <p className="text-secondary-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">
                    Agility 4.0 reduces delivery times through streamlined processes and continuous deployment
                  </p>
                </div>
              </div>
              
              <div className="group relative text-center p-6 bg-gradient-to-br from-white to-secondary-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-secondary-100 hover:border-primary hover:-translate-y-2 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-3 group-hover:scale-105 transition-transform duration-300">
                    {sector.stats[1].value}
                  </div>
                  <div className="text-secondary-900 font-bold text-base mb-2">{sector.stats[1].label}</div>
                  <p className="text-secondary-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">
                    Agile methodologies boost team efficiency and output quality significantly
                  </p>
                </div>
              </div>
              
              <div className="group relative text-center p-6 bg-gradient-to-br from-white to-secondary-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-secondary-100 hover:border-primary hover:-translate-y-2 cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-3 group-hover:scale-105 transition-transform duration-300">
                    {sector.stats[2].value}
                  </div>
                  <div className="text-secondary-900 font-bold text-base mb-2">{sector.stats[2].label}</div>
                  <p className="text-secondary-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">
                    Eliminate waste and focus on high-value tasks to reduce operational expenses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Technologies Driving [Sector] Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 text-center">Key Technologies Driving {sector.name}</h2>
            <p className="text-xl text-secondary-700 leading-relaxed mb-16 text-center max-w-3xl mx-auto">
              {sector.id === 'farming'
                ? 'The right technologies are essential for Farming 4.0, enabling rapid adaptation, improved collaboration, and continuous delivery.'
                : 'For organizations to implement Agility 4.0 successfully, the right technologies must be in place. These core technologies enable rapid adaptation, improved collaboration, and continuous delivery:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative p-3 bg-white rounded-xl border border-secondary-100 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                      <Zap className="w-4.5 h-4.5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-secondary-900 font-semibold text-sm mb-1">AI & Machine Learning</h3>
                    <p className="text-secondary-600 text-xs leading-snug line-clamp-2">Automate decision-making and enhance efficiency.</p>
                  </div>
                </div>
              </div>
              
              <div className="relative p-3 bg-white rounded-xl border border-secondary-100 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                      <TrendingUp className="w-4.5 h-4.5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-secondary-900 font-semibold text-sm mb-1">Cloud Computing</h3>
                    <p className="text-secondary-600 text-xs leading-snug line-clamp-2">Scalable infrastructure for remote teams.</p>
                  </div>
                </div>
              </div>
              
              <div className="relative p-3 bg-white rounded-xl border border-secondary-100 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                      <CheckCircle className="w-4.5 h-4.5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-secondary-900 font-semibold text-sm mb-1">Automation Tools</h3>
                    <p className="text-secondary-600 text-xs leading-snug line-clamp-2">Streamline tasks for higher-value work.</p>
                  </div>
                </div>
              </div>
              
              <div className="relative p-3 bg-white rounded-xl border border-secondary-100 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                      <Users className="w-4.5 h-4.5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-secondary-900 font-semibold text-sm mb-1">Collaborative Platforms</h3>
                    <p className="text-secondary-600 text-xs leading-snug line-clamp-2">Seamless communication and teamwork.</p>
                  </div>
                </div>
              </div>
              
              <div className="relative p-3 bg-white rounded-xl border border-secondary-100 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                      <Zap className="w-4.5 h-4.5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-secondary-900 font-semibold text-sm mb-1">DevOps & CI/CD</h3>
                    <p className="text-secondary-600 text-xs leading-snug line-clamp-2">Continuous integration for faster releases.</p>
                  </div>
                </div>
              </div>
              
              <div className="relative p-3 bg-white rounded-xl border border-secondary-100 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                      <CheckCircle className="w-4.5 h-4.5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-secondary-900 font-semibold text-sm mb-1">Agile Project Management</h3>
                    <p className="text-secondary-600 text-xs leading-snug line-clamp-2">Plan, track, and deliver iteratively.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits of [Sector] Section - Enhanced 2-Column Layout */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-secondary-50 to-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4 text-center">Benefits of {sector.name}</h2>
            <p className="text-base text-secondary-600 leading-relaxed mb-12 text-center max-w-3xl mx-auto">
              {sector.id === 'agility' 
                ? 'Agility 4.0 delivers measurable business value by fostering an adaptive culture that improves speed, efficiency, collaboration, and innovation.'
                : sector.id === 'experience'
                ? 'Experience 4.0 delivers measurable value by aligning digital interactions with customer expectations.'
                : 'Farming 4.0 delivers measurable business value by aligning technology with operational goals. Key benefits include optimized crop yields, improved resource management, and enhanced sustainability.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sector.benefits.map((benefit, index) => {
                // Split benefit into title and description
                const [title, description] = benefit.split(':').map(s => s.trim());
                
                return (
                  <div key={index} className="group relative p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-102 cursor-pointer border border-secondary-100 hover:border-primary overflow-hidden">
                    {/* Animated background overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-600 shadow-md group-hover:scale-110 transition-transform duration-300">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-secondary-900 font-bold text-base mb-2">{title}</h3>
                        <p className="text-secondary-700 text-sm leading-relaxed">{description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How [Sector] Works: Key Use Cases Section - Horizontal Scroll Layout */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4 text-center">
              {sector.id === 'experience' ? 'See How Experience 4.0 Works' : `How ${sector.name} Works: Key Use Cases`}
            </h2>
            <p className="text-base text-secondary-600 leading-relaxed mb-12 text-center max-w-3xl mx-auto">
              {sector.id === 'agility' 
                ? 'Here\'s how Agility 4.0 is applied in real-world business scenarios:'
                : 'Ready to apply these use cases to your business? Here\'s how Experience 4.0 works in practice:'}
            </p>
            
            {/* Horizontal Scrolling Container */}
            <div className="relative">
              <div className="flex overflow-x-auto gap-5 pb-6 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
                {sector.useCases.map((useCase, index) => (
                  <div 
                    key={index} 
                    className="group relative flex-shrink-0 w-72 md:w-auto snap-start p-6 bg-gradient-to-br from-secondary-50 to-white rounded-xl border border-secondary-200 hover:border-primary shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-102 cursor-pointer overflow-hidden"
                  >
                    {/* Animated background overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Icon/Number Badge */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-600 text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          {index === 0 && <Zap className="w-6 h-6 text-primary" />}
                          {index === 1 && <TrendingUp className="w-6 h-6 text-primary" />}
                          {index === 2 && <CheckCircle className="w-6 h-6 text-primary" />}
                          {index === 3 && <Users className="w-6 h-6 text-primary" />}
                          {index === 4 && <Zap className="w-6 h-6 text-primary" />}
                        </div>
                      </div>
                      
                      {/* Use Case Title */}
                      <h3 className="text-lg font-bold text-secondary-900 mb-3 leading-tight group-hover:text-primary transition-colors">
                        {useCase.split(':')[0]}
                      </h3>
                      
                      {/* Use Case Description */}
                      <p className="text-secondary-700 text-sm leading-relaxed flex-grow">
                        {useCase.split(':')[1] || useCase}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Sample Articles: Dive Deeper into [Sector] Section */}
      {(sector.id === 'agility' || sector.id === 'experience' || sector.id === 'farming') && (
        <section className="py-24 bg-gradient-to-br from-secondary-50 to-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 text-center">
                {sector.id === 'experience' 
                  ? 'Dive Deeper into Experience 4.0' 
                  : sector.id === 'farming'
                  ? 'Dive Deeper into Farming 4.0'
                  : `Sample Articles: Dive Deeper into ${sector.name}`}
              </h2>
              <p className="text-xl text-secondary-700 text-center mb-16 max-w-3xl mx-auto leading-relaxed">
                {sector.id === 'agility' 
                  ? 'Explore these insightful articles to learn more about how Agility 4.0 is transforming businesses, enhancing productivity, and driving innovation in the Digital Economy 4.0.'
                  : sector.id === 'experience'
                  ? 'Discover how Experience 4.0 is transforming customer journeys, enhancing engagement, and driving growth. Get the latest insights to stay ahead.'
                  : 'Discover how Farming 4.0 is modernizing agriculture, improving sustainability, and boosting crop yields. Get the latest insights to stay ahead.'}
              </p>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden border-2 border-secondary-200 animate-pulse shadow-lg">
                      <div className="h-64 bg-secondary-200"></div>
                      <div className="p-8">
                        <div className="h-4 bg-secondary-200 rounded w-1/3 mb-4"></div>
                        <div className="h-7 bg-secondary-200 rounded w-full mb-4"></div>
                        <div className="h-4 bg-secondary-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-secondary-200 rounded w-2/3 mb-6"></div>
                        <div className="h-10 bg-secondary-200 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : featuredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featuredArticles.map((article, index) => (
                    <Link
                      key={article.id}
                      to={`/marketplace/dtmi/${article.id}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <div className="relative h-64 flex-shrink-0 overflow-hidden">
                        {article.thumbnail_url ? (
                          <img 
                            src={article.thumbnail_url} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <img 
                            src={
                              index === 0 ? 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80' :
                              index === 1 ? 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80' :
                              'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'
                            }
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className={`p-6 flex flex-col flex-grow border-b-4 ${
                        index === 0 ? 'border-primary' :
                        index === 1 ? 'border-orange-600' :
                        'border-secondary-700'
                      }`}>
                        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                          <span className={`text-sm font-semibold ${getMediaTypeColor(article.type)}`}>
                            {getMediaTypeLabel(article.type)}
                          </span>
                          <span className="text-secondary-400">•</span>
                          <span className="text-sm text-secondary-600">{article.provider?.name || 'DigitalQatalyst'}</span>
                        </div>
                        <h3 className="text-xl font-bold text-secondary-900 mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-secondary-600 mb-4 leading-relaxed line-clamp-2 flex-grow text-sm">
                          {article.summary || 'Explore this insightful content on digital transformation and agility practices.'}
                        </p>
                        <p className="text-sm text-secondary-500 flex-shrink-0">{formatDate(article.published_at)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Placeholder Article 1 */}
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="relative h-64 flex-shrink-0 overflow-hidden">
                      <img 
                        src={sector.id === 'farming' 
                          ? 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80'
                          : 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'
                        }
                        alt={sector.id === 'farming' ? 'Smart Farming Technology' : 'AI and Global Digital Transformation'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow border-b-4 border-primary">
                      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">Blog</span>
                        <span className="text-secondary-400">•</span>
                        <span className="text-sm text-secondary-600">DigitalQatalyst</span>
                      </div>
                      <h3 className="text-xl font-bold text-secondary-900 mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {sector.id === 'farming' 
                          ? 'How IoT Sensors Are Revolutionizing Precision Agriculture'
                          : 'How Agile Methodologies Are Shaping the Future of Work'}
                      </h3>
                      <p className="text-secondary-600 mb-4 leading-relaxed line-clamp-2 flex-grow text-sm">
                        {sector.id === 'farming'
                          ? 'IoT sensors are transforming modern farming by providing real-time data on soil conditions, moisture levels, and crop health...'
                          : 'Agile methodologies, once confined to software development, are now being applied across a wide range of industries...'}
                      </p>
                      <p className="text-sm text-secondary-500 flex-shrink-0">Feb 18, 2026</p>
                    </div>
                  </div>

                  {/* Placeholder Article 2 */}
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="relative h-64 flex-shrink-0 overflow-hidden">
                      <img 
                        src={sector.id === 'farming'
                          ? 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80'
                          : 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'
                        }
                        alt={sector.id === 'farming' ? 'Drone Technology in Agriculture' : 'DevOps and Agile Development'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow border-b-4 border-primary">
                      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                        <span className="text-sm font-semibold text-orange-600">Research Report</span>
                        <span className="text-secondary-400">•</span>
                        <span className="text-sm text-secondary-600">DigitalQatalyst</span>
                      </div>
                      <h3 className="text-xl font-bold text-secondary-900 mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {sector.id === 'farming'
                          ? 'AI-Powered Crop Monitoring: The Future of Sustainable Farming'
                          : 'DevOps: The Bridge Between Development and Operations'}
                      </h3>
                      <p className="text-secondary-600 mb-4 leading-relaxed line-clamp-2 flex-grow text-sm">
                        {sector.id === 'farming'
                          ? 'Artificial intelligence and machine learning are enabling farmers to predict crop yields, detect diseases early, and optimize resource usage...'
                          : 'DevOps is at the heart of Agility 4.0. This article examines how DevOps practices create a continuous feedback loop...'}
                      </p>
                      <p className="text-sm text-secondary-500 flex-shrink-0">Feb 18, 2026</p>
                    </div>
                  </div>

                  {/* Placeholder Article 3 */}
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="relative h-64 flex-shrink-0 overflow-hidden">
                      <img 
                        src={sector.id === 'farming'
                          ? 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80'
                          : 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'
                        }
                        alt={sector.id === 'farming' ? 'Sustainable Agriculture Practices' : 'Cloud Computing and Agile Teams'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow border-b-4 border-secondary-700">
                      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">Blog</span>
                        <span className="text-secondary-400">•</span>
                        <span className="text-sm text-secondary-600">DigitalQatalyst</span>
                      </div>
                      <h3 className="text-xl font-bold text-secondary-900 mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {sector.id === 'farming'
                          ? 'Blockchain Technology: Ensuring Food Traceability and Safety'
                          : 'Leveraging Cloud Computing for Agile Success'}
                      </h3>
                      <p className="text-secondary-600 mb-4 leading-relaxed line-clamp-2 flex-grow text-sm">
                        {sector.id === 'farming'
                          ? 'Blockchain technology is revolutionizing food supply chains by providing transparent, tamper-proof records from farm to table...'
                          : 'Cloud computing enables scalable infrastructure, essential for Agile teams. This article explains how cloud services empower businesses...'}
                      </p>
                      <p className="text-sm text-secondary-500 flex-shrink-0">Feb 18, 2026</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Simplified with Single CTA */}
      <section className="relative py-24 bg-gradient-to-br from-[#1e3a5f] via-[#2c5282] to-[#1a365d] text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80" 
            alt="Digital transformation background"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/90 via-[#2c5282]/85 to-[#1a365d]/90"></div>
        
        {/* Decorative Wave Patterns */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <path fill="none" stroke="currentColor" strokeWidth="2" d="M0,400 Q360,300 720,400 T1440,400" opacity="0.3"/>
            <path fill="none" stroke="currentColor" strokeWidth="2" d="M0,500 Q360,400 720,500 T1440,500" opacity="0.2"/>
            <path fill="none" stroke="currentColor" strokeWidth="2" d="M0,600 Q360,500 720,600 T1440,600" opacity="0.1"/>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Transform Your {sector.name.replace(' 4.0', '')} Operations?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed mb-8">
              {sector.id === 'agility' 
                ? 'Let\'s discuss how Agility 4.0 can drive innovation and growth in your organization.'
                : sector.id === 'experience'
                ? 'Let\'s explore how Experience 4.0 can elevate your customer journeys and accelerate growth.'
                : 'Let\'s explore how digital tools can improve productivity, sustainability, and crop yields.'}
            </p>
            
            {/* Single CTA Button */}
            <Link
              to="/marketplace/dtmi"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-600 text-white rounded-lg font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Explore Resources
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SectorLandingPage;
