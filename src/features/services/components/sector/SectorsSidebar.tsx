"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectorLink {
  id: string;
  name: string;
  slug: string;
}

const sectors: SectorLink[] = [
  { id: "experience", name: "Experience 4.0", slug: "experience-4-0" },
  { id: "agility", name: "Agility 4.0", slug: "agility-4-0" },
  { id: "farming", name: "Farming 4.0", slug: "farming-4-0" },
  { id: "government", name: "Government 4.0", slug: "government-4-0" },
  { id: "hospitality", name: "Hospitality 4.0", slug: "hospitality-4-0" },
  { id: "infrastructure", name: "Infrastructure 4.0", slug: "infrastructure-4-0" },
  { id: "logistics", name: "Logistics 4.0", slug: "logistics-4-0" },
  { id: "mining", name: "Mining 4.0", slug: "mining-4-0" },
  { id: "plant", name: "Plant 4.0", slug: "plant-4-0" },
  { id: "retail", name: "Retail 4.0", slug: "retail-4-0" },
  { id: "service", name: "Services 4.0", slug: "service-4-0" },
  { id: "wellness", name: "Wellness 4.0", slug: "wellness-4-0" },
  { id: "intelligence", name: "Intelligence 4.0", slug: "intelligence-4-0" },
  { id: "workspace", name: "Workspace 4.0", slug: "workspace-4-0" },
  { id: "governance", name: "Governance 4.0", slug: "governance-4-0" },
  { id: "backoffice", name: "Backoffice 4.0", slug: "backoffice-4-0" },
];

interface SectorsSidebarProps {
  currentSectorId: string;
}

export function SectorsSidebar({ currentSectorId }: SectorsSidebarProps) {
  return (
    <aside className="w-64 bg-gray-50 rounded-lg sticky top-4 max-h-[600px] overflow-y-auto flex-shrink-0">
      <div className="p-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-4">
          Our Services
        </h2>
        <nav className="space-y-1 mb-6">
          {sectors.map((sector) => {
            const isActive = sector.id === currentSectorId;
            return (
              <Link
                key={sector.id}
                href={`/services/sectors/${sector.slug}`}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-white"
                    : "text-foreground hover:bg-gray-200"
                )}
              >
                {sector.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA Section */}
        <div className="bg-primary text-white rounded-lg p-6">
          <p className="text-sm mb-4 leading-relaxed">
            Need help? Our experts will guide you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-colors text-sm group"
          >
            Contact Us <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
