import { useEffect, useState } from "react";
import { ExploreDropdown } from "./components/ExploreDropdown";
import { MobileDrawer } from "./components/MobileDrawer";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationsMenu } from "./notifications/NotificationsMenu";
import { NotificationCenter } from "./notifications/NotificationCenter";
import { mockNotifications } from "./utils/mockNotifications";
import { useAuth } from "@/components/Header/context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../hooks/useDarkMode";

import { ArrowRight, AlertCircle, LogIn } from "lucide-react";

interface HeaderProps {
  "data-id"?: string;
}

export function Header({ "data-id": dataId }: HeaderProps) {
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const { user, isLoading, isSyncing, syncError, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();

  // Count unread notifications
  const unreadCount = mockNotifications.filter((notif) => !notif.read).length;

  // Toggle notifications menu
  const toggleNotificationsMenu = () => {
    setShowNotificationsMenu(!showNotificationsMenu);
    if (showNotificationCenter) setShowNotificationCenter(false);
  };

  // Open notification center
  const openNotificationCenter = () => {
    setShowNotificationCenter(true);
    setShowNotificationsMenu(false);
  };

  // Close notification center
  const closeNotificationCenter = () => {
    setShowNotificationCenter(false);
  };

  // Handle get in touch - redirect to consultation page
  const handleGetInTouch = () => {
    navigate("/consultation");
  };

  // Reset notification states when user logs out
  useEffect(() => {
    if (!user) {
      setShowNotificationsMenu(false);
      setShowNotificationCenter(false);
    }
  }, [user]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-secondary-900 shadow-md text-white transition-all duration-300`}
        data-id={dataId}
      >
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex flex-row items-center">
              <Link to="/" className="flex items-center px-4 py-2 rounded-md">
                <img
                  src={
                    isDarkMode
                      ? "/images/DQ Logo White.svg"
                      : "/images/DQ Logo Dark.svg"
                  }
                  alt="DigitalQatalyst"
                  className="h-12"
                />
              </Link>
            </div>

            {/* Left: Explore Dropdown */}
            <div className="hidden lg:flex items-center">
              <ExploreDropdown isCompact={false} />
            </div>

            {/* Center: Main Navigation */}
            <nav className="hidden lg:flex flex-1 items-center justify-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-semibold text-white transition-colors ${
                  location.pathname === "/"
                    ? "text-white"
                    : "text-white/80 hover:text-primary-500"
                }`}
              >
                Home
              </Link>
              <Link
                to="/services"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/services"
                    ? "text-white"
                    : "text-white/80 hover:text-primary-500"
                }`}
              >
                Services
              </Link>
              <Link
                to="/products"
                className={`text-sm font-medium transition-colors ${
                  location.pathname.includes("/products")
                    ? "text-white"
                    : "text-white/80 hover:text-primary-500"
                }`}
              >
                Products
              </Link>
              <Link
                to="/dtmi"
                className={`text-sm font-medium transition-colors ${
                  location.pathname.includes("/dtmi")
                    ? "text-white"
                    : "text-white/80 hover:text-primary-500"
                }`}
              >
                Insights
              </Link>
              <Link
                to="/about-us"
                className={`text-sm font-medium transition-colors ${
                  location.pathname.includes("/about-us")
                    ? "text-white"
                    : "text-white/80 hover:text-primary-500"
                }`}
              >
                Company
              </Link>
              {/* Research link hidden - feature/stage02-hide */}
              {/* <Link
                to="/research-report"
                className={`text-sm font-medium transition-colors ${
                  location.pathname.includes("/research-report")
                    ? "text-white border-b-2 border-primary pb-1"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Research
              </Link> */}
            </nav>

            {/* Right: CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={handleGetInTouch}
                className="flex flex-row items-center gap-2 bg-primary-500 text-white font-semibold px-6 py-2.5 rounded-lg shadow-lg hover:bg-primary-600 transition-all duration-200"
              >
                Get In Touch
                <ArrowRight size={18} />
              </button>

              {/* Login/Profile Section */}
              {isLoading ? (
                <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  {syncError && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100 text-xs">
                      <AlertCircle size={14} />
                      <span className="truncate max-w-xs">{syncError}</span>
                    </div>
                  )}
                  {isSyncing && (
                    <div className="text-xs text-white/60 animate-pulse">
                      Syncing...
                    </div>
                  )}
                  <ProfileDropdown />
                </div>
              ) : null}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center ml-auto">
              <MobileDrawer isSignedIn={!!user} />
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Menu */}
      {showNotificationsMenu && user && (
        <NotificationsMenu
          onViewAll={openNotificationCenter}
          onClose={() => setShowNotificationsMenu(false)}
        />
      )}
      {/* Notification Center Modal */}
      {showNotificationCenter && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeNotificationCenter}
          ></div>
          <div className="relative bg-white shadow-xl rounded-lg max-w-2xl w-full max-h-[90vh] m-4 transform transition-all duration-300">
            <NotificationCenter onBack={closeNotificationCenter} />
          </div>
        </div>
      )}
    </>
  );
}
