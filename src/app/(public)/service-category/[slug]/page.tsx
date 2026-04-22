import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceCategoryBySlug } from "@/features/services/api/serviceCategories";
import { ServiceCategoryPage } from "@/features/services/components/ServiceCategoryPage";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const cat = await getServiceCategoryBySlug(slug);
    if (cat) return { title: `${cat.name} | DigitalQatalyst`, description: cat.description };
  } catch {}
  return { title: "Service Not Found | DigitalQatalyst" };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  try {
    const cat = await getServiceCategoryBySlug(slug);
    if (cat) return <ServiceCategoryPage slug={slug} />;
  } catch {}

  notFound();
}
