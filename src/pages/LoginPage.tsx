import React, { useEffect } from "react";
import { useAuth } from "../components/Header";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

interface LocationState {
  from?: {
    pathname: string;
  };
}

/**
 * Login Page - Handles Azure AD B2C authentication flow
 *
 * Flow:
 * 1. User tries to access a protected page without authentication
 * 2. ProtectedRoute redirects to /login?from=/original-page
 * 3. LoginPage triggers Azure B2C login via login()
 * 4. Azure B2C redirects back to the app after successful authentication
 * 5. AuthContext detects successful login via handleRedirectPromise()
 * 6. LoginPage detects authenticated state and redirects to original page
 */
export const LoginPage: React.FC = () => {
  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Get the original page from query parameter (survives Azure B2C redirect)
  // Falls back to location.state for direct navigation to /login
  const fromParam = searchParams.get("from");
  const fromState = (location.state as LocationState)?.from?.pathname;
  const from = fromParam || fromState || "/";

  useEffect(() => {
    // If already authenticated, redirect to the requested page
    if (!isLoading && user) {
      navigate(from, { replace: true });
      return;
    }

    // If not authenticated and not loading, trigger Azure B2C login
    if (!isLoading && !user) {
      login();
    }
  }, [user, isLoading, login, navigate, from]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">
          Authenticating...
        </h2>
      </div>
    </div>
  );
};

export default LoginPage;
