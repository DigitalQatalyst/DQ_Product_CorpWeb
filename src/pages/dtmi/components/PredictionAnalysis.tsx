import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getKnowledgeHubItems } from "../../../utils/mockMarketplaceData";

interface Prediction {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  category: string;
}

export function PredictionAnalysis() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  // Auto-play carousel - move to next slide every 5 seconds
  useEffect(() => {
    if (predictions.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % predictions.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [predictions.length]);

  const fetchPredictions = async () => {
    try {
      setLoading(true);

      // Fetch all knowledge hub items (same as marketplace)
      const allItems = await getKnowledgeHubItems();

      // Filter for prediction analysis only
      const predictionData = allItems.filter(
        (item) => item.mediaType === "Prediction Analysis",
      );

      console.log(
        "Prediction Analysis - fetched items:",
        predictionData.length,
      );

      if (predictionData && predictionData.length > 0) {
        // Map knowledge hub items to component format
        const mappedPredictions = predictionData
          .slice(0, 5)
          .map((item: any) => {
            console.log(
              "Prediction image URL:",
              item.title,
              "→",
              item.imageUrl,
            );
            return {
              id: item.id,
              title: item.title,
              description:
                item.summary ||
                item.description ||
                "Explore this prediction analysis on digital transformation.",
              image: item.imageUrl || "/images/Article 01_hero image.png",
              link:
                item.detailsUrl ||
                `/marketplace/dtmi/prediction-analysis/${item.slug}`,
              category:
                item.domain || item.category || "Digital Transformation",
            };
          });

        setPredictions(mappedPredictions);
      } else {
        useFallbackData();
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
      useFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const useFallbackData = () => {
    setPredictions([
      {
        id: 1,
        title: "Building a Data-Driven Culture in Modern Enterprises",
        description:
          "Learn practical strategies for fostering a data-driven mindset across your organization and empowering teams with insights.",
        image: "/images/Article 02_hero image.png",
        link: "/marketplace/dtmi/prediction-analysis/data-driven-culture",
        category: "Data Strategy",
      },
      {
        id: 2,
        title: "The Future of AI in Enterprise Decision Making",
        description:
          "Explore how artificial intelligence is transforming strategic decision-making processes in modern organizations.",
        image: "/images/Article 01_hero image.png",
        link: "/marketplace/dtmi/prediction-analysis/ai-decision-making",
        category: "AI & Analytics",
      },
      {
        id: 3,
        title: "Cognitive Organizations: The Next Evolution",
        description:
          "Discover how cognitive technologies are reshaping organizational structures and business operations.",
        image: "/images/Article 03_hero image.png",
        link: "/marketplace/dtmi/prediction-analysis/cognitive-organizations",
        category: "Digital Transformation",
      },
      {
        id: 4,
        title: "Digital Platforms: Redefining Business Models",
        description:
          "Understanding how digital platforms are creating new value ecosystems and competitive advantages.",
        image: "/images/Article 01_hero image.png",
        link: "/marketplace/dtmi/prediction-analysis/digital-platforms",
        category: "Business Innovation",
      },
    ]);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % predictions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? predictions.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="h-[500px] flex items-center justify-center text-gray-600">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral"></div>
              <p>Loading prediction analysis...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (predictions.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="h-[500px] flex items-center justify-center text-gray-600">
            <p>No prediction analysis available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentPrediction = predictions[currentIndex];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Featured Prediction Analysis
          </h2>
          <button
            onClick={() =>
              navigate("/marketplace/dtmi?contentType=prediction-analysis")
            }
            className="text-gray-900 hover:text-brand-coral transition-colors font-semibold flex items-center gap-2"
          >
            See all predictions
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Main Content */}
          <div
            className="bg-white min-h- rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => navigate(currentPrediction.link)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-[500px]">
              {/* Text Content - Left */}
              <div className="p-8 md:p-12 flex flex-col justify-center order-2 lg:order-1">
                <span className="inline-block px-3 py-1 bg-brand-coral/10 text-brand-coral text-sm font-semibold rounded-md mb-4 w-fit">
                  {currentPrediction.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight line-clamp-2">
                  {currentPrediction.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow line-clamp-4">
                  {currentPrediction.description}
                </p>
                <button className="inline-flex items-center gap-2 text-gray-900 hover:text-brand-coral transition-colors font-semibold group">
                  Read more
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Image - Right */}
              <div className="relative h-full lg:h-full order-1 lg:order-2">
                <img
                  src={currentPrediction.image}
                  alt={currentPrediction.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-900 transition-all duration-300 z-10 shadow-lg"
            aria-label="Previous prediction"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-900 transition-all duration-300 z-10 shadow-lg"
            aria-label="Next prediction"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {predictions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-8 h-3 bg-brand-coral"
                  : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to prediction ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
