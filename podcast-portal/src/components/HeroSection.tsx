import { Play, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { podcastInfo, episodes } from "@/data/episodes";
import heroImage from "@/assets/hero-podcast.jpg";

const HeroSection = () => {
  const latestEpisode = episodes[0];

  const handleListenLatest = () => {
    window.open(latestEpisode.listenUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Podcast hero"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/50 backdrop-blur-sm border border-border px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Headphones className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">{podcastInfo.subscriberCount} listeners</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-text">{podcastInfo.name}</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {podcastInfo.tagline}
          </p>

          {/* Description */}
          <p className="text-foreground/80 text-lg leading-relaxed mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {podcastInfo.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button variant="hero" size="xl" onClick={handleListenLatest} className="group">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" />
              Listen to Latest Episode
            </Button>
            <Button variant="glass" size="xl">
              Browse All Episodes
            </Button>
          </div>

          {/* Latest Episode Preview */}
          <div className="mt-12 p-4 glass-card rounded-xl max-w-md animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-xs text-primary font-medium mb-2">LATEST EPISODE</p>
            <h3 className="font-display font-semibold text-foreground mb-1">{latestEpisode.title}</h3>
            <p className="text-sm text-muted-foreground">{latestEpisode.duration} • {latestEpisode.date}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
