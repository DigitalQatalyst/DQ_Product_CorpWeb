import type { Metadata } from "next";
import { ProductsPage } from "@/features/products/ProductsPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products | DigitalQatalyst",
  description:
    "DQ products operationalize your vision through unified, scalable systems built for measurable growth and sustained transformation.",
};

export default async function Page() {
  return <ProductsPage />;
}
