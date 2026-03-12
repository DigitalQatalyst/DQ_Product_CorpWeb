import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import { useState } from "react";

const featuredContributors = [
  {
    id: 1,
    name: "Dr. Stéphane Niango",
    expertise: "DCO Strategy & Applied AI Specialist",
    bio: "Expert in Digital Cognitive Organizations & Strategic Transformation with 10+ published works",
    recentContribution: {
      title: "Why Traditional Organizations Are Obsolete",
      link: "/dtmi/article/why-traditional-organizations-are-obsolete",
      type: "Article",
    },
    avatar: "/images/Stephane_Avatar.png",
    profileUrl: "/authors/dr-stephane-niango",
  },
  {
    id: 2,
    name: "Kaylynn Océanne",
    expertise: "Experience Design & Human Insights Expert",
    bio: "Content Engagement Strategist specializing in coherent system design with 9+ published works",
    recentContribution: {
      title: "Traditional Digital Transformation is Dead",
      link: "/dtmi/article/traditional-digital-transformation-is-dead",
      type: "Article",
    },
    avatar: "/images/Kaylynn_Avatar.png",
    profileUrl: "/authors/kaylynn-oceanne",
  },
  {
    id: 3,
    name: "Mark Kerry",
    expertise: "DCO Strategy & Accounts Specialist",
    bio: "Explores leadership, culture, and strategy in driving meaningful organisational transformation",
    recentContribution: {
      title: "Leadership in Digital Transformation",
      link: "/marketplace/dtmi",
      type: "Case Study",
    },
    avatar: "/images/MK-Avatar.png",
    profileUrl: "/authors/mark-kerry",
  },
  {
    id: 4,
    name: "Sharavi Chander",
    expertise: "Solution Architecture & DBPs Expert",
    bio: "Explores frameworks, tools, and mindsets for building scalable and resilient digital solutions",
    recentContribution: {
      title: "Building Scalable Digital Platforms",
      link: "/marketplace/dtmi",
      type: "Report",
    },
    avatar: "/images/Sharavi-Avatar.png",
    profileUrl: "/authors/sharavi-chander",
  },
];

export function ContributorMarketplaceBanner() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredContributors.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? featuredContributors.length - 1 : prev - 1,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Meet the Experts
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Learn from top experts shaping digital transformation with
            real-world insights and cutting-edge strategies.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Carousel Container */}
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredContributors.map((contributor) => (
                <div key={contributor.id} className="w-full flex-shrink-0">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      {/* Photo */}
                      <div className="flex-shrink-0">
                        <img
                          src={contributor.avatar}
                          alt={contributor.name}
                          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-brand-coral/20"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                          {contributor.name}
                        </h3>
                        <p className="text-brand-coral font-semibold text-sm mb-3">
                          {contributor.expertise}
                        </p>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {contributor.bio}
                        </p>

                        {/* Recent Contribution */}
                        <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            Recent Work
                          </p>
                          <button
                            onClick={() =>
                              navigate(contributor.recentContribution.link)
                            }
                            className="text-left group w-full"
                          >
                            <p className="font-semibold text-sm text-gray-900 group-hover:text-brand-coral transition-colors">
                              {contributor.recentContribution.title}
                            </p>
                          </button>
                        </div>

                        {/* CTA */}
                        <button
                          onClick={() => navigate(contributor.profileUrl)}
                          className="px-5 py-2 bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center text-sm"
                        >
                          View Profile
                          <ArrowRight size={14} className="ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-5 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
            aria-label="Previous contributor"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-5 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
            aria-label="Next contributor"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-5">
            {featuredContributors.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "w-8 h-3 bg-brand-coral"
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Explore All CTA */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/dtmi/contributors")}
            className="px-8 py-3 bg-brand-navy hover:bg-brand-navy/90 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl inline-flex items-center justify-center"
          >
            Explore All Contributors
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}
