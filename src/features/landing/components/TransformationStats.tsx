"use client";

import { useRef, useState } from "react";
import { ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

export function TransformationStats() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!videoRef.current) return;
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const formatTime = (t: number) =>
    `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#FF6B4D] uppercase tracking-wide">
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
            <Link
              href="/consultation"
              className="inline-flex items-center px-6 py-3 bg-[#030F35] hover:bg-[#1F2F5C] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Book Your Free Consultation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Right Video Player */}
          <div className="relative">
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                onTimeUpdate={() =>
                  setCurrentTime(videoRef.current?.currentTime ?? 0)
                }
                onLoadedMetadata={() =>
                  setDuration(videoRef.current?.duration ?? 0)
                }
                poster="/images/Landing page video thumbnail.png"
              >
                <source
                  src="/videos/Why Work with Us - DQ.mp4"
                  type="video/mp4"
                />
              </video>

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

              {/* Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4">
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

                      {showVolumeSlider && (
                        <>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-transparent" />
                          <div
                            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/80 rounded-lg p-3"
                            onMouseEnter={() => setShowVolumeSlider(true)}
                            onMouseLeave={() => setShowVolumeSlider(false)}
                          >
                            <div className="relative w-1 h-20 bg-gray-600 rounded-full">
                              <div
                                className="absolute bottom-0 w-full bg-white rounded-full transition-all duration-100"
                                style={{
                                  height: `${(isMuted ? 0 : volume) * 100}%`,
                                }}
                              />
                              <div
                                className="absolute w-3 h-3 bg-white rounded-full cursor-pointer left-1/2 transition-all duration-100"
                                style={{
                                  bottom: `${(isMuted ? 0 : volume) * 100}%`,
                                  transform: "translateX(-50%) translateY(50%)",
                                }}
                                onMouseDown={(e) => {
                                  const slider = e.currentTarget.parentElement;
                                  if (!slider) return;
                                  const onMove = (ev: MouseEvent) => {
                                    const rect = slider.getBoundingClientRect();
                                    handleVolumeChange(
                                      Math.max(
                                        0,
                                        Math.min(
                                          1,
                                          1 -
                                            (ev.clientY - rect.top) /
                                              rect.height,
                                        ),
                                      ),
                                    );
                                  };
                                  const onUp = () => {
                                    document.removeEventListener(
                                      "mousemove",
                                      onMove,
                                    );
                                    document.removeEventListener(
                                      "mouseup",
                                      onUp,
                                    );
                                  };
                                  document.addEventListener(
                                    "mousemove",
                                    onMove,
                                  );
                                  document.addEventListener("mouseup", onUp);
                                }}
                              />
                              <div
                                className="absolute inset-0 cursor-pointer"
                                onClick={(e) => {
                                  const rect =
                                    e.currentTarget.getBoundingClientRect();
                                  handleVolumeChange(
                                    Math.max(
                                      0,
                                      Math.min(
                                        1,
                                        1 -
                                          (e.clientY - rect.top) / rect.height,
                                      ),
                                    ),
                                  );
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
                  />
                </div>
              </div>
            </div>

            <p className="text-center text-gray-600 mt-4 text-sm">
              Watch how we turn digital disruption into opportunity
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
