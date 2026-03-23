import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Dedicated client for password reset operations with lock disabled
export const passwordResetClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    lock: undefined, // Disable Navigator LockManager
    persistSession: false, // Don't persist session during reset
    autoRefreshToken: false, // Don't auto refresh during reset
  },
});
