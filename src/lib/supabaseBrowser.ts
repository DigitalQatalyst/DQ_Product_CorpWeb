import { createClient } from "@supabase/supabase-js";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase-env";

export const supabaseBrowser = createClient(getSupabaseUrl(), getSupabasePublishableKey());
