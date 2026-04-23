import Image from "next/image";
import { Play } from "lucide-react";
import type { SectorData } from "@/features/services/data/sectors.db";

export function SectorOverview({ sector }: { sector: SectorData }) {
  return (
    <section className="py-10 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Overview
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed mb-8">
          {sector.focus}
        </p>
        
        {/* Video or Image */}
        {sector.overviewVideo ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
            <video
              controls
              className="w-full h-full object-cover"
              poster={sector.overviewImage}
            >
              <source src={sector.overviewVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : sector.overviewImage ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
            <Image
              src={sector.overviewImage}
              alt={`${sector.name} overview`}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        ) : (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
                <Play className="w-8 h-8 text-secondary" />
              </div>
              <p className="text-muted-foreground font-medium">Video Coming Soon</p>
            </div>
          </div>
        )}

        {/* Additional Description */}
        {sector.overviewDescription && (
          <p className="text-base text-muted-foreground leading-relaxed">
            {sector.overviewDescription}
          </p>
        )}
      </div>
    </section>
  );
}
