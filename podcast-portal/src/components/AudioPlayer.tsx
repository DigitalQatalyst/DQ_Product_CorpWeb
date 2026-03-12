import { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Rewind,
  FastForward
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  artist?: string;
}

const AudioPlayer = ({ audioUrl, title, artist }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      audio.volume = volume || 0.7;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Now Playing Info */}
      <div className="text-center mb-6">
        <p className="text-xs text-primary font-medium uppercase tracking-wider mb-2">
          Now Playing
        </p>
        <h3 className="font-display text-lg md:text-xl font-semibold text-foreground line-clamp-2">
          {title}
        </h3>
        {artist && (
          <p className="text-muted-foreground text-sm mt-1">{artist}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-3 md:gap-6 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => skip(-15)}
          className="text-muted-foreground hover:text-foreground"
          title="Rewind 15 seconds"
        >
          <Rewind className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => skip(-30)}
          className="text-muted-foreground hover:text-foreground"
          title="Previous"
        >
          <SkipBack className="w-5 h-5" />
        </Button>

        <Button
          variant="play"
          size="icon-xl"
          onClick={togglePlay}
          className="glow-primary"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7" fill="currentColor" />
          ) : (
            <Play className="w-7 h-7 ml-1" fill="currentColor" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => skip(30)}
          className="text-muted-foreground hover:text-foreground"
          title="Next"
        >
          <SkipForward className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => skip(15)}
          className="text-muted-foreground hover:text-foreground"
          title="Forward 15 seconds"
        >
          <FastForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-28 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
