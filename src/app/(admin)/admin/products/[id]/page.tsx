import type { Metadata } from "next";
import { AdminProductEditorPage } from "@/features/admin/products/AdminProductEditorPage";

export const metadata: Metadata = { title: "Edit Product | DQ Admin" };

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Readonly<Props>) {
  const { id } = await params;
  return <AdminProductEditorPage mode="edit" productId={id} />;
}

