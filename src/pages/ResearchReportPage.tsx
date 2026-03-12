import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import ResearchHeroSection from '../components/research/ResearchHeroSection';
import ResearchTableOfContents from '../components/research/ResearchTableOfContents';
import ResearchReportContent from '../components/research/ResearchReportContent';

const ResearchReportPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <ResearchHeroSection />

        {/* Main Content */}
        <main className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
              {/* Sidebar - Table of Contents */}
              <aside className="hidden lg:block">
                <ResearchTableOfContents />
              </aside>

              {/* Report Content */}
              <div className="glass-card rounded-2xl p-8 md:p-12">
                <ResearchReportContent />
              </div>
            </div>
          </div>
        </main>


      </div>
      <Footer />
    </>
  );
};

export default ResearchReportPage;