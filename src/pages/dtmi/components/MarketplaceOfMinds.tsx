import { useNavigate } from "react-router-dom";

export function MarketplaceOfMinds() {
  const navigate = useNavigate();

  const handleExploreContributors = () => {
    navigate("/dtmi/contributors");
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Marketplace of Minds
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Discover the experts and institutions driving DTMI insights and
            digital transformation knowledge.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleExploreContributors}
            className="inline-flex items-center gap-2 bg-brand-coral text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explore Contributors
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
