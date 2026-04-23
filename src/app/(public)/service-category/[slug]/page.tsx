import { ServiceCategoryPage } from "@/features/services/components/ServiceCategoryPage";

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <ServiceCategoryPage slug={slug} />;
}
