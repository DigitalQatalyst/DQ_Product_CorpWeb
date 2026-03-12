import React from "react";
import { ExternalLink } from "lucide-react";

const platforms = [
  { name: "Spotify", url: "https://open.spotify.com", color: "bg-[#1DB954]" },
  { name: "Apple Podcasts", url: "https://podcasts.apple.com", color: "bg-gradient-to-br from-[#9933FF] to-[#FF3366]" },
  { name: "Google Podcasts", url: "https://podcasts.google.com", color: "bg-[#4285F4]" },
  { name: "YouTube", url: "https://youtube.com", color: "bg-[#FF0000]" },
];

const PodcastPlatforms = React.forwardRef<HTMLElement>((_, ref) => {
  return (
    <section className="py-16 border-t border-border">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Listen on Your Favorite Platform
          </h2>
          <p className="text-muted-foreground">
            Available wherever you get your podcasts
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {platforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-6 py-3 glass-card rounded-xl hover:border-primary/30 transition-all duration-300 hover:scale-105"
            >
              <div className={`w-3 h-3 rounded-full ${platform.color}`} />
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                {platform.name}
              </span>
              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
});

PodcastPlatforms.displayName = "PodcastPlatforms";

export default PodcastPlatforms;
