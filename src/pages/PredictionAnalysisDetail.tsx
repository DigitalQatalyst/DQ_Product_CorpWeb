import { Calendar, Clock, User, TrendingUp, Target, DollarSign, Users, Mail, Linkedin, Twitter, Share2, Download, Lightbulb, BarChart3, AlertCircle, Zap, UserCheck, Shield, Eye, Bookmark, Check } from 'lucide-react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { NewsletterSubscription } from '../components/NewsletterSubscription';
import { isValidEmail } from '../utils/emailValidation';

// Add CSS styles for links in dangerouslySetInnerHTML content
const linkStyles = `
  <style>
    .prediction-content main a {
      color: #FF4D2B !important;
      text-decoration: underline !important;
      transition: color 0.2s ease !important;
    }
    .prediction-content main a:hover {
      color: #E63D1A !important;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    @media print {
      .no-print {
        display: none !important;
      }
      body {
        font-size: 12pt;
        line-height: 1.4;
      }
      .prediction-content {
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
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
      className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-700 rounded-xl shadow-lg p-6 md:p-8 mb-8 mx-auto"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-secondary-100">{subtitle}</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat: any, index: number) => {
          const IconComponent = stat.icon === 'users' ? Users :
            stat.icon === 'dollar' ? DollarSign :
              stat.icon === 'target' ? Target :
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
              <div className="text-sm font-medium text-secondary-100 mb-1">{stat.label}</div>
              <div className="text-xs text-secondary-200">{stat.trend}</div>
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
        <p className="text-secondary-100 leading-relaxed">{keyTakeaway}</p>
      </motion.div>
    </motion.div>
  );
};

// Executive Summary Component
const ExecutiveSummary = ({ summary, keyInsights }: any) => (
  <motion.div
    className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div
      className="flex items-center gap-3 mb-4"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="p-2 bg-primary-50 rounded-lg">
        <Lightbulb size={20} className="text-primary-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
        <p className="text-sm text-gray-600">Key takeaways and strategic insights</p>
      </div>
    </motion.div>

    <motion.p
      className="text-gray-700 leading-relaxed mb-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      dangerouslySetInnerHTML={{ __html: summary }}
    />

    <motion.h3
      className="text-lg font-semibold text-gray-900 mb-4"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      Key Insights:
    </motion.h3>
    <div className="space-y-3">
      {keyInsights.map((insight: string, index: number) => (
        <motion.div
          key={index}
          className="flex items-start gap-3"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
        >
          <div className="flex-shrink-0 w-6 h-6 bg-secondary-900 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
            {index + 1}
          </div>
          <span className="text-gray-700 leading-relaxed">{insight}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Prediction Timeline Component
const PredictionTimeline = ({ phases }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const phaseVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div
      ref={ref}
      className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <motion.div
        className="flex items-center gap-3 mb-8"
        variants={phaseVariants}
      >
        <div className="p-2 bg-primary-50 rounded-lg">
          <TrendingUp size={20} className="text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Evolution Timeline</h2>
          <p className="text-sm text-gray-600">Key evolution phases from 2025-2030</p>
        </div>
      </motion.div>

      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-secondary-200"></div>

        <div className="space-y-6">
          {phases.map((phase: any, index: number) => (
            <motion.div
              key={index}
              className="relative"
              variants={phaseVariants}
            >
              {/* Timeline Dot */}
              <div className="hidden md:block absolute left-6 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-sm z-10"></div>

              {/* Content Card */}
              <div className="ml-0 md:ml-20">
                <motion.div
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Year Badge and Adoption Rate */}
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-900 text-white text-sm font-semibold rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      {phase.year}
                    </motion.div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{phase.adoptionRate}% Adoption</span>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{phase.title}</h3>
                  <p
                    className="text-gray-700 mb-4 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: phase.description }}
                  />

                  {/* Key Milestones */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">🎯 Key Milestones:</h4>
                    <div className="space-y-2">
                      {phase.milestones.map((milestone: string, idx: number) => (
                        <motion.div
                          key={idx}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 + idx * 0.05 }}
                        >
                          <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span
                            className="text-sm text-gray-700"
                            dangerouslySetInnerHTML={{ __html: milestone }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{phase.adoptionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${phase.adoptionRate}%` }}
                        transition={{
                          delay: 0.5 + index * 0.2,
                          duration: 1,
                          ease: "easeOut"
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Prediction Metrics Component
const PredictionMetrics = ({ metrics }: any) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const metricVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6 md:p-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.div
        className="flex items-center gap-3 mb-8"
        variants={metricVariants}
      >
        <div className="p-2 bg-primary-50 rounded-lg">
          <BarChart3 size={20} className="text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prediction Metrics</h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric: any, index: number) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
            variants={metricVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">{metric.title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                <div className="flex items-center">
                  {metric.trend === 'up' ? (
                    <TrendingUp size={16} className="text-teal-500" />
                  ) : metric.trend === 'warning' ? (
                    <AlertCircle size={16} className="text-orange-500" />
                  ) : (
                    <TrendingUp size={16} className="text-teal-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${metric.trend === 'warning'
                    ? 'bg-gradient-to-r from-teal-500 to-orange-400'
                    : 'bg-gradient-to-r from-teal-500 to-teal-400'
                    }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.percentage}%` }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    duration: 1,
                    ease: "easeOut"
                  }}
                />
              </div>
            </div>

            <p
              className={`text-sm leading-relaxed ${metric.trend === 'warning' ? 'text-orange-600' : 'text-teal-600'
                }`}
              dangerouslySetInnerHTML={{ __html: metric.description }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Scenario Analysis Component
const ScenarioAnalysis = ({ scenarios }: any) => {
  const [activeTab, setActiveTab] = useState(0);

  // Scroll active tab into view on mobile
  const scrollToActiveTab = (index: number) => {
    setActiveTab(index);
    // Small delay to ensure state update, then scroll active tab into view
    setTimeout(() => {
      const activeButton = document.querySelector(`[data-tab-index="${index}"]`);
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }, 50);
  };

  const getTabIcon = (scenario: any) => {
    if (scenario.id === 'optimistic') return <TrendingUp size={16} />;
    if (scenario.id === 'conservative') return <Target size={16} />;
    if (scenario.id === 'disruptive') return <AlertCircle size={16} />;
    return <TrendingUp size={16} />;
  };

  const getTabColor = (scenario: any, isActive: boolean) => {
    if (scenario.id === 'optimistic') {
      return isActive
        ? 'text-teal-600 border-teal-600 bg-teal-50'
        : 'text-teal-500 border-transparent hover:text-teal-600 hover:border-teal-300';
    }
    if (scenario.id === 'conservative') {
      return isActive
        ? 'text-gray-600 border-gray-600 bg-gray-50'
        : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300';
    }
    if (scenario.id === 'disruptive') {
      return isActive
        ? 'text-orange-600 border-orange-600 bg-orange-50'
        : 'text-orange-500 border-transparent hover:text-orange-600 hover:border-orange-300';
    }
    return 'text-gray-500 border-transparent';
  };

  const getScenarioCardStyle = (scenario: any) => {
    if (scenario.id === 'optimistic') {
      return 'bg-teal-50 border-teal-200';
    }
    if (scenario.id === 'conservative') {
      return 'bg-gray-50 border-gray-200';
    }
    if (scenario.id === 'disruptive') {
      return 'bg-orange-50 border-orange-200';
    }
    return 'bg-gray-50 border-gray-200';
  };

  const getProbabilityBadgeStyle = (scenario: any) => {
    if (scenario.id === 'optimistic') {
      return 'bg-teal-500 text-white';
    }
    if (scenario.id === 'conservative') {
      return 'bg-gray-500 text-white';
    }
    if (scenario.id === 'disruptive') {
      return 'bg-orange-500 text-white';
    }
    return 'bg-teal-500 text-white';
  };

  const activeScenario = scenarios[activeTab];

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Scenario Analysis</h2>
        <p className="text-gray-600">Three potential pathways for DCO evolution</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        {/* Mobile: Horizontal scrolling tabs */}
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg min-w-max">
              {scenarios.map((scenario: any, index: number) => (
                <motion.button
                  key={index}
                  data-tab-index={index}
                  onClick={() => scrollToActiveTab(index)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 border-2 whitespace-nowrap ${getTabColor(scenario, activeTab === index)}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {getTabIcon(scenario)}
                  <span className="hidden sm:inline">{scenario.name}</span>
                  <span className="sm:hidden">{scenario.name.split(' ')[0]}</span>
                </motion.button>
              ))}
            </div>
          </div>
          {/* Subtle scroll indicator for mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden"></div>
        </div>
      </div>

      {/* Active Scenario Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-lg border-2 p-6 ${getScenarioCardStyle(activeScenario)}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              {getTabIcon(activeScenario)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{activeScenario.name} Scenario</h3>
              <p className="text-sm text-gray-600">{activeScenario.timeline}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProbabilityBadgeStyle(activeScenario)}`}>
            {activeScenario.probability}% Probability
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6 leading-relaxed">{activeScenario.description}</p>

        {/* Key Drivers */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Key Drivers</h4>
          <div className="flex flex-wrap gap-2">
            {activeScenario.keyDrivers?.map((driver: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200">
                {driver}
              </span>
            ))}
          </div>
        </div>

        {/* Outcomes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Positive Outcomes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h4 className="font-semibold text-gray-900">Positive Outcomes</h4>
            </div>
            <ul className="space-y-2">
              {activeScenario.outcomes.positive.map((outcome: string, idx: number) => (
                <motion.li
                  key={idx}
                  className="text-sm text-gray-700 flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <span className="text-green-600 mt-0.5">•</span>
                  {outcome}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Challenges & Risks */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <h4 className="font-semibold text-gray-900">Challenges & Risks</h4>
            </div>
            <ul className="space-y-2">
              {activeScenario.outcomes.negative.map((outcome: string, idx: number) => (
                <motion.li
                  key={idx}
                  className="text-sm text-gray-700 flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <span className="text-red-600 mt-0.5">•</span>
                  {outcome}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Signals to Watch Component
const SignalsTracking = ({ signals }: any) => {

  const getSignalIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology': return <Zap size={20} className="text-secondary-600" />;
      case 'social': return <UserCheck size={20} className="text-teal-500" />;
      case 'policy': return <Shield size={20} className="text-indigo-500" />;
      case 'market': return <TrendingUp size={20} className="text-orange-500" />;
      default: return <Eye size={20} className="text-gray-500" />;
    }
  };

  const getStrengthBadge = (strength: string, impact: string) => {
    const strengthColor = strength === 'Strong' ? 'bg-teal-500' :
      strength === 'Moderate' ? 'bg-secondary-500' : 'bg-gray-500';
    const impactColor = impact === 'High Impact' ? 'bg-primary-500' :
      impact === 'Medium Impact' ? 'bg-orange-500' : 'bg-gray-500';

    return (
      <div className="flex gap-2">
        <span className={`px-3 py-1 ${strengthColor} text-white rounded-full text-xs font-medium`}>
          {strength}
        </span>
        <span className={`px-3 py-1 ${impactColor} text-white rounded-full text-xs font-medium`}>
          {impact}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Eye size={20} className="text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Signals to Watch</h2>
          <p className="text-sm text-gray-600">Key indicators and emerging trends</p>
        </div>
      </div>

      <div className="space-y-4">
        {signals && signals.length > 0 ? signals.map((signal: any, index: number) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg">
                {getSignalIcon(signal.category)}
              </div>

              {/* Content */}
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{signal.title}</h3>
                    <span className="text-sm text-gray-600 font-medium">{signal.category}</span>
                  </div>
                  {getStrengthBadge(signal.strength, signal.impact)}
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{signal.description}</p>

                {/* Key Indicators */}
                {signal.keyIndicators && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Indicators:</h4>
                    <ul className="space-y-1">
                      {signal.keyIndicators.map((indicator: string, idx: number) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-700 flex items-start gap-2"
                        >
                          <span className="text-primary-600 mt-1">•</span>
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No signals data available</p>
          </div>
        )}

        {/* Monitoring Recommendation */}
        <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6 mt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Eye size={16} className="text-secondary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 mb-2">Monitoring Recommendation</h4>
              <p className="text-sm text-secondary-800 leading-relaxed">
                Organizations should establish dedicated monitoring systems for these signals, tracking changes in intensity and
                emergence of new patterns. Regular scenario planning exercises should incorporate signal analysis to maintain strategic
                agility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Author Card Component
const AuthorCard = ({ name, title, bio, avatarUrl, onLinkedInClick, onTwitterClick }: any) => (
  <motion.div
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex flex-col">
      {/* Avatar and Name/Title Row */}
      <div className="flex items-start gap-4 mb-6">
        <motion.img
          src={avatarUrl}
          alt={name}
          className="w-20 h-20 rounded-full object-cover flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          onError={(e) => {
            e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Stephane&backgroundColor=b6e3f4&clothesColor=262e33&eyebrowType=Default&eyeType=Default&facialHairColor=BrownDark&facialHairType=BeardMedium&hairColor=BrownDark&hatColor=Blue01&mouthType=Smile&skinColor=Brown&topType=NoHair";
          }}
        />

        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
          <p className="text-base text-gray-600">{title}</p>
        </div>
      </div>

      {/* Bio and Social Icons - Full Width Below */}
      <div>
        <p className="text-sm text-gray-700 leading-relaxed mb-6">{bio}</p>

        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLinkedInClick}
          >
            <Linkedin size={20} className="text-gray-600" />
          </motion.div>
          <motion.div
            className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTwitterClick}
          >
            <Twitter size={20} className="text-gray-600" />
          </motion.div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Related Analyses Component
const RelatedAnalyses = ({ analyses }: any) => {
  const navigate = useNavigate();

  const handleArticleClick = (articleId: string, articleTitle: string) => {
    navigate(`/coming-soon/article-${articleId}`, {
      state: {
        headline: 'Article Coming Soon',
        subText: `"${articleTitle}" will be available soon. Stay tuned for more insights!`,
        ctaText: 'Back to Prediction Analysis',
        ctaLink: '/marketplace/knowledge-hub/prediction-analysis'
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Analyses</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analyses.map((analysis: any, index: number) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => handleArticleClick(analysis.id, analysis.title)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Image Section with Space/Earth Background */}
            <div className="relative aspect-[4/3] overflow-hidden bg-black rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt={analysis.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
              />
            </div>

            {/* Content Section */}
            <div className="p-5">
              {/* Category Tags */}
              <div className="flex gap-4 mb-4">
                <span className="text-orange-600 text-sm font-medium bg-orange-50 px-2 py-1 rounded">
                  Prediction Analysis
                </span>
                <span className="text-gray-500 text-sm font-medium">
                  DTMI
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-3">
                {analysis.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {analysis.excerpt}
              </p>

              {/* Read Time */}
              <p className="text-gray-400 text-xs">{analysis.readTime}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const PredictionAnalysisDetail = () => {
  console.log('PredictionAnalysisDetail component is rendering');

  // Handler functions for CTA buttons
  const handleShare = async () => {
    const shareData = {
      title: predictionData.header.title,
      text: predictionData.header.subtitle,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
      }
    }
  };

  // Social media handler functions
  const handleLinkedInShare = () => {
    window.open('https://www.linkedin.com/in/stephaneniango', '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    window.open('https://x.com/drstephane_', '_blank', 'noopener,noreferrer');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(predictionData.header.title);
    const body = encodeURIComponent(`I thought you might find this interesting:\n\n${predictionData.header.title}\n${predictionData.header.subtitle}\n\n${window.location.href}`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };


  const handleSave = () => {
    // Save to localStorage for now (could be enhanced with user accounts later)
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    const articleData = {
      id: 'prediction-analysis-dco',
      title: predictionData.header.title,
      subtitle: predictionData.header.subtitle,
      url: window.location.href,
      savedAt: new Date().toISOString()
    };

    // Check if already saved
    const isAlreadySaved = savedArticles.some((article: any) => article.id === articleData.id);

    if (!isAlreadySaved) {
      savedArticles.push(articleData);
      localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
      alert('Article saved successfully!');
    } else {
      alert('Article is already saved!');
    }
  };

  const handleSubscribe = () => {
    // Simple email collection for newsletter subscription
    const email = prompt('Enter your email address to subscribe to our weekly insights:');

    if (email) {
      // Basic email validation using safe utility
      if (isValidEmail(email)) {
        // Store subscription in localStorage (could be enhanced with API call later)
        const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');

        // Check if already subscribed
        const isAlreadySubscribed = subscribers.some((sub: any) => sub.email === email);

        if (!isAlreadySubscribed) {
          const subscriptionData = {
            email: email,
            subscribedAt: new Date().toISOString(),
            source: 'prediction-analysis-detail',
            interests: ['digital-transformation', 'ai-trends', 'dco-insights']
          };

          subscribers.push(subscriptionData);
          localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
          alert('Thank you for subscribing! You will receive weekly insights on digital transformation trends.');
        } else {
          alert('This email is already subscribed to our newsletter.');
        }
      } else {
        alert('Please enter a valid email address.');
      }
    }
  };


  // Comprehensive prediction data
  const predictionData = {
    header: {
      title: "The Rise of Digital Cognitive Organizations: 2025-2030 Outlook",
      subtitle: "An in-depth analysis of how AI-driven cognitive architectures will reshape enterprise operations and decision-making frameworks",
      category: "Prediction Analysis",
      author: "Dr. Sarah Chen",
      publishDate: "January 15, 2025",
      readTime: "12 min",
    },
    visualSummary: {
      title: "DCO 2030 Executive Dashboard",
      subtitle: "Enterprise transformation metrics and forecasts at a glance",
      stats: [
        {
          icon: "users",
          value: "85%",
          label: "Fortune 500 Adoption",
          trend: "By 2030"
        },
        {
          icon: "dollar",
          value: "250%",
          label: "AI Efficiency Increase",
          trend: "All Sectors"
        },
        {
          icon: "target",
          value: "60%",
          label: "Workforce Augmented",
          trend: "By AI Systems"
        },
        {
          icon: "clock",
          value: "35%",
          label: "Cost Reduction",
          trend: "Via Automation"
        }
      ],
      keyTakeaway: "Digital Cognitive Organizations will become the standard for forward-thinking enterprises by 2030. Organizations operating with DCO frameworks will achieve remarkable efficiency, innovation, and agility—leading industries through data-driven decisions and seamless AI-human integration."
    },
    executiveSummary: {
      summary: "The emergence of Digital Cognitive Organizations (DCOs) is poised to dramatically reshape how businesses function by 2030. DCOs are organizations that integrate advanced digital platforms, AI, machine learning, and human expertise to create seamless, intelligent ecosystems for decision-making and operations. The shift from traditional models to these cognitive enterprises will not only impact organizational structures but also redefine roles, responsibilities, and the very nature of work itself. According to <a href='https://www.gartner.com/en/newsroom/press-releases/2025-10-20-gartner-survey-finds-all-it-work-will-involve-ai-by-2030-organizations-must-navigate-ai-readiness-and-human-readiness-to-find-capture-and-sustain-value?utm_source=chatgpt.com' target='_blank' rel='noopener noreferrer'>Gartner's AI Workload Forecast</a>, by 2030, 75% of work will be done by humans augmented with AI, and 25% will be fully automated by AI.",
      keyInsights: [
        "85% of Fortune 500 companies predicted to transition to full DCO models by 2030",
        "60% of employees will be augmented by AI, focusing on strategic and high-value activities",
        "250% increase in AI-driven operational efficiency across all sectors by 2030",
        "35% reduction in operational costs as a result of cognitive platforms and automation",
      ],
    },
    predictionMetrics: [
      {
        title: "Fortune 500 DCO Adoption",
        value: "85%",
        percentage: 85,
        trend: "up",
        description: "Companies transitioning to full DCO models by 2030"
      },
      {
        title: "Workforce AI Augmentation",
        value: "60%",
        percentage: 60,
        trend: "up",
        description: "Employees enhanced by AI for strategic activities"
      },
      {
        title: "Operational Efficiency Gain",
        value: "75%",
        percentage: 75,
        trend: "up",
        description: "Average improvement from AI-driven operations. <a href='https://www.gartner.com/en/newsroom/press-releases/2025-06-17-gartner-announces-top-data-and-analytics-predictions?utm_source=chatgpt.com' target='_blank' rel='noopener noreferrer'>Gartner's D&A predictions</a> forecast that 50% of business decisions will be augmented or automated by AI agents by 2027."
      },
      {
        title: "Cost Reduction",
        value: "35%",
        percentage: 35,
        trend: "warning",
        description: "Decrease in operational costs via cognitive automation"
      }
    ],
    timeline: [
      {
        year: "2025-2026",
        title: "Initial Adoption & Early Deployment",
        description: "Organizations begin integrating foundational digital platforms and AI capabilities. Companies focus on automation of routine tasks and data-driven decision-making.",
        milestones: [
          "AI integration accelerates in finance, healthcare, and manufacturing",
          "Initial DCO frameworks defined within organizations",
          "Foundational cognitive architecture development begins",
          "First wave of enterprise AI integration projects"
        ],
        adoptionRate: 25
      },
      {
        year: "2027-2028",
        title: "Widespread Integration & Workforce Transformation",
        description: "Full-scale deployment of DCOs within large enterprises. Human roles evolve, with cognitive agents handling administrative and operational tasks. <a href='https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai?utm_source=chatgpt.com' target='_blank' rel='noopener noreferrer'>McKinsey's AI adoption survey</a> indicates that 88% of organizations report using AI in at least one business function by 2027.",
        milestones: [
          "Significant workforce shift as AI takes strategic decision-making roles",
          "Seamless integration between AI systems and human teams",
          "Enhanced operational agility across industries",
          "Cognitive automation reaches mainstream enterprise adoption",
          "20% of organizational structures will be AI-augmented by 2028, according to <a href='https://www.gartner.com/en/newsroom/press-releases/2024-10-22-gartner-unveils-top-predictions-for-it-organizations-and-users-in-2025-and-beyond?utm_source=chatgpt.com' target='_blank' rel='noopener noreferrer'>Gartner's AI organizational transformation</a> forecast"
        ],
        adoptionRate: 60
      },
      {
        year: "2029-2030",
        title: "Optimization & Innovation",
        description: "DCOs reach peak performance, offering highly customized, predictive, and autonomous business processes. Organizations operate with minimal friction, driving innovation across industries.",
        milestones: [
          "AI-driven decision-making models become standard",
          "DCOs enable new personalized customer experiences",
          "Self-optimizing organizational systems go mainstream",
          "Full integration with IoT and edge computing platforms"
        ],
        adoptionRate: 85
      }
    ],
    scenarios: [
      {
        id: "optimistic",
        name: "Accelerated Adoption",
        probability: 30,
        description: "Rapid technological advancement combined with supportive regulatory environment and high organizational readiness creates ideal conditions for DCO adoption. AI capabilities exceed expectations, driving faster ROI and broader implementation.",
        timeline: "Full maturity by late 2028",
        keyDrivers: [
          "Breakthrough AI advances",
          "Supportive government policies",
          "Strong economic conditions",
          "High digital literacy",
          "Intense competitive pressure"
        ],
        outcomes: {
          positive: [
            "90%+ Fortune 500 adoption by 2028",
            "Average ROI exceeds 300% within 12 months",
            "Significant job creation in cognitive system management",
            "Dramatic improvements in decision quality and speed",
            "New business models and revenue streams emerge rapidly"
          ],
          negative: [
            "Widening gap between leaders and laggards",
            "Increased technology stack complexity",
            "Talent shortage due to higher skill requirements",
            "Potential over-reliance on automated systems"
          ]
        }
      },
      {
        id: "conservative",
        name: "Measured Progression",
        probability: 50,
        description: "Steady but measured adoption as organizations carefully evaluate DCO implementations. Progress limited by change management challenges, integration complexity, and cautious investment approaches.",
        timeline: "Mainstream adoption by 2030",
        keyDrivers: [
          "Incremental AI progress",
          "Mixed regulatory environment",
          "Moderate economic conditions",
          "Organizational inertia",
          "Risk averse corporate culture"
        ],
        outcomes: {
          positive: [
            "85% Fortune 500 adoption by 2030",
            "Stable 200% average ROI over 24 months",
            "Sustainable transformation pace",
            "Well-tested implementation methodologies",
            "Balanced risk approach reduces failures"
          ],
          negative: [
            "Slower competitive advantage realization",
            "Extended implementation timelines",
            "Higher opportunity costs from delayed adoption",
            "Market share loss to faster movers",
            "Talent migration to innovative competitors"
          ]
        }
      },
      {
        id: "disruptive",
        name: "Regulatory Resistance",
        probability: 20,
        description: "Major regulatory changes or ethical concerns fundamentally alter the adoption landscape. Delayed adoption due to concerns about AI autonomy, data privacy, and workforce displacement creates significant uncertainty.",
        timeline: "Mainstream adoption delayed to post-2032",
        keyDrivers: [
          "Stringent AI regulations",
          "Major cybersecurity incidents",
          "Economic volatility",
          "Public AI skepticism",
          "Workforce resistance movements"
        ],
        outcomes: {
          positive: [
            "More thoughtful implementation approaches emerge",
            "Stronger ethical AI frameworks developed",
            "Better safeguards for workforce transition",
            "Reduced risk of catastrophic AI failures"
          ],
          negative: [
            "Significant adoption delays across industries",
            "Competitive disadvantage vs. less regulated markets",
            "Higher implementation costs due to compliance",
            "Innovation stagnation in key sectors",
            "Talent exodus to more permissive jurisdictions",
            "Reduced global competitiveness"
          ]
        }
      }
    ],
    signals: [
      {
        title: "Advanced AI and Machine Learning Maturation",
        category: "Technology",
        strength: "Strong",
        impact: "High Impact",
        description: "Rapid advancement in AI technologies is driving the shift to DCOs. Organizations recognizing AI potential for intelligent operations and cognitive decision-making are accelerating adoption.",
        keyIndicators: [
          "Large language models achieving human-level reasoning in enterprise contexts",
          "Machine learning platforms offering no-code cognitive automation",
          "AI accuracy in strategic recommendations exceeding 90%",
          "Cognitive API ecosystems enabling rapid integration"
        ]
      },
      {
        title: "Data-Driven Culture Emergence",
        category: "Social",
        strength: "Strong",
        impact: "High Impact",
        description: "With the explosion of data, organizations need cognitive platforms enabling real-time analytics and decision-making. DCOs are at the forefront of data-centric operations.",
        keyIndicators: [
          "Real-time analytics adoption increasing 50% year-over-year",
          "Data literacy programs mandatory in 40% of Fortune 500",
          "Chief Data Officer roles becoming standard C-suite positions",
          "Data-driven KPIs replacing traditional metrics across industries"
        ]
      },
      {
        title: "Workforce Transformation Acceleration",
        category: "Social",
        strength: "Moderate",
        impact: "High Impact",
        description: "As DCOs automate routine tasks, organizations need higher-level cognitive roles. Organizations must reskill workforces to meet new model demands.",
        keyIndicators: [
          "Corporate reskilling budgets increased 130% since 2022",
          "Universities launching AI augmented work programs",
          "Hybrid human-AI teams emerging in leading organizations",
          "New job categories focused on AI collaboration growing 200%+"
        ]
      },
      {
        title: "Regulatory Framework Development",
        category: "Policy",
        strength: "Moderate",
        impact: "Medium Impact",
        description: "Governments and regulatory bodies playing critical roles in ensuring ethical AI use. These regulations encourage transparent, explainable AI models, pushing DCO adoption forward.",
        keyIndicators: [
          "EU AI Act implementation affecting enterprise AI governance",
          "Industry self-regulation standards emerging globally",
          "AI audit and compliance roles becoming mandated",
          "Increased emphasis on AI decision liability frameworks"
        ]
      },
      {
        title: "Cognitive Platform Investment Surge",
        category: "Market",
        strength: "Strong",
        impact: "High Impact",
        description: "Massive capital flowing into cognitive enterprise platforms, with major technology providers and startups competing to define the DCO infrastructure landscape.",
        keyIndicators: [
          "Venture capital for cognitive enterprise solutions exceeding $25B annually",
          "Major cloud providers launching integrated DCO platform suites",
          "M&A activity consolidating cognitive technology market",
          "Enterprise cognitive platform revenue growing 85%+ annually"
        ]
      }
    ],
    author: {
      name: "Dr. Stephane Niango",
      title: "DTMI Head of Research",
      bio: "Dr. Niango is the Chief Architect of the Digital Cognitive Organization (DCO) Framework and founder of DigitalQatalyst. His pioneering work on digital transformation and DCO model architecture has revolutionized how organizations approach cognitive enterprise solutions and AI-driven business transformation.",
      avatarUrl: "/images/dr-niango.png",
    },
    relatedAnalyses: [
      {
        id: "1",
        title: "AI-Powered Decision Intelligence: The Next Frontier",
        category: "Technology Trends",
        readTime: "10 min",
        excerpt: "Exploring how artificial intelligence is revolutionizing enterprise decision-making processes and creating new competitive advantages.",
      },
      {
        id: "2",
        title: "Quantifying the ROI of Digital Transformation",
        category: "Case Study",
        readTime: "8 min",
        excerpt: "A comprehensive analysis of 50+ digital transformation initiatives and their measurable business outcomes.",
      },
      {
        id: "3",
        title: "Building Resilient Cognitive Systems",
        category: "Technical Deep Dive",
        readTime: "15 min",
        excerpt: "Best practices for architecting cognitive systems that scale with organizational growth and adapt to changing requirements.",
      },
    ],
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
        {/* Background Image Container - Fixed at original height */}
        <div className="absolute top-0 left-0 w-full h-[600px]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/images/prediction-hero.jpg)',
              imageRendering: 'crisp-edges',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          />

          {/* Gradient Fade Overlay - seamless blend to white background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% via-white/60 via-60% to-white to-90%" />
        </div>

        {/* Content Container - Positioned lower with 35vh top margin */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-[25vh] md:pt-[35vh] pb-12 md:pb-20">
          <div className="max-w-5xl">
            {/* Category Badge */}
            <motion.div
              className="mb-5"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="inline-block px-4 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
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
              The Road to 2030: How Digital Cognitive Organizations Will Redefine Enterprise Structures
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-sm sm:text-base md:text-lg text-gray-500 mb-5 leading-relaxed max-w-3xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              A comprehensive forecast exploring the evolution of DCOs, key drivers, adoption rates, and the challenges businesses will face in this transformative journey
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
                <span>Dr. Stephane Niango</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>December 10, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>15 min read</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-3 no-print"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-700 transition-all duration-300 min-h-[44px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
              >
                <Share2 size={16} />
                Share
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pb-12">
        <div className="w-full">
          {/* Visual Executive Summary */}
          <VisualExecutiveSummary {...predictionData.visualSummary} />

          {/* Introduction Paragraph */}
          {predictionData.introduction && (
            <motion.div
              className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">{predictionData.introduction}</p>
              </div>
            </motion.div>
          )}

          {/* Traditional Executive Summary */}
          <ExecutiveSummary {...predictionData.executiveSummary} />

          {/* Evolution Timeline */}
          <PredictionTimeline phases={predictionData.timeline} />

          {/* Prediction Metrics and Author Section - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Prediction Metrics - Takes 2/3 of the width */}
            <div className="lg:col-span-2">
              <PredictionMetrics metrics={predictionData.predictionMetrics} />
            </div>

            {/* Author Section - Takes 1/3 of the width */}
            <div className="space-y-8">
              <AuthorCard
                {...predictionData.author}
                onLinkedInClick={handleLinkedInShare}
                onTwitterClick={handleTwitterShare}
              />

              {/* Newsletter CTA */}

              <motion.div
                className="bg-gradient-to-br from-primary-600 to-purple-600 text-white p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02, boxShadow: "0 15px 30px rgba(0,0,0,0.2)" }}
              >
                <h3 className="font-bold text-xl mb-2">Stay Updated</h3>
                <p className="text-sm mb-4 text-white/90">
                  Get weekly insights on digital transformation trends delivered to your inbox.
                </p>
                <motion.button
                  className="w-full bg-white text-primary-600 font-semibold py-2 px-4 rounded-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleSubscribe}
                >
                  Subscribe Now
                </motion.button>
              </motion.div>

            </div >
          </div >

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Scenario Analysis */}
              <ScenarioAnalysis scenarios={predictionData.scenarios} />

              {/* Signals Tracking */}
              <SignalsTracking signals={predictionData.signals} />

              {/* Key Drivers of DCO Adoption */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Drivers of DCO Adoption</h2>
                <div className="space-y-8">
                  {/* Introduction */}
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      Advanced AI and Machine Learning stand at the forefront of DCO transformation. The rapid advancement in AI
                      technologies is driving the shift to cognitive organizations. As organizations recognize the potential of AI to streamline
                      operations, optimize decision-making, and improve customer experiences, adoption rates will skyrocket. Modern AI
                      systems don't merely process data—they understand context, learn from outcomes, and continuously optimize
                      organizational responses.
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      A Data-Driven Culture has become essential for competitive advantage. With the explosion of data, organizations need
                      cognitive platforms that allow for real-time analytics and decision-making. DCOs will be at the forefront of enabling
                      data-centric operations, ensuring that business strategies are informed by actionable insights rather than intuition
                      alone.
                    </p>
                  </div>

                  {/* Workforce Transformation */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Workforce Transformation</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      As DCOs automate more routine tasks, employees will shift toward roles that require higher-level cognitive abilities,
                      such as problem-solving, strategic thinking, and creative decision-making. Organizations will need to retrain their
                      workforce to meet the demands of this new model. This represents a fundamental reimagining of the employee value
                      proposition.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      The most successful organizations will be those that view AI augmentation as a partnership rather than a replacement
                      strategy. Early adopters are already reporting dramatic improvements in employee satisfaction as routine cognitive
                      burdens are lifted, allowing human workers to focus on the strategic and interpersonal work that drives genuine value
                      creation.
                    </p>
                  </div>

                  {/* Implementation Strategies */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Implementation Strategies and Best Practices</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Starting with a Pilot Program is essential for successful DCO adoption. Early adopters should begin by automating
                      specific processes, such as data entry, customer service, or inventory management. This allows businesses to test the
                      integration of AI and digital platforms on a smaller scale before full-scale deployment, reducing risk while building
                      organizational capability.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Investing in AI Talent becomes critical as cognitive systems become integral to business operations. Organizations
                      must invest in upskilling their workforce, collaborating with educational institutions to create specialized training
                      programs for AI and machine learning skills. Additionally, fostering a Data-Centric Culture and establishing robust data
                      governance frameworks will provide the foundation needed for AI to deliver actionable insights.
                    </p>
                  </div>

                  {/* Challenges and Risk Mitigation */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Challenges and Risk Mitigation</h3>
                    <p
                      className="text-gray-700 leading-relaxed mb-4"
                      dangerouslySetInnerHTML={{
                        __html: "Data Privacy and Security remain paramount concerns as organizations adopt cognitive technologies. Businesses must invest in advanced cybersecurity measures and adhere to international data protection regulations to avoid breaches and loss of trust. The rise of AI decision-making also brings concerns regarding accountability—DCOs must ensure their AI systems are explainable and transparent. <a href='https://arxiv.org/abs/2502.15870?utm_source=chatgpt.com' target='_blank' rel='noopener noreferrer'>Academic research on AI accountability</a> indicates that 30% of AI initiatives fail due to lack of transparency, specifically in the context of AI decision-making and ethical concerns."
                      }}
                    />
                    <p className="text-gray-700 leading-relaxed">
                      Organizational Resistance represents one of the major barriers to DCO adoption. To mitigate this risk, businesses
                      should engage in comprehensive change management initiatives that promote understanding and acceptance of
                      cognitive transformation. While implementation requires significant upfront investment, the long-term cost savings in
                      operational efficiency and innovation will justify these expenses. Businesses should view this investment as a strategic
                      move for long-term competitiveness.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty Sidebar for this section */}
            <div className="space-y-8">
              {/* This space can be used for additional content if needed */}
            </div>
          </div>

                  </div >
      </main >

      <Footer isLoggedIn={false} />
    </div >
  );
};

export default PredictionAnalysisDetail;
