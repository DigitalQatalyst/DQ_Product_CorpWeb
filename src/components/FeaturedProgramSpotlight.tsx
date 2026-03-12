import React, { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  FileText,
  TrendingUp,
  BookOpen,
  Mic,
} from "lucide-react";
import { FadeInUpOnScroll } from "./AnimationUtils";
import { featuredPrograms } from "../data/featuredPrograms";



const FeaturedProgramSpotlight: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const programs = featuredPrograms.featured;
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const hasMultiplePrograms = programs.length > 1;

  // Handle auto-cycling between programs
  useEffect(() => {
    if (hasMultiplePrograms) {
      autoPlayRef.current = setInterval(() => {
        nextProgram();
      }, 7000); // Auto-cycle every 7 seconds
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [activeIndex, hasMultiplePrograms]);

  const nextProgram = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % programs.length);
      setIsTransitioning(false);
    }, 500);
  };



  const goToProgram = (index: number) => {
    if (isTransitioning || index === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 500);
  };

  const activeProgram = programs[activeIndex];

  return (
    <section className="w-full bg-white pt-16 pb-8 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Program Card */}
        <FadeInUpOnScroll>
          <div
            className={`relative rounded-2xl overflow-hidden shadow-xl transition-opacity duration-500 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
            style={{
              minHeight: "280px",
            }}
          >
            {/* Background Image with Dark Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(/images/DTMI-banner.png)`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 via-secondary-800/90 to-secondary-900/85"></div>

            {/* Content Container */}
            <div className="relative z-10 p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row gap-6 h-full min-h-[280px]">
              {/* Left Content */}
              <div className="flex-1 flex flex-col justify-between text-center lg:text-left">
                {/* Top Section */}
                <div>
                  {/* Badge */}
                  <div className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded text-white/90 text-xs font-medium uppercase tracking-wider mb-3">
                    DTMI - DIGITAL TRANSFORMATION MANAGEMENT INSIGHTS
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
                    The Future of Digital Cognitive Organizations (DCOs)
                  </h3>

                  {/* Description */}
                  <p className="text-white/80 text-sm md:text-base mb-4 leading-relaxed">
                    Explore our online magazine to discover how AI, cloud technologies, and data are transforming businesses through Digital Cognitive Organizations (DCOs).
                  </p>
                </div>

                {/* Bottom CTA Buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <a
                    href="/dtmi"
                    className="inline-flex items-center px-5 py-2.5 bg-white hover:bg-white/95 text-primary font-bold text-sm rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                  >
                    EXPLORE DTMI
                    <ArrowRight size={16} className="ml-2" strokeWidth={2.5} />
                  </a>
                </div>
              </div>

              {/* Right Category Cards - Vertical */}
              <div className="lg:w-56 flex flex-col gap-1.5 justify-center">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2.5 flex items-center transition-all duration-200 border border-white/10">
                  <FileText
                    size={18}
                    className="text-white/90 mr-2.5"
                    strokeWidth={1.5}
                  />
                  <div className="text-white text-sm font-medium">
                    Articles
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2.5 flex items-center transition-all duration-200 border border-white/10">
                  <TrendingUp
                    size={18}
                    className="text-white/90 mr-2.5"
                    strokeWidth={1.5}
                  />
                  <div className="text-white text-sm font-medium">
                    Predictions
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2.5 flex items-center transition-all duration-200 border border-white/10">
                  <BookOpen
                    size={18}
                    className="text-white/90 mr-2.5"
                    strokeWidth={1.5}
                  />
                  <div className="text-white text-sm font-medium">
                    Case Studies
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2.5 flex items-center transition-all duration-200 border border-white/10">
                  <Mic
                    size={18}
                    className="text-white/90 mr-2.5"
                    strokeWidth={1.5}
                  />
                  <div className="text-white text-sm font-medium">
                    Podcasts
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Navigation Indicators */}
        {hasMultiplePrograms && (
          <div className="flex justify-center mt-4 gap-2">
            {programs.map((program, index) => (
              <button
                key={program.id}
                onClick={() => goToProgram(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-primary w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to program: ${program.title}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProgramSpotlight;
