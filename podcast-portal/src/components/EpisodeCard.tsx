import { Play, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Episode } from "@/data/episodes";

interface EpisodeCardProps {
  episode: Episode;
  index: number;
}

const EpisodeCard = ({ episode, index }: EpisodeCardProps) => {
  return (
    <Link
      to={`/episode/${episode.id}`}
      className="glass-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Episode Image */}
        <div className="relative w-full sm:w-40 h-48 sm:h-40 flex-shrink-0 overflow-hidden">
          <img
            src={episode.imageUrl}
            alt={episode.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent sm:bg-gradient-to-r" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="play" size="icon-lg" className="shadow-2xl">
              <Play className="w-6 h-6 ml-1" fill="currentColor" />
            </Button>
          </div>

          {/* Episode Number Badge */}
          <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-muted-foreground">
            EP {episode.episodeNumber}
          </div>

          {/* New Badge */}
          {episode.isNew && (
            <div className="absolute top-3 right-3 bg-primary px-2 py-1 rounded-md text-xs font-bold text-primary-foreground">
              NEW
            </div>
          )}
        </div>

        {/* Episode Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {episode.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {episode.description}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{episode.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{episode.date}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EpisodeCard;
