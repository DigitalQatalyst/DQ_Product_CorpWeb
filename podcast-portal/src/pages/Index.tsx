import HeroSection from "@/components/HeroSection";
import EpisodeGrid from "@/components/EpisodeGrid";
import PodcastPlatforms from "@/components/PodcastPlatforms";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <EpisodeGrid />
      <PodcastPlatforms />
      <Footer />
    </div>
  );
};

export default Index;
