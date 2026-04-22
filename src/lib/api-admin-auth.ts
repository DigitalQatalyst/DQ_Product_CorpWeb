/**
 * Shared helper for admin route handlers.
 * Returns the authenticated admin userId or null.
 */
import { createServerClient } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminProfileRole } from "@/lib/admin-role";

export async function getAdminUserId(request: NextRequest): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: () => {},
    },
  });

  let userId: string | null = null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const claimRole =
      (user.user_metadata?.role as string | undefined) ??
      (user.app_metadata?.role as string | undefined);
    if (isAdminProfileRole(claimRole)) return user.id;
    userId = user.id;
  }

  if (!userId) {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (token) {
      const {
        data: { user: tokenUser },
      } = await supabase.auth.getUser(token);
      if (tokenUser) userId = tokenUser.id;
    }
  }

  if (!userId) return null;

  const { data: profile } = await getSupabaseAdmin()
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return isAdminProfileRole(profile?.role as string | undefined) ? userId : null;
}
