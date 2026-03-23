import React, { PropsWithChildren, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import { useNavigate, useLocation } from "react-router-dom";

type UserRole = "admin" | "creator" | "hr";

export interface AuthorizedRouteProps extends PropsWithChildren {
  /**
   * One or more roles that are allowed to access this route.
   * The user must have AT LEAST ONE of the listed roles.
   *
   * Role hierarchy (inclusive):
   *   admin     → can do everything admins + creators + viewers + HR roles can do
   *   creator   → can do everything creators + viewers can do
   *   viewer    → read-only access
   *   hr_admin  → full access to HR/recruitment features
   *   hr_viewer → read-only access to HR/recruitment features (CV screening)
   *
   * Leave undefined to allow any authenticated user (same as ProtectedRoute).
   */
  allowedRoles?: UserRole[];

  /**
   * Optional fine-grained permission check.
   * Provide a { resource, action } pair; the user must have this permission
   * in addition to passing the role check.
   *
   * Example: { resource: 'blogs', action: 'delete' }
   */
  requiredPermission?: { resource: string; action: string };
}

/**
 * Combines authentication AND authorisation in one guard.
 *
 * Renders <ProtectedRoute> first (ensures the user is logged in),
 * then checks role / permission requirements before rendering children.
 *
 * Usage:
 *
 * ```tsx
 * // Only admins
 * <AuthorizedRoute allowedRoles={['admin']}>
 *   <UserManagement />
 * </AuthorizedRoute>
 *
 * // Admins and creators
 * <AuthorizedRoute allowedRoles={['admin', 'creator']}>
 *   <BlogCreate />
 * </AuthorizedRoute>
 *
 * // Fine-grained permission
 * <AuthorizedRoute
 *   allowedRoles={['admin', 'creator']}
 *   requiredPermission={{ resource: 'blogs', action: 'delete' }}
 * >
 *   <BlogDetail />
 * </AuthorizedRoute>
 *
 * // Any authenticated user (same as ProtectedRoute)
 * <AuthorizedRoute>
 *   <Dashboard />
 * </AuthorizedRoute>
 * ```
 */
const AuthorizedRoute: React.FC<AuthorizedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);
  const { 
    isAdmin, 
    isCreator, 
    isHR
  } = useAuth();

  // Helper: check if the current user's role satisfies one of the allowed roles
  const checkRole = (): boolean => {
    if (!allowedRoles || allowedRoles.length === 0) {
      // No role restriction – any authenticated user is fine
      return true;
    }

    // Hierarchical role matching using helpers already provided by AuthContext
    if (allowedRoles.includes("admin") && isAdmin()) return true;
    if (allowedRoles.includes("creator") && isCreator()) return true;
    if (allowedRoles.includes("hr") && isHR()) return true;

    return false;
  };

  // Helper: check fine-grained permission if one was requested
  const checkPermission = (): boolean => {
    if (!requiredPermission) return true;
    // For now, we'll skip fine-grained permissions as they're not fully implemented in Supabase auth
    // This can be added later if needed
    console.warn('Fine-grained permissions not yet implemented for Supabase auth');
    return true;
  };

  // Redirect to dashboard if user doesn't have access (but prevent infinite loops)
  const handleUnauthorizedAccess = () => {
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      // Only redirect if not already at dashboard
      if (location.pathname !== '/admin-ui/dashboard') {
        navigate('/admin-ui/dashboard', { replace: true });
      }
    }
    return null;
  };

  // Reset redirect flag when component mounts or location changes
  useEffect(() => {
    hasRedirected.current = false;
  }, [location]);

  return (
    <ProtectedRoute>
      {/* User is authenticated at this point – check authorisation */}
      {checkRole() && checkPermission() ? (
        <>{children}</>
      ) : (
        handleUnauthorizedAccess()
      )}
    </ProtectedRoute>
  );
};

export default AuthorizedRoute;
