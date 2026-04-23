import { SectorContent } from "@/features/services/components/sector/SectorContent";

type Props = { params: Promise<{ sectorId: string }> };

export default async function Page({ params }: Props) {
  const { sectorId } = await params;
  return <SectorContent slug={sectorId} />;
}
