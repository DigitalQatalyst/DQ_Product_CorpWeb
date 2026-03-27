import React, { useEffect, useState } from "react";
import { Send, ChevronDown, ArrowRight } from "lucide-react";
import {
  AnimatedText,
  FadeInUpOnScroll,
  StaggeredFadeIn,
} from "./AnimationUtils";
import { useNavigate } from "react-router-dom";
import ModernDQChatbot from "./ModernDQChatbot";

interface HeroSectionProps {
  "data-id"?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ "data-id": dataId }) => {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [chatbotMessage, setChatbotMessage] = useState<string | undefined>(
    undefined,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  // Trigger animation on component mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);

    try {
      console.log("Hero Section: Setting chatbot message:", prompt);
      // Set the message for the DQ chatbot and trigger it to open
      setChatbotMessage(prompt);
      setPrompt(""); // Clear the input
      setIsProcessing(false);
    } catch (error) {
      console.error("Error sending message to DQ chatbot:", error);
      alert("There was an error connecting to the chat. Please try again.");
      setIsProcessing(false);
    }
  };

  // Show suggestion pills with delay after focus
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSearchFocused) {
      timer = setTimeout(() => {
        setShowSuggestions(true);
      }, 500);
    } else {
      setShowSuggestions(false);
    }
    return () => clearTimeout(timer);
  }, [isSearchFocused]);

  const suggestionPills = [
    "How can my organization start its digital transformation journey?",
    "What service areas does DQ serve?",
    "How is DQ's digital transformation different?",
    "What products does DQ offer?",
    "Tell me about the DT 2.0 methodology",
  ];

  // Handle suggestion pill clicks
  const handleSuggestionClick = async (suggestion: string) => {
    setPrompt(suggestion);
    setIsSearchFocused(true);

    // Auto-submit the suggestion
    setIsProcessing(true);

    try {
      // Set the message for the DQ chatbot and trigger it to open
      setChatbotMessage(suggestion);
      setPrompt(""); // Clear the input
      setIsProcessing(false);
    } catch (error) {
      console.error("Error sending suggestion to DQ chatbot:", error);
      setIsProcessing(false);
      alert("There was an error connecting to the chat. Please try again.");
    }
  };

  return (
    <div
      className="relative w-full bg-gradient-to-r from-secondary-900 via-secondary-800 to-secondary-700 overflow-hidden"
      style={{ height: "100vh" }}
      data-id={dataId}
    >
      {/* Animated background image with zoom effect */}
      <div
        className="absolute inset-0 transition-transform duration-[3000ms] ease-out"
        style={{
          backgroundImage:
            "linear-gradient(rgba(3, 15, 53, 0.3), rgba(3, 15, 53, 0.3)), url('/images/landingpage_hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: isLoaded ? "scale(1)" : "scale(1.1)",
        }}
      ></div>

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple/30 mix-blend-multiply"
        style={{
          animation: "pulse-gradient 8s ease-in-out infinite alternate",
        }}
      ></div>

      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-snug">
            <AnimatedText
              text="Design and Operate Your Digital Business Platform"
              gap="1rem"
            />
          </h1>
          <FadeInUpOnScroll delay={0.8}>
            <p className="font-body text-xl text-white/90 mb-8">
              From strategy and architecture to platforms and execution; we
              design, deploy, and operate your transformation with clarity,
              speed, and control.
            </p>
          </FadeInUpOnScroll>
        </div>

        {/* AI Prompt Interface with animation */}
        <FadeInUpOnScroll delay={1.2} className="w-full max-w-3xl mb-10">
          <div
            className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${isSearchFocused ? "shadow-xl transform scale-105" : ""}`}
          >
            <div className="p-2 md:p-3">
              <div className="flex items-center">
                {/* Input field */}
                <div className="flex-grow relative">
                  <input
                    type="text"
                    placeholder="Ask about our digital transformation services..."
                    className={`font-body w-full py-3 px-4 outline-none text-gray-700 rounded-lg bg-gray-50 transition-all duration-300 ${isSearchFocused ? "bg-white" : ""}`}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() =>
                      setTimeout(() => setIsSearchFocused(false), 200)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmitPrompt();
                      }
                    }}
                  />
                </div>
                {/* Submit button */}
                <button
                  onClick={handleSubmitPrompt}
                  disabled={isProcessing || !prompt.trim()}
                  className={`ml-2 p-3 rounded-lg flex items-center justify-center transition-all ${
                    isProcessing || !prompt.trim()
                      ? "bg-gray-200 cursor-not-allowed text-gray-400"
                      : "bg-primary hover:bg-primary-600 text-white"
                  }`}
                >
                  <Send
                    size={20}
                    className={isProcessing ? "animate-pulse" : ""}
                  />
                </button>
              </div>
            </div>

            {/* Example prompts with staggered animation */}
            <div
              className={`bg-gray-50 px-4 py-3 border-t border-gray-100 transition-all duration-500 ease-in-out ${showSuggestions ? "opacity-100 max-h-24 mb-4" : "opacity-0 max-h-0 overflow-hidden"}`}
            >
              <p className="text-xs text-gray-500 mb-2">Try asking:</p>
              <div className="suggestion-pills-container flex gap-2 overflow-x-auto md:flex-wrap md:overflow-x-visible pb-2 md:pb-0">
                {suggestionPills.map((pill, index) => (
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
                    onClick={() => handleSuggestionClick(pill)}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Call to Action Buttons with animations and onClick handlers */}
        <StaggeredFadeIn
          staggerDelay={0.2}
          className="flex flex-col sm:flex-row gap-4 mt-2"
        >
          <button
            onClick={() => navigate("/services")}
            className="h-14 px-8 bg-primary hover:bg-primary-600 text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center flex items-center justify-center overflow-hidden group"
          >
            <span className="relative z-10">Explore Our Services</span>
            <ArrowRight
              size={18}
              className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300"
            />
            {/* Ripple effect on hover */}
            <span className="absolute inset-0 overflow-hidden rounded-lg">
              <span className="absolute inset-0 bg-white/20 transform scale-0 opacity-0 group-hover:scale-[2.5] group-hover:opacity-100 rounded-full transition-all duration-700 origin-center"></span>
            </span>
          </button>
          <button
            onClick={() => navigate("/products")}
            className="h-14 px-8 bg-transparent border-2 border-white text-white hover:bg-white hover:text-secondary-900 font-bold rounded-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center"
          >
            Explore Our Products
          </button>
        </StaggeredFadeIn>
      </div>

      {/* Scroll indicator with animation */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={() => {
          const nextSection = document.querySelector("main > div:nth-child(2)");
          nextSection?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        <ChevronDown size={24} className="text-white" />
        <span className="sr-only">Scroll down</span>
      </div>

      {/* Add keyframes for gradient animation */}
      <style jsx>{`
        @keyframes pulse-gradient {
          0% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.4;
          }
        }

        /* Hide scrollbar for suggestion pills on mobile */
        .suggestion-pills-container::-webkit-scrollbar {
          display: none;
        }
        .suggestion-pills-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* DQ AI Chatbot */}
      <ModernDQChatbot
        initialMessage={chatbotMessage}
        onMessageProcessed={() => setChatbotMessage(undefined)}
      />
    </div>
  );
};

export default HeroSection;
