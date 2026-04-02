import React from 'react';
import { Calendar, Clock, User, TrendingUp, Target, DollarSign, Users, Share2, Download, Bookmark, Building2, Cpu, Briefcase, ArrowRight, Zap, AlertTriangle } from 'lucide-react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';

// Add CSS styles for links in dangerouslySetInnerHTML content
const linkStyles = `
  <style>
    .prediction-content main a {
      color: #2563eb !important;
      text-decoration: underline !important;
      transition: color 0.2s ease !important;
    }
    .prediction-content main a:hover {
      color: #1d4ed8 !important;
    }
  </style>
`;

// Visual Executive Summary Component
const VisualExecutiveSummary = ({ title, subtitle, stats, keyTakeaway }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      ref={ref}
      className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 rounded-xl shadow-lg p-8 mb-8 mx-auto"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-blue-100">{subtitle}</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat: any, index: number) => {
          const IconComponent = stat.icon === 'users' ? Users : 
                             stat.icon === 'dollar' ? DollarSign :
                             stat.icon === 'target' ? Target : 
                             stat.icon === 'building' ? Building2 :
                             stat.icon === 'cpu' ? Cpu :
                             stat.icon === 'briefcase' ? Briefcase :
                             stat.icon === 'clock' ? Clock : TrendingUp;
          return (
            <motion.div
              key={index}
              className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "rgba(255,255,255,0.15)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="flex justify-center mb-3"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <div className="p-3 bg-white/20 text-white rounded-full">
                  <IconComponent size={24} />
                </div>
              </motion.div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-blue-100 mb-1">{stat.label}</div>
              <div className="text-xs text-blue-200">{stat.trend}</div>
            </motion.div>
          );
        })}
      </div>
      
      <motion.div 
        className="bg-white/10 backdrop-blur-sm text-white p-6 rounded-lg border border-white/20"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-white/20 rounded-full">
            <Target size={16} />
          </div>
          <h3 className="font-bold text-lg">Key Takeaway</h3>
        </div>
        <p className="text-blue-100 leading-relaxed">{keyTakeaway}</p>
      </motion.div>
    </motion.div>
  );
};

const CognitiveEnterprisesPrediction = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Comprehensive prediction data
  const predictionData = {
    header: {
      title: "The Next Decade in Digital Transformation: How Cognitive Enterprises Will Drive Global Economic Growth",
      subtitle: "By 2030, the rise of Digital Cognitive Organizations (DCOs) will fundamentally reshape the global economy, driving growth through AI-powered automation, cross-sector collaboration, and data-driven decision-making.",
      category: "Prediction Analysis",
      author: "Dr. Chen Wei",
      publishDate: "January 21, 2026",
      readTime: "12 min",
    },
    visualSummary: {
      title: "Cognitive Enterprises 2030 Executive Dashboard",
      subtitle: "Global economic transformation metrics and forecasts at a glance",
      stats: [
        {
          icon: "dollar",
          value: "$12T",
          label: "Global GDP Contribution",
          trend: "By 2030"
        },
        {
          icon: "building",
          value: "80%",
          label: "Fortune 500 AI Integration",
          trend: "Full Adoption"
        },
        {
          icon: "target",
          value: "40%",
          label: "Global Productivity Boost",
          trend: "AI-Enhanced"
        },
        {
          icon: "briefcase",
          value: "50%",
          label: "Jobs Augmented by AI",
          trend: "New Roles Created"
        }
      ],
      keyTakeaway: "By 2030, Digital Cognitive Organizations (DCOs) will redefine the global economic landscape, leveraging AI-powered automation, cross-sector collaboration, and data-driven decision-making. These cognitive enterprises will not only enhance global GDP but will also foster greater productivity and shift employment patterns, creating new opportunities across industries."
    },
    timeline: {
      phases: [
        {
          period: "2025-2026",
          title: "Initial Adoption",
          adoption: "25%",
          description: "Cognitive Enterprises begin forming, initially in early-adopting sectors like finance, technology, and e-commerce. AI tools begin to automate operations, decision-making, and customer service.",
          milestones: [
            "30% of Fortune 500 begin deploying AI for operational processes",
            "AI governance models and ethical frameworks start emerging"
          ]
        },
        {
          period: "2027-2028",
          title: "Widespread Integration",
          adoption: "55%",
          description: "AI expands into mainstream sectors. Cross-sector ecosystems develop, facilitating collaboration through shared data platforms. AI optimizes real-time decision-making.",
          milestones: [
            "50% of businesses integrate AI-driven automation into core functions",
            "Interorganizational collaboration using shared platforms and data begins to take shape"
          ]
        },
        {
          period: "2029-2030",
          title: "Cognitive Enterprises at Scale",
          adoption: "80%",
          description: "AI-driven automation dominates global economies, driving productivity and growth. Cognitive Enterprises enhance decision-making and efficiency through seamless integration with AI ecosystems.",
          milestones: [
            "80% of global GDP is driven by AI-enabled cognitive enterprises",
            "AI and automation fully optimize global supply chains, increasing speed and reducing costs"
          ]
        }
      ]
    },
    scenarios: [
      {
        name: "Accelerated Adoption",
        probability: 40,
        icon: Zap,
        color: "border-secondary-500 bg-secondary-50",
        outcomes: [
          "90% of Fortune 500 companies integrate AI by 2028",
          "Global productivity increases by 40% due to widespread automation",
          "Technological advancements, regulatory support, and strong economic growth accelerate AI adoption"
        ]
      },
      {
        name: "Measured Growth",
        probability: 45,
        icon: Target,
        color: "border-secondary-500 bg-secondary-50",
        outcomes: [
          "60% of companies fully implement AI by 2030, with variances across sectors",
          "Cross-sector collaboration becomes more common, but at a slower pace",
          "Adoption occurs steadily across sectors, with some industries taking the lead while others remain slower to transition"
        ]
      },
      {
        name: "Fragmented Adoption",
        probability: 15,
        icon: AlertTriangle,
        color: "border-secondary-500 bg-secondary-50",
        outcomes: [
          "30% of companies hesitate to scale AI",
          "Global economic disparities widen as AI adoption remains isolated in certain sectors",
          "Barriers such as regulation, ethical concerns, and technological limitations hinder AI adoption"
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen prediction-content" style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
      <div dangerouslySetInnerHTML={{ __html: linkStyles }} />
      <Header />

      {/* Hero Header */}
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image Container */}
        <div className="absolute top-0 left-0 w-full h-[600px]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80)',
              imageRendering: 'crisp-edges',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          />

          {/* Gradient Fade Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% via-white/60 via-60% to-white to-90%" />
        </div>

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-[35vh] pb-20">
          <div className="max-w-5xl">
            {/* Category Badge */}
            <motion.div
              className="mb-5"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="inline-block px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                Prediction Analysis
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-gray-900"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {predictionData.header.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-sm sm:text-base md:text-lg text-gray-500 mb-5 leading-relaxed max-w-3xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {predictionData.header.subtitle}
            </motion.p>

            {/* Author and Meta Info */}
            <motion.div
              className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-gray-400 mb-5"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{predictionData.header.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{predictionData.header.publishDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{predictionData.header.readTime}</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-3"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-all duration-300 min-h-[44px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={16} />
                Share
              </motion.button>

              <motion.button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent text-gray-600 text-sm font-medium rounded border border-gray-300 hover:bg-gray-50 transition-all duration-300 min-h-[44px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={16} />
                Download PDF
              </motion.button>

              <motion.button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent text-gray-600 text-sm font-medium rounded border border-gray-300 hover:bg-gray-50 transition-all duration-300 min-h-[44px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bookmark size={16} />
                Save
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pb-12">
        <div className="w-full">
          {/* Visual Executive Summary */}
          <VisualExecutiveSummary {...predictionData.visualSummary} />

          {/* Executive Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Executive Summary</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              AI adoption and automation will drive economic growth by enhancing productivity and operational efficiency across sectors like finance, healthcare, and retail. The rise of Cognitive Enterprises will generate new industries focused on AI ethics, data governance, and cross-organizational collaboration.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                  1
                </div>
                <span className="text-gray-700 leading-relaxed">AI adoption and automation will drive economic growth by enhancing productivity and operational efficiency across sectors like finance, healthcare, and retail</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                  2
                </div>
                <span className="text-gray-700 leading-relaxed">The rise of Cognitive Enterprises will generate new industries focused on AI ethics, data governance, and cross-organizational collaboration</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                  3
                </div>
                <span className="text-gray-700 leading-relaxed">AI will automate routine tasks, but also augment human capabilities, transforming the global labor market</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                  4
                </div>
                <span className="text-gray-700 leading-relaxed">By 2030, cognitive enterprises will thrive in interconnected ecosystems, enabling cross-sector collaboration that makes supply chains resilient, adaptive, and efficient</span>
              </div>
            </div>
          </div>

          {/* Evolution Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Evolution Timeline</h2>
            </div>
            <p className="text-gray-600 text-sm mb-8">Key evolution phases from 2025-2030</p>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-12">
                {/* Phase 1: 2025-2026 */}
                <div className="relative">
                  <div className="absolute left-4 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-md"></div>
                  
                  <div className="ml-16">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded">
                          2025-2026
                        </span>
                        <div className="text-sm text-gray-500 mt-1">Adoption: ~25%</div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Initial Adoption</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Cognitive Enterprises begin forming, initially in early-adopting sectors like finance, technology, and e-commerce. AI tools begin to automate operations, decision-making, and customer service.
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-900">Milestones:</span>
                      </div>
                      <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">30% of Fortune 500 begin deploying AI for operational processes.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">AI governance models and ethical frameworks start emerging.</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-1">Progress</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <div className="text-right text-xs text-gray-500 mt-1">~25%</div>
                    </div>
                  </div>
                </div>

                {/* Phase 2: 2027-2028 */}
                <div className="relative">
                  <div className="absolute left-4 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-md"></div>
                  
                  <div className="ml-16">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded">
                          2027-2028
                        </span>
                        <div className="text-sm text-gray-500 mt-1">Adoption: ~55%</div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Widespread Integration</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      AI expands into mainstream sectors. Cross-sector ecosystems develop, facilitating collaboration through shared data platforms. AI optimizes real-time decision-making.
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-900">Milestones:</span>
                      </div>
                      <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">50% of businesses integrate AI-driven automation into core functions.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Interorganizational collaboration using shared platforms and data begins to take shape.</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-1">Progress</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '55%' }}></div>
                      </div>
                      <div className="text-right text-xs text-gray-500 mt-1">~55%</div>
                    </div>
                  </div>
                </div>

                {/* Phase 3: 2029-2030 */}
                <div className="relative">
                  <div className="absolute left-4 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-md"></div>
                  
                  <div className="ml-16">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded">
                          2029-2030
                        </span>
                        <div className="text-sm text-gray-500 mt-1">Adoption: ~80%</div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Cognitive Enterprises at Scale</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      AI-driven automation dominates global economies, driving productivity and growth. Cognitive Enterprises enhance decision-making and efficiency through seamless integration with AI ecosystems.
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-900">Milestones:</span>
                      </div>
                      <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">80% of global GDP is driven by AI-enabled cognitive enterprises.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">AI and automation fully optimize global supply chains, increasing speed and reducing costs.</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-1">Progress</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                      <div className="text-right text-xs text-gray-500 mt-1">~80%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prediction Metrics and Author Section - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Prediction Metrics - Takes 2/3 of the width */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Prediction Metrics</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Global GDP Contribution */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Global GDP Contribution</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">$12T</span>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Cognitive Enterprises will contribute $12 trillion to global GDP by 2030</p>
                  </div>

                  {/* AI Integration */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">AI Integration</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">80%</span>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">80% of enterprises will integrate AI-driven automation into their operations</p>
                  </div>

                  {/* Productivity Boost */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Productivity Boost</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">40%</span>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">40% increase in global productivity driven by cognitive tools</p>
                  </div>

                  {/* Employment Transformation */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Employment Transformation</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">50%</span>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">50% of jobs will be AI-augmented, creating new roles in AI development and data governance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Section - Takes 1/3 of the width */}
            <div className="space-y-6">
              {/* Author Profile */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
                      alt="Dr. Stephane Niango" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dr. Stephane Niango</h3>
                    <p className="text-sm text-gray-600">DTMI Head of Research</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Dr. Niango is the Chief Architect of the Digital Cognitive Organization (DCO) Framework and founder of DigitalCatalyst. His pioneering work on digital transformation and DCO model architecture has revolutionized how organizations approach cognitive enterprise solutions and AI-driven business transformation.
                </p>
                <div className="flex gap-3">
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Building2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <User className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Stay Updated CTA */}
              <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
                <p className="text-sm text-primary-100 mb-4">
                  Get weekly insights on AI-powered digital platforms and enterprise innovation trends delivered to your inbox.
                </p>
                <button className="w-full bg-white text-purple-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>

          {/* Scenario Analysis - 2/3 Width */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Scenario Analysis</h2>
                
                <div className="flex gap-2 mb-6">
                  {predictionData.scenarios.map((scenario, index) => (
                    <button
                      key={index}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border-2 flex-1 justify-center ${
                        activeTab === index ? scenario.color : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab(index)}
                    >
                      {React.createElement(scenario.icon, { className: "w-3 h-3" })}
                      <span className="truncate">{scenario.name}</span>
                      <span className="px-1.5 py-0.5 bg-white/50 rounded text-xs">
                        {scenario.probability}%
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {React.createElement(predictionData.scenarios[activeTab].icon, { className: "w-6 h-6 text-gray-700" })}
                    <h3 className="text-xl font-semibold text-gray-900">
                      {predictionData.scenarios[activeTab].name}
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {predictionData.scenarios[activeTab].probability}% Probability
                    </span>
                  </div>
                  <div className="space-y-3">
                    {predictionData.scenarios[activeTab].outcomes.map((outcome, index) => (
                      <div key={index} className="flex gap-3">
                        <ArrowRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">{outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signals to Watch - 2/3 Width */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Signals to Watch</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        Technology
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        High Impact
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">AI and Automation Maturation</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Rapid developments in AI, machine learning, and robotics. AI integration into real-time decision-making across industries.</p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        Policy
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        High Impact
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Global Regulatory Frameworks for AI</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">AI regulations to ensure ethical standards and data privacy. Governments push for AI innovation through incentives and policies.</p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        Technology
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        Medium Impact
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Cross-Sector Ecosystem Platforms</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Emergence of open-source ecosystems enabling AI and data sharing. Industry alliances grow to address global challenges like climate change.</p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        Social
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        Medium Impact
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">AI-Powered Knowledge Sharing</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Knowledge ecosystems powered by AI facilitate global collaboration. Data-sharing platforms support global problem-solving.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis and Insights - 2/3 Width */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="max-w-none">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Drivers</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    <strong>AI-Enhanced Automation</strong> will drive automation across industries, reducing costs and enhancing decision-making. <a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">McKinsey</a> estimates that AI will boost productivity by 40% globally by 2030.
                  </p>
                  
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    <strong>Cross-Sector Ecosystem Platforms</strong> - Interconnected platforms will enable shared resources, knowledge, and real-time decision-making. <a href="https://www.gartner.com/en/newsroom/press-releases/2023-10-11-gartner-identifies-the-top-10-strategic-technology-trends-for-2024" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Gartner</a> reports that AI-driven ecosystems will dominate by 2030, fostering collaboration across sectors.
                  </p>
                  
                  <p className="text-sm text-gray-700 leading-relaxed mb-8">
                    <strong>Global Collaboration in AI Innovation</strong> - Governments and private sectors will collaborate to ensure ethical AI usage, particularly in healthcare, finance, and education. <a href="https://www.weforum.org/agenda/2023/04/artificial-intelligence-governance-global-cooperation/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">World Economic Forum</a> highlights the importance of global cooperation in driving economic growth.
                  </p>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Implementation Strategies</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    <strong>Foster AI-Centric Ecosystems</strong> - Organizations should prioritize AI-driven platforms to integrate AI into their operations and external collaborations.
                  </p>
                  
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    <strong>Focus on Cross-Sector Partnerships</strong> - By 2027, 80% of valuable collaborations will be AI-facilitated. Companies should form strategic alliances to accelerate AI-driven innovation.
                  </p>
                  
                  <p className="text-sm text-gray-700 leading-relaxed mb-8">
                    <strong>Support Workforce Reskilling</strong> - Organizations must invest in upskilling employees, especially in AI ethics, machine learning development, and data governance.
                  </p>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Challenges and Risk Mitigations</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    <strong>Ethical and Regulatory Concerns</strong> - As AI scales, ethical concerns around bias and data privacy must be managed. <a href="https://www.gartner.com/en/newsroom/press-releases/2023-06-26-gartner-survey-finds-organizations-are-slow-to-produce-business-value-from-ai-investments" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Gartner</a> discusses the need for global AI governance frameworks to ensure ethical adoption.
                  </p>
                  
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    <strong>Technology Adoption Barriers</strong> - Small and medium-sized enterprises (SMEs) may struggle with AI implementation. Government interventions and public-private partnerships will help bridge the gap.
                  </p>
                  
                  <p className="text-sm text-gray-700 leading-relaxed mb-8">
                    <strong>Workforce Transition</strong> - AI will transform the workforce. Reskilling programs and the creation of new AI-related jobs will ensure smooth workforce transitions.
                  </p>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Conclusion</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    By 2030, Cognitive Enterprises powered by AI and automation will shape global economies, driving growth, boosting productivity, and enabling cross-sector collaboration.
                  </p>
                  
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    Organizations must prioritize AI ecosystems, focus on workforce reskilling, and foster global collaboration to fully capitalize on the potential of cognitive enterprises.
                  </p>
                  
                  <p className="text-sm text-gray-700 leading-relaxed font-semibold">
                    The next decade will be marked by AI-driven transformation, positioning cognitive enterprises as key drivers of the global economy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Analyses */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Analyses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI-Powered Decision Intelligence */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="AI-Powered Decision Intelligence" 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded">
                      Prediction Analysis
                    </span>
                    <span className="text-xs text-gray-500">DTMI</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    AI-Powered Decision Intelligence: The Next Frontier
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Exploring how artificial intelligence is revolutionizing enterprise decision-making processes and creating new competitive advantages.
                  </p>
                  <div className="text-xs text-gray-500">10 min</div>
                </div>
              </div>

              {/* Quantifying the ROI of Digital Transformation */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Quantifying the ROI of Digital Transformation" 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded">
                      Prediction Analysis
                    </span>
                    <span className="text-xs text-gray-500">DTMI</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    Quantifying the ROI of Digital Transformation
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    A comprehensive analysis of 50+ digital transformation initiatives and their measurable business outcomes.
                  </p>
                  <div className="text-xs text-gray-500">8 min</div>
                </div>
              </div>

              {/* Building Resilient Cognitive Systems */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Building Resilient Cognitive Systems" 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded">
                      Prediction Analysis
                    </span>
                    <span className="text-xs text-gray-500">DTMI</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    Building Resilient Cognitive Systems
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Best practices for architecting cognitive systems that scale with organizational growth and adapt to changing requirements.
                  </p>
                  <div className="text-xs text-gray-500">15 min</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default CognitiveEnterprisesPrediction;