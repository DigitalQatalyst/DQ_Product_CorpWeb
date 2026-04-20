import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSectorData, allSectorSlugs } from "@/features/services/data/sectors.data";
import { SectorHero } from "@/features/services/components/sector/SectorHero";
import { SectorOverview } from "@/features/services/components/sector/SectorOverview";
import { SectorContent } from "@/features/services/components/sector/SectorContent";
import { SectorCta } from "@/features/services/components/sector/SectorCta";

type Props = { params: Promise<{ sectorId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sectorId } = await params;
  const sector = getSectorData(sectorId);
  if (!sector) return { title: "Sector Not Found | DigitalQatalyst" };
  return { title: `${sector.name} | DigitalQatalyst`, description: sector.subtitle };
}

export function generateStaticParams() {
  return allSectorSlugs.map((sectorId) => ({ sectorId }));
}

export default async function Page({ params }: Props) {
  const { sectorId } = await params;
  const sector = getSectorData(sectorId);
  if (!sector) notFound();
  return (
    <div className="min-h-screen bg-background">
      <SectorHero sector={sector} />
      <SectorOverview sector={sector} />
      <SectorContent sector={sector} />
      <SectorCta name={sector.name} />
    </div>
  );
}
