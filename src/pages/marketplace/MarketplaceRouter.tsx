import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MarketplacePage } from '../../components/marketplace/MarketplacePage';
import { SimpleMarketplacePage } from '../../components/marketplace/SimpleMarketplacePage';
import MarketplaceDetailsPage from './MarketplaceDetailsPage';
import ServiceDetailPage from './ServiceDetailPage';
import PredictionAnalysisDetail from '../PredictionAnalysisDetail';
import ContentGovernancePrediction from '../ContentGovernancePrediction';
import AIDecisionMakingPrediction from '../AIDecisionMakingPrediction';
import CognitiveEnterprisesPrediction from '../CognitiveEnterprisesPrediction';
import DynamicPredictionAnalysis from '../DynamicPredictionAnalysis';

import { DollarSign, Briefcase, Calendar, BookOpen } from 'lucide-react';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig';
// Promo cards for courses marketplac

// new chatbot
const coursePromoCards = [{
  id: 'finance-promo',
  title: 'Looking for funding?',
  description: 'Explore financial opportunities and resources to grow your business.',
  icon: <DollarSign size={24} className="text-white" />,
  path: '/marketplace/financial',
  gradientFrom: 'from-blue-600',
  gradientTo: 'to-indigo-700'
}, {
  id: 'advisory-promo',
  title: 'Need expert advice?',
  description: 'Connect with industry experts and get personalized guidance.',
  icon: <Briefcase size={24} className="text-white" />,
  path: '/marketplace/non-financial',
  gradientFrom: 'from-purple-600',
  gradientTo: 'to-primary-500'
}];
// Promo cards for financial services marketplace
// added
const financialPromoCards = [{
  id: 'courses-promo',
  title: 'Improve your skills',
  description: 'Discover courses to enhance your financial knowledge.',
  icon: <Calendar size={24} className="text-white" />,
  path: '/marketplace/courses',
  gradientFrom: 'from-green-500',
  gradientTo: 'to-teal-400'
}, {
  id: 'advisory-promo',
  title: 'Need expert advice?',
  description: 'Connect with industry experts and get personalized guidance.',
  icon: <Briefcase size={24} className="text-white" />,
  path: '/marketplace/non-financial',
  gradientFrom: 'from-purple-600',
  gradientTo: 'to-primary-500'
}];
// Promo cards for non-financial services marketplace
const nonFinancialPromoCards = [{
  id: 'courses-promo',
  title: 'Improve your skills',
  description: 'Discover courses to enhance your business knowledge.',
  icon: <Calendar size={24} className="text-white" />,
  path: '/marketplace/courses',
  gradientFrom: 'from-green-500',
  gradientTo: 'to-teal-400'
}, {
  id: 'finance-promo',
  title: 'Looking for funding?',
  description: 'Explore financial opportunities and resources to grow your business.',
  icon: <DollarSign size={24} className="text-white" />,
  path: '/marketplace/financial',
  gradientFrom: 'from-blue-600',
  gradientTo: 'to-indigo-700'
}];
// Promo cards for DTMI marketplace
const dtmiPromoCards = [{
  id: 'courses-promo',
  title: 'Enhance your skills',
  description: 'Discover courses to develop your business capabilities.',
  icon: <BookOpen size={24} className="text-white" />,
  path: '/marketplace/courses',
  gradientFrom: 'from-green-500',
  gradientTo: 'to-teal-400'
}, {
  id: 'finance-promo',
  title: 'Explore funding options',
  description: 'Find financial services to support your business growth.',
  icon: <DollarSign size={24} className="text-white" />,
  path: '/marketplace/financial',
  gradientFrom: 'from-blue-600',
  gradientTo: 'to-indigo-700'
}];

// Promo cards for Knowledge Hub marketplace
const knowledgeHubPromoCards = [{
  id: 'courses-promo',
  title: 'Enhance your skills',
  description: 'Discover courses to develop your business capabilities.',
  icon: <BookOpen size={24} className="text-white" />,
  path: '/marketplace/courses',
  gradientFrom: 'from-green-500',
  gradientTo: 'to-teal-400'
}, {
  id: 'finance-promo',
  title: 'Explore funding options',
  description: 'Find financial services to support your business growth.',
  icon: <DollarSign size={24} className="text-white" />,
  path: '/marketplace/financial',
  gradientFrom: 'from-blue-600',
  gradientTo: 'to-indigo-700'
}];

export const MarketplaceRouter: React.FC = () => {
  // Get configurations for each marketplace type
  const coursesConfig = getMarketplaceConfig('courses');
  const financialConfig = getMarketplaceConfig('financial');
  const nonFinancialConfig = getMarketplaceConfig('non-financial');
  const dtmiConfig = getMarketplaceConfig('dtmi');
  
  // State for bookmarked items and comparison
  const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, string[]>>({
    courses: [],
    financial: [],
    'non-financial': [],
    'dtmi': []
  });
  // Toggle bookmark for an item
  const handleToggleBookmark = (marketplaceType: string, itemId: string) => {
    setBookmarkedItems(prev => {
      const currentItems = prev[marketplaceType] || [];
      const updatedItems = currentItems.includes(itemId) ? currentItems.filter(id => id !== itemId) : [...currentItems, itemId];
      return {
        ...prev,
        [marketplaceType]: updatedItems
      };
    });
  };
  return <Routes>
      {/* Courses Marketplace */}
      <Route path="/courses" element={<MarketplacePage marketplaceType="courses" title={coursesConfig.title} description={coursesConfig.description} promoCards={coursePromoCards} />} />
      <Route path="/courses/:itemId" element={<MarketplaceDetailsPage marketplaceType="courses" bookmarkedItems={bookmarkedItems.courses} onToggleBookmark={itemId => handleToggleBookmark('courses', itemId)} />} />
      {/* Financial Services Marketplace */}
      <Route path="/financial" element={<MarketplacePage marketplaceType="financial" title={financialConfig.title} description={financialConfig.description} promoCards={financialPromoCards} />} />
      <Route path="/financial/:itemId" element={<MarketplaceDetailsPage marketplaceType="financial" bookmarkedItems={bookmarkedItems.financial} onToggleBookmark={itemId => handleToggleBookmark('financial', itemId)} />} />
      {/* Service Marketplace */}
      <Route path="/services" element={<SimpleMarketplacePage marketplaceType="non-financial" title={nonFinancialConfig.title} description={nonFinancialConfig.description} />} />
      <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
      {/* DTMI Marketplace */}
      <Route path="/dtmi" element={<MarketplacePage marketplaceType="dtmi" title={dtmiConfig.title} description={dtmiConfig.description} promoCards={[]} />} />
      
      {/* Knowledge Hub Marketplace */}
      <Route path="/knowledge-hub" element={<MarketplacePage marketplaceType="dtmi" title="Knowledge Hub" description="Discover insights, research, and expert analysis to drive your business forward" promoCards={knowledgeHubPromoCards} />} />
      
      {/* Prediction Analysis Detail Pages - Must come before generic :itemId route */}
      <Route path="/dtmi/prediction-analysis" element={<PredictionAnalysisDetail />} />
      <Route path="/dtmi/prediction-analysis/:itemId" element={<DynamicPredictionAnalysis />} />
      <Route path="/dtmi/content-governance-prediction" element={<ContentGovernancePrediction />} />
      <Route path="/dtmi/ai-decision-making-prediction" element={<AIDecisionMakingPrediction />} />
      
      {/* Knowledge Hub Prediction Analysis Pages */}
      <Route path="/knowledge-hub/cognitive-enterprises-prediction" element={<CognitiveEnterprisesPrediction />} />
      
      <Route path="/dtmi/:itemId" element={<MarketplaceDetailsPage marketplaceType="dtmi" bookmarkedItems={bookmarkedItems['dtmi']} onToggleBookmark={itemId => handleToggleBookmark('dtmi', itemId)} />} />
      <Route path="/knowledge-hub/:itemId" element={<MarketplaceDetailsPage marketplaceType="dtmi" bookmarkedItems={bookmarkedItems['dtmi']} onToggleBookmark={itemId => handleToggleBookmark('dtmi', itemId)} />} />
    </Routes>;
};
