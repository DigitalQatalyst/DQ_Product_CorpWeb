import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react";

export function TransformationStats() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      setVolume(newVolume);
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary uppercase tracking-wide">
                WELCOME TO THE FUTURE OF DIGITAL TRANSFORMATION
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Approximately 70% of Digital Transformation initiatives fail
              </h2>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">
              DQ ensures you are not part of the statistics by guiding you
              through a data-driven transformation that delivers measurable
              results.
            </p>

            <button
              onClick={() => navigate("/consultation")}
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Book Your Free Consultation
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>

          {/* Right Video Player */}
          <div className="relative">
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                poster="/images/Landing page video thumbnail.png"
              >
                <source
                  src="/videos/Why Work with Us - DQ.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              {/* Play Button Overlay - Only show when paused */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <button
                    onClick={togglePlay}
                    className="flex items-center justify-center w-16 h-16 bg-white/90 hover:bg-white rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                  >
                    <Play
                      className="w-6 h-6 text-gray-900 ml-1"
                      fill="currentColor"
                    />
                  </button>
                </div>
              )}

              {/* Video Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center justify-between text-white text-sm">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlay}
                      className="hover:text-gray-300 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" fill="currentColor" />
                      ) : (
                        <Play className="w-4 h-4" fill="currentColor" />
                      )}
                    </button>
                    <span>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Volume Control */}
                    <div
                      className="relative flex items-center"
                      onMouseEnter={() => setShowVolumeSlider(true)}
                      onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                      <button
                        onClick={toggleMute}
                        className="hover:text-gray-300 transition-colors"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>

                      {/* Volume Slider - Shows on hover */}
                      {showVolumeSlider && (
                        <>
                          {/* Invisible bridge to prevent slider from disappearing */}
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-transparent" />

                          <div
                            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/80 rounded-lg p-3"
                            onMouseEnter={() => setShowVolumeSlider(true)}
                            onMouseLeave={() => setShowVolumeSlider(false)}
                          >
                            <div className="relative w-1 h-20 bg-gray-600 rounded-full">
                              {/* Volume fill */}
                              <div
                                className="absolute bottom-0 w-full bg-white rounded-full transition-all duration-100"
                                style={{
                                  height: `${(isMuted ? 0 : volume) * 100}%`,
                                }}
                              />
                              {/* Volume thumb */}
                              <div
                                className="absolute w-3 h-3 bg-white rounded-full cursor-pointer transform -translate-x-1/2 left-1/2 transition-all duration-100"
                                style={{
                                  bottom: `${(isMuted ? 0 : volume) * 100}%`,
                                  transform: "translateX(-50%) translateY(50%)",
                                }}
                                onMouseDown={(e) => {
                                  const slider = e.currentTarget.parentElement;
                                  if (!slider) return;

                                  const handleMouseMove = (
                                    moveEvent: MouseEvent,
                                  ) => {
                                    const rect = slider.getBoundingClientRect();
                                    const y = moveEvent.clientY - rect.top;
                                    const percentage = Math.max(
                                      0,
                                      Math.min(1, 1 - y / rect.height),
                                    );
                                    handleVolumeChange(percentage);
                                  };

                                  const handleMouseUp = () => {
                                    document.removeEventListener(
                                      "mousemove",
                                      handleMouseMove,
                                    );
                                    document.removeEventListener(
                                      "mouseup",
                                      handleMouseUp,
                                    );
                                  };

                                  document.addEventListener(
                                    "mousemove",
                                    handleMouseMove,
                                  );
                                  document.addEventListener(
                                    "mouseup",
                                    handleMouseUp,
                                  );
                                }}
                              />
                              {/* Click area for direct volume setting */}
                              <div
                                className="absolute inset-0 cursor-pointer"
                                onClick={(e) => {
                                  const rect =
                                    e.currentTarget.getBoundingClientRect();
                                  const y = e.clientY - rect.top;
                                  const percentage = Math.max(
                                    0,
                                    Math.min(1, 1 - y / rect.height),
                                  );
                                  handleVolumeChange(percentage);
                                }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 w-full bg-white/20 rounded-full h-1">
                  <div
                    className="bg-white h-1 rounded-full transition-all duration-100"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Text below video */}
            <p className="text-center text-gray-600 mt-4 text-sm">
              Watch how we turn digital disruption into opportunity
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TransformationStats;
