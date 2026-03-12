import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getKnowledgeHubItems } from "../../../utils/mockMarketplaceData";

interface Article {
  id: number;
  title: string;
  description: string;
  author: string;
  category: string;
  date: string;
  link: string;
  image: string;
  featured?: boolean;
}

export function FeaturedInsights() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Helper function to format dates
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "Recently published";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recently published";
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (error) {
      return "Recently published";
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Auto-rotate featured article every 30 seconds
  useEffect(() => {
    if (articles.length === 0) return;

    const interval = setInterval(() => {
      setFeaturedIndex((prevIndex) => (prevIndex + 1) % articles.length);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [articles.length]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      console.log("🔄 [Latest Perspectives] Starting to fetch articles...");

      // Fetch all knowledge hub items (same as admin-ui)
      const allItems = await getKnowledgeHubItems();

      console.log(
        "📊 [Latest Perspectives] Total items fetched:",
        allItems.length,
      );
      console.log(
        "🔍 [Latest Perspectives] Item types:",
        allItems.map((item: any) => item.mediaType)
      );

      // Filter for all recent content items (not just featured blogs) and sort by date (newest first)
      const articlesData = allItems
        .filter((item: any) => ["Blog", "Article", "News", "Guide", "Case Study", "Expert Interview", "Prediction Analysis", "Video", "Podcast"].includes(item.mediaType))
        .sort((a: any, b: any) => {
          const dateA = new Date(a.date || a.publishedAt || a.publishDate || 0).getTime();
          const dateB = new Date(b.date || b.publishedAt || b.publishDate || 0).getTime();
          return dateB - dateA; // Descending order (newest first)
        });

      console.log(
        "✅ [Latest Perspectives] Recent content items count:",
        articlesData.length,
      );

      if (articlesData && articlesData.length > 0) {
        // Map knowledge hub items to component format (take latest 5)
        const mappedArticles = articlesData
          .slice(0, 5)
          .map((article: any, index: number) => {
            console.log(
              `📰 [Latest Perspectives] Mapping article ${index + 1}:`,
              article.title,
            );
            
            // Enhanced mapping logic specifically for featured blogs
            const mappedArticle = {
              id: article.id,
              title: article.title || "Untitled Blog",
              description:
                article.summary ||
                article.description ||
                article.excerpt ||
                article.blog_excerpt ||
                article.content?.substring(0, 150) + "..." ||
                "Explore this featured blog on digital transformation.",
              author: 
                article.author?.name || 
                article.author?.fullName ||
                article.author?.displayName ||
                article.authorName ||
                article.blog_author_name ||
                "DTMI Team",
              category:
                article.domain || 
                article.category || 
                article.tags?.[0] || 
                article.businessStage ||
                "Digital Transformation",
              date: formatDate(article.date || article.publishedAt || article.publishDate) || "Recently published",
              link: 
                article.blogUrl || 
                article.url ||
                `/blog/${article.slug || article.id}`,
              image:
                article.imageUrl ||
                article.heroImage ||
                article.thumbnailUrl ||
                article.image ||
                `/images/Article 0${(index % 3) + 1}_hero image.png`,
              featured: index === 0,
            };
            
            console.log(
              `✅ [Latest Perspectives] Mapped:`,
              mappedArticle.title,
              "→",
              mappedArticle.image,
            );
            
            return mappedArticle;
          });

        console.log("🎯 [Latest Perspectives] Final mapped articles:", mappedArticles.length);
        setArticles(mappedArticles);
      } else {
        console.log("⚠️ [Latest Perspectives] No articles found, using fallback data");
        useFallbackData();
      }
    } catch (error) {
      console.error("❌ [Latest Perspectives] Error fetching articles:", error);
      useFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const useFallbackData = () => {
    console.log("🔄 [Latest Perspectives] Using fallback data for recent content items");
    
    // Fallback data for recent content items with realistic dates and content
    const fallbackArticles = [
      {
        id: 1,
        title: "The Rise of Cognitive Enterprises",
        description:
          "How AI-powered organizations are transforming business operations and decision-making processes. Featured insights on the future of work.",
        author: "Dr. Stéphane Niango",
        category: "Digital Economy 4.0",
        date: formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)), // 2 days ago
        link: "/blog/the-rise-of-cognitive-enterprises",
        image: "/images/Article 01_hero image.png",
        featured: true,
      },
      {
        id: 2,
        title: "Digital Transformation ROI: What Really Works",
        description:
          "Evidence-based strategies that deliver measurable returns on digital transformation investments. Avoiding the 73% failure rate.",
        author: "Kaylynn Océanne",
        category: "Digital Economy 4.0",
        date: formatDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)), // 5 days ago
        link: "/blog/digital-transformation-roi-strategies",
        image: "/images/Article 02_hero image.png",
      },
      {
        id: 3,
        title: "AI Governance Frameworks for Enterprise Success",
        description:
          "Comprehensive frameworks for implementing responsible AI governance in enterprise environments. Regulatory compliance and ethical considerations.",
        author: "Mark Kerry",
        category: "Digital Cognitive Organisation",
        date: formatDate(new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)), // 8 days ago
        link: "/blog/ai-governance-frameworks-enterprise",
        image: "/images/Article 03_hero image.png",
      },
      {
        id: 4,
        title: "Building the Digital-First Organization",
        description:
          "Practical roadmap for transitioning from traditional to digital-first organizational structures. Culture, processes, and technology alignment.",
        author: "Sharavi Chander",
        category: "Digital Transformation",
        date: formatDate(new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)), // 12 days ago
        link: "/blog/building-digital-first-organization",
        image: "/images/Article 01_hero image.png",
      },
      {
        id: 5,
        title: "Data Sovereignty in the Cloud Era",
        description:
          "Navigating data sovereignty challenges in hybrid and multi-cloud environments. Compliance strategies for global enterprises.",
        author: "Dr. Stéphane Niango",
        category: "Digital Cognitive Organisation",
        date: formatDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)), // 15 days ago
        link: "/blog/data-sovereignty-cloud-era",
        image: "/images/Article 02_hero image.png",
      },
    ];
    
    setArticles(fallbackArticles);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Latest Perspectives
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the latest insights and perspectives from our digital transformation experts
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-brand-coral border-t-transparent"></div>
              </div>
              <div className="text-center">
                <p className="text-gray-700 font-medium text-lg mb-2">Loading latest content</p>
                <p className="text-gray-500 text-sm">Fetching the most recent articles and insights...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Rotate articles based on featuredIndex
  const rotatedArticles = [
    ...articles.slice(featuredIndex),
    ...articles.slice(0, featuredIndex),
  ];

  const featuredArticle = rotatedArticles[0];
  const leftArticles = rotatedArticles.slice(1, 3);
  const rightArticles = rotatedArticles.slice(3, 5);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest Perspectives
          </h2>
        </div>

        {/* Three-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left Column - Small Articles */}
          <div className="lg:col-span-3 space-y-6">
            {leftArticles.map((article) => (
              <div
                key={article.id}
                className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate(article.link)}
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-brand-coral transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="text-xs text-gray-600">{article.date}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Center Column - Featured Article */}
          <div className="lg:col-span-6">
            <div
              className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
              onClick={() => navigate(featuredArticle.link)}
            >
              {/* Large Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Trending Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase rounded">
                    Trending
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-coral transition-colors line-clamp-2">
                  {featuredArticle.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {featuredArticle.description}
                </p>
                <div className="text-xs text-gray-500">
                  {featuredArticle.date}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Small Articles */}
          <div className="lg:col-span-3 space-y-6">
            {rightArticles.map((article) => (
              <div
                key={article.id}
                className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate(article.link)}
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-brand-coral transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="text-xs text-gray-600">{article.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row - Text-Only Headlines with Scrolling Animation */}
        <div className="relative overflow-hidden">
          <div className="animate-scroll flex gap-6 whitespace-nowrap">
            {/* First set of dynamic headlines */}
            {(articles && articles.length > 0) ? (
              articles.map((article, index) => (
                <div
                  key={`headline-${index}`}
                  className="group cursor-pointer inline-block min-w-max"
                  onClick={() => navigate(article.link)}
                >
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-brand-coral transition-colors">
                    {article.title}
                  </h4>
                </div>
              ))
            ) : (
              // Fallback static headlines when no dynamic content is available
              <>
                <div
                  className="group cursor-pointer inline-block min-w-max"
                  onClick={() => navigate("/dtmi/article/ai-governance-frameworks")}
                >
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-brand-coral transition-colors">
                    AI governance frameworks reshape enterprise decisions
                  </h4>
                </div>
                <div
                  className="group cursor-pointer inline-block min-w-max"
                  onClick={() =>
                    navigate("/dtmi/article/digital-transformation-roi")
                  }
                >
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-brand-coral transition-colors">
                    73% of digital transformations fail to deliver ROI
                  </h4>
                </div>
                <div
                  className="group cursor-pointer inline-block min-w-max"
                  onClick={() =>
                    navigate("/dtmi/article/cognitive-automation-adoption")
                  }
                >
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-brand-coral transition-colors">
                    Cognitive automation accelerates in financial services
                  </h4>
                </div>
                <div
                  className="group cursor-pointer inline-block min-w-max"
                  onClick={() =>
                    navigate("/dtmi/article/digital-workplace-evolution")
                  }
                >
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-brand-coral transition-colors">
                    Hybrid models redefine productivity metrics
                  </h4>
                </div>
                <div
                  className="group cursor-pointer inline-block min-w-max"
                  onClick={() =>
                    navigate("/dtmi/article/data-sovereignty-challenges")
                  }
                >
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-brand-coral transition-colors">
                    Data sovereignty emerges as top enterprise concern
                  </h4>
                </div>
              </>
            )}
            {/* Duplicate set for seamless loop */}
            {(articles && articles.length > 0) ? (
              articles.map((article, index) => (
                <div
                  key={`headline-duplicate-${index}`}
                  className="group cursor-pointer inline-block min-w-max"
                  onClick={() => navigate(article.link)}
                >
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-brand-coral transition-colors">
                    {article.title}
                  </h4>
                </div>
              ))
            ) : (
              // Duplicate fallback static headlines for seamless loop
              <>
                <div
                  className="group cursor-pointer inline-block min-w-max"
                  onClick={() => navigate("/dtmi/article/ai-governance-frameworks")}
                >
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-brand-coral transition-colors">
                    AI governance frameworks reshape enterprise decisions
                  </h4>
                </div>
                <div
                  className="group cursor-pointer inline-block min-w-max"
                  onClick={() =>
                    navigate("/dtmi/article/digital-transformation-roi")
                  }
                >
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-brand-coral transition-colors">
                    73% of digital transformations fail to deliver ROI
                  </h4>
                </div>
                <div
                  className="group cursor-pointer inline-block min-w-max"
                  onClick={() =>
                    navigate("/dtmi/article/cognitive-automation-adoption")
                  }
                >
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-brand-coral transition-colors">
                    Cognitive automation accelerates in financial services
                  </h4>
                </div>
                <div
                  className="group cursor-pointer inline-block min-w-max"
                  onClick={() =>
                    navigate("/dtmi/article/digital-workplace-evolution")
                  }
                >
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-brand-coral transition-colors">
                    Hybrid models redefine productivity metrics
                  </h4>
                </div>
                <div
                  className="group cursor-pointer inline-block min-w-max"
                  onClick={() =>
                    navigate("/dtmi/article/data-sovereignty-challenges")
                  }
                >
                  <h4 className="text-sm font-semibold text-gray-900 hover:text-brand-coral transition-colors">
                    Data sovereignty emerges as top enterprise concern
                  </h4>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CSS Animation */}
        <style>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            animation: scroll 40s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </section>
  );
}
