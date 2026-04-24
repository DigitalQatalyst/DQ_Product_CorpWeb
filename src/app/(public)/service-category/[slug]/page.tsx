import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/features/services/components/ServiceCategoryPage";
import { getServiceCategoryBySlug } from "@/features/services/hooks/useServiceCategories";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getServiceCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: `${cat.heroTitle || cat.name} | DigitalQatalyst`,
    description: cat.heroSubtitle || cat.description,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <ServiceCategoryPage slug={slug} />;
}
