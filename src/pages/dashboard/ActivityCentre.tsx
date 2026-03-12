import { useState } from "react";
import { Bell, Check, Trash2, FileText, Bookmark, Mail, User } from "lucide-react";

const ActivityCentre = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "content",
      icon: "document",
      title: "New article published",
      description: '"The Future of AI in Banking" matches your interests',
      time: "2 hours ago",
      link: "View article →",
      unread: true,
      date: "today",
    },
    {
      id: 2,
      type: "content",
      icon: "document",
      title: "Recommended for you",
      description: "3 new articles in Digital Transformation 2.0",
      time: "5 hours ago",
      link: "View article →",
      unread: true,
      date: "today",
    },
    {
      id: 3,
      type: "system",
      icon: "bookmark",
      title: "Saved item reminder",
      description: "You have 5 unread saved articles",
      time: "1 day ago",
      link: "",
      unread: false,
      date: "yesterday",
    },
    {
      id: 4,
      type: "system",
      icon: "mail",
      title: "Weekly newsletter sent",
      description: "DQ Weekly Newsletter: Top insights from this week",
      time: "2 days ago",
      link: "",
      unread: false,
      date: "this-week",
    },
    {
      id: 5,
      type: "content",
      icon: "document",
      title: "New content in your sectors",
      description: "2 new articles in Banking & Capital Markets",
      time: "3 days ago",
      link: "",
      unread: false,
      date: "this-week",
    },
    {
      id: 6,
      type: "system",
      icon: "user",
      title: "Profile updated",
      description: "Your professional information has been saved",
      time: "5 days ago",
      link: "",
      unread: false,
      date: "this-week",
    },
    {
      id: 7,
      type: "system",
      icon: "mail",
      title: "New subscription confirmed",
      description: "You are now subscribed to Digital Transformation Updates",
      time: "1 week ago",
      link: "",
      unread: false,
      date: "earlier",
    },
  ]);

  const unreadCount = activities.filter((a) => a.unread).length;

  const filters = [
    { id: "all", label: "All" },
    { id: "unread", label: `Unread (${unreadCount})` },
    { id: "content", label: "Content" },
    { id: "system", label: "System" },
  ];

  const handleMarkAllRead = () => {
    setActivities(activities.map((a) => ({ ...a, unread: false })));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      setActivities([]);
    }
  };

  const handleMarkAsRead = (id: number) => {
    setActivities(
      activities.map((a) => (a.id === id ? { ...a, unread: false } : a))
    );
  };

  const handleDelete = (id: number) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const filteredActivities = activities.filter((activity) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return activity.unread;
    return activity.type === activeFilter;
  });

  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, typeof activities>);

  const dateLabels: Record<string, string> = {
    today: "TODAY",
    yesterday: "YESTERDAY",
    "this-week": "THIS WEEK",
    earlier: "EARLIER",
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "document":
        return <FileText size={20} className="text-blue-600" />;
      case "bookmark":
        return <Bookmark size={20} className="text-orange-600" />;
      case "mail":
        return <Mail size={20} className="text-purple-600" />;
      case "user":
        return <User size={20} className="text-green-600" />;
      default:
        return <Bell size={20} className="text-gray-600" />;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="text-primary" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Activity Centre</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-secondary-900 text-white text-xs font-semibold rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-gray-600">
            Stay updated with your latest notifications and activity
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === filter.id
                    ? "bg-secondary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Check size={16} />
                Mark all as read
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Trash2 size={16} />
              Clear all
            </button>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-6">
          {Object.keys(groupedActivities).length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <Bell className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-600">
                You're all caught up! Check back later for new updates.
              </p>
            </div>
          ) : (
            Object.entries(groupedActivities).map(([date, items]) => (
              <div key={date}>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  {dateLabels[date]}
                </h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                  {items.map((activity) => (
                    <div
                      key={activity.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        activity.unread ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                            activity.icon === "document"
                              ? "bg-blue-100"
                              : activity.icon === "bookmark"
                              ? "bg-orange-100"
                              : activity.icon === "mail"
                              ? "bg-purple-100"
                              : "bg-green-100"
                          }`}
                        >
                          {getIcon(activity.icon)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {activity.title}
                            </h4>
                            {activity.unread && (
                              <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500">
                              {activity.time}
                            </span>
                            {activity.link && (
                              <button className="text-xs text-primary hover:text-primary-600 font-medium">
                                {activity.link}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex items-center gap-2">
                          {activity.unread && (
                            <button
                              onClick={() => handleMarkAsRead(activity.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(activity.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCentre;
