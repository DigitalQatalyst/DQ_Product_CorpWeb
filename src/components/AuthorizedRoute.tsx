import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, X } from 'lucide-react';

interface AuthorizedRouteProps {
  children?: React.ReactNode;
  allowedRoles: string[];
  requiredPermission?: string;
  deniedMessage?: string;
}

const AuthorizedRoute: React.FC<AuthorizedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission,
  deniedMessage,
}) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based authorization
  const hasRequiredRole = profile && allowedRoles.includes(profile.role);
  
  if (!hasRequiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 px-4">
        <div className="max-w-md w-full bg-secondary-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <X className="w-8 h-8 text-red-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Access Denied
          </h2>
          
          <p className="text-gray-300 mb-6">
            {deniedMessage || 'You do not have permission to access this page.'}
          </p>
          
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-red-400 text-sm font-medium mb-1">Required role:</p>
                <p className="text-gray-300 text-sm">
                  {allowedRoles.join(' or ')}
                </p>
                {profile && (
                  <>
                    <p className="text-red-400 text-sm font-medium mb-1 mt-3">Your current role:</p>
                    <p className="text-gray-300 text-sm capitalize">{profile.role}</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
              <Link
                to="/"
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthorizedRoute;
