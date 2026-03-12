import { episodes } from "@/data/episodes";
import EpisodeCard from "./EpisodeCard";

const EpisodeGrid = () => {
  return (
    <section className="py-20 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              All Episodes
            </h2>
            <p className="text-muted-foreground">
              Catch up on the latest conversations
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {episodes.length} episodes
          </div>
        </div>

        {/* Episodes Grid */}
        <div className="grid gap-6">
          {episodes.map((episode, index) => (
            <EpisodeCard key={episode.id} episode={episode} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EpisodeGrid;
