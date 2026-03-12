import { useState } from "react";
import { FileText, Eye, Clock, FileX, TrendingUp, Edit, Trash2, BarChart3, Plus } from "lucide-react";

const MyContentPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const articles = [
    {
      id: 1,
      title: "The Future of Digital Banking in Economy 4.0",
      category: "Digital Economy 4.0",
      status: "published",
      lastEdited: "2 days ago",
      publishedDate: "Dec 18, 2023",
      views: 1247,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "AI-Driven Decision Making: A Practical Guide",
      category: "Artificial Intelligence",
      status: "in-review",
      lastEdited: "5 hours ago",
      publishedDate: null,
      views: 0,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Building Cognitive Organizations: Step by Step",
      category: "Digital Economy 4.0",
      status: "draft",
      lastEdited: "Yesterday",
      publishedDate: null,
      views: 0,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Data Privacy in the Age of AI",
      category: "Technology",
      status: "published",
      lastEdited: "1 week ago",
      publishedDate: "Dec 10, 2023",
      views: 0,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop",
    },
    {
      id: 5,
      title: "Customer Experience in Digital Transformation",
      category: "Digital Economy 4.0",
      status: "rejected",
      lastEdited: "3 days ago",
      publishedDate: null,
      views: 0,
      feedback: "Revision required - Check feedback",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&auto=format&fit=crop",
    },
  ];

  // Calculate stats dynamically from articles
  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.status === "published").length,
    inReview: articles.filter((a) => a.status === "in-review").length,
    drafts: articles.filter((a) => a.status === "draft").length,
    rejected: articles.filter((a) => a.status === "rejected").length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
  };

  const filters = [
    { id: "all", label: `All (${stats.total})` },
    { id: "published", label: `Published (${stats.published})` },
    { id: "inReview", label: `In Review (${stats.inReview})` },
    { id: "drafts", label: `Drafts (${stats.drafts})` },
    { id: "rejected", label: `Rejected (${stats.rejected})` },
  ];

  const filteredArticles = articles.filter((article) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "inReview") return article.status === "in-review";
    if (activeFilter === "drafts") return article.status === "draft";
    if (activeFilter === "rejected") return article.status === "rejected";
    if (activeFilter === "published") return article.status === "published";
    return article.status === activeFilter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      published: { 
        bg: "bg-green-50", 
        text: "text-green-700", 
        icon: "✓",
        label: "Published" 
      },
      "in-review": { 
        bg: "bg-yellow-50", 
        text: "text-yellow-700", 
        icon: "⏱",
        label: "In Review" 
      },
      draft: { 
        bg: "bg-gray-50", 
        text: "text-gray-700", 
        icon: "📄",
        label: "Draft" 
      },
      rejected: { 
        bg: "bg-red-50", 
        text: "text-red-700", 
        icon: "⊘",
        label: "Rejected" 
      },
    };
    const badge = badges[status as keyof typeof badges] || badges.draft;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
        <span>{badge.icon}</span>
        {badge.label}
      </span>
    );
  };

  const handleCreateNew = () => {
    // Open CMS in new tab
    window.open("/admin-ui/media/new", "_blank");
  };

  const handleEdit = (id: number) => {
    // Open CMS edit page in new tab
    window.open(`/admin-ui/media/${id}`, "_blank");
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Content</h1>
            <div className="flex items-center gap-2">
              <p className="text-gray-600">Core Contributor • Manage your published articles and drafts</p>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
                DigitalQatalyst Core Contributor
              </span>
            </div>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-sm"
          >
            <Plus size={20} />
            Create New Article
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="text-gray-600" size={20} />
              <span className="text-sm text-gray-600">Total Articles</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
              </div>
              <span className="text-sm text-gray-600">Published</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.published}</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-yellow-600" size={20} />
              <span className="text-sm text-gray-600">In Review</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.inReview}</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <FileX className="text-gray-600" size={20} />
              <span className="text-sm text-gray-600">Drafts</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.drafts}</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-primary" size={20} />
              <span className="text-sm text-gray-600">Total Views</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeFilter === filter.id
                    ? "text-gray-900 border-b-2 border-secondary-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <FileText className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">
                {activeFilter === "all"
                  ? "Start creating your first article"
                  : `No articles in ${activeFilter} status`}
              </p>
              <button
                onClick={handleCreateNew}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Create New Article
              </button>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-5">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">{getStatusBadge(article.status)}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="text-secondary-600 font-medium">{article.category}</span>
                      <span>•</span>
                      <span>Last edited {article.lastEdited}</span>
                      {article.publishedDate && (
                        <>
                          <span>•</span>
                          <span>Published {article.publishedDate}</span>
                        </>
                      )}
                    </div>

                    {article.status === "published" && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Eye size={16} />
                        <span>{article.views.toLocaleString()} views</span>
                      </div>
                    )}

                    {article.feedback && (
                      <div className="mt-2 text-sm text-red-600 font-medium">{article.feedback}</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {article.status === "published" && (
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Analytics"
                      >
                        <BarChart3 size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(article.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    {article.status === "draft" && (
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyContentPage;
