import React, { useState } from 'react';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import HeroSection from './HeroSection';
import TransformationStats from './TransformationStats';
import ProofAndTrust from './ProofAndTrust';
import DigitalMaturityAssessment from './DigitalMaturityAssessment';
import Home from './Home';
import KnowledgeHub from './KnowledgeHub';
import CallToAction from './CallToAction';
import DigitalQatalystAttribution from './DigitalQatalystAttribution';

const HomePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <main className="flex-grow">
        <HeroSection />
        <TransformationStats />
        <ProofAndTrust />
        <DigitalMaturityAssessment />
        <Home />
        <KnowledgeHub graphqlEndpoint={null} />
        <CallToAction />
      </main>
      <Footer isLoggedIn={false} />
      {/* <DigitalQatalystAttribution /> */}
    </div>
  );
};

export default HomePage;