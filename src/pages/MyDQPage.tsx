import React from "react";
import { Footer } from "../components/Footer/Footer";
import { useNavigate, Link } from "react-router-dom";
import { Bookmark, Bell, Tag, ArrowLeft } from "lucide-react";
import { useAuth } from "../components/Header/context/AuthContext";
import { useDarkMode } from "../hooks/useDarkMode";

const MyDQPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useDarkMode();

  const handleCreateAccount = () => {
    // For now, trigger mock login (we'll implement real signup later)
    handleSignIn();
  };

  const handleSignIn = () => {
    // Trigger the actual login flow
    // This will redirect to MSAL authentication
    login();
  };

  const handleGoogleSignIn = () => {
    // For now, use the same login flow
    // We'll implement Google OAuth later
    login();
  };

  const handleLinkedInSignIn = () => {
    // For now, use the same login flow
    // We'll implement LinkedIn OAuth later
    login();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimalistic Header */}
      <header className="bg-secondary py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={isDarkMode ? "/images/DQ Logo White.svg" : "/images/DQ Logo Dark.svg"}
              alt="DigitalQatalyst"
              className="h-10"
            />
          </Link>

          {/* Back to Home */}
          <Link
            to="/"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Side - Benefits */}
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Make My DQ yours
              </h1>
              <p className="text-xl text-white/80 mb-12">
                Join, customize, connect
              </p>

              <div className="space-y-8">
                {/* Personalized content feed */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Tag className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Personalized content feed
                    </h3>
                    <p className="text-white/70">
                      Curate a tailored feed of insights and research relevant
                      to your journey
                    </p>
                  </div>
                </div>

                {/* Saved items */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Bookmark className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Saved items</h3>
                    <p className="text-white/70">
                      Save articles, blogs, and case studies to access anytime
                      from your dashboard
                    </p>
                  </div>
                </div>

                {/* Email subscriptions */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Bell className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Email subscriptions
                    </h3>
                    <p className="text-white/70">
                      Get newsletters, webinars, and exclusive content delivered
                      to your inbox
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Sign In/Sign Up Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Get Started
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Create your account or sign in to access personalized insights
              </p>

              <div className="space-y-4">
                {/* Create Account Button */}
                <button
                  onClick={handleCreateAccount}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Create Account
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>

                {/* Sign In Button */}
                <button
                  onClick={handleSignIn}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg border-2 border-gray-200 transition-all duration-200"
                >
                  Sign In
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Social Sign In Buttons */}
                <button
                  onClick={handleSignIn}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="0" y="0" width="10" height="10" fill="#F25022" />
                    <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
                    <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
                    <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
                  </svg>
                  Login with Microsoft
                </button>
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10.2V12.05H15.6109C15.3727 13.3 14.6636 14.3591 13.6045 15.0682V17.5773H16.8273C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.2 20C12.9 20 15.1636 19.1045 16.8273 17.5773L13.6045 15.0682C12.7091 15.6682 11.5636 16.0227 10.2 16.0227C7.59545 16.0227 5.38182 14.2636 4.58636 11.9H1.25455V14.4909C2.90909 17.7591 6.29091 20 10.2 20Z"
                      fill="#34A853"
                    />
                    <path
                      d="M4.58636 11.9C4.38636 11.3 4.27273 10.6591 4.27273 10C4.27273 9.34091 4.38636 8.7 4.58636 8.1V5.50909H1.25455C0.572727 6.85909 0.2 8.38636 0.2 10C0.2 11.6136 0.572727 13.1409 1.25455 14.4909L4.58636 11.9Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10.2 3.97727C11.6864 3.97727 13.0182 4.48182 14.0636 5.47273L16.9182 2.61818C15.1591 0.981818 12.8955 0 10.2 0C6.29091 0 2.90909 2.24091 1.25455 5.50909L4.58636 8.1C5.38182 5.73636 7.59545 3.97727 10.2 3.97727Z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={handleLinkedInSignIn}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M18.5236 0H1.47639C0.660764 0 0 0.647222 0 1.44444V18.5556C0 19.3528 0.660764 20 1.47639 20H18.5236C19.3392 20 20 19.3528 20 18.5556V1.44444C20 0.647222 19.3392 0 18.5236 0ZM5.93056 17.0417H2.96528V7.49306H5.93056V17.0417ZM4.44792 6.19444C3.49653 6.19444 2.72569 5.42361 2.72569 4.47222C2.72569 3.52083 3.49653 2.75 4.44792 2.75C5.39931 2.75 6.17014 3.52083 6.17014 4.47222C6.17014 5.42361 5.39931 6.19444 4.44792 6.19444ZM17.0417 17.0417H14.0764V12.4028C14.0764 11.2944 14.0556 9.87153 12.5347 9.87153C10.9931 9.87153 10.7569 11.0764 10.7569 12.3194V17.0417H7.79167V7.49306H10.6389V8.80556H10.6806C11.0764 8.05556 12.0486 7.25694 13.5347 7.25694C16.5347 7.25694 17.0417 9.23611 17.0417 11.8056V17.0417Z"
                      fill="#0077B5"
                    />
                  </svg>
                  Continue with LinkedIn
                </button>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center mt-6">
                By continuing, you agree to our{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyDQPage;
