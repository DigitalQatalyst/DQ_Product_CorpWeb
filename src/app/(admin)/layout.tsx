import { AdminRouteShell } from "@/features/admin/auth/AdminRouteShell";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminRouteShell>{children}</AdminRouteShell>;
}
