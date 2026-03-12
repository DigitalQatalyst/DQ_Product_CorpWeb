import React from 'react';
import { Button } from '@mantine/core';
import { ArrowRight } from 'lucide-react';
import { mockKnowledgeHubItems } from '../../../utils/mockMarketplaceData';

// Only show the prediction analysis since it's the only one available
const predictionAnalysisItem = {
  id: 1,
  title: 'The Rise of Digital Cognitive Organizations',
  description: 'An in-depth prediction analysis of how AI-driven cognitive architectures will reshape enterprise operations and decision-making frameworks over the next five years.',
  industry: 'Prediction Analysis',
  image: '/images/prediction1-thumbnail.png',
  url: '/marketplace/dtmi/prediction-analysis'
};
export function FeaturedCaseStudies() {
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          Featured Prediction Analysis
        </h2>
        <div className="relative bg-brand-navy rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
            {/* Left side - Content */}
            <div className="p-12 md:p-16 flex flex-col justify-center">
              <div className="inline-block px-3 py-1.5 text-xs font-medium bg-white/10 text-white rounded-md mb-6 self-start border border-white/20">
                {predictionAnalysisItem.industry}
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {predictionAnalysisItem.title}
              </h3>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                {predictionAnalysisItem.description}
              </p>
              <div>
                <Button
                  size="lg"
                  onClick={() => window.location.href = predictionAnalysisItem.url}
                  styles={{
                    root: {
                      backgroundColor: '#FFFFFF',
                      color: '#131C3A',
                      fontWeight: 600,
                      padding: '0 2.5rem',
                      height: '48px',
                      border: '1px solid transparent',
                      borderRadius: '0.85rem',
                      boxShadow: '0 18px 30px rgba(15, 23, 42, 0.25)',
                      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#FF6B4D',
                        color: '#FFFFFF',
                        transform: 'translateY(-3px) scale(1.02)',
                        boxShadow: '0 25px 50px rgba(255, 107, 77, 0.4)',
                        border: '1px solid rgba(255, 107, 77, 0.3)'
                      },
                      '&:active': {
                        transform: 'translateY(-1px) scale(1.01)',
                        boxShadow: '0 15px 30px rgba(255, 107, 77, 0.3)'
                      }
                    }
                  }}
                >
                  <span className="inline-flex items-center gap-2 transition-all duration-300">
                    Take a closer look
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </div>
            </div>
            {/* Right side - Image */}
            <div className="relative h-full min-h-[400px] lg:min-h-[500px]">
              <img src={predictionAnalysisItem.image} alt={predictionAnalysisItem.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}
