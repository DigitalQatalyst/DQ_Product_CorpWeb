import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface PropsWithChildren {
  children?: React.ReactNode;
}

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
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
