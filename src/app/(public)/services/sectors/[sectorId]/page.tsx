import { notFound } from "next/navigation";
import {
  getSectorBySlug,
  listSectorGroups,
} from "@/features/services/hooks/useSectors";
import { SectorHero } from "@/features/services/components/sector/SectorHero";
import { SectorsSidebar } from "@/features/services/components/sector/SectorsSidebar";
import { SectorOverview } from "@/features/services/components/sector/SectorOverview";
import { SectorKeyBenefits } from "@/features/services/components/sector/SectorKeyBenefits";
import { SectorWhereToStart } from "@/features/services/components/sector/SectorWhereToStart";
import { SectorFocusAreas } from "@/features/services/components/sector/SectorFocusAreas";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ sectorId: string }> };

export default async function Page({ params }: Props) {
  const { sectorId } = await params;

  const [sector, groups] = await Promise.all([
    getSectorBySlug(sectorId),
    listSectorGroups(),
  ]);

  if (!sector) return notFound();

  const sidebarSectors = groups.flatMap((g) =>
    g.items.map((s) => ({ id: s.id, slug: s.slug, name: s.name })),
  );

  return (
    <div className="min-h-screen bg-background">
      <SectorHero sector={sector} />
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex lg:gap-6">
          <div className="hidden lg:block">
            <SectorsSidebar
              currentSectorId={sector.id}
              sectors={sidebarSectors}
            />
          </div>
          <main className="flex-1 min-w-0">
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
