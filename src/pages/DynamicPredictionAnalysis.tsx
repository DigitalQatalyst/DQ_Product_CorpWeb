import { Calendar, Clock, User, TrendingUp, Target, DollarSign, Users, Mail, Linkedin, Twitter, Share2, Download, Lightbulb, BarChart3, AlertCircle, Zap, UserCheck, Shield, Eye, Bookmark, Check } from 'lucide-react';
import { motion, useInView, useAnimation } from 'framer-motion';
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { NewsletterSubscription } from '../components/NewsletterSubscription';
import { blogService } from '../admin-ui/utils/supabase';
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

// Utility function to strip HTML tags if content is not meant to have HTML
const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  // If the content contains HTML tags that should be rendered, return as-is
  // If it contains HTML tags that should be stripped (like <p> tags in plain text), strip them
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

// Utility function to check if content should be rendered as HTML
const shouldRenderAsHtml = (content: string): boolean => {
  if (!content) return false;
  // Check if content has meaningful HTML tags (not just <p> wrappers)
  const hasComplexHtml = /<(?!\/?(p|br\s*\/?)>)[a-z][\s\S]*>/i.test(content);
  return hasComplexHtml;
};

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
      className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-700 rounded-xl shadow-lg p-6 md:p-8 mb-12 mx-auto"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-secondary-100">{subtitle}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats && Array.isArray(stats) && stats.map((stat: any, index: number) => {
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
    className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-12"
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
      dangerouslySetInnerHTML={{ 
        __html: shouldRenderAsHtml(summary) ? summary : summary.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
      }}
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
    <div className="space-y-4">
      {keyInsights && Array.isArray(keyInsights) && keyInsights.map((insight: string, index: number) => (
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
      className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-12"
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
          {phases && Array.isArray(phases) && phases.map((phase: any, index: number) => (
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
                      <span className="font-medium">{phase.adoptionRate || '0'}% Adoption</span>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{phase.title}</h3>
                  <p
                    className="text-gray-700 mb-4 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: phase.description }}
                  ></p>

                  {/* Key Milestones */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">🎯 Key Milestones:</h4>
                    <div className="space-y-2">
                      {phase.milestones && Array.isArray(phase.milestones) && phase.milestones.map((milestone: string, idx: number) => (
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
                      <span>{phase.adoptionRate || '0'}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${phase.adoptionRate || 0}%` }}
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
        staggerChildren: 0.1
      }
    }
  };

  const metricVariants = {
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
      className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-12"
      initial="hidden"
      animate={controls}
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
          <p className="text-sm text-gray-600">Key performance indicators and forecasts</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics && Array.isArray(metrics) && metrics.map((metric: any, index: number) => (
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
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{metric.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                  <div className="flex items-center">
                    {metric.trend === 'positive' ? (
                      <TrendingUp size={16} className="text-teal-500" />
                    ) : metric.trend === 'negative' ? (
                      <AlertCircle size={16} className="text-orange-500" />
                    ) : (
                      <TrendingUp size={16} className="text-teal-500" />
                    )}
                  </div>
                </div>
              </div>
              <div className={`p-2 rounded-lg ${
                metric.trend === 'positive' ? 'bg-green-100 text-green-600' :
                metric.trend === 'negative' ? 'bg-red-100 text-red-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                <TrendingUp size={20} />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${metric.trend === 'negative'
                    ? 'bg-gradient-to-r from-teal-500 to-orange-400'
                    : 'bg-gradient-to-r from-teal-500 to-teal-400'
                    }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.percentage || 75}%` }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    duration: 1,
                    ease: "easeOut"
                  }}
                />
              </div>
            </div>

            <p
              className={`text-sm leading-relaxed ${metric.trend === 'negative' ? 'text-orange-600' : 'text-teal-600'
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
  useEffect(() => {
    const activeTabElement = document.querySelector(`[data-tab-index="${activeTab}"]`);
    if (activeTabElement) {
      activeTabElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeTab]);

  const getTabColor = (index: number) => {
    if (index === activeTab) return 'bg-primary-600 text-white';
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  const getBadgeColor = (probability: string) => {
    const prob = parseInt(probability);
    if (prob >= 70) return 'bg-green-500 text-white';
    if (prob >= 40) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  const activeScenario = scenarios[activeTab];

  return (
    <motion.div
      className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Target size={20} className="text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Scenario Analysis</h2>
          <p className="text-sm text-gray-600">Potential future outcomes and their implications</p>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg min-w-max">
            {scenarios && Array.isArray(scenarios) && scenarios.map((scenario: any, index: number) => (
              <motion.button
                key={index}
                data-tab-index={index}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${getTabColor(index)}`}
                onClick={() => setActiveTab(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {scenario.name}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{activeScenario.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(activeScenario.probability)}`}>
                      {activeScenario.probability} Probability
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activeScenario.impact === 'High' ? 'bg-red-100 text-red-700' :
                      activeScenario.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {activeScenario.impact} Impact
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">{activeScenario.description}</p>

              {activeScenario.keyDrivers && Array.isArray(activeScenario.keyDrivers) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Drivers:</h4>
                  <ul className="space-y-1">
                    {activeScenario.keyDrivers.map((driver: string, idx: number) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="text-primary-600 mt-1">•</span>
                        {driver}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeScenario.outcomes && Array.isArray(activeScenario.outcomes) && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Expected Outcomes:</h4>
                  <ul className="space-y-1">
                    {activeScenario.outcomes.map((outcome: string, idx: number) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="text-primary-600 mt-1">•</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
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
    <motion.div
      className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
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
  {signals && Array.isArray(signals) && signals.length > 0 ? (
    signals.map((signal: any, index: number) => (
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
              {getStrengthBadge(signal.strength || signal.status, signal.impact)}
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">{signal.description}</p>

            {/* Key Indicators */}
            {signal.keyIndicators && Array.isArray(signal.keyIndicators) && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Indicators:</h4>
                <ul className="space-y-1">
                  {signal.keyIndicators.map((indicator: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
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
    ))
  ) : (
    <div className="text-center py-8">
      <p className="text-gray-500">No signals data available</p>
    </div>
  )}

  {/* Monitoring Recommendation (unchanged) */}
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
    </motion.div>
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

      {/* Bio */}
      <p className="text-gray-700 leading-relaxed mb-6">{bio}</p>

      {/* Social Links */}
      <div className="flex gap-3">
        <button
          onClick={onLinkedInClick}
          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Linkedin size={18} />
        </button>
        <button
          onClick={onTwitterClick}
          className="p-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors"
        >
          <Twitter size={18} />
        </button>
      </div>
    </div>
  </motion.div>
);

// Dynamic Prediction Analysis Component
const DynamicPredictionAnalysis: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  
  // State for marketplace item data
  const [itemData, setItemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for prediction analysis data
  const [predictionData, setPredictionData] = useState({
    visualSummary: {
      title: '',
      subtitle: '',
      stats: [
        { icon: 'users', value: '', label: '', trend: '' },
        { icon: 'dollar', value: '', label: '', trend: '' },
        { icon: 'target', value: '', label: '', trend: '' },
        { icon: 'clock', value: '', label: '', trend: '' }
      ],
      keyTakeaway: ''
    },
    executiveSummary: {
      summary: '',
      keyInsights: ['']
    },
    predictionMetrics: [
      { title: '', value: '', description: '', trend: 'positive' }
    ],
    timeline: [
      { year: '', title: '', description: '' }
    ],
    scenarios: [
      { id: 'optimistic', name: 'Optimistic', probability: '', description: '', impact: '' },
      { id: 'realistic', name: 'Realistic', probability: '', description: '', impact: '' },
      { id: 'conservative', name: 'Conservative', probability: '', description: '', impact: '' }
    ],
    signals: [
      { title: '', status: '', description: '' }
    ],
    relatedAnalyses: [
      { title: '', category: '', readTime: '', excerpt: '' }
    ],
    detailedSections: [
      { title: '', content: '' }
    ]
  });

  // Handler functions for CTA buttons
  const handleShare = async () => {
    const shareData = {
      title: itemData?.title || "Prediction Analysis",
      text: itemData?.description || "Comprehensive prediction analysis",
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
    const subject = encodeURIComponent(itemData?.title || "Prediction Analysis");
    const body = encodeURIComponent(`I thought you might find this interesting:

${itemData?.title}
${itemData?.description}

${window.location.href}`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const handleSave = () => {
    // Save to localStorage for now (could be enhanced with user accounts later)
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    const articleData = {
      id: itemId || 'prediction-analysis-dynamic',
      title: itemData?.title || "Prediction Analysis",
      subtitle: itemData?.description || "",
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

  // Fetch item data from Supabase or localStorage (fallback)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let blogData = null;
        
        // First try to fetch from Supabase using itemId
        if (itemId) {
          try {
            blogData = await blogService.getBlogById(itemId);
            console.log('Successfully fetched blog data from Supabase:', blogData);
            
            // Validate that fetched data is a prediction analysis
            if (blogData && 'type' in blogData && blogData.type !== 'prediction-analysis') {
              console.warn('Fetched item is not a prediction analysis, type:', (blogData as any).type);
              // Don't use invalid data, continue to fallback
              blogData = null;
            }
          } catch (supabaseError: any) {
            console.warn('Failed to fetch from Supabase, trying localStorage:', supabaseError);
            // Check if it's a 404 or specific error
            if (supabaseError && supabaseError.message && supabaseError.message.includes('not found')) {
              setError('Prediction analysis not found. It may have been deleted or moved.');
              return;
            }
          }
        }
        
        // Fallback to localStorage if Supabase fails
        if (!blogData) {
          const marketplaceState = JSON.parse(localStorage.getItem('marketplacePredictionState') || '{}');
          if (marketplaceState && marketplaceState.item) {
            blogData = marketplaceState.item;
            console.log('Using localStorage data as fallback');
          }
        }
        
        if (blogData) {
          setItemData(blogData);
          
          // Parse content if it's a prediction analysis with structured data
          if (blogData.type === 'prediction-analysis' && blogData.content) {
            try {
              const parsedContent = typeof blogData.content === 'string' 
                ? JSON.parse(blogData.content) 
                : blogData.content;
              
              // Validate parsed content structure
              if (!parsedContent || typeof parsedContent !== 'object') {
                console.warn('Invalid content structure for prediction analysis');
                return;
              }
              
              // Update predictionData with parsed content
              if (parsedContent.visualSummary) {
                setPredictionData(prev => ({
                  ...prev,
                  visualSummary: parsedContent.visualSummary || prev.visualSummary,
                  executiveSummary: parsedContent.executiveSummary || prev.executiveSummary,
                  predictionMetrics: parsedContent.predictionMetrics || prev.predictionMetrics,
                  timeline: parsedContent.timeline || prev.timeline,
                  scenarios: parsedContent.scenarios || prev.scenarios,
                  signals: parsedContent.signals || prev.signals,
                  relatedAnalyses: parsedContent.relatedAnalyses || prev.relatedAnalyses,
                  detailedSections: parsedContent.detailedSections || prev.detailedSections
                }));
              } else {
                console.warn('Missing visualSummary in parsed content, using defaults');
              }
            } catch (parseError) {
              console.error('Failed to parse prediction analysis content:', parseError);
              setError('Failed to parse prediction analysis content. The data may be corrupted.');
            }
          } else if (blogData && 'type' in blogData && blogData.type !== 'prediction-analysis') {
            setError('This content is not a prediction analysis.');
          } else {
            console.warn('No content found for prediction analysis');
          }
        } else {
          // Final fallback data structure
          setItemData({
            title: decodeURIComponent(itemId || 'Prediction Analysis'),
            description: 'Comprehensive analysis of future trends and predictions',
            author: { name: 'Dr. Stephane Niango' },
            publishDate: new Date().toISOString(),
            readTime: 15,
            imageUrl: '/images/prediction-hero.jpg',
            provider: { name: 'Digital Business Platform' }
          });
        }
      } catch (err) {
        setError('Failed to load prediction analysis data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId]);

  // Generate dynamic content based on item data and predictionData state
  const predictionData_display = {
    header: {
      title: itemData?.title || "Prediction Analysis",
      subtitle: itemData?.description || "Comprehensive market analysis and future predictions",
      category: "Prediction Analysis",
      author: itemData?.author?.name || itemData?.provider?.name || "Unknown Author",
      publishDate: itemData?.publishDate ? new Date(itemData.publishDate).toLocaleDateString() : new Date().toLocaleDateString(),
      readTime: itemData?.readTime ? `${itemData.readTime} min` : "15 min"
    },
    visualSummary: {
      title: predictionData.visualSummary.title || "Key Metrics",
      subtitle: predictionData.visualSummary.subtitle || "Important data points and forecasts",
      stats: predictionData.visualSummary.stats.map(stat => ({
        icon: stat.icon || "trending-up",
        value: stat.value || "75%",
        label: stat.label || "Metric",
        trend: stat.trend || "Projected Growth"
      })),
      keyTakeaway: predictionData.visualSummary.keyTakeaway || itemData?.description || "This analysis provides comprehensive insights into market trends and future predictions to help guide strategic decision-making."
    },
    executiveSummary: {
      summary: predictionData.executiveSummary.summary || itemData?.description || "This comprehensive analysis examines key market trends and provides actionable predictions for future decision-making. The data-driven insights help organizations prepare for upcoming challenges and opportunities.",
      keyInsights: predictionData.executiveSummary.keyInsights.filter(insight => insight.trim()).length > 0 
        ? predictionData.executiveSummary.keyInsights.filter(insight => insight.trim())
        : [
          "Market trends indicate significant growth opportunities",
          "Technology adoption is accelerating across all sectors",
          "Strategic planning based on these predictions yields better results",
          "Early adopters gain competitive advantages"
        ]
    },
    predictionMetrics: predictionData.predictionMetrics && Array.isArray(predictionData.predictionMetrics) && predictionData.predictionMetrics.length > 0 && predictionData.predictionMetrics[0].title
      ? predictionData.predictionMetrics
      : [
        {
          title: "Adoption Rate",
          value: "75%",
          description: "Projected market adoption by 2030",
          trend: "positive"
        },
        {
          title: "Market Size",
          value: "$2.5T",
          description: "Estimated market value by 2030",
          trend: "positive"
        },
        {
          title: "ROI",
          value: "200%",
          description: "Expected return on investment",
          trend: "positive"
        },
        {
          title: "Timeline",
          value: "12-18 months",
          description: "Implementation timeframe",
          trend: "neutral"
        }
      ],
    timeline: predictionData.timeline && Array.isArray(predictionData.timeline) && predictionData.timeline.length > 0 && predictionData.timeline[0].year
      ? predictionData.timeline
      : [
        {
          year: "2025",
          title: "Current State",
          description: "Establishing baseline and initial adoption"
        },
        {
          year: "2026-2027",
          title: "Growth Phase",
          description: "Accelerated adoption and market expansion"
        },
        {
          year: "2028-2029",
          title: "Maturity",
          description: "Market stabilization and optimization"
        },
        {
          year: "2030",
          title: "Future Outlook",
          description: "Full market integration and new opportunities"
        }
      ],
    scenarios: predictionData.scenarios && Array.isArray(predictionData.scenarios) && predictionData.scenarios.length > 0 && predictionData.scenarios[0].description
      ? predictionData.scenarios
      : [
        {
          id: "optimistic",
          title: "Optimistic Scenario",
          description: "Maximum adoption with strong market conditions",
          probability: "30%",
          impact: "High"
        },
        {
          id: "realistic",
          title: "Realistic Scenario",
          description: "Moderate adoption with balanced conditions",
          probability: "50%",
          impact: "Medium"
        },
        {
          id: "conservative",
          title: "Conservative Scenario",
          description: "Cautious adoption with challenging conditions",
          probability: "20%",
          impact: "Low"
        }
      ],
    signals: predictionData.signals && Array.isArray(predictionData.signals) && predictionData.signals.length > 0 && predictionData.signals[0].title
      ? predictionData.signals
      : [
        {
          title: "Technology Maturity",
          status: "positive",
          description: "Technology readiness indicates strong adoption potential"
        },
        {
          title: "Market Demand",
          status: "positive",
          description: "Increasing demand from various sectors"
        },
        {
          title: "Regulatory Environment",
          status: "neutral",
          description: "Regulatory frameworks are evolving to support adoption"
        }
      ],
    author: {
      name: itemData?.author?.name || itemData?.provider?.name || "Expert Analyst",
      title: "Senior Prediction Analyst",
      bio: "Leading expert in market analysis and future trend predictions",
      avatarUrl: itemData?.author?.avatar || "/images/default-avatar.png"
    },
    relatedAnalyses: [
      {
        id: "1",
        title: "Market Trend Analysis 2025",
        category: "Related Analysis",
        readTime: "10 min",
        excerpt: "Comprehensive overview of current market trends and their implications."
      },
      {
        id: "2",
        title: "Technology Adoption Forecast",
        category: "Forecast Report",
        readTime: "12 min",
        excerpt: "Detailed predictions about technology adoption patterns across industries."
      }
    ],
    detailedSections: predictionData.detailedSections && Array.isArray(predictionData.detailedSections) && predictionData.detailedSections.length > 0 && predictionData.detailedSections[0].title
      ? predictionData.detailedSections
      : [
        {
          title: "Strategic Implementation",
          content: "<p>Successful implementation requires a structured approach that aligns with organizational goals and capabilities. Organizations should begin by conducting a comprehensive assessment of their current state and identifying key areas where these predictions can inform strategic decisions.</p><p>The implementation process should be phased, starting with pilot programs that allow for testing and refinement before full-scale deployment. This approach minimizes risk while building organizational confidence and capability.</p>"
        },
        {
          title: "Risk Assessment and Mitigation",
          content: "<p>While the predictions presented are based on comprehensive analysis, organizations must consider potential risks and develop mitigation strategies. Key risks include market volatility, technological disruptions, and regulatory changes that could impact outcomes.</p><p>Proactive risk management involves continuous monitoring, scenario planning, and maintaining flexibility in strategic approaches. Organizations that embed risk considerations into their planning processes are better positioned to navigate uncertainties and capitalize on emerging opportunities.</p>"
        },
        {
          title: "Performance Metrics and KPIs",
          content: "<p>Measuring success requires clearly defined metrics that align with the predictions and organizational objectives. Key performance indicators should be established for each phase of implementation, with regular reviews to assess progress and adjust strategies as needed.</p><p>Effective measurement systems combine leading indicators that provide early warning signals with lagging indicators that confirm outcomes. This balanced approach enables organizations to course-correct in real-time while building a comprehensive understanding of prediction accuracy and implementation effectiveness.</p>"
        }
      ]
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Content</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/marketplace/dtmi')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

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
              backgroundImage: `url(${itemData?.heroImage || '/images/prediction-hero.jpg'})`,
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
              {predictionData_display.header.title}
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              className="text-sm sm:text-base md:text-lg text-gray-500 mb-5 leading-relaxed max-w-3xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {predictionData_display.header.subtitle}
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
                <span>{predictionData_display.header.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{predictionData_display.header.publishDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{predictionData_display.header.readTime}</span>
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
              
              <motion.button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300 hover:bg-gray-50 transition-all duration-300 min-h-[44px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
              >
                <Bookmark size={16} />
                Save
              </motion.button>
              
              <div className="flex gap-2">
                <motion.button
                  className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLinkedInShare}
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin size={18} />
                </motion.button>
                
                <motion.button
                  className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleTwitterShare}
                  aria-label="Share on Twitter"
                >
                  <Twitter size={18} />
                </motion.button>
                
                <motion.button
                  className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleEmailShare}
                  aria-label="Share via Email"
                >
                  <Mail size={18} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pb-12">
        <div className="w-full">
          {/* Visual Executive Summary */}
          <VisualExecutiveSummary {...predictionData_display.visualSummary} />
          
          {/* Traditional Executive Summary */}
          <ExecutiveSummary {...predictionData_display.executiveSummary} />
          
          {/* Evolution Timeline */}
          <PredictionTimeline phases={predictionData_display.timeline} />
          
          {/* Prediction Metrics and Author Section - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Prediction Metrics - Takes 2/3 of the width */}
            <div className="lg:col-span-2">
              <PredictionMetrics metrics={predictionData_display.predictionMetrics} />
            </div>

            {/* Author Section - Takes 1/3 of the width */}
            <div className="space-y-8">
              <AuthorCard 
                name={predictionData_display.author.name}
                title={predictionData_display.author.title}
                bio={predictionData_display.author.bio}
                avatarUrl={predictionData_display.author.avatarUrl}
                onLinkedInClick={() => window.open('https://www.linkedin.com/in/stephaneniango', '_blank')}
                onTwitterClick={() => window.open('https://x.com/drstephane_', '_blank')}
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
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Scenario Analysis */}
              <ScenarioAnalysis scenarios={predictionData_display.scenarios} />

              {/* Signals Tracking */}
              <SignalsTracking signals={predictionData_display.signals} />
            </div>
          </div>
          
          {/* Additional Content Sections */}
          {predictionData_display.detailedSections && Array.isArray(predictionData_display.detailedSections) && predictionData_display.detailedSections.map((section: any, index: number) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
              <div className="prose max-w-none">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            </div>
          ))}

          {/* Default Analysis Details if no detailed sections */}
          {(!predictionData_display.detailedSections || predictionData_display.detailedSections.length === 0) && (
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Details</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  This prediction analysis provides comprehensive insights based on current market data and trends. 
                  The findings are designed to help organizations make informed decisions about future investments 
                  and strategic planning.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  The data presented reflects industry research, expert consultations, and market analysis conducted 
                  over the past quarter. All projections are based on current conditions and may vary based on 
                  external factors and market changes.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Organizations should consider these insights as part of their broader strategic planning process, 
                  incorporating them with their specific industry knowledge and market position. Regular reviews 
                  and updates to these predictions are recommended as market conditions evolve.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  For more detailed analysis or specific implementation guidance, consider consulting with our 
                  research team or exploring related analyses in this domain. The interconnected nature of 
                  digital transformation means that changes in one area often have cascading effects across 
                  multiple business functions.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default DynamicPredictionAnalysis;