import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import {
  LayoutDashboard,
  Bell,
  FileText,
  Bookmark,
  Mail,
  User,
  Settings,
} from "lucide-react";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const topNavigationItems = [
    {
      id: "dashboard",
      label: "My Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "activity",
      label: "Activity Centre",
      icon: Bell,
      path: "/dashboard/activity",
    },
  ];

  const authorNavigationItems = [
    {
      id: "my-content",
      label: "My Content",
      icon: FileText,
      path: "/dashboard/my-content",
    },
  ];

  const preferencesNavigationItems = [
    {
      id: "saved-items",
      label: "Saved Items",
      icon: Bookmark,
      path: "/dashboard/saved-items",
    },
    {
      id: "subscriptions",
      label: "Email Subscriptions",
      icon: Mail,
      path: "/dashboard/subscriptions",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/dashboard/profile",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation - Fixed */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
          <nav className="flex-1 p-4">
            {/* Top Navigation Items */}
            <div className="space-y-1 mb-6">
              {topNavigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? "bg-secondary-600 text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Author Section */}
            <div className="mb-6">
              <h3 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Author
              </h3>
              <div className="space-y-1">
                {authorNavigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active
                          ? "bg-secondary-600 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* My Preferences Section */}
            <div>
              <h3 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                My Preferences
              </h3>
              <div className="space-y-1">
                {preferencesNavigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active
                          ? "bg-secondary-600 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Settings at the bottom */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => navigate("/dashboard/settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive("/dashboard/settings")
                  ? "bg-secondary-600 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
