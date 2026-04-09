import React, {
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { EventType, AuthenticationResult } from "@azure/msal-browser";
import {
  defaultLoginRequest,
  signupRequest,
} from "../../../services/auth/msal";
import {
  syncUserFromB2C,
  getUserPermissions,
  getUserByAuthId,
} from "../../../lib/supabase";

import { isValidEmail } from "../../../utils/emailValidation";

type UserRole = "admin" | "creator" | "viewer" | "HR-Admin" | "HR-viewer";

interface Permission {
  resource: string;
  action: string;
  can_perform: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  supabaseUserId?: string;
  role?: UserRole;
  permissions?: Permission[];
  isNewUser?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isSyncing: boolean;
  syncError: string | null;
  login: () => void;
  signup: () => void;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
  isAdmin: () => boolean;
  isCreator: () => boolean;
  isViewer: () => boolean;
  isHRAdmin: () => boolean;
  isHRViewer: () => boolean;
  refreshAvatar: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [emailOverride, setEmailOverride] = useState<string | undefined>(
    undefined,
  );
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [supabaseUserId, setSupabaseUserId] = useState<string | undefined>(
    undefined,
  );
  const [isNewUser, setIsNewUser] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const viteEnv = (import.meta as any).env as Record<
    string,
    string | undefined
  >;
  const enableGraphFallback =
    (viteEnv?.VITE_MSAL_ENABLE_GRAPH_FALLBACK ||
      viteEnv?.NEXT_PUBLIC_MSAL_ENABLE_GRAPH_FALLBACK) === "true";

  // Log configuration on load
  useEffect(() => {
    const hasSupabaseUrl = import.meta.env.VITE_SUPABASE_URL ? "✓" : "✗";
    const hasSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ? "✓" : "✗";
    console.log(
      `[Auth] Supabase configured: ${hasSupabaseUrl} URL, ${hasSupabaseKey} Key`,
    );
  }, []);

  // Ensure active account is set for convenience
  useEffect(() => {
    if (!instance) {
      console.log("[Auth] MSAL instance not ready yet");
      return;
    }

    try {
      const active = instance.getActiveAccount();
      if (!active && accounts.length === 1) {
        instance.setActiveAccount(accounts[0]);
      }
    } catch (error) {
      console.warn(
        "[Auth] MSAL not initialized yet, skipping setActiveAccount:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }, [instance, accounts]);

  // Ensure active account is set on successful login/redirect events
  useEffect(() => {
    if (!instance) return;

    try {
      const callbackId = instance.addEventCallback((event) => {
        if (
          event.eventType === EventType.LOGIN_SUCCESS ||
          event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
          event.eventType === EventType.SSO_SILENT_SUCCESS
        ) {
          const payload = event.payload as AuthenticationResult | null;
          const account = payload?.account;
          if (account) {
            try {
              instance.setActiveAccount(account);
              console.log("[Auth] Active account set on auth event");
            } catch (e) {
              console.warn("[Auth] Failed to set active account:", e);
            }
          }
        }
      });
      return () => {
        try {
          if (callbackId) instance.removeEventCallback(callbackId);
        } catch (e) {
          console.warn("[Auth] Failed to remove event callback:", e);
        }
      };
    } catch (error) {
      console.warn(
        "[Auth] Failed to add event callback:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }, [instance]);

  const user: UserProfile | null = useMemo(() => {
    if (!instance) {
      console.log("[Auth] Instance not ready for user profile");
      return null;
    }

    try {
      const account = instance.getActiveAccount() || accounts[0];
      if (!account) {
        console.log("[Auth] No account found");
        return null;
      }

      const claims = account.idTokenClaims as any;

      console.log("----======== claims============", claims);
      const name = account.name || claims?.name || "";

      if (!name) {
        console.warn("[Auth] No name found in account or claims");
      }

      // Prefer real email claims over UPN/preferred_username when available
      const email =
        claims?.emails?.[0] ||
        claims?.email ||
        claims?.preferred_username ||
        account.username ||
        "";

      return {
        id: account.localAccountId,
        name,
        email: emailOverride || email,
        givenName: claims?.given_name,
        familyName: claims?.family_name,
        picture: avatarUrl,
        supabaseUserId,
        role: userRole,
        permissions: userPermissions,
        isNewUser,
      };
    } catch (error) {
      console.warn(
        "[Auth] Error building user profile:",
        error instanceof Error ? error.message : "Unknown error",
      );
      return null;
    }
  }, [
    accounts,
    instance,
    emailOverride,
    userRole,
    userPermissions,
    supabaseUserId,
    isNewUser,
    avatarUrl,
  ]);

  // Sync user profile to Supabase after authentication
  const syncUserProfile = useCallback(async (account: any) => {
    if (!account) {
      console.warn("[Auth] syncUserProfile called with null account");
      return;
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      const claims = account.idTokenClaims as Record<string, unknown>;
      const authUserId = account.localAccountId;
      const name = (account.name as string) || (claims?.name as string) || "";

      // Extract email from various possible claim fields
      let email =
        (claims?.emails as string[])?.at(0) ||
        (claims?.email as string) ||
        (claims?.preferred_username as string) ||
        (account.username as string) ||
        "";

      // Validate and sanitize email
      email = email ? email.trim() : "";

      // If email is empty or invalid, generate a fallback email based on username or name
      if (!email || !isValidEmail(email)) {
        const rawUsername =
          (account.username as string) || name?.split(" ")[0] || "user";
        // Remove special characters from username - only keep alphanumeric and dots/hyphens
        const username = rawUsername.replace(/[^a-zA-Z0-9._-]/g, "") || "user";
        // Use a proper TLD (.com) as fallback domain
        email = `${username}@b2cusers.com`;
      }

      // Final validation before sending to RPC
      if (!email || !isValidEmail(email)) {
        throw new Error(
          `Invalid or missing email for user sync: ${email || "null"}`,
        );
      }

      const givenName = claims?.given_name as string | undefined;
      const familyName = claims?.family_name as string | undefined;

      // Call Supabase RPC directly to sync user
      const syncData = await syncUserFromB2C(
        authUserId,
        email,
        name,
        givenName,
        familyName,
      );

      if (!syncData) {
        throw new Error("No sync data returned from RPC");
      }

      // Fetch user permissions
      const permissions = await getUserPermissions(authUserId);

      // Fetch full user data including avatar_url
      const userData = await getUserByAuthId(authUserId);

      // Update user profile with Supabase data
      setSupabaseUserId(syncData.user_id);
      setUserRole(syncData.role);
      setUserPermissions(permissions);
      setIsNewUser(syncData.created ?? false);
      setAvatarUrl(userData?.avatar_url || undefined);

      console.log("[Auth] User profile synced successfully:", {
        userId: syncData.user_id,
        role: syncData.role,
        isNew: syncData.created,
        permissionsCount: permissions?.length || 0,
        hasAvatar: !!userData?.avatar_url,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sync user profile";
      setSyncError(errorMessage);
      console.error("[Auth] User sync failed:", errorMessage, error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    // Loading is complete once we have determined authentication state at least once
    setIsLoading(false);
  }, [isAuthenticated]);

  // Sync user when authenticated
  useEffect(() => {
    console.log("[Auth] Sync effect triggered:", {
      isAuthenticated,
      supabaseUserId,
      accountCount: accounts.length,
    });

    if (!isAuthenticated || supabaseUserId) {
      console.log(
        `[Auth] Skipping sync: isAuthenticated=${isAuthenticated}, supabaseUserId=${supabaseUserId}`,
      );
      return;
    }

    const syncOnAuth = async () => {
      try {
        const account = instance.getActiveAccount() || accounts[0];
        if (!account) {
          console.warn("[Auth] No account found for sync");
          return;
        }

        console.log("[Auth] Starting user sync for account:", {
          name: account.name,
          localAccountId: account.localAccountId,
        });

        // Sync user directly with Supabase
        await syncUserProfile(account);
      } catch (error) {
        console.error("[Auth] Failed to sync user:", error);
      }
    };

    syncOnAuth();
  }, [isAuthenticated, supabaseUserId, instance, accounts, syncUserProfile]);

  // Heuristic to detect synthetic/UPN-like emails we want to improve
  const looksSynthetic = useCallback((value?: string) => {
    if (!value) return true;
    const onMs = /@.*\.onmicrosoft\.com$/i.test(value);
    const guidLocal = /^[0-9a-f-]{36}@/i.test(value) || value.includes("#EXT#");
    return onMs || guidLocal;
  }, []);

  // Optional: resolve better email via Microsoft Graph if configured and necessary
  useEffect(() => {
    if (!enableGraphFallback) return;
    const account = instance.getActiveAccount() || accounts[0];
    if (!account) return;
    const claims = account.idTokenClaims as any;
    const current = (claims?.emails?.[0] ||
      claims?.email ||
      claims?.preferred_username ||
      account.username) as string | undefined;
    if (current && !looksSynthetic(current)) return;

    let cancelled = false;
    (async () => {
      try {
        const result = await instance.acquireTokenSilent({
          account,
          scopes: ["User.Read"],
        });
        console.log("[Auth] Token:", result.accessToken);
        const r = await fetch(
          "https://graph.microsoft.com/v1.0/me?$select=mail,userPrincipalName,otherMails",
          {
            headers: { Authorization: `Bearer ${result.accessToken}` },
          },
        );
        if (!r.ok) return;
        const me = await r.json();
        const resolved: string | undefined =
          me.mail || me.otherMails?.[0] || me.userPrincipalName || current;
        if (!cancelled && resolved && !looksSynthetic(resolved)) {
          setEmailOverride(resolved);
        }
      } catch (e) {
        console.error(
          "[Auth] Failed to fetch user info from Graph:",
          e instanceof Error ? e.message : "Unknown error",
        );
        // Silently fallback to existing email
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accounts, instance, enableGraphFallback, looksSynthetic]);

  const login = useCallback(() => {
    if (!instance) return;
    instance.loginRedirect({
      ...defaultLoginRequest,
    });
  }, [instance]);

  // For B2C with a combined SUSI policy, signup is the same as login
  const signup = useCallback(() => {
    if (!instance) return;
    instance.loginRedirect({
      ...signupRequest,
      // Tag this flow so we can route to onboarding after redirect
      state: "ej-signup",
    });
  }, [instance]);

  const logout = useCallback(() => {
    // Clear Supabase user data
    setUserRole(undefined);
    setUserPermissions([]);
    setSupabaseUserId(undefined);
    setSyncError(null);
    setIsNewUser(false);

    if (!instance) return;
    const account = instance.getActiveAccount() || accounts[0];
    instance.logoutRedirect({ account: account });
  }, [instance, accounts]);

  // Helper function to check if user has specific permission
  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      if (!userPermissions) return false;
      return userPermissions.some(
        (p) => p.resource === resource && p.action === action && p.can_perform,
      );
    },
    [userPermissions],
  );

  // Helper function to check if user is admin
  const isAdmin = useCallback((): boolean => {
    return userRole === "admin";
  }, [userRole]);

  // Helper function to check if user is creator
  const isCreator = useCallback((): boolean => {
    return userRole === "creator" || userRole === "admin";
  }, [userRole]);

  // Helper function to check if user is viewer
  const isViewer = useCallback((): boolean => {
    return (
      userRole === "viewer" || userRole === "creator" || userRole === "admin"
    );
  }, [userRole]);

  // Helper function to check if user is HR-Admin
  const isHRAdmin = useCallback((): boolean => {
    return userRole === "HR-Admin" || userRole === "admin";
  }, [userRole]);

  // Helper function to check if user is HR-viewer
  const isHRViewer = useCallback((): boolean => {
    return (
      userRole === "HR-viewer" ||
      userRole === "HR-Admin" ||
      userRole === "admin"
    );
  }, [userRole]);

  // Refresh avatar URL from database
  const refreshAvatar = useCallback(async () => {
    if (!user?.id) return;
    try {
      const userData = await getUserByAuthId(user.id);
      if (userData?.avatar_url !== undefined) {
        setAvatarUrl(userData.avatar_url || undefined);
        console.log("[Auth] Avatar refreshed:", userData.avatar_url);
      }
    } catch (error) {
      console.error("[Auth] Failed to refresh avatar:", error);
    }
  }, [user?.id]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isSyncing,
      syncError,
      login,
      signup,
      logout,
      hasPermission,
      isAdmin,
      isCreator,
      isViewer,
      isHRAdmin,
      isHRViewer,
      refreshAvatar,
    }),
    [
      user,
      isLoading,
      isSyncing,
      syncError,
      login,
      signup,
      logout,
      hasPermission,
      isAdmin,
      isCreator,
      isViewer,
      isHRAdmin,
      isHRViewer,
      refreshAvatar,
    ],
  );

  // Expose auth state to window for debugging (dev only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__authDebug = {
        user,
        isAuthenticated,
        isSyncing,
        syncError,
        supabaseUserId,
        accounts: accounts.length,
        instance: !!instance,
        manualSync: async () => {
          const account = instance?.getActiveAccount() || accounts[0];
          if (account) {
            await syncUserProfile(account);
          } else {
            console.warn("[Debug] No account to sync");
          }
        },
      };
    }
  }, [
    user,
    isAuthenticated,
    isSyncing,
    syncError,
    supabaseUserId,
    accounts,
    instance,
    syncUserProfile,
  ]);

  // Expose debug helpers to window for testing
  useEffect(() => {
    const debugHelper = {
      user,
      isAuthenticated,
      isSyncing,
      syncError,
      supabaseUserId,
      accounts: accounts.map((acc) => ({
        name: acc.name,
        username: acc.username,
        email: (acc.idTokenClaims as Record<string, unknown>)?.emails?.[0],
        localAccountId: acc.localAccountId,
      })),
      manualSync: async () => {
        console.log("[Debug] Manually triggering user sync...");
        try {
          const account = instance?.getActiveAccount() || accounts[0];
          if (!account) {
            console.error("[Debug] No active account found for manual sync");
            return;
          }
          await syncUserProfile(account);
          console.log("[Debug] Manual sync completed successfully");
        } catch (error) {
          console.error(
            "[Debug] Manual sync failed:",
            error instanceof Error ? error.message : "Unknown error",
          );
        }
      },
      logout: () => {
        console.log("[Debug] Logging out...");
        logout();
      },
      getState: () => ({
        user,
        isAuthenticated,
        isSyncing,
        syncError,
        supabaseUserId,
        userRole,
        userPermissions,
        isNewUser,
      }),
    };

    (globalThis as Record<string, unknown>).__authDebug = debugHelper;
    console.log(
      "[Auth Debug Helper] Available as window.__authDebug in console",
    );

    return () => {
      delete (globalThis as Record<string, unknown>).__authDebug;
    };
  }, [
    user,
    isAuthenticated,
    isSyncing,
    syncError,
    supabaseUserId,
    userRole,
    userPermissions,
    isNewUser,
    syncUserProfile,
    logout,
    instance,
    accounts,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { supabase } from "../../../lib/supabase";
