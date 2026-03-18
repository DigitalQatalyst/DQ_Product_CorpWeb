// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
//   ReactNode,
//   useMemo,
// } from 'react';
// import { 
//   User, 
//   Session, 
//   AuthError,
//   SignInWithPasswordCredentials,
//   SignUpWithPasswordCredentials,
//   AuthResponse
// } from '@supabase/supabase-js';
// import { supabase } from '../lib/supabase';

// // Simple user interface - just basic auth user data
// export interface SimpleUser extends User {
//   isAdmin?: boolean;
//   metadata?: Record<string, any>;
// }

// export interface AuthContextType {
//   // Auth state
//   user: SimpleUser | null;
//   session: Session | null;
//   profile: null; // No profiles table
//   isLoading: boolean;
//   isAuthenticated: boolean;
  
//   // Auth actions
//   signIn: (credentials: SignInWithPasswordCredentials) => Promise<AuthResponse>;
//   signUp: (credentials: SignUpWithPasswordCredentials) => Promise<AuthResponse>;
//   signOut: () => Promise<{ error: AuthError | null }>;
  
//   // Profile actions (simplified - just metadata)
//   updateProfile: (updates: Record<string, any>) => Promise<{ error: AuthError | null }>;
//   refreshProfile: () => Promise<void>;
  
//   // Role-based access helpers (simplified)
//   hasRole: (role: string) => boolean;
//   isAdmin: () => boolean;
//   isCreator: () => boolean;
//   isViewer: () => boolean;
//   isHRAdmin: () => boolean;
//   isHRViewer: () => boolean;
  
//   // Session management
//   refreshSession: () => Promise<{ error: AuthError | null }>;
  
//   // Error state
//   error: AuthError | null;
//   clearError: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   // Core auth state
//   const [user, setUser] = useState<SimpleUser | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [profile, setProfile] = useState(null); // Always null - no profiles table
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<AuthError | null>(null);
//   console.log("user info",user)

//   // Computed states
//   const isAuthenticated = useMemo(() => !!user && !!session, [user, session]);

//   // Process user data and add admin check
//   const processUser = useCallback((authUser: User | null): SimpleUser | null => {
//     if (!authUser) return null;
    
//     // Check both app_metadata (set via dashboard/API) and user_metadata (set via signup)
//     const appMetadata = authUser.app_metadata || {};
//     const userMetadata = authUser.user_metadata || {};
    
//     // Role can be in either - app_metadata takes precedence (set via dashboard)
//     const role = appMetadata.role || userMetadata.role;
//     const isAdmin = appMetadata.is_admin === true || userMetadata.is_admin === true || role === 'admin';
    
//     return {
//       ...authUser,
//       isAdmin,
//       role,
//       metadata: { ...userMetadata, ...appMetadata },
//     };
//   }, []);

//   // Update user metadata (simplified profile update)
//   const updateProfile = useCallback(async (updates: Record<string, any>) => {
//     if (!user) {
//       return { error: { message: 'No authenticated user' } as AuthError };
//     }

//     try {
//       const { error } = await supabase.auth.updateUser({
//         data: updates
//       });

//       if (error) {
//         setError(error);
//         return { error };
//       }

//       // Refresh user data
//       const { data: { user: updatedUser } } = await supabase.auth.getUser();
//       if (updatedUser) {
//         setUser(processUser(updatedUser));
//       }

//       return { error: null };
//     } catch (err) {
//       const error = { message: 'Failed to update profile' } as AuthError;
//       setError(error);
//       return { error };
//     }
//   }, [user, processUser]);

//   // Refresh profile (no-op since no profiles table)
//   const refreshProfile = useCallback(async () => {
//     // No profiles table to refresh
//     console.log('[AuthContext] Profile refresh called but no profiles table exists');
//   }, []);

//   // Sign in
//   const signIn = useCallback(async (credentials: SignInWithPasswordCredentials) => {
//     setError(null);
    
//     try {
//       const response = await supabase.auth.signInWithPassword(credentials);
      
//       if (response.error) {
//         setError(response.error);
//       }
      
//       return response;
//     } catch (err) {
//       const error = { message: 'Sign in failed' } as AuthError;
//       setError(error);
//       return { data: null, user: null, session: null, error };
//     }
//   }, []);

//   // Sign up
//   const signUp = useCallback(async (credentials: SignUpWithPasswordCredentials) => {
//     setError(null);
    
//     try {
//       const response = await supabase.auth.signUp(credentials);
      
//       if (response.error) {
//         setError(response.error);
//       }
      
//       return response;
//     } catch (err) {
//       const error = { message: 'Sign up failed' } as AuthError;
//       setError(error);
//       return { data: null, user: null, session: null, error };
//     }
//   }, []);

//   // Sign out
//   const signOut = useCallback(async () => {
//     setError(null);
    
//     try {
//       const response = await supabase.auth.signOut();
      
//       if (response.error) {
//         setError(response.error);
//       }
      
//       // Clear local state immediately
//       setUser(null);
//       setSession(null);
//       setProfile(null);
      
//       return response;
//     } catch (err) {
//       const error = { message: 'Sign out failed' } as AuthError;
//       setError(error);
//       return { error };
//     }
//   }, []);

//   // Refresh session
//   const refreshSession = useCallback(async () => {
//     try {
//       const response = await supabase.auth.refreshSession();
      
//       if (response.error) {
//         setError(response.error);
//       }
      
//       return response;
//     } catch (err) {
//       const error = { message: 'Session refresh failed' } as AuthError;
//       setError(error);
//       return { error };
//     }
//   }, []);

//   // Clear error
//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   // Simplified role-based access helpers
//   const hasRole = useCallback((role: string): boolean => {
//     if (!user) return false;
    
//     // Check metadata for role
//     const userRole = user.user_metadata?.role;
//     return userRole === role || userRole === 'admin'; // Admin has all roles
//   }, [user]);

//   const isAdmin = useCallback(() => user?.isAdmin === true, [user]);
//   const isCreator = useCallback(() => hasRole('creator') || isAdmin(), [hasRole, isAdmin]);
//   const isViewer = useCallback(() => hasRole('viewer') || isCreator(), [hasRole, isCreator]);
//   const isHRAdmin = useCallback(() => hasRole('hr_admin') || isAdmin(), [hasRole, isAdmin]);
//   const isHRViewer = useCallback(() => hasRole('hr_viewer') || isHRAdmin(), [hasRole, isHRAdmin]);

//   // Initialize auth state
//   useEffect(() => {
//     let mounted = true;

//     const initializeAuth = async () => {
//       try {
//         // Get initial session
//         const { data: { session }, error } = await supabase.auth.getSession();
        
//         if (error) {
//           console.error('[AuthContext] Error getting session:', error);
//           if (mounted) {
//             setError(error);
//             setIsLoading(false);
//           }
//           return;
//         }

//         if (mounted) {
//           setSession(session);
//           setUser(processUser(session?.user ?? null));
//         }
//       } catch (err) {
//         console.error('[AuthContext] Unexpected error during initialization:', err);
//         if (mounted) {
//           setError({ message: 'Auth initialization failed' } as AuthError);
//         }
//       } finally {
//         if (mounted) {
//           setIsLoading(false);
//         }
//       }
//     };

//     initializeAuth();

//     // Set up auth state change listener
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         console.log('[AuthContext] Auth state changed:', event, session?.user?.id);
        
//         if (!mounted) return;

//         setSession(session);
//         setUser(processUser(session?.user ?? null));
//         setIsLoading(false);
//       }
//     );

//     return () => {
//       mounted = false;
//       subscription.unsubscribe();
//     };
//   }, [processUser]);

//   // Context value
//   const value = useMemo<AuthContextType>(() => ({
//     // Auth state
//     user,
//     session,
//     profile,
//     isLoading,
//     isAuthenticated,
    
//     // Auth actions
//     signIn,
//     signUp,
//     signOut,
    
//     // Profile actions
//     updateProfile,
//     refreshProfile,
    
//     // Role-based access helpers
//     hasRole,
//     isAdmin,
//     isCreator,
//     isViewer,
//     isHRAdmin,
//     isHRViewer,
    
//     // Session management
//     refreshSession,
    
//     // Error state
//     error,
//     clearError,
//   }), [
//     user,
//     session,
//     profile,
//     isLoading,
//     isAuthenticated,
//     signIn,
//     signUp,
//     signOut,
//     updateProfile,
//     refreshProfile,
//     hasRole,
//     isAdmin,
//     isCreator,
//     isViewer,
//     isHRAdmin,
//     isHRViewer,
//     refreshSession,
//     error,
//     clearError,
//   ]);

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // Hook to use auth context
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

// // Export for convenience
// export { AuthContext };



import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import {
  User,
  Session,
  AuthError,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  AuthResponse,
} from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Extended user with our custom fields
export interface SimpleUser extends User {
  isAdmin: boolean;
  role: string;
  metadata: Record<string, any>;
}

export interface AuthContextType {
  // Auth state
  user: SimpleUser | null;
  session: Session | null;
  profile: null; // No profiles table
  isLoading: boolean;
  isAuthenticated: boolean;

  // Auth actions
  signIn: (credentials: SignInWithPasswordCredentials) => Promise<AuthResponse>;
  signUp: (credentials: SignUpWithPasswordCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;

  // Profile / metadata actions
  updateProfile: (updates: Record<string, any>) => Promise<{ error: AuthError | null }>;
  refreshProfile: () => Promise<void>;

  // Role-based access helpers
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isCreator: () => boolean;
  isViewer: () => boolean;
  isHRAdmin: () => boolean;
  isHRViewer: () => boolean;

  // Session management
  refreshSession: () => Promise<{ error: AuthError | null }>;

  // Error state
  error: AuthError | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile] = useState<null>(null); // Placeholder - no profiles table
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  const isAuthenticated = useMemo(() => !!user && !!session, [user, session]);
  console.log("logged user",user)

  // Process Supabase user → our SimpleUser with role & admin flag
  const processUser = useCallback((authUser: User | null): SimpleUser | null => {
    if (!authUser) return null;

    const userMetadata = authUser.user_metadata || {};
    const appMetadata = authUser.app_metadata || {};

    // Prefer user_metadata (set via updateUser / signup), fallback to app_metadata
    const role = (userMetadata.role as string) || (appMetadata.role as string) || 'user';

    const isAdmin =
      role === 'admin' ||
      appMetadata.is_admin === true ||
      userMetadata.is_admin === true ||
      false;

    return {
      ...authUser,
      role,
      isAdmin,
      metadata: { ...appMetadata, ...userMetadata },
    };
  }, []);

  // Update user metadata and force refresh to avoid stale data
  const updateProfile = useCallback(
    async (updates: Record<string, any>) => {
      if (!user) {
        return { error: { message: 'No authenticated user' } as AuthError };
      }

      try {
        const { error: updateError } = await supabase.auth.updateUser({
          data: updates,
        });

        if (updateError) {
          setError(updateError);
          return { error: updateError };
        }

        // Force fetch fresh user data from server (critical for role updates)
        const { data: { user: freshUser }, error: fetchError } = await supabase.auth.getUser();

        if (fetchError) throw fetchError;

        if (freshUser) {
          const processed = processUser(freshUser);
          setUser(processed);
        }

        return { error: null };
      } catch (err: any) {
        const errObj = { message: err.message || 'Failed to update profile' } as AuthError;
        setError(errObj);
        return { error: errObj };
      }
    },
    [user, processUser]
  );

  // No-op since no separate profiles table
  const refreshProfile = useCallback(async () => {
    console.log('[AuthContext] refreshProfile called (no profiles table)');
  }, []);

  const signIn = useCallback(async (credentials: SignInWithPasswordCredentials) => {
    setError(null);
    try {
      const response = await supabase.auth.signInWithPassword(credentials);
      if (response.error) setError(response.error);
      return response;
    } catch (err: any) {
      const errorObj = { message: 'Sign in failed' } as AuthError;
      setError(errorObj);
      return { data: { user: null, session: null }, error: errorObj };
    }
  }, []);

  const signUp = useCallback(async (credentials: SignUpWithPasswordCredentials) => {
    setError(null);
    try {
      const response = await supabase.auth.signUp(credentials);
      if (response.error) setError(response.error);
      return response;
    } catch (err: any) {
      const errorObj = { message: 'Sign up failed' } as AuthError;
      setError(errorObj);
      return { data: { user: null, session: null }, error: errorObj };
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      const response = await supabase.auth.signOut();
      if (response.error) setError(response.error);

      // Clear state immediately
      setUser(null);
      setSession(null);
      return response;
    } catch (err: any) {
      const errorObj = { message: 'Sign out failed' } as AuthError;
      setError(errorObj);
      return { error: errorObj };
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const response = await supabase.auth.refreshSession();
      if (response.error) setError(response.error);
      return response;
    } catch (err: any) {
      const errorObj = { message: 'Session refresh failed' } as AuthError;
      setError(errorObj);
      return { error: errorObj };
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Role helpers
  const hasRole = useCallback(
    (role: string): boolean => {
      if (!user) return false;
      return user.role === role || user.role === 'admin';
    },
    [user]
  );

  const isAdmin = useCallback(() => user?.isAdmin ?? false, [user]);
  const isCreator = useCallback(() => hasRole('creator') || isAdmin(), [hasRole, isAdmin]);
  const isViewer = useCallback(() => hasRole('viewer') || isCreator(), [hasRole, isCreator]);
  const isHRAdmin = useCallback(() => hasRole('hr_admin') || isAdmin(), [hasRole, isAdmin]);
  const isHRViewer = useCallback(() => hasRole('hr_viewer') || isHRAdmin(), [hasRole, isHRAdmin]);

  // Initialize auth & listen for changes
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted) {
          setSession(session);
          setUser(processUser(session?.user ?? null));
        }
      } catch (err: any) {
        console.error('[AuthContext] Init error:', err);
        if (mounted) setError({ message: 'Auth initialization failed' } as AuthError);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('[AuthContext] Auth event:', event, session?.user?.id);

        let currentUser = session?.user ?? null;

        // Force refresh on important events to catch metadata changes
        if (event === 'USER_UPDATED' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const { data: { user: freshUser } } = await supabase.auth.getUser();
          currentUser = freshUser ?? currentUser;
        }

        if (mounted) {
          setSession(session);
          setUser(processUser(currentUser));
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [processUser]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      profile,
      isLoading,
      isAuthenticated,
      signIn,
      signUp,
      signOut,
      updateProfile,
      refreshProfile,
      hasRole,
      isAdmin,
      isCreator,
      isViewer,
      isHRAdmin,
      isHRViewer,
      refreshSession,
      error,
      clearError,
    }),
    [
      user,
      session,
      profile,
      isLoading,
      isAuthenticated,
      signIn,
      signUp,
      signOut,
      updateProfile,
      refreshProfile,
      hasRole,
      isAdmin,
      isCreator,
      isViewer,
      isHRAdmin,
      isHRViewer,
      refreshSession,
      error,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };