"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectorLink {
  id: string;
  name: string;
  slug: string;
}

interface SectorsSidebarProps {
  currentSectorId: string;
  sectors: SectorLink[];
}

export function SectorsSidebar({ currentSectorId, sectors }: SectorsSidebarProps) {
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
