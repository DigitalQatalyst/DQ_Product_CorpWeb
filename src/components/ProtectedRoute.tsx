import React, { PropsWithChildren, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Header";

/**
 * Guards routes behind MSAL authentication.
 *
 * - While auth state is being determined → renders null (prevents flash)
 * - If unauthenticated → redirects to "/" preserving the "from" location
 *   so the user can be bounced back after login
 * - If authenticated → renders children
 *
 * NOTE: This guard only checks **authentication** (is the user logged in?).
 * For **authorisation** (does the user have the required role/permission?)
 * use <AuthorizedRoute> which wraps this component.
 */
export const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading, login } = useAuth();
  const location = useLocation();

  // Optional: auto-trigger login redirect when the user is not authenticated.
  // Set to `true` in production once B2C is fully configured.
  const AUTO_LOGIN = false;

  useEffect(() => {
    if (!isLoading && !user && AUTO_LOGIN) {
      login();
    }
  }, [isLoading, user, login, AUTO_LOGIN]);

  // While determining auth state, render nothing to avoid a redirect flash
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Authenticated → render the protected content
  if (user) {
    return <>{children}</>;
  }

  // Not authenticated and not auto-logging in → redirect to login
  // Pass the attempted location as a query parameter so it survives Azure B2C redirect
  const loginPath = `/login?from=${encodeURIComponent(location.pathname)}`;
  return <Navigate to={loginPath} state={{ from: location }} replace />;
};

export default ProtectedRoute;
