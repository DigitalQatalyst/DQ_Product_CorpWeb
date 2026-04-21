import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase-env";

export const supabaseBrowser = createBrowserClient(
  getSupabaseUrl(),
  getSupabasePublishableKey(),
);
