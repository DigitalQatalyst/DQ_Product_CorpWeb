"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/AdminSidebar";
import { Separator } from "@/components/ui/separator";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const LOGIN_PATH = "/login";

async function fetchAdminMe(accessToken: string): Promise<number> {
  const res = await fetch("/api/admin/me", {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  return res.status;
}

export function AdminRouteShell({ children }: { readonly children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function ensureAdminDashboard() {
      const { data } = await supabaseBrowser.auth.getSession();
      const session = data.session;
      if (!session) {
        if (!cancelled) {
          router.replace(`${LOGIN_PATH}?next=${encodeURIComponent(pathname)}`);
        }
        return;
      }

      const status = await fetchAdminMe(session.access_token);
      if (cancelled) return;

      if (status === 401 || status === 403) {
        await supabaseBrowser.auth.signOut();
        router.replace(`${LOGIN_PATH}?error=not_admin`);
        return;
      }

      if (status >= 400) {
        await supabaseBrowser.auth.signOut();
        router.replace(`${LOGIN_PATH}?error=admin_check_failed`);
        return;
      }

      setAllowed(true);
    }

    setAllowed(false);
    void ensureAdminDashboard();

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (!session) {
        setAllowed(false);
        router.replace(`${LOGIN_PATH}?next=${encodeURIComponent(pathname)}`);
        return;
      }
      void (async () => {
        const status = await fetchAdminMe(session.access_token);
        if (cancelled) return;
        if (status === 401 || status === 403) {
          await supabaseBrowser.auth.signOut();
          setAllowed(false);
          router.replace(`${LOGIN_PATH}?error=not_admin`);
          return;
        }
        if (status >= 400) {
          await supabaseBrowser.auth.signOut();
          setAllowed(false);
          router.replace(`${LOGIN_PATH}?error=admin_check_failed`);
          return;
        }
        setAllowed(true);
      })();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 text-sm text-muted-foreground">
        Verifying admin access…
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b border-border px-4 bg-background">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium text-muted-foreground">DigitalQatalyst Admin</span>
        </header>
        <main className="flex-1 p-6 bg-muted/30 min-h-[calc(100vh-3.5rem)]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
