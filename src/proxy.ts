import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_PREFIX = "/admin";
const LOGIN_PATH = "/login";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard admin routes (skip the login page itself)
  if (!pathname.startsWith(ADMIN_PREFIX) || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          ),
      },
    },
  );

  // Validates JWT with Supabase Auth server — not just a local decode
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Fast path: role in JWT claims (set by DB trigger on profiles update)
  const role =
    (user.user_metadata?.role as string | undefined) ??
    (user.app_metadata?.role as string | undefined);

  if (role === "admin") return response;

  // Slow path: role not in claims yet — check profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.searchParams.set("error", "not_admin");
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
