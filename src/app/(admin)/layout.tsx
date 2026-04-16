import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/AdminSidebar";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b border-border px-4 bg-background">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium text-muted-foreground">DigitalQatalyst Admin</span>
        </header>
        <main className="flex-1 p-6 bg-muted/30 min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
