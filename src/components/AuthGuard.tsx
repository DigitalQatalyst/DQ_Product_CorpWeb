import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
  fallbackPath?: string;
}

export function AuthGuard({ 
  children, 
  requiredRole,
  requireAuth = true,
  fallbackPath = '/login'
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access if a specific role is required
  if (requiredRole && profile) {
    const hasRequiredRole = checkUserRole(profile.role, requiredRole);
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page or dashboard
      return (
        <Navigate 
          to="/unauthorized" 
          state={{ 
            requiredRole,
            currentRole: profile.role,
            from: location 
          }} 
          replace 
        />
      );
    }
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
}

// Helper function to check if user has sufficient role
function checkUserRole(userRole: UserRole, requiredRole: UserRole): boolean {
  // Admin has access to everything
  if (userRole === 'admin') {
    return true;
  }

  // HR Admin has access to HR viewer and below
  if (userRole === 'hr_admin') {
    return requiredRole === 'hr_admin' || requiredRole === 'hr_viewer';
  }

  // Creator has access to viewer and below
  if (userRole === 'creator') {
    return requiredRole === 'creator' || requiredRole === 'viewer';
  }

  // HR Viewer only has access to hr_viewer
  if (userRole === 'hr_viewer') {
    return requiredRole === 'hr_viewer';
  }

  // Viewer only has access to viewer
  if (userRole === 'viewer') {
    return requiredRole === 'viewer';
  }

  return false;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthGuardProps, 'children'> = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

// Role-specific guard components
export function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="admin">
      {children}
    </AuthGuard>
  );
}

export function CreatorGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="creator">
      {children}
    </AuthGuard>
  );
}

export function HRAdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="hr_admin">
      {children}
    </AuthGuard>
  );
}

export function HRViewerGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="hr_viewer">
      {children}
    </AuthGuard>
  );
}

// Hook to check if current user has specific role
export function useRoleCheck() {
  const { profile } = useAuth();

  const hasRole = React.useCallback((requiredRole: UserRole): boolean => {
    if (!profile) return false;
    return checkUserRole(profile.role, requiredRole);
  }, [profile]);

  const isAdmin = React.useCallback(() => hasRole('admin'), [hasRole]);
  const isCreator = React.useCallback(() => hasRole('creator'), [hasRole]);
  const isViewer = React.useCallback(() => hasRole('viewer'), [hasRole]);
  const isHRAdmin = React.useCallback(() => hasRole('hr_admin'), [hasRole]);
  const isHRViewer = React.useCallback(() => hasRole('hr_viewer'), [hasRole]);

  return {
    hasRole,
    isAdmin,
    isCreator,
    isViewer,
    isHRAdmin,
    isHRViewer,
    currentRole: profile?.role || null,
  };
}
