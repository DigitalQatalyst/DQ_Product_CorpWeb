"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
    <aside className="w-60 flex-shrink-0 sticky top-24 self-start pt-10">
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Our Sectors
          </p>
        </div>

        <ScrollArea className="h-[420px]">
          <nav className="px-2 pb-2 space-y-0.5">
            {sectors.map((sector) => {
              const isActive = sector.id === currentSectorId;
              return (
                <Link
                  key={sector.id}
                  href={`/services/sectors/${sector.slug}`}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-secondary text-white font-medium"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {sector.name}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <Separator />

        <div className="p-4 bg-primary/5 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Need help? Our experts will guide you.
          </p>
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium bg-secondary text-white hover:bg-secondary/90 transition-colors group"
          >
            Contact Us
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
