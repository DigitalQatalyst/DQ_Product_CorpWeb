"use client";

import { notFound } from "next/navigation";
import { Loader } from "lucide-react";
import { useSector, useSectorGroups } from "@/features/services/hooks/useSectors";
import { SectorHero } from "./SectorHero";
import { SectorsSidebar } from "./SectorsSidebar";
import { SectorOverview } from "./SectorOverview";
import { SectorKeyBenefits } from "./SectorKeyBenefits";
import { SectorWhereToStart } from "./SectorWhereToStart";
import { SectorFocusAreas } from "./SectorFocusAreas";

export function SectorContent({ slug }: { slug: string }) {
  const { data: sector, isLoading: sectorLoading } = useSector(slug);
  const { data: groups = [], isLoading: groupsLoading } = useSectorGroups();

  if (sectorLoading || groupsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!sector) return notFound();

  const sidebarSectors = groups.flatMap((g) =>
    g.items.map((s) => ({ id: s.id, slug: s.slug, name: s.name }))
  );

  return (
    <div className="min-h-screen bg-background">
      <SectorHero sector={sector} />
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex">
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
