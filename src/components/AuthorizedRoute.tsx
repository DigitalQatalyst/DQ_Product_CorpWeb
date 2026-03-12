import React, { PropsWithChildren } from "react";
import { useAuth } from "./Header";
import ProtectedRoute from "./ProtectedRoute";
import AccessDenied from "./AccessDenied";

type UserRole = "admin" | "creator" | "viewer" | "HR-Admin" | "HR-viewer";

export interface AuthorizedRouteProps extends PropsWithChildren {
  /**
   * One or more roles that are allowed to access this route.
   * The user must have AT LEAST ONE of the listed roles.
   *
   * Role hierarchy (inclusive):
   *   admin     → can do everything admins + creators + viewers + HR roles can do
   *   creator   → can do everything creators + viewers can do
   *   viewer    → read-only access
   *   HR-Admin  → full access to HR/recruitment features
   *   HR-viewer → read-only access to HR/recruitment features (CV screening)
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

  /**
   * Custom message shown on the access-denied screen.
   */
  deniedMessage?: string;
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
  deniedMessage,
}) => {
  const { isAdmin, isCreator, isViewer, isHRAdmin, isHRViewer, hasPermission } =
    useAuth();

  // Helper: check if the current user's role satisfies one of the allowed roles
  const checkRole = (): boolean => {
    if (!allowedRoles || allowedRoles.length === 0) {
      // No role restriction – any authenticated user is fine
      return true;
    }

    // Hierarchical role matching using the helpers already provided by AuthContext
    if (allowedRoles.includes("admin") && isAdmin()) return true;
    if (allowedRoles.includes("creator") && isCreator()) return true;
    if (allowedRoles.includes("viewer") && isViewer()) return true;
    if (allowedRoles.includes("HR-Admin") && isHRAdmin()) return true;
    if (allowedRoles.includes("HR-viewer") && isHRViewer()) return true;

    return false;
  };

  // Helper: check fine-grained permission if one was requested
  const checkPermission = (): boolean => {
    if (!requiredPermission) return true;
    return hasPermission(
      requiredPermission.resource,
      requiredPermission.action,
    );
  };

  return (
    <ProtectedRoute>
      {/* User is authenticated at this point – check authorisation */}
      {checkRole() && checkPermission() ? (
        <>{children}</>
      ) : (
        <AccessDenied
          message={
            deniedMessage ??
            (allowedRoles
              ? `This page is restricted to users with one of the following roles: ${allowedRoles.join(", ")}.`
              : "You do not have permission to access this page.")
          }
        />
      )}
    </ProtectedRoute>
  );
};

export default AuthorizedRoute;
