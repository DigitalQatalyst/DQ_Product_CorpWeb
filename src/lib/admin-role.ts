/** Roles that may access the admin dashboard and admin APIs. */
const ADMIN_ROLES = new Set(["admin"]);

export function isAdminProfileRole(role: string | null | undefined): boolean {
  if (!role) return false;
  return ADMIN_ROLES.has(role.trim().toLowerCase());
}
