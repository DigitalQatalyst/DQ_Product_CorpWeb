import { useState } from "react";
import { Bookmark, FileText, Video, Headphones, Plus, Trash2 } from "lucide-react";

const SavedItemsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>(null);

  // Mock data - replace with real data later
  const playlists = [
    { id: 1, name: "AI & Automation", count: 8, type: "Mixed" },
    { id: 2, name: "Digital Strategy", count: 12, type: "Videos" },
    { id: 3, name: "Leadership Podcasts", count: 6, type: "Podcasts" },
  ];

  // Mock playlist items
  const playlistItems: Record<number, any[]> = {
    1: [
      {
        id: 101,
        type: "Video",
        title: "AI Implementation Strategies",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
        duration: "12:45",
        category: "video",
      },
      {
        id: 102,
        type: "Podcast",
        title: "Automation in Modern Business",
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop",
        duration: "28:30",
        category: "podcast",
      },
    ],
    2: [
      {
        id: 201,
        type: "Video",
        title: "Digital Transformation Roadmap",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
        duration: "15:20",
        category: "video",
      },
      {
        id: 202,
        type: "Video",
        title: "Building a Data-Driven Culture",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
        duration: "18:45",
        category: "video",
      },
    ],
    3: [
      {
        id: 301,
        type: "Podcast",
        title: "Leadership in Digital Age",
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop",
        duration: "32:15",
        category: "podcast",
      },
      {
        id: 302,
        type: "Podcast",
        title: "The Future of Digital Banking",
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop",
        duration: "25:40",
        category: "podcast",
      },
    ],
  };

  const savedItems = [
    {
      id: 1,
      type: "Blog",
      title: "5 Quick Wins for Digital Transformation",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop",
      savedDate: "2 days ago",
      category: "blog",
    },
    {
      id: 2,
      type: "Blog",
      title: "AI in Everyday Business: Real Examples",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
      savedDate: "5 days ago",
      category: "blog",
    },
    {
      id: 3,
      type: "Video",
      title: "Building a Data-Driven Culture",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
      savedDate: "1 week ago",
      category: "video",
    },
    {
      id: 4,
      type: "Podcast",
      title: "The Future of Digital Banking",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop",
      savedDate: "2 weeks ago",
      category: "podcast",
    },
  ];

  const tabs = [
    { id: "all", label: "All Items", icon: Bookmark },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "videos", label: "Videos", icon: Video },
    { id: "podcasts", label: "Podcasts", icon: Headphones },
  ];

  const filteredItems =
    activeTab === "all"
      ? savedItems
      : savedItems.filter((item) => item.category === activeTab.slice(0, -1));

  // Get current playlist if one is selected
  const currentPlaylist = selectedPlaylist
    ? playlists.find((p) => p.id === selectedPlaylist)
    : null;
  const currentPlaylistItems = selectedPlaylist
    ? playlistItems[selectedPlaylist] || []
    : [];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Bookmark className="text-primary" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">Saved Items</h1>
            </div>
            <p className="text-gray-600">
              Access all your saved content and playlists in one place
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Playlists */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Playlists</h2>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
                    <Plus size={16} />
                    New
                  </button>
                </div>

                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                      onClick={() => {
                        setSelectedPlaylist(playlist.id);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* List Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-400"
                          >
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">
                            {playlist.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {playlist.count} items • {playlist.type}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Playlist Header (when playlist is selected) */}
              {selectedPlaylist && currentPlaylist && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <button
                    onClick={() => setSelectedPlaylist(null)}
                    className="text-sm text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to all items
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {currentPlaylist.name}
                      </h2>
                      <p className="text-gray-600">
                        {currentPlaylist.count} items • {currentPlaylist.type}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs (only show when no playlist is selected) */}
              {!selectedPlaylist && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                  <div className="flex border-b border-gray-200 overflow-x-auto">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                            activeTab === tab.id
                              ? "text-gray-900 border-b-2 border-gray-900"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          <Icon size={18} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Saved Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(selectedPlaylist ? currentPlaylistItems : filteredItems).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all"
                  >
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden bg-gray-200 cursor-pointer">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Play button overlay for videos/podcasts */}
                      {(item.type === "Video" || item.type === "Podcast") && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="text-gray-900 ml-1"
                            >
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </div>
                        </div>
                      )}
                      {/* Duration badge */}
                      {item.duration && (
                        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {item.duration}
                        </div>
                      )}
                      {/* Delete button overlay */}
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-100 z-10">
                        <Trash2 size={16} className="text-gray-600" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="text-xs font-semibold text-gray-600 mb-2">
                        {item.type}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="text-sm text-gray-500">
                        Saved {item.savedDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State (if no items) */}
              {(selectedPlaylist ? currentPlaylistItems : filteredItems).length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <Bookmark className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No saved items yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start saving articles, videos, and podcasts to access them here
                  </p>
                  <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Explore Content
                  </button>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default SavedItemsPage;
