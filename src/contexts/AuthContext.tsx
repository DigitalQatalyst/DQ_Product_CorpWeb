import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

// User roles
export type UserRole = 'user' | 'admin' | 'hr' | 'editor';

// User profile with role
export interface UserProfile {
  id: string;
  name?: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  location?: string;
  created_at: string;
}

// Auth context type
export interface AuthContextType {
  // Auth state
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null; success: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; success: boolean }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null; success: boolean }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: AuthError | null; success: boolean }>;
  
  // Role checks
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isHR: () => boolean;
  isEditor: () => boolean;
  
  // Email verification
  resendVerificationEmail: () => Promise<{ error: AuthError | null; success: boolean }>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from database
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
       

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
       console.log("data returned",data)

      return data;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  // Create or update user profile in database
  const upsertProfile = async (user: User, name?: string): Promise<UserProfile | null> => {
    try {
      const profileData = {
        id: user.id,
        name: name || user.user_metadata?.name || user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, {
          onConflict: 'id',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in upsertProfile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async (retryCount = 0) => {
      try {
        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth initialization timeout')), 5000)
        );
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (session?.user) {
          setUser(session.user);
          setSession(session);
          
          // Fetch or create user profile
          let userProfile = await fetchProfile(session.user.id);
          if (!userProfile) {
            userProfile = await upsertProfile(session.user);
          }
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        
        // Retry logic for lock timeout errors
        if (retryCount < 2 && error?.message?.includes('lock')) {
          console.log(`Retrying auth initialization (${retryCount + 1}/3)...`);
          setTimeout(() => initializeAuth(retryCount + 1), 1000);
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setUser(session?.user || null);
        setSession(session);
        
        if (session?.user) {
          // Fetch or create user profile
          let userProfile = await fetchProfile(session.user.id);
          if (!userProfile) {
            userProfile = await upsertProfile(session.user);
          }
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        return { error, success: false };
      }

      if (data.user && !data.session) {
        // Email confirmation required
        return { error: null, success: true };
      }

      // User is automatically signed in
      if (data.user && data.session) {
        await upsertProfile(data.user, name);
      }

      return { error: null, success: true };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error: error as AuthError, success: false };
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error, success: false };
      }

      // Profile will be fetched automatically by the auth state listener
      return { error: null, success: true };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error: error as AuthError, success: false };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Error in signOut:', error);
      return { error: error as AuthError };
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      return { error, success: !error };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { error: error as AuthError, success: false };
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: { message: 'No authenticated user' } as AuthError, success: false };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { error, success: false };
      }

      setProfile(data);
      return { error: null, success: true };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { error: error as AuthError, success: false };
    }
  };

  // Resend verification email
  const resendVerificationEmail = async () => {
    if (!user) {
      return { error: { message: 'No authenticated user' } as AuthError, success: false };
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
      });

      return { error, success: !error };
    } catch (error) {
      console.error('Error in resendVerificationEmail:', error);
      return { error: error as AuthError, success: false };
    }
  };

  // Role checking functions
  const hasRole = (role: UserRole): boolean => {
    return profile?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return profile ? roles.includes(profile.role) : false;
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isHR = (): boolean => hasRole('hr');
  const isEditor = (): boolean => hasRole('editor');

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    hasRole,
    hasAnyRole,
    isAdmin,
    isHR,
    isEditor,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
