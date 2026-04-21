import type { Metadata } from "next";
import { AdminProfilesPage } from "@/features/admin/profiles/AdminProfilesPage";

export const metadata: Metadata = { title: "Profiles | DQ Admin" };

export default function Page() {
  return <AdminProfilesPage />;
}
