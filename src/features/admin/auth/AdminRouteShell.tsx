"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/AdminSidebar";
import { Separator } from "@/components/ui/separator";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const LOGIN_PATH = "/admin/login";

export function AdminRouteShell({ children }: { readonly children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === LOGIN_PATH;
  const [dashboardReady, setDashboardReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (isLogin) {
        const { data } = await supabaseBrowser.auth.getSession();
        if (data.session && !cancelled) router.replace("/admin");
        return;
      }

      const { data } = await supabaseBrowser.auth.getSession();
      if (!data.session) {
        if (!cancelled) router.replace(LOGIN_PATH);
        return;
      }
      if (!cancelled) setDashboardReady(true);
    }

    void run();

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (isLogin) {
        if (session) router.replace("/admin");
        return;
      }
      if (!session) {
        setDashboardReady(false);
        router.replace(LOGIN_PATH);
        return;
      }
      setDashboardReady(true);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [isLogin, pathname, router]);

  if (isLogin) {
    return <div className="min-h-screen bg-muted/30">{children}</div>;
  }

  if (!dashboardReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 text-sm text-muted-foreground">
        Checking session…
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
