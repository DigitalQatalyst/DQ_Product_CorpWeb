import { useState } from "react";
import { ExploreDropdown } from "./components/ExploreDropdown";
import { MobileDrawer } from "./components/MobileDrawer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../hooks/useDarkMode";

import { ArrowRight } from "lucide-react";

interface HeaderProps {
  "data-id"?: string;
}

export function Header({ "data-id": dataId }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();

  // Handle get in touch - redirect to consultation page
  const handleGetInTouch = () => {
    navigate("/consultation");
  };

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
                    !isDarkMode
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

            {/* Center: Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                to="/courses"
                className={`text-sm font-medium transition-colors ${
                  location.pathname.includes("/courses")
                    ? "text-white border-b-2 border-primary pb-1"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Courses
              </Link>
              <Link
                to="/products/marketplace"
                className={`text-sm font-medium transition-colors ${
                  location.pathname.includes("/products")
                    ? "text-white border-b-2 border-primary pb-1"
                    : "text-white/80 hover:text-primary-500"
                }`}
              >
                Products
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
            </nav>

            {/* Right: CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={handleGetInTouch}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Get Started
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center ml-auto">
              <MobileDrawer isSignedIn={false} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
