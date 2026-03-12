import { Clock, Calendar, Share2, Download, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Episode } from "@/data/episodes";

interface EpisodeDetailsProps {
  episode: Episode;
}

const EpisodeDetails = ({ episode }: EpisodeDetailsProps) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: episode.title,
          text: episode.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      {/* Episode Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
          <span className="text-primary font-semibold">EP {episode.episodeNumber}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{episode.duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>{episode.date}</span>
        </div>
        {episode.isNew && (
          <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-bold">
            NEW
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
        {episode.title}
      </h1>

      {/* Description */}
      <p className="text-lg text-muted-foreground leading-relaxed">
        {episode.description}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Button variant="glass" size="lg" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button variant="ghost" size="lg">
          <Heart className="w-4 h-4" />
          Save
        </Button>
        <Button variant="ghost" size="lg">
          <Download className="w-4 h-4" />
          Download
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => window.open(episode.listenUrl, "_blank")}
        >
          <ExternalLink className="w-4 h-4" />
          Open in Spotify
        </Button>
      </div>
    </div>
  );
};

export default EpisodeDetails;
