import { useAuth } from "../../components/Header/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bookmark, FileText, Clock, Bell, ArrowRight } from "lucide-react";

const DashboardContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = {
    savedItems: 12,
    articlesRead: 24,
    readingTime: "8h",
    subscriptions: 5,
  };

  const recentActivity = [
    {
      id: 1,
      title: "5 Quick Wins for Digital Transformation",
      type: "Blog",
      category: "Read",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "AI in Everyday Business: Real Examples",
      type: "Blog",
      category: "Saved",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "The Future of Digital Banking",
      type: "Podcast",
      category: "Listened",
      time: "Yesterday",
    },
  ];

  const quickActions = [
    { label: "View Saved Items", path: "/dashboard/saved-items" },
    { label: "Manage Subscriptions", path: "/dashboard/subscriptions" },
    { label: "Edit Profile", path: "/dashboard/profile" },
    { label: "Explore Content", path: "/dtmi" },
  ];

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl font-bold">
          {user?.name?.substring(0, 2).toUpperCase() || "?"}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.givenName || user?.name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-gray-600">Here's what's happening with your account</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg mb-4">
            <Bookmark className="text-orange-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.savedItems}</div>
          <div className="text-sm text-gray-600">Saved Items</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-4">
            <FileText className="text-blue-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.articlesRead}</div>
          <div className="text-sm text-gray-600">Articles Read</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mb-4">
            <Clock className="text-purple-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.readingTime}</div>
          <div className="text-sm text-gray-600">Reading Time</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mb-4">
            <Bell className="text-green-600" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.subscriptions}</div>
          <div className="text-sm text-gray-600">Subscriptions</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{activity.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{activity.type}</span>
                    <span>•</span>
                    <span>{activity.category}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>

          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <span>{action.label}</span>
                <ArrowRight
                  size={16}
                  className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Feed Section */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Content feed | 224 articles</h2>
            <p className="text-sm text-gray-600 mt-1">The latest on interests you follow</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="group cursor-pointer"
              onClick={() => navigate("/dtmi")}
            >
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
              </div>
              <div className="text-xs text-primary font-semibold mb-2">Technology</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                Sample Article Title
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                Discover how leading organizations are leveraging artificial intelligence...
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/dtmi")}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
          >
            View All Articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
