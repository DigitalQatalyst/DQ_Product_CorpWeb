import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SectorData } from "@/features/services/data/sectors.data";

export function SectorHero({ sector }: { sector: SectorData }) {
  return (
    <section className="relative min-h-[400px] flex items-center overflow-hidden">
      <Image src={sector.heroImage} alt={sector.name} fill className="object-cover" priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/60" />
      <div className="relative container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto">{sector.title}</h1>
        <p className="text-lg text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">{sector.subtitle}</p>
        <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors group">
          Explore Resources <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
