"use client";

import { useState, useRef, useEffect } from "react";
import { Send, ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";

const SUGGESTIONS = [
  "How can my organization start its digital transformation journey?",
  "What service areas does DQ serve?",
  "How is DQ's digital transformation different?",
  "What products does DQ offer?",
  "Tell me about the DT 2.0 methodology",
];

export function HeroSection() {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isSearchFocused) {
      timer = setTimeout(() => setShowSuggestions(true), 500);
    } else {
      setShowSuggestions(false);
    }
    return () => clearTimeout(timer);
  }, [isSearchFocused]);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    // TODO: wire to chatbot context
    console.log("chatbot:", prompt);
    setPrompt("");
    setIsProcessing(false);
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

        {/* AI Prompt Interface */}
        <div className="w-full max-w-3xl mb-10">
          <div
            className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
              isSearchFocused ? "shadow-xl scale-105" : ""
            }`}
          >
            <div className="p-2 md:p-3">
              <div className="flex items-center">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    placeholder="Ask about our digital transformation services..."
                    className={`font-sans w-full py-3 px-4 outline-none text-gray-700 rounded-lg bg-gray-50 transition-all duration-300 ${
                      isSearchFocused ? "bg-white" : ""
                    }`}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() =>
                      setTimeout(() => setIsSearchFocused(false), 200)
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isProcessing || !prompt.trim()}
                  className={`ml-2 p-3 rounded-lg flex items-center justify-center transition-all ${
                    isProcessing || !prompt.trim()
                      ? "bg-gray-200 cursor-not-allowed text-gray-400"
                      : "bg-[#FF6B4D] hover:bg-[#E63D1A] text-white"
                  }`}
                >
                  <Send
                    size={20}
                    className={isProcessing ? "animate-pulse" : ""}
                  />
                </button>
              </div>
            </div>

            {/* Suggestion pills */}
            <div
              className={`bg-gray-50 px-4 py-3 border-t border-gray-100 transition-all duration-500 ease-in-out ${
                showSuggestions
                  ? "opacity-100 max-h-24 mb-4"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <p className="text-xs text-gray-500 mb-2">Try asking:</p>
              <div
                className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-x-visible md:pb-0"
                style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
              >
                {SUGGESTIONS.map((pill, index) => (
                  <button
                    key={index}
                    className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0 whitespace-nowrap"
                    style={{
                      opacity: showSuggestions ? 1 : 0,
                      transform: showSuggestions
                        ? "translateY(0)"
                        : "translateY(10px)",
                      transition:
                        "opacity 0.3s ease-out, transform 0.3s ease-out",
                      transitionDelay: `${0.1 + index * 0.1}s`,
                    }}
                    onClick={() => setPrompt(pill)}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/services"
          className="h-14 px-8 bg-[#FF6B4D] text-white font-bold rounded-lg hover:bg-[#E63D1A] transition-all transform hover:-translate-y-1 hover:shadow-xl inline-flex items-center gap-2 group"
        >
          <span className="relative z-10">Explore Now</span>
          <ArrowRight
            size={18}
            className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
          />
        </Link>
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
