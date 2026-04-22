import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { hasSupabaseSecretKey } from "@/lib/supabase-env";
import { isAdminProfileRole } from "@/lib/admin-role";

/**
 * Used by LoginPage to verify the signed-in user has admin role.
 * Accepts Bearer token in Authorization header.
 */
export async function GET(request: Request) {
  if (!hasSupabaseSecretKey()) {
    return NextResponse.json({ error: "SUPABASE_SECRET_KEY is not configured." }, { status: 500 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () =>
        "cookies" in request && typeof (request as NextRequest).cookies?.getAll === "function"
          ? (request as NextRequest).cookies.getAll()
          : [],
      setAll: () => {},
    },
  });

  // Try cookie session first
  let userId: string | null = null;
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    userId = user.id;
    const claimRole = (user.user_metadata?.role as string | undefined) ?? (user.app_metadata?.role as string | undefined);
    if (isAdminProfileRole(claimRole)) return NextResponse.json({ ok: true });
  }

  // Fall back to Bearer token
  if (!userId) {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (token) {
      const { data: { user: tokenUser } } = await supabase.auth.getUser(token);
      if (tokenUser) userId = tokenUser.id;
    }
  }

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check profiles table
  const { data: profile } = await getSupabaseAdmin()
    .from("profiles").select("role").eq("id", userId).maybeSingle();

  if (!isAdminProfileRole(profile?.role as string | undefined)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
