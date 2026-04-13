import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { FadeInUpOnScroll } from "./AnimationUtils";

const DWSBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative bg-gradient-to-r from-secondary-800 to-secondary-900 overflow-hidden rounded-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-primary-500/20 to-transparent"></div>
          
          {/* Subtle geometric elements */}
          <div className="absolute top-4 right-20 w-16 h-16 border border-white/20 rounded-lg rotate-12"></div>
          <div className="absolute bottom-4 right-32 w-8 h-8 bg-white/10 rounded-full"></div>

          <div className="relative z-10 p-8 md:p-12">
            <FadeInUpOnScroll>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Left Content */}
                <div className="flex-1 text-center lg:text-left">
                  {/* Location Badge */}
                  <div className="inline-flex items-center px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-3">
                    <MapPin size={14} className="mr-2" />
                    Now Open in Nairobi, Kenya
                  </div>
                  
                  {/* Main Headline */}
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    Premium Workspaces in Nairobi
                  </h2>
                  
                  {/* Subheadline - Simplified and punchy */}
                  <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                    Smart workspaces. Zero distractions. Maximum focus.
                  </p>
                </div>

                {/* Right CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate("/dws")}
                    className="px-6 py-3 bg-primary text-white hover:bg-primary-600 font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  >
                    Explore Our Spaces
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                  
                  <button
                    onClick={() => navigate("/forms/tour-request")}
                    className="px-6 py-3 bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold rounded-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  >
                    Book Your Space
                  </button>
                </div>
              </div>
            </FadeInUpOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DWSBanner;