// // import React, {
// //   createContext,
// //   useContext,
// //   useEffect,
// //   useState,
// //   useCallback,
// //   ReactNode,
// //   useMemo,
// // } from 'react';
// // import { 
// //   User, 
// //   Session, 
// //   AuthError,
// //   SignInWithPasswordCredentials,
// //   SignUpWithPasswordCredentials,
// //   AuthResponse
// // } from '@supabase/supabase-js';
// // import { supabase } from '../lib/supabase';

// // // Simple user interface - just basic auth user data
// // export interface SimpleUser extends User {
// //   isAdmin?: boolean;
// //   metadata?: Record<string, any>;
// // }

// // export interface AuthContextType {
// //   // Auth state
// //   user: SimpleUser | null;
// //   session: Session | null;
// //   profile: null; // No profiles table
// //   isLoading: boolean;
// //   isAuthenticated: boolean;
  
// //   // Auth actions
// //   signIn: (credentials: SignInWithPasswordCredentials) => Promise<AuthResponse>;
// //   signUp: (credentials: SignUpWithPasswordCredentials) => Promise<AuthResponse>;
// //   signOut: () => Promise<{ error: AuthError | null }>;
  
// //   // Profile actions (simplified - just metadata)
// //   updateProfile: (updates: Record<string, any>) => Promise<{ error: AuthError | null }>;
// //   refreshProfile: () => Promise<void>;
  
// //   // Role-based access helpers (simplified)
// //   hasRole: (role: string) => boolean;
// //   isAdmin: () => boolean;
// //   isCreator: () => boolean;
// //   isViewer: () => boolean;
// //   isHRAdmin: () => boolean;
// //   isHRViewer: () => boolean;
  
// //   // Session management
// //   refreshSession: () => Promise<{ error: AuthError | null }>;
  
// //   // Error state
// //   error: AuthError | null;
// //   clearError: () => void;
// // }

// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // interface AuthProviderProps {
// //   children: ReactNode;
// // }

// // export function AuthProvider({ children }: AuthProviderProps) {
// //   // Core auth state
// //   const [user, setUser] = useState<SimpleUser | null>(null);
// //   const [session, setSession] = useState<Session | null>(null);
// //   const [profile, setProfile] = useState(null); // Always null - no profiles table
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<AuthError | null>(null);
// //   console.log("user info",user)

// //   // Computed states
// //   const isAuthenticated = useMemo(() => !!user && !!session, [user, session]);

// //   // Process user data and add admin check
// //   const processUser = useCallback((authUser: User | null): SimpleUser | null => {
// //     if (!authUser) return null;
    
// //     // Check both app_metadata (set via dashboard/API) and user_metadata (set via signup)
// //     const appMetadata = authUser.app_metadata || {};
// //     const userMetadata = authUser.user_metadata || {};
    
// //     // Role can be in either - app_metadata takes precedence (set via dashboard)
// //     const role = appMetadata.role || userMetadata.role;
// //     const isAdmin = appMetadata.is_admin === true || userMetadata.is_admin === true || role === 'admin';
    
// //     return {
// //       ...authUser,
// //       isAdmin,
// //       role,
// //       metadata: { ...userMetadata, ...appMetadata },
// //     };
// //   }, []);

// //   // Update user metadata (simplified profile update)
// //   const updateProfile = useCallback(async (updates: Record<string, any>) => {
// //     if (!user) {
// //       return { error: { message: 'No authenticated user' } as AuthError };
// //     }

// //     try {
// //       const { error } = await supabase.auth.updateUser({
// //         data: updates
// //       });

// //       if (error) {
// //         setError(error);
// //         return { error };
// //       }

// //       // Refresh user data
// //       const { data: { user: updatedUser } } = await supabase.auth.getUser();
// //       if (updatedUser) {
// //         setUser(processUser(updatedUser));
// //       }

// //       return { error: null };
// //     } catch (err) {
// //       const error = { message: 'Failed to update profile' } as AuthError;
// //       setError(error);
// //       return { error };
// //     }
// //   }, [user, processUser]);

// //   // Refresh profile (no-op since no profiles table)
// //   const refreshProfile = useCallback(async () => {
// //     // No profiles table to refresh
// //     console.log('[AuthContext] Profile refresh called but no profiles table exists');
// //   }, []);

// //   // Sign in
// //   const signIn = useCallback(async (credentials: SignInWithPasswordCredentials) => {
// //     setError(null);
    
// //     try {
// //       const response = await supabase.auth.signInWithPassword(credentials);
      
// //       if (response.error) {
// //         setError(response.error);
// //       }
      
// //       return response;
// //     } catch (err) {
// //       const error = { message: 'Sign in failed' } as AuthError;
// //       setError(error);
// //       return { data: null, user: null, session: null, error };
// //     }
// //   }, []);

// //   // Sign up
// //   const signUp = useCallback(async (credentials: SignUpWithPasswordCredentials) => {
// //     setError(null);
    
// //     try {
// //       const response = await supabase.auth.signUp(credentials);
      
// //       if (response.error) {
// //         setError(response.error);
// //       }
      
// //       return response;
// //     } catch (err) {
// //       const error = { message: 'Sign up failed' } as AuthError;
// //       setError(error);
// //       return { data: null, user: null, session: null, error };
// //     }
// //   }, []);

// //   // Sign out
// //   const signOut = useCallback(async () => {
// //     setError(null);
    
// //     try {
// //       const response = await supabase.auth.signOut();
      
// //       if (response.error) {
// //         setError(response.error);
// //       }
      
// //       // Clear local state immediately
// //       setUser(null);
// //       setSession(null);
// //       setProfile(null);
      
// //       return response;
// //     } catch (err) {
// //       const error = { message: 'Sign out failed' } as AuthError;
// //       setError(error);
// //       return { error };
// //     }
// //   }, []);

// //   // Refresh session
// //   const refreshSession = useCallback(async () => {
// //     try {
// //       const response = await supabase.auth.refreshSession();
      
// //       if (response.error) {
// //         setError(response.error);
// //       }
      
// //       return response;
// //     } catch (err) {
// //       const error = { message: 'Session refresh failed' } as AuthError;
// //       setError(error);
// //       return { error };
// //     }
// //   }, []);

// //   // Clear error
// //   const clearError = useCallback(() => {
// //     setError(null);
// //   }, []);

// //   // Simplified role-based access helpers
// //   const hasRole = useCallback((role: string): boolean => {
// //     if (!user) return false;
    
// //     // Check metadata for role
// //     const userRole = user.user_metadata?.role;
// //     return userRole === role || userRole === 'admin'; // Admin has all roles
// //   }, [user]);

// //   const isAdmin = useCallback(() => user?.isAdmin === true, [user]);
// //   const isCreator = useCallback(() => hasRole('creator') || isAdmin(), [hasRole, isAdmin]);
// //   const isViewer = useCallback(() => hasRole('viewer') || isCreator(), [hasRole, isCreator]);
// //   const isHRAdmin = useCallback(() => hasRole('hr_admin') || isAdmin(), [hasRole, isAdmin]);
// //   const isHRViewer = useCallback(() => hasRole('hr_viewer') || isHRAdmin(), [hasRole, isHRAdmin]);

// //   // Initialize auth state
// //   useEffect(() => {
// //     let mounted = true;

// //     const initializeAuth = async () => {
// //       try {
// //         // Get initial session
// //         const { data: { session }, error } = await supabase.auth.getSession();
        
// //         if (error) {
// //           console.error('[AuthContext] Error getting session:', error);
// //           if (mounted) {
// //             setError(error);
// //             setIsLoading(false);
// //           }
// //           return;
// //         }

// //         if (mounted) {
// //           setSession(session);
// //           setUser(processUser(session?.user ?? null));
// //         }
// //       } catch (err) {
// //         console.error('[AuthContext] Unexpected error during initialization:', err);
// //         if (mounted) {
// //           setError({ message: 'Auth initialization failed' } as AuthError);
// //         }
// //       } finally {
// //         if (mounted) {
// //           setIsLoading(false);
// //         }
// //       }
// //     };

// //     initializeAuth();

// //     // Set up auth state change listener
// //     const { data: { subscription } } = supabase.auth.onAuthStateChange(
// //       async (event, session) => {
// //         console.log('[AuthContext] Auth state changed:', event, session?.user?.id);
        
// //         if (!mounted) return;

// //         setSession(session);
// //         setUser(processUser(session?.user ?? null));
// //         setIsLoading(false);
// //       }
// //     );

// //     return () => {
// //       mounted = false;
// //       subscription.unsubscribe();
// //     };
// //   }, [processUser]);

// //   // Context value
// //   const value = useMemo<AuthContextType>(() => ({
// //     // Auth state
// //     user,
// //     session,
// //     profile,
// //     isLoading,
// //     isAuthenticated,
    
// //     // Auth actions
// //     signIn,
// //     signUp,
// //     signOut,
    
// //     // Profile actions
// //     updateProfile,
// //     refreshProfile,
    
// //     // Role-based access helpers
// //     hasRole,
// //     isAdmin,
// //     isCreator,
// //     isViewer,
// //     isHRAdmin,
// //     isHRViewer,
    
// //     // Session management
// //     refreshSession,
    
// //     // Error state
// //     error,
// //     clearError,
// //   }), [
// //     user,
// //     session,
// //     profile,
// //     isLoading,
// //     isAuthenticated,
// //     signIn,
// //     signUp,
// //     signOut,
// //     updateProfile,
// //     refreshProfile,
// //     hasRole,
// //     isAdmin,
// //     isCreator,
// //     isViewer,
// //     isHRAdmin,
// //     isHRViewer,
// //     refreshSession,
// //     error,
// //     clearError,
// //   ]);

// //   return (
// //     <AuthContext.Provider value={value}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// // // Hook to use auth context
// // export function useAuth() {
// //   const context = useContext(AuthContext);
// //   if (context === undefined) {
// //     throw new Error('useAuth must be used within an AuthProvider');
// //   }
// //   return context;
// // }

// // // Export for convenience
// // export { AuthContext };



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
//   AuthResponse,
// } from '@supabase/supabase-js';
// import { supabase } from '../lib/supabase';

// // Extended user with our custom fields
// export interface SimpleUser extends User {
//   isAdmin: boolean;
//   role: string;
//   metadata: Record<string, any>;
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

//   // Profile / metadata actions
//   updateProfile: (updates: Record<string, any>) => Promise<{ error: AuthError | null }>;
//   refreshProfile: () => Promise<void>;

//   // Role-based access helpers
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
//   const [user, setUser] = useState<SimpleUser | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [profile] = useState<null>(null); // Placeholder - no profiles table
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<AuthError | null>(null);

//   const isAuthenticated = useMemo(() => !!user && !!session, [user, session]);
//   console.log("logged user",user)

//   // Process Supabase user → our SimpleUser with role & admin flag
//   const processUser = useCallback((authUser: User | null): SimpleUser | null => {
//     if (!authUser) return null;

//     const userMetadata = authUser.user_metadata || {};
//     const appMetadata = authUser.app_metadata || {};

//     // Prefer user_metadata (set via updateUser / signup), fallback to app_metadata
//     const role = (userMetadata.role as string) || (appMetadata.role as string) || 'user';

//     const isAdmin =
//       role === 'admin' ||
//       appMetadata.is_admin === true ||
//       userMetadata.is_admin === true ||
//       false;

//     return {
//       ...authUser,
//       role,
//       isAdmin,
//       metadata: { ...appMetadata, ...userMetadata },
//     };
//   }, []);

//   // Update user metadata and force refresh to avoid stale data
//   const updateProfile = useCallback(
//     async (updates: Record<string, any>) => {
//       if (!user) {
//         return { error: { message: 'No authenticated user' } as AuthError };
//       }

//       try {
//         const { error: updateError } = await supabase.auth.updateUser({
//           data: updates,
//         });

//         if (updateError) {
//           setError(updateError);
//           return { error: updateError };
//         }

//         // Force fetch fresh user data from server (critical for role updates)
//         const { data: { user: freshUser }, error: fetchError } = await supabase.auth.getUser();

//         if (fetchError) throw fetchError;

//         if (freshUser) {
//           const processed = processUser(freshUser);
//           setUser(processed);
//         }

//         return { error: null };
//       } catch (err: any) {
//         const errObj = { message: err.message || 'Failed to update profile' } as AuthError;
//         setError(errObj);
//         return { error: errObj };
//       }
//     },
//     [user, processUser]
//   );

//   // No-op since no separate profiles table
//   const refreshProfile = useCallback(async () => {
//     console.log('[AuthContext] refreshProfile called (no profiles table)');
//   }, []);

//   const signIn = useCallback(async (credentials: SignInWithPasswordCredentials) => {
//     setError(null);
//     try {
//       const response = await supabase.auth.signInWithPassword(credentials);
//       if (response.error) setError(response.error);
//       return response;
//     } catch (err: any) {
//       const errorObj = { message: 'Sign in failed' } as AuthError;
//       setError(errorObj);
//       return { data: { user: null, session: null }, error: errorObj };
//     }
//   }, []);

//   const signUp = useCallback(async (credentials: SignUpWithPasswordCredentials) => {
//     setError(null);
//     try {
//       const response = await supabase.auth.signUp(credentials);
//       if (response.error) setError(response.error);
//       return response;
//     } catch (err: any) {
//       const errorObj = { message: 'Sign up failed' } as AuthError;
//       setError(errorObj);
//       return { data: { user: null, session: null }, error: errorObj };
//     }
//   }, []);

//   const signOut = useCallback(async () => {
//     setError(null);
//     try {
//       const response = await supabase.auth.signOut();
//       if (response.error) setError(response.error);

//       // Clear state immediately
//       setUser(null);
//       setSession(null);
//       return response;
//     } catch (err: any) {
//       const errorObj = { message: 'Sign out failed' } as AuthError;
//       setError(errorObj);
//       return { error: errorObj };
//     }
//   }, []);

//   const refreshSession = useCallback(async () => {
//     try {
//       const response = await supabase.auth.refreshSession();
//       if (response.error) setError(response.error);
//       return response;
//     } catch (err: any) {
//       const errorObj = { message: 'Session refresh failed' } as AuthError;
//       setError(errorObj);
//       return { error: errorObj };
//     }
//   }, []);

//   const clearError = useCallback(() => setError(null), []);

//   // Role helpers
//   const hasRole = useCallback(
//     (role: string): boolean => {
//       if (!user) return false;
//       return user.role === role || user.role === 'admin';
//     },
//     [user]
//   );

//   const isAdmin = useCallback(() => user?.isAdmin ?? false, [user]);
//   const isCreator = useCallback(() => hasRole('creator') || isAdmin(), [hasRole, isAdmin]);
//   const isViewer = useCallback(() => hasRole('viewer') || isCreator(), [hasRole, isCreator]);
//   const isHRAdmin = useCallback(() => hasRole('hr_admin') || isAdmin(), [hasRole, isAdmin]);
//   const isHRViewer = useCallback(() => hasRole('hr_viewer') || isHRAdmin(), [hasRole, isHRAdmin]);

//   // Initialize auth & listen for changes
//   useEffect(() => {
//     let mounted = true;

//     const initializeAuth = async () => {
//       try {
//         const { data: { session }, error } = await supabase.auth.getSession();
//         if (error) throw error;

//         if (mounted) {
//           setSession(session);
//           setUser(processUser(session?.user ?? null));
//         }
//       } catch (err: any) {
//         console.error('[AuthContext] Init error:', err);
//         if (mounted) setError({ message: 'Auth initialization failed' } as AuthError);
//       } finally {
//         if (mounted) setIsLoading(false);
//       }
//     };

//     initializeAuth();

//     // Listen to auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (!mounted) return;

//         console.log('[AuthContext] Auth event:', event, session?.user?.id);

//         let currentUser = session?.user ?? null;

//         // Force refresh on important events to catch metadata changes
//         if (event === 'USER_UPDATED' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
//           const { data: { user: freshUser } } = await supabase.auth.getUser();
//           currentUser = freshUser ?? currentUser;
//         }

//         if (mounted) {
//           setSession(session);
//           setUser(processUser(currentUser));
//           setIsLoading(false);
//         }
//       }
//     );

//     return () => {
//       mounted = false;
//       subscription.unsubscribe();
//     };
//   }, [processUser]);

//   const value = useMemo<AuthContextType>(
//     () => ({
//       user,
//       session,
//       profile,
//       isLoading,
//       isAuthenticated,
//       signIn,
//       signUp,
//       signOut,
//       updateProfile,
//       refreshProfile,
//       hasRole,
//       isAdmin,
//       isCreator,
//       isViewer,
//       isHRAdmin,
//       isHRViewer,
//       refreshSession,
//       error,
//       clearError,
//     }),
//     [
//       user,
//       session,
//       profile,
//       isLoading,
//       isAuthenticated,
//       signIn,
//       signUp,
//       signOut,
//       updateProfile,
//       refreshProfile,
//       hasRole,
//       isAdmin,
//       isCreator,
//       isViewer,
//       isHRAdmin,
//       isHRViewer,
//       refreshSession,
//       error,
//       clearError,
//     ]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

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

// ────────────────────────────────────────────────
// Profile shape – matches your profiles table
// ────────────────────────────────────────────────
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  email:string;
}
export interface LoggedRole { 
  role:string | null
}

// Extended user – now includes profile reference
export interface SimpleUser extends User {
  profile: Profile | null;
  isAdmin: boolean;
  role: string;           // comes from profile now
  metadata: Record<string, any>; // still keep user_metadata if needed
}

export interface AuthContextType {
  user: SimpleUser | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loggedrole: LoggedRole | null;

  signIn: (credentials: SignInWithPasswordCredentials) => Promise<AuthResponse>;
  signUp: (credentials: SignUpWithPasswordCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;

  // Now updates profiles table
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;

  // Role helpers – now based on profile.role (only creator, admin, hr)
  hasRole: (role: string) => boolean;

  refreshSession: () => Promise<{ error: AuthError | null }>;

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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  const isAuthenticated = useMemo(() => !!user && !!session, [user, session]);

  console.log("logged user + profile", { user, profile });
  const [loggedrole,setLoggedrole] = useState<LoggedRole | null>({role:''});
  console.log("logged role",loggedrole)

  const setRole = async()=>{
    try {
      if(profile != null || profile || profile != ''){
        setLoggedrole({role:profile?.role || ''})
      }else{
        console.log("error geting current profile")
      }
      
    } catch (error) {
      console.log("failed to assign role")
      
    }
  }

  useEffect(()=>{
    setRole()

  },[user])

  // ────────────────────────────────────────────────
  // Merge auth user + profile data
  // ────────────────────────────────────────────────
  const processUser = useCallback(
    (authUser: User | null, userProfile: Profile | null): SimpleUser | null => {
      if (!authUser) return null;

      console.log('[AuthContext] Processing user:', {
        authUserId: authUser.id,
        userProfile: userProfile,
        profileRole: userProfile?.role,
        authRole: authUser.role
      });

      const role = userProfile?.role || 'user';
      const isAdmin = role === 'admin';

      console.log('[AuthContext] Final role assignment:', { role, isAdmin });

      return {
        ...authUser,
        profile: userProfile,
        role,
        isAdmin,
        metadata: { ...authUser.user_metadata, ...authUser.app_metadata },
      };
    },
    []
  );

  // ────────────────────────────────────────────────
  // Fetch / refresh profile from public.profiles
  // ────────────────────────────────────────────────
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log('[AuthContext] Fetching profile for userId:', userId);
      
      // First try to get the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('[AuthContext] Profile fetch result:', { data, error });

      if (error) {
        console.error('[AuthContext] Profile fetch error:', error);
        console.log('[AuthContext] Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // Try to see if any profiles exist at all
        const { data: allProfiles, error: listError } = await supabase
          .from('profiles')
          .select('id, role, email')
          .limit(5);
          
        console.log('[AuthContext] Sample profiles in database:', allProfiles);
        console.log('[AuthContext] List profiles error:', listError);
        
        throw error;
      }
      
      if (!data) {
        console.warn('[AuthContext] No profile found for user:', userId);
        
        // Check if profiles table exists and has data
        const { data: countData, error: countError } = await supabase
          .from('profiles')
          .select('count', { count: 'exact', head: true });
          
        console.log('[AuthContext] Total profiles count:', countData);
        console.log('[AuthContext] Count error:', countError);
      } else {
        console.log('[AuthContext] Profile found with role:', data.role);
        console.log('[AuthContext] Full profile data:', data);
      }
      
      setProfile(data);
      return data;
    } catch (err: any) {
      console.error('[AuthContext] Profile fetch failed:', err.message);
      setProfile(null);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    await fetchProfile(user.id);
  }, [user?.id, fetchProfile]);

  // ────────────────────────────────────────────────
  // Update profile row (first_name, avatar_url, role, etc.)
  // ────────────────────────────────────────────────
  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      if (!user?.id) {
        return { error: new Error('No authenticated user') };
      }

      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) throw error;

        // Refresh local profile state
        await refreshProfile();

        return { error: null };
      } catch (err: any) {
        console.error('Profile update failed:', err);
        return { error: err };
      }
    },
    [user?.id, refreshProfile]
  );

  // ────────────────────────────────────────────────
  // Auth actions (unchanged mostly)
  // ────────────────────────────────────────────────
  const signIn = useCallback(async (credentials: SignInWithPasswordCredentials) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await supabase.auth.signInWithPassword(credentials);
      if (response.error) {
        setError(response.error);
        setIsLoading(false);
      }
      return response;
    } catch (err: any) {
      const errObj = { message: 'Sign in failed' } as AuthError;
      setError(errObj);
      setIsLoading(false);
      return { data: { user: null, session: null }, error: errObj };
    }
  }, []);

  const signUp = useCallback(async (credentials: SignUpWithPasswordCredentials) => {
    setError(null);
    try {
      const response = await supabase.auth.signUp(credentials);
      if (response.error) setError(response.error);
      return response;
    } catch (err: any) {
      const errObj = { message: 'Sign up failed' } as AuthError;
      setError(errObj);
      return { data: { user: null, session: null }, error: errObj };
    }
  }, []);

  // Comprehensive cleanup function to clear all auth data
  const clearAllAuthData = useCallback(() => {
    console.log('[Auth] Clearing all auth data...');
    
    // Clear React state
    setUser(null);
    setSession(null);
    setProfile(null);
    setError(null);
    
    // Clear all possible localStorage keys
    const localStorageKeys = [
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      'supabase.auth.codeVerifier',
      'supabase.auth.accessToken',
      'supabase.auth.user',
      'supabase.auth.session',
      'sb-yorxrlwwcthkovbgvxfa-auth-token', // Specific lock key
      'sb-yorxrlwwcthkovbgvxfa-auth-refresh-token',
      'sb-yorxrlwwcthkovbgvxfa-auth-code-verifier'
    ];
    
    localStorageKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`[Auth] Failed to remove localStorage key ${key}:`, error);
      }
    });
    
    // Clear all possible sessionStorage keys
    const sessionStorageKeys = [
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      'supabase.auth.codeVerifier',
      'supabase.auth.accessToken',
      'supabase.auth.user',
      'supabase.auth.session'
    ];
    
    sessionStorageKeys.forEach(key => {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.warn(`[Auth] Failed to remove sessionStorage key ${key}:`, error);
      }
    });
    
    // Clear all cookies that might contain auth data
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name.includes('supabase') || name.includes('auth')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
      }
    });
    
    console.log('[Auth] All auth data cleared');
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      console.log('[Auth] Starting sign out process');
      
      // First try Supabase signOut
      const response = await supabase.auth.signOut();
      
      if (response.error) {
        console.error('[Auth] Sign out error:', response.error);
        setError(response.error);
      } else {
        console.log('[Auth] Sign out successful');
      }
      
      // Always clear all auth data regardless of Supabase response
      clearAllAuthData();
      
      return response;
    } catch (err: any) {
      console.error('[Auth] Sign out exception:', err);
      const errObj = { message: 'Sign out failed' } as AuthError;
      setError(errObj);
      
      // Force clear all data even on error
      clearAllAuthData();
      
      return { error: errObj };
    }
  }, [clearAllAuthData]);

  const refreshSession = useCallback(async () => {
    try {
      const response = await supabase.auth.refreshSession();
      if (response.error) setError(response.error);
      return response;
    } catch (err: any) {
      const errObj = { message: 'Session refresh failed' } as AuthError;
      setError(errObj);
      return { error: errObj };
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // ────────────────────────────────────────────────
  // Role helpers – now use profile.role (only creator, admin, hr)
  // ────────────────────────────────────────────────
  const hasRole = useCallback(
    (requiredRole: string): boolean => {
      if (!profile) return false;
      const userRole = profile.role;
      
      return userRole === requiredRole || userRole === 'admin';
    },
    [profile]
  );

  // ────────────────────────────────────────────────
  // Initialize + listen
  // ────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    let profileChannel: any = null;

    const initialize = async () => {
      try {
        // 1. Get current session
        const { data: { session }, error: sessErr } = await supabase.auth.getSession();
        if (sessErr) throw sessErr;

        if (mounted && session?.user) {
          setSession(session);
          const freshProfile = await fetchProfile(session.user.id);
          setUser(processUser(session.user, freshProfile));
        }
      } catch (err: any) {
        console.error('[Auth] Init error:', err);
        if (mounted) setError({ message: 'Auth init failed' } as AuthError);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initialize();

    // 2. Auth state listener
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        console.log('[Auth] Event:', event, newSession?.user?.id);

        let currentUser = newSession?.user ?? null;
        let currentProfile: Profile | null = null;

        if (currentUser) {
          currentProfile = await fetchProfile(currentUser.id);
        }

        if (mounted) {
          setSession(newSession);
          setUser(processUser(currentUser, currentProfile));
          setIsLoading(false);
        }
      }
    );

    // 3. Realtime subscription to own profile changes
    if (user?.id) {
      profileChannel = supabase
        .channel(`profiles:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            console.log('[Realtime] Profile updated:', payload.new);
            setProfile(payload.new as Profile);
            // Also update user object
            setUser((prev) =>
              prev ? processUser(prev, payload.new as Profile) : null
            );
          }
        )
        .subscribe();
    }

    return () => {
      mounted = false;
      authSub.unsubscribe();
      if (profileChannel) {
        supabase.removeChannel(profileChannel);
      }
    };
  }, [fetchProfile, processUser, user?.id]);

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
      refreshSession,
      error,
      clearError,
      loggedrole
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
      refreshSession,
      error,
      clearError,
      loggedrole
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