import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Episode } from "@/data/episodes";

interface RelatedEpisodesProps {
  episodes: Episode[];
  currentEpisodeId: string;
}

const RelatedEpisodes = ({ episodes, currentEpisodeId }: RelatedEpisodesProps) => {
  const related = episodes
    .filter((ep) => ep.id !== currentEpisodeId)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
        More Episodes
      </h2>
      
      <div className="grid gap-4">
        {related.map((episode) => (
          <Link
            key={episode.id}
            to={`/episode/${episode.id}`}
            className="group glass-card rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 transition-all duration-300"
          >
            {/* Thumbnail */}
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src={episode.imageUrl}
                alt={episode.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-5 h-5 text-primary" fill="currentColor" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">
                EP {episode.episodeNumber} • {episode.duration}
              </p>
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {episode.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedEpisodes;
