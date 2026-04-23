import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSectorBySlug, listSectorGroups } from "@/features/services/hooks/useSectors";
import { SectorHero } from "@/features/services/components/sector/SectorHero";
import { SectorsSidebar } from "@/features/services/components/sector/SectorsSidebar";
import { SectorOverview } from "@/features/services/components/sector/SectorOverview";
import { SectorKeyBenefits } from "@/features/services/components/sector/SectorKeyBenefits";
import { SectorWhereToStart } from "@/features/services/components/sector/SectorWhereToStart";
import { SectorFocusAreas } from "@/features/services/components/sector/SectorFocusAreas";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ sectorId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sectorId } = await params;
  const sector = await getSectorBySlug(sectorId);
  if (!sector) return { title: "Sector Not Found | DigitalQatalyst" };
  return { title: `${sector.name} | DigitalQatalyst`, description: sector.subtitle };
}

export default async function Page({ params }: Props) {
  const { sectorId } = await params;

  const [sector, groups] = await Promise.all([
    getSectorBySlug(sectorId),
    listSectorGroups(),
  ]);

  if (!sector) notFound();

  const sidebarSectors = groups.flatMap((g) =>
    g.items.map((s) => ({ id: s.id, slug: s.slug, name: s.name }))
  );

  return (
    <div className="min-h-screen bg-background">
      <SectorHero sector={sector} />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex pl-4">
          <SectorsSidebar currentSectorId={sector.id} sectors={sidebarSectors} />

          <main className="flex-1">
            <SectorOverview sector={sector} />
            <SectorKeyBenefits sector={sector} />
            <SectorWhereToStart sector={sector} />
            <SectorFocusAreas sector={sector} />
          </main>
        </div>
      </div>
    </div>
  );
}
