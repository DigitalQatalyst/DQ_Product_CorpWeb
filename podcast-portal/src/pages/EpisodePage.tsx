import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { episodes, podcastInfo } from "@/data/episodes";
import AudioPlayer from "@/components/AudioPlayer";
import EpisodeDetails from "@/components/EpisodeDetails";
import RelatedEpisodes from "@/components/RelatedEpisodes";
import Footer from "@/components/Footer";

// Sample audio URL for demo purposes - replace with actual podcast audio URLs
const SAMPLE_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const EpisodePage = () => {
  const { id } = useParams();
  const episode = episodes.find((ep) => ep.id === id);

  if (!episode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Episode Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The episode you're looking for doesn't exist.
          </p>
          <Button asChild variant="hero">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <Button variant="ghost" size="icon" className="mr-1">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
              <Headphones className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground group-hover:text-primary transition-colors hidden sm:inline">
              {podcastInfo.name}
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 md:py-12">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8 lg:gap-12">
          {/* Left Column - Episode Details */}
          <div>
            {/* Episode Cover Image */}
            <div className="relative aspect-video md:aspect-[16/9] rounded-2xl overflow-hidden mb-8 group">
              <img
                src={episode.imageUrl}
                alt={episode.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              
              {/* Floating Elements */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -top-20 -left-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
            </div>

            {/* Episode Details */}
            <EpisodeDetails episode={episode} />

            {/* Show Notes Section */}
            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Show Notes
              </h2>
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  In this episode, we dive deep into the fascinating world of {episode.title.toLowerCase()}. 
                  Our guests share their unique perspectives and experiences, offering valuable insights 
                  that you can apply in your own journey.
                </p>
                <h3 className="font-display text-lg font-semibold text-foreground mt-6 mb-3">
                  Topics Covered
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Key insights and takeaways from industry experts
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Practical strategies you can implement today
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Behind-the-scenes stories and experiences
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Future trends and predictions
                  </li>
                </ul>
              </div>
            </div>

            {/* Related Episodes - Mobile Only */}
            <div className="lg:hidden">
              <RelatedEpisodes episodes={episodes} currentEpisodeId={episode.id} />
            </div>
          </div>

          {/* Right Column - Audio Player */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <AudioPlayer
              audioUrl={SAMPLE_AUDIO_URL}
              title={episode.title}
              artist={podcastInfo.host}
            />

            {/* Related Episodes - Desktop */}
            <div className="hidden lg:block">
              <RelatedEpisodes episodes={episodes} currentEpisodeId={episode.id} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EpisodePage;
