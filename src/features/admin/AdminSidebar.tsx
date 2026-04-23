"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Package,
  Layers,
  Globe,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Service Categories", href: "/admin/service-categories", icon: Layers },
  { label: "Services", href: "/admin/services", icon: Briefcase },
  { label: "Sectors", href: "/admin/sectors", icon: Globe },
  { label: "Profiles", href: "/admin/profiles", icon: Users },
  { label: "Job Postings", href: "/admin/job-postings", icon: Briefcase },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  // { label: "Interviews", href: "/admin/interviews", icon: Calendar },
  { label: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/dq-logo-white.svg" alt="DQ" className="h-8 w-auto" />
        </Link>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Admin Panel</p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map(({ label, href, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  render={<Link href={href} />}
                  isActive={pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`))}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" />}>
              <LogOut size={16} />
              <span>Back to Site</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={async () => {
                await supabaseBrowser.auth.signOut();
                globalThis.location.href = "/login";
              }}
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
