import {
  FileText,
  BookOpen,
  Layers,
  Headphones,
  BarChart2,
  ArrowRight,
  TrendingUp,
  Filter,
  Calendar,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const contentData = {
  articles: [
    {
      title:
        "Why Traditional Organizations Are Obsolete in Today's Digital Economy",
      excerpt:
        "Discover how digital-first organizations are reshaping industries and leaving traditional models behind.",
      link: "/dtmi/article/why-traditional-organizations-are-obsolete",
      date: "Dec 22, 2025",
      readTime: "7 min read",
      trending: true,
      category: "Digital Economy 4.0",
      image: "/images/Article 01_hero image.png",
    },
    {
      title:
        "Traditional Digital Transformation is Dead: Meet the Future of Business",
      excerpt:
        "Explore the next generation of transformation strategies that go beyond conventional approaches.",
      link: "/dtmi/article/traditional-digital-transformation-is-dead",
      date: "Dec 20, 2025",
      readTime: "10 min read",
      trending: true,
      category: "Digital Economy 4.0",
      image: "/images/Article 02_hero image.png",
    },
    {
      title:
        "Why Traditional Business Models Are Doomed in the Age of Cognitive Organizations",
      excerpt:
        "Understanding the shift from traditional to cognitive organizational structures.",
      link: "/dtmi/article/why-traditional-business-models-are-doomed",
      date: "Dec 15, 2025",
      readTime: "12 min read",
      trending: false,
      category: "Digital Cognitive Organisation",
      image: "/images/Article 03_hero image.png",
    },
  ],
  blogs: [
    {
      title: "Digital Transformation in Practice: Real Stories",
      excerpt:
        "Practical insights and experiences from digital transformation journeys across industries.",
      link: "/blog",
      date: "Dec 18, 2025",
      readTime: "8 min read",
      trending: true,
      category: "Digital Transformation",
      image: "/images/Article 01_hero image.png",
    },
    {
      title: "Building a Digital-First Culture",
      excerpt:
        "How organizations are fostering innovation and agility through cultural transformation.",
      link: "/blog",
      date: "Dec 10, 2025",
      readTime: "6 min read",
      trending: false,
      category: "Organizational Culture",
      image: "/images/Article 02_hero image.png",
    },
  ],
  predictionAnalysis: [
    {
      title: "2026 AI Transformation Predictions",
      excerpt:
        "Data-driven forecasts on how AI will reshape business operations in the coming year.",
      link: "/marketplace/dtmi",
      date: "Jan 2026",
      trending: true,
      category: "AI & Automation",
    },
    {
      title: "Future of Work: 5-Year Outlook",
      excerpt:
        "Predictive analysis on workforce evolution and digital workplace trends.",
      link: "/marketplace/dtmi",
      date: "Dec 2025",
      trending: true,
      category: "Future of Work",
    },
    {
      title: "Emerging Technology Impact Assessment",
      excerpt:
        "Forecasting the business impact of quantum computing, edge AI, and Web3.",
      link: "/marketplace/dtmi",
      date: "Nov 2025",
      trending: false,
      category: "Emerging Tech",
    },
  ],
  whitepapers: [
    {
      title: "Digital Economy 4.0: A Comprehensive Guide",
      excerpt:
        "In-depth exploration of the digital economy transformation and its implications.",
      link: "/whitepaper/digital-economy-4-0",
      date: "Dec 2025",
      trending: true,
      category: "Digital Economy 4.0",
    },
    {
      title: "Cognitive Organizations Framework",
      excerpt:
        "Complete framework for building and scaling cognitive organizational capabilities.",
      link: "/marketplace/dtmi",
      date: "Nov 2025",
      trending: false,
      category: "Digital Cognitive Organisation",
    },
  ],
};

export function ContentCategories() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("articles");
  const [sortBy, setSortBy] = useState("date");

  const tabs = [
    {
      id: "articles",
      label: "Articles",
      icon: FileText,
      count: contentData.articles.length,
    },
    {
      id: "blogs",
      label: "Blogs",
      icon: BookOpen,
      count: contentData.blogs.length,
    },
    {
      id: "predictionAnalysis",
      label: "Prediction Analysis",
      icon: TrendingUp,
      count: contentData.predictionAnalysis.length,
    },
    {
      id: "whitepapers",
      label: "Whitepapers",
      icon: FileText,
      count: contentData.whitepapers.length,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "articles":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentData.articles.map((article, idx) => (
              <div
                key={idx}
                onClick={() => navigate(article.link)}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {article.trending && (
                    <div className="absolute top-3 right-3 bg-brand-coral text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                      <TrendingUp size={12} className="mr-1" />
                      Trending
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full mb-3">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-coral transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {article.date}
                    </div>
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "blogs":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentData.blogs.map((blog, idx) => (
              <div
                key={idx}
                onClick={() => navigate(blog.link)}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {blog.trending && (
                    <div className="absolute top-3 right-3 bg-brand-coral text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                      <TrendingUp size={12} className="mr-1" />
                      Trending
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full mb-3">
                    {blog.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-coral transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {blog.date}
                    </div>
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {blog.readTime}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "predictionAnalysis":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentData.predictionAnalysis.map((prediction, idx) => (
              <div
                key={idx}
                onClick={() => navigate(prediction.link)}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-brand-coral" size={24} />
                  </div>
                  {prediction.trending && (
                    <span className="flex items-center text-brand-coral text-xs font-semibold">
                      <TrendingUp size={12} className="mr-1" />
                      Trending
                    </span>
                  )}
                </div>
                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full mb-3">
                  {prediction.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-coral transition-colors">
                  {prediction.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {prediction.excerpt}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar size={12} className="mr-1" />
                  {prediction.date}
                </div>
              </div>
            ))}
          </div>
        );

      case "whitepapers":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentData.whitepapers.map((whitepaper, idx) => (
              <div
                key={idx}
                onClick={() => navigate(whitepaper.link)}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center">
                    <FileText className="text-brand-coral" size={24} />
                  </div>
                  {whitepaper.trending && (
                    <span className="flex items-center text-brand-coral text-xs font-semibold">
                      <TrendingUp size={12} className="mr-1" />
                      Trending
                    </span>
                  )}
                </div>
                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full mb-3">
                  {whitepaper.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-coral transition-colors">
                  {whitepaper.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {whitepaper.excerpt}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar size={12} className="mr-1" />
                  {whitepaper.date}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore DTMI Content
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access our extensive library of research, insights, and analysis
            across digital transformation topics.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center ${
                  activeTab === tab.id
                    ? "bg-brand-coral text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon size={18} className="mr-2" />
                {tab.label}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter/Sort Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Filter by:
            </span>
            <select className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-brand-coral focus:border-brand-coral">
              <option>All Topics</option>
              <option>Digital Economy 4.0</option>
              <option>Digital Cognitive Organisation</option>
              <option>Digital Business Platform</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-brand-coral focus:border-brand-coral"
            >
              <option value="date">Latest</option>
              <option value="popularity">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        {/* Content Grid */}
        {renderContent()}

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/marketplace/dtmi")}
            className="px-8 py-3 bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl inline-flex items-center justify-center"
          >
            Browse Full Content Library
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}
