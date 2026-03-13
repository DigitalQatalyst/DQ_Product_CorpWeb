import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/Header/context/AuthContext";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Building2,
  Newspaper,
  Users,
  Package,
  Home,
  Briefcase,
  Lightbulb,
  Info,
  Phone,
  FileText,
  LogIn,
  LogOut,
} from "lucide-react";

interface MobileDrawerProps {
  isSignedIn: boolean;
}

const marketplaces = [
  {
    id: "services",
    name: "Service Marketplace",
    description:
      "Explore our comprehensive digital transformation services across all sectors",
    icon: Building2,
    href: "/services",
  },
  {
    id: "products",
    name: "Product Marketplace",
    description:
      "Discover our digital accelerators: TMaaS, DTO4T, DTMP, DTMA, DTMI, DTMB, DWS",
    icon: Package,
    href: "/products",
  },
];

const mainNavItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Services",
    href: "/services",
    icon: Briefcase,
  },
  {
    name: "Products",
    href: "/products",
    icon: Package,
  },
  {
    name: "Insights",
    href: "/dtmi",
    icon: Lightbulb,
  },
  {
    name: "Company",
    href: "/about-us",
    icon: Info,
  },
  // Research hidden - feature/stage02-hide
  // {
  //   name: "Research",
  //   href: "/research-report",
  //   icon: FileText,
  // },
];

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

export function MobileDrawer({ isSignedIn }: MobileDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExploreExpanded, setIsExploreExpanded] = useState(false);

  useEffect(() => {
    if (isDrawerOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [isDrawerOpen]);

  const handleGetInTouchClick = () => {
    navigate("/consultation");
    setIsDrawerOpen(false);
  };

  const handleLoginClick = () => {
    login();
    setIsDrawerOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    setIsDrawerOpen(false);
  };

  const handleMarketplaceClick = (href: string) => {
    if (isExternal(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      navigate(href);
    }
    setIsDrawerOpen(false);
  };

  const handleNavClick = (href: string) => {
    navigate(href);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Always visible primary CTA + hamburger menu for Mobile (<768px) */}
      <div className="flex items-center space-x-2 md:hidden">
        {!isSignedIn && (
          <button
            className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 font-medium text-sm"
            onClick={handleGetInTouchClick}
          >
            Get In Touch
          </button>
        )}
        {/* Hamburger menu button */}
        <button
          className="p-2 text-white hover:bg-white/10 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          aria-label="Open navigation menu"
          aria-expanded={isDrawerOpen}
        >
          {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Tablet hamburger menu (768px - 1023px) */}
      <div className="hidden md:flex lg:hidden items-center">
        <button
          className="p-2 text-white hover:bg-white/10 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          aria-label="Open navigation menu"
          aria-expanded={isDrawerOpen}
        >
          {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile and Tablet drawer overlay */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsDrawerOpen(false)}
          />
          {/* Mobile and Tablet drawer */}
          <div className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-gray-50 to-white shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Drawer content - scrollable area */}
              <div className="flex-1 overflow-y-auto">
                {/* Main Navigation Section */}
                <div className="px-6 py-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Navigation
                  </h3>
                  <div className="space-y-1">
                    {mainNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        location.pathname === item.href ||
                        (item.href !== "/" &&
                          location.pathname.startsWith(item.href));

                      return (
                        <button
                          key={item.name}
                          className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary border-l-4 border-primary"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => handleNavClick(item.href)}
                        >
                          <Icon
                            size={20}
                            className={`mr-3 ${isActive ? "text-primary" : "text-gray-500"}`}
                          />
                          <span className="font-medium">{item.name}</span>
                          {isActive && (
                            <ChevronRight
                              size={16}
                              className="ml-auto text-primary"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 mx-6 my-2"></div>

                {/* Explore Marketplaces Section */}
                <div className="px-6 py-4">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    onClick={() => setIsExploreExpanded(!isExploreExpanded)}
                    aria-expanded={isExploreExpanded}
                  >
                    <div className="flex items-center">
                      <Building2 size={20} className="mr-3 text-gray-500" />
                      <span>Explore Marketplaces</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform ${
                        isExploreExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExploreExpanded && (
                    <div className="mt-2 ml-8 space-y-1">
                      {marketplaces.map((marketplace) => {
                        const Icon = marketplace.icon;
                        return (
                          <button
                            key={marketplace.id}
                            className="w-full flex items-start px-3 py-2.5 text-left hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() =>
                              handleMarketplaceClick(marketplace.href)
                            }
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <Icon size={16} className="text-primary" />
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {marketplace.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {marketplace.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 mx-6 my-2"></div>

                {/* Get In Touch Section */}
                <div className="px-6 py-4 space-y-3">
                  {!isSignedIn ? (
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors font-medium shadow-lg"
                      onClick={handleLoginClick}
                    >
                      <div className="flex items-center">
                        <LogIn size={20} className="mr-3 text-white" />
                        <span>Sign In</span>
                      </div>
                      <ChevronRight size={16} className="text-white" />
                    </button>
                  ) : (
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-medium shadow-lg"
                      onClick={handleLogoutClick}
                    >
                      <div className="flex items-center">
                        <LogOut size={20} className="mr-3 text-white" />
                        <span>Sign Out</span>
                      </div>
                      <ChevronRight size={16} className="text-white" />
                    </button>
                  )}
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors font-medium shadow-lg"
                    onClick={handleGetInTouchClick}
                  >
                    <div className="flex items-center">
                      <Phone size={20} className="mr-3 text-white" />
                      <span>Get In Touch</span>
                    </div>
                    <ChevronRight size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
