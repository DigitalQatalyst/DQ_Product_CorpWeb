"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { trackButtonClick } from "@/lib/analytics";

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleExploreServicesClick = () => {
    trackButtonClick("Explore Services", "Hero Section");
  };

  const handleExploreProductsClick = () => {
    trackButtonClick("Explore Products", "Hero Section");
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(to right, #030F35, #1F2F5C, #2E4580)",
        height: "100vh",
      }}
    >
      {/* Animated background image */}
      <div
        className="absolute inset-0 transition-transform duration-[3000ms] ease-out"
        style={{
          backgroundImage: "url('/images/landingpage_hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: isLoaded ? "scale(1)" : "scale(1.1)",
        }}
      />

      {/* Gradient overlay — matches old: from-secondary-900/95 via-secondary-900/70 to-secondary-900/30 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(3,15,53,0.95), rgba(3,15,53,0.70), rgba(3,15,53,0.30))",
        }}
      />

      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-snug">
            Design and Operate Your Digital Business Platform
          </h1>
          <p className="font-sans text-xl text-white/90 mb-8">
            From strategy and architecture to platforms and execution; we
            design, deploy, and operate your transformation with clarity, speed,
            and control
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/services"
            onClick={handleExploreServicesClick}
            className="inline-flex items-center gap-2 h-14 px-8 bg-secondary text-secondary-foreground font-bold rounded-lg hover:-translate-y-1 hover:shadow-xl transition-all group"
          >
            <span className="relative z-10">Explore Services</span>
            <ArrowRight
              size={18}
              className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
          <Link
            href="/products"
            onClick={handleExploreProductsClick}
            className="inline-flex items-center gap-2 h-14 px-8 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-gray-900 hover:-translate-y-1 hover:shadow-xl transition-all group"
          >
            <span className="relative z-10">Explore Products</span>
            <ArrowRight
              size={18}
              className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={() => {
          const next = document.querySelector("main > section:nth-child(2)");
          next?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <ChevronDown size={24} className="text-white" />
        <span className="sr-only">Scroll down</span>
      </div>
    </div>
  );
}
