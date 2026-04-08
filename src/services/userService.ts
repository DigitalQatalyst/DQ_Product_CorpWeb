/**
 * userService.ts - Unified User Management Service
 *
 * Provides functions to manage users in Supabase with the new unified users table.
 * Handles CRUD operations on users, role management, and profile updates.
 *
 * Replaces the old adminUserService which only handled admin_users.
 */

import { getPrimarySupabase } from "../lib/supabaseClients";
import { isValidEmail } from "../utils/emailValidation";

export type UserRole = "admin" | "creator" | "viewer";

export interface UserProfile {
  id: string;
  auth_user_id?: string;
  email: string;
  name: string;
  title?: string;
  bio?: string;
  avatar_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  role: UserRole;
  is_active: boolean;
  department?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  role?: UserRole;
  title?: string;
  bio?: string;
  avatar_url?: string;
  department?: string;
}

export interface UpdateUserInput {
  name?: string;
  title?: string;
  bio?: string;
  avatar_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  department?: string;
  role?: UserRole;
  is_active?: boolean;
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(limit?: number, offset?: number) {
  const query = getPrimarySupabase()
    .from("users")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (limit) query.limit(limit);
  if (offset) query.range(offset, offset + (limit || 10) - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }

  return { users: data as UserProfile[], total: count };
}

/**
 * Get a single user by ID
 */
export async function getUserById(userId: string) {
  const { data, error } = await getPrimarySupabase()
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Failed to fetch user:", error);
    throw error;
  }

  return data as UserProfile | null;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const { data, error } = await getPrimarySupabase()
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Failed to fetch user by email:", error);
    throw error;
  }

  return data as UserProfile | null;
}

/**
 * Get user by auth_user_id (Azure B2C user ID)
 */
export async function getUserByAuthId(authUserId: string) {
  const { data, error } = await getPrimarySupabase()
    .from("users")
    .select("*")
    .eq("auth_user_id", authUserId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Failed to fetch user by auth_user_id:", error);
    throw error;
  }

  return data as UserProfile | null;
}

/**
 * Create a new user (admin only)
 */
export async function createUser(input: CreateUserInput) {
  const { data, error } = await getPrimarySupabase()
    .from("users")
    .insert([
      {
        email: input.email,
        name: input.name,
        role: input.role || "viewer",
        title: input.title,
        bio: input.bio,
        avatar_url: input.avatar_url,
        department: input.department,
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Failed to create user:", error);
    throw error;
  }

  return data as UserProfile;
}

/**
 * Update user profile
 */
export async function updateUser(userId: string, input: UpdateUserInput) {
  const { data, error } = await getPrimarySupabase()
    .from("users")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update user:", error);
    throw error;
  }

  return data as UserProfile;
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId: string, role: UserRole) {
  const { data, error } = await getPrimarySupabase()
    .from("users")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update user role:", error);
    throw error;
  }

  return data as UserProfile;
}

/**
 * Deactivate user (soft delete)
 */
export async function deactivateUser(userId: string) {
  return updateUser(userId, { is_active: false });
}

/**
 * Activate user
 */
export async function activateUser(userId: string) {
  return updateUser(userId, { is_active: true });
}

/**
 * Delete user (hard delete)
 */
export async function deleteUser(userId: string) {
  const { error } = await getPrimarySupabase()
    .from("users")
    .delete()
    .eq("id", userId);

  if (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: UserRole) {
  const { data, error } = await getPrimarySupabase()
    .from("users")
    .select("*")
    .eq("role", role)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch users by role:", error);
    throw error;
  }

  return data as UserProfile[];
}

/**
 * Search users
 */
export async function searchUsers(query: string, limit = 20) {
  const { data, error } = await getPrimarySupabase()
    .from("users")
    .select("*")
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to search users:", error);
    throw error;
  }

  return data as UserProfile[];
}

/**
 * Get user statistics by role
 */
export async function getUserStatistics() {
  const { data, error } = await getPrimarySupabase()
    .from("users")
    .select("role")
    .eq("is_active", true);

  if (error) {
    console.error("Failed to get user statistics:", error);
    throw error;
  }

  const stats = {
    total: data?.length || 0,
    admin: data?.filter((u) => u.role === "admin").length || 0,
    creator: data?.filter((u) => u.role === "creator").length || 0,
    viewer: data?.filter((u) => u.role === "viewer").length || 0,
  };

  return stats;
}

/**
 * Bulk update user roles
 */
export async function bulkUpdateUserRoles(userIds: string[], role: UserRole) {
  const { error } = await getPrimarySupabase()
    .from("users")
    .update({ role, updated_at: new Date().toISOString() })
    .in("id", userIds);

  if (error) {
    console.error("Failed to bulk update user roles:", error);
    throw error;
  }

  return { success: true, updatedCount: userIds.length };
}

/**
 * Sync user metadata from Azure B2C (called by API endpoint)
 */
export async function syncUserFromB2C(
  authUserId: string,
  email: string,
  name: string,
  givenName?: string,
  familyName?: string,
  avatarUrl?: string,
) {
  // Validate required parameters
  if (!authUserId?.trim()) {
    throw new Error("authUserId is required for user sync");
  }

  if (!email?.trim()) {
    throw new Error("email is required for user sync");
  }

  if (!name?.trim()) {
    throw new Error("name is required for user sync");
  }

  // Validate email format using safe utility
  if (!isValidEmail(email)) {
    throw new Error(
      `Invalid email format: ${email}. Must match pattern: user@domain.com`,
    );
  }

  const { data, error } = await getPrimarySupabase().rpc("sync_user_from_b2c", {
    p_auth_user_id: authUserId,
    p_email: email.trim(),
    p_name: name.trim(),
    p_given_name: givenName?.trim() || null,
    p_family_name: familyName?.trim() || null,
    p_avatar_url: avatarUrl?.trim() || null,
  });

  if (error) {
    console.error("Failed to sync user from B2C:", error);
    throw error;
  }

  return data[0];
}

/**
 * Check if user has permission
 */
export async function hasUserPermission(
  userId: string,
  resource: string,
  action: string,
): Promise<boolean> {
  const { data, error } = await getPrimarySupabase().rpc(
    "check_user_permission",
    {
      p_auth_user_id: userId,
      p_resource: resource,
      p_action: action,
    },
  );

  if (error) {
    console.error("Failed to check user permission:", error);
    return false;
  }

  return data;
}

/**
 * Get all permissions for a user
 */
export async function getUserPermissions(userId: string) {
  const { data, error } = await getPrimarySupabase().rpc(
    "get_user_permissions",
    {
      p_auth_user_id: userId,
    },
  );

  if (error) {
    console.error("Failed to get user permissions:", error);
    throw error;
  }

  return data;
}
