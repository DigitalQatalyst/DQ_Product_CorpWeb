import type { Metadata } from "next";
import { AdminProductsListPage } from "@/features/admin/products/AdminProductsListPage";

export const metadata: Metadata = { title: "Products | DQ Admin" };

export default function Page() {
  return <AdminProductsListPage />;
}

