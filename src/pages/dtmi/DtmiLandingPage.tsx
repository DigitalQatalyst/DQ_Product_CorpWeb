import { DtmiHeroSection } from "./components/HeroSection";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { FeaturedInsights } from "./components/FeaturedInsights";
import { SectorInsights } from "./components/SectorInsights";
import { NewsletterSignupForm } from "./components/NewsletterSignupForm";
import { DigitalPerspectives } from "./components/DigitalPerspectives";
import { FeaturedBlogs } from "./components/FeaturedBlogs";
import { DigitalDomains } from "./components/DigitalDomains";
import { MarketplaceOfMinds } from "./components/MarketplaceOfMinds";
import { FeaturedContent } from "./components/FeaturedContent";

const DtmiLandingPage = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        <DtmiHeroSection />
        <FeaturedInsights />
        <DigitalPerspectives />
        <FeaturedBlogs />
        <SectorInsights />
        <MarketplaceOfMinds />
        <DigitalDomains />
        <FeaturedContent />
        <NewsletterSignupForm />
      </main>
      <Footer />
    </div>
  );
};

export default DtmiLandingPage;
