import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  
  const state = location.state as {
    requiredRole?: string;
    currentRole?: string;
    from?: {
      pathname: string;
    };
  } || {};

  const requiredRole = state?.requiredRole || 'Unknown';
  const currentRole = state?.currentRole || 'Unknown';
  const fromPath = state?.from?.pathname || '/';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-900/40" />
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          <div className="mb-8">
            <img
              src="/images/DQ Logo White.svg"
              alt="DigitalQatalyst"
              className="h-12 mb-8"
            />
            <h1 className="text-4xl font-bold text-white mb-4">
              Access{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-600">
                Denied
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              You don't have the required permissions to access this resource.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Permission Required</h3>
                <p className="text-gray-400">
                  This area requires specific role-based permissions that your current account doesn't have.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Return to Dashboard</h3>
                <p className="text-gray-400">
                  Navigate back to your dashboard or contact an administrator for access.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      {/* Right side - Error Details */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block lg:hidden mb-8">
              <img
                src="/images/DQ Logo White.svg"
                alt="DigitalQatalyst"
                className="h-10 mx-auto"
              />
            </Link>
            
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-400 mb-6">
              You don't have permission to access this page.
            </p>
          </div>

          {/* Error Details */}
          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Access Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Your Role:</span>
                <span className="text-white font-medium capitalize">{currentRole}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Required Role:</span>
                <span className="text-white font-medium capitalize">{requiredRole}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Attempted Page:</span>
                <span className="text-white font-medium text-sm truncate ml-2">
                  {fromPath}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-secondary-800/50 hover:bg-secondary-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
              
              <Link
                to="/admin-ui/dashboard"
                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </div>

            <div className="text-center">
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Sign out and switch account
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">
              Need access to this page?
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                Contact your system administrator to request the necessary permissions.
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="mailto:admin@digitalqatalyst.com"
                  className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
                >
                  Email Admin
                </a>
                <span className="text-gray-500">•</span>
                <Link
                  to="/support"
                  className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
                >
                  Get Help
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
