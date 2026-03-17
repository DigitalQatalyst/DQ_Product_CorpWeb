import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import { ArrowRight, User, LogOut, Settings, Menu, X } from "lucide-react";

interface AdminHeaderProps {
  title?: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate("/login");
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <header className="bg-secondary-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Title */}
          <div className="flex items-center">
            <Link to="/admin-ui/dashboard" className="flex items-center">
              <img
                src="/images/DQ Logo White.svg"
                alt="DigitalQatalyst"
                className="h-8 mr-4"
              />
              <div>
                <h1 className="text-lg font-semibold text-white">Admin Dashboard</h1>
                {title && <p className="text-xs text-gray-400">{title}</p>}
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/admin-ui/dashboard"
              className={`text-sm font-medium transition-colors ${
                isActive("/admin-ui/dashboard")
                  ? "text-primary-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin-ui/media"
              className={`text-sm font-medium transition-colors ${
                isActive("/admin-ui/media")
                  ? "text-primary-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Media
            </Link>
            <Link
              to="/admin-ui/blog"
              className={`text-sm font-medium transition-colors ${
                isActive("/admin-ui/blog")
                  ? "text-primary-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Blog
            </Link>
            <Link
              to="/admin-ui/job-applications"
              className={`text-sm font-medium transition-colors ${
                isActive("/admin-ui/job-applications")
                  ? "text-primary-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Recruitment
            </Link>
            <Link
              to="/admin-ui/settings"
              className={`text-sm font-medium transition-colors ${
                isActive("/admin-ui/settings")
                  ? "text-primary-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Settings
            </Link>
          </nav>

          {/* Right: User Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-white hidden sm:block">
                  {profile?.name || user?.email}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-secondary-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white truncate">
                      {profile?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-primary-400 capitalize">
                      {profile?.role || 'user'}
                    </p>
                  </div>
                  
                  <Link
                    to="/admin-ui/settings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div className="flex items-center gap-2">
                      <Settings size={16} />
                      Settings
                    </div>
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-700 py-4">
            <nav className="space-y-2">
              <Link
                to="/admin-ui/dashboard"
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/admin-ui/dashboard")
                    ? "text-primary-400 bg-white/10"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/admin-ui/media"
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/admin-ui/media")
                    ? "text-primary-400 bg-white/10"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Media
              </Link>
              <Link
                to="/admin-ui/blog"
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/admin-ui/blog")
                    ? "text-primary-400 bg-white/10"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Blog
              </Link>
              <Link
                to="/admin-ui/job-applications"
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/admin-ui/job-applications")
                    ? "text-primary-400 bg-white/10"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Recruitment
              </Link>
              <Link
                to="/admin-ui/settings"
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("/admin-ui/settings")
                    ? "text-primary-400 bg-white/10"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Settings
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
