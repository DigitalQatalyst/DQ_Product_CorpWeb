import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSectorData, allSectorSlugs } from "@/features/services/data/sectors.data";
import { SectorHero } from "@/features/services/components/sector/SectorHero";
import { SectorsSidebar } from "@/features/services/components/sector/SectorsSidebar";
import { SectorOverview } from "@/features/services/components/sector/SectorOverview";
import { SectorKeyBenefits } from "@/features/services/components/sector/SectorKeyBenefits";
import { SectorWhereToStart } from "@/features/services/components/sector/SectorWhereToStart";
import { SectorFocusAreas } from "@/features/services/components/sector/SectorFocusAreas";

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
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex pl-4">
          {/* Left Sidebar - Sectors Navigation */}
          <SectorsSidebar currentSectorId={sector.id} />
          
          {/* Main Content */}
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
