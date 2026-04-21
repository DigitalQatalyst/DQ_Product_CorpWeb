import type { Metadata } from "next";
import { AdminProductEditorPage } from "@/features/admin/products/AdminProductEditorPage";

export const metadata: Metadata = { title: "New Product | DQ Admin" };

export default function Page() {
  return <AdminProductEditorPage mode="create" />;
}

