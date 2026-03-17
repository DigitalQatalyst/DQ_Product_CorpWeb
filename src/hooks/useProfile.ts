import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error) {
        setProfile(data);
      } else {
        console.error('Error fetching profile:', error);
        setProfile(null);
      }
      
      setLoading(false);
    };

    getProfile();

    // Optional: listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [user]);

  return { profile, loading };
};

// Helper hook to check if user has specific role
export const useRole = (requiredRole) => {
  const { profile } = useProfile();
  
  return {
    hasRole: profile?.role === requiredRole,
    isAdmin: profile?.role === 'admin',
    isHr: profile?.role === 'hr',
    isEditor: profile?.role === 'editor',
    isUser: profile?.role === 'user',
    profile
  };
};
