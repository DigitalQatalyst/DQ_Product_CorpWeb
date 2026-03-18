import React, { PropsWithChildren, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Guards routes behind Supabase authentication.
 *
 * - While auth state is being determined → renders null (prevents flash)
 * - If unauthenticated → redirects to "/login" preserving the "from" location
 *   so the user can be bounced back after login
 * - If authenticated → renders children
 *
 * NOTE: This guard only checks **authentication** (is the user logged in?).
 * For **authorisation** (does the user have the required role/permission?)
 * use <AuthorizedRoute> which wraps this component.
 */
export const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // While determining auth state, render nothing to avoid a redirect flash
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Authenticated → render the protected content
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Not authenticated → redirect to login
  // Pass the attempted location as a query parameter so it survives redirect
  const loginPath = `/login?redirect=${encodeURIComponent(location.pathname)}`;
  return <Navigate to={loginPath} state={{ from: location }} replace />;
};

export default ProtectedRoute;
