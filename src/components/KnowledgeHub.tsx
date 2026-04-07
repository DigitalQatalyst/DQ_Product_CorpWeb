import React, { useEffect, useState } from "react";
import {
  Calendar,
  BookOpen,
  Newspaper,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FadeInUpOnScroll } from "./AnimationUtils";
import { ContentItemCard } from "./Cards/ContentItemCard";
import { mockBlogs } from "../data/mockBlogs";
interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
  source?: string;
  slug?: string;
}

interface KnowledgeHubProps {
  // No props needed for mock data version
}
// Add new interface for tab items
interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Update SimpleTabs props interface
interface SimpleTabsProps {
  tabs: TabItem[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}
// Mock data for Articles tab - Our 3 DTMI articles
const articlesData: NewsItem[] = [
  {
    id: "16",
    title:
      "Why Traditional Business Models Are Doomed in the Age of Cognitive Organizations",
    excerpt:
      "Explore why traditional business models are becoming obsolete and how Digital Cognitive Organizations (DCOs) are revolutionizing the way businesses operate in the digital economy.",
    date: "December 10, 2025",
    category: "Digital Economy 4.0",
    source: "DigitalQatalyst",
    imageUrl: "/images/Article 01_hero image.png",
  },
  {
    id: "17",
    title:
      "Traditional Digital Transformation is Dead: Meet the Future of Business",
    excerpt:
      "Discover why traditional digital transformation strategies are no longer enough and how Digital Cognitive Organizations represent the future of business in Economy 4.0.",
    date: "December 10, 2025",
    category: "Digital Economy 4.0",
    source: "DigitalQatalyst",
    imageUrl: "/images/Article 02_hero image.png",
  },
  {
    id: "18",
    title:
      "Why Traditional Organizations Are Obsolete in Today's Digital Economy",
    excerpt:
      "Learn why traditional organizational structures are becoming obsolete and how businesses can transform into adaptive, intelligent Digital Cognitive Organizations.",
    date: "December 10, 2025",
    category: "Digital Economy 4.0",
    source: "DigitalQatalyst",
    imageUrl: "/images/Article 03_hero image.png",
  },
];
// Simple Tab Component (matching services marketplace style)
const SimpleTabs: React.FC<SimpleTabsProps> = ({
  tabs,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="border-b border-gray-200 mb-8">
      <div className="flex justify-center space-x-8">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(index)}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
              activeTab === index
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            <span className="ml-2">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
// Main KnowledgeHub Content Component
const KnowledgeHubContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // 0: Articles, 1: Blogs, 2: Events
  const [isTabChanging, setIsTabChanging] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  // Define tabs
  const tabs = [
    {
      id: "articles",
      label: "Articles",
      icon: <Newspaper size={16} />,
    },
    {
      id: "blogs",
      label: "Blogs",
      icon: <BookOpen size={16} />,
    },
    {
      id: "events",
      label: "Events",
      icon: <Calendar size={16} />,
    },
  ];
  // Handle tab change with animation
  const handleTabChange = (index: number) => {
    setIsTabChanging(true);
    setCurrentPage(1); // Reset to first page when changing tabs
    setTimeout(() => {
      setActiveTab(index);
      setIsTabChanging(false);
    }, 300);
  };

  // Handle bookmark toggle
  const handleToggleBookmark = (id: string) => {
    setBookmarkedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Format date helper
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "";
    }
  };
  // Get data based on active tab with pagination
  const getArticlesData = () => {
    const data = articlesData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      items: data.slice(startIndex, endIndex),
      totalItems: data.length,
      totalPages: Math.ceil(data.length / itemsPerPage),
    };
  };

  const getBlogsData = () => {
    const data = mockBlogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt,
      date: blog.publishDate,
      category: blog.category,
      imageUrl: blog.heroImage,
      source: "DigitalQatalyst Blog",
      slug: blog.slug,
    }));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      items: data.slice(startIndex, endIndex),
      totalItems: data.length,
      totalPages: Math.ceil(data.length / itemsPerPage),
    };
  };
  // Pagination component
  const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </button>

        <div className="flex space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === page
                  ? 'bg-primary text-white'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    );
  };
  // Commented out Supabase integration for now - using static data
  // const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  // const [resources, setResources] = useState<Resource[]>([]);
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 relative inline-block">
            Stay Informed with Our Latest Digital Transformation Insights
            {/* <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-400 transform origin-left"></span> */}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Gain Actionable Insights to Lead Your Organization into the Next
            Phase of Digital Growth.
          </p>
          {/* <div className="mt-4">
            <a href="/admin-ui/media/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Add Content
            </a>
          </div> */}
        </FadeInUpOnScroll>
        {/* Simple Tabs */}
        <div className="flex justify-center mb-8">
          <SimpleTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
        </div>
        {/* Tab Content with Fade Transition */}
        <div
          className={`transition-opacity duration-300 ${isTabChanging ? "opacity-0" : "opacity-100"
            }`}
        >
          {/* Articles Tab */}
          {activeTab === 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getArticlesData().items.map((item) => (
                  <div
                    key={item.id}
                    className="transition-all duration-300 hover:scale-105"
                  >
                    <ContentItemCard
                      id={item.id}
                      type="Article"
                      title={item.title}
                      description={item.excerpt}
                      imageUrl={item.imageUrl}
                      source={item.source || "DigitalQatalyst"}
                      date={formatDate(item.date)}
                      isBookmarked={bookmarkedItems.has(item.id)}
                      onToggleBookmark={() => handleToggleBookmark(item.id)}
                      onClick={() =>
                        navigate(
                          `/dtmi/article/${item.id === "16" ? "why-traditional-business-models-are-doomed" : item.id === "17" ? "traditional-digital-transformation-is-dead" : "why-traditional-organizations-are-obsolete"}`,
                        )
                      }
                    />
                  </div>
                ))}
              </div>
              <PaginationControls
                currentPage={currentPage}
                totalPages={getArticlesData().totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}

          {/* Blogs Tab */}
          {activeTab === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getBlogsData().items.map((item) => (
                  <div
                    key={item.id}
                    className="transition-all duration-300 hover:scale-105"
                  >
                    <ContentItemCard
                      id={item.id}
                      type="Blog"
                      title={item.title}
                      description={item.excerpt}
                      imageUrl={item.imageUrl}
                      source={item.source || "DigitalQatalyst Blog"}
                      date={formatDate(item.date)}
                      isBookmarked={bookmarkedItems.has(item.id)}
                      onToggleBookmark={() => handleToggleBookmark(item.id)}
                      onClick={() => navigate(`/blog/${item.slug}`)}
                    />
                  </div>
                ))}
              </div>
              <PaginationControls
                currentPage={currentPage}
                totalPages={getBlogsData().totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}

          {/* Events Tab */}
          {activeTab === 2 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6">
                <Calendar size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Upcoming Events
                </h3>
                <p className="text-gray-500 max-w-md">
                  We don't have any events scheduled at the moment. Check back
                  later for exciting workshops, webinars, and networking
                  opportunities.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Animations are handled by Tailwind CSS classes */}
    </div>
  );
};

// Main KnowledgeHub component
const KnowledgeHub: React.FC<KnowledgeHubProps> = () => {
  return <KnowledgeHubContent />;
};

export default KnowledgeHub;
