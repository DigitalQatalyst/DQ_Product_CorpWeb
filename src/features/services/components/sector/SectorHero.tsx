import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { SectorData } from "@/features/services/data/sectors.data";

export function SectorHero({ sector }: { sector: SectorData }) {
  return (
    <section className="relative min-h-[500px] flex items-center overflow-hidden">
      <Image src={sector.heroImage} alt={sector.name} fill className="object-cover" priority sizes="100vw" />
      <div className="absolute inset-0 bg-primary/80" />
      <div className="relative container mx-auto px-4 md:px-6 py-20">
        <div className="max-w-2xl pl-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {sector.name}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            {sector.subtitle}
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 h-14 px-8 bg-secondary text-secondary-foreground font-bold rounded-lg hover:-translate-y-1 hover:shadow-xl transition-all group"
          >
            Get in Touch <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Breadcrumb Navigation - Bottom Left */}
        <nav className="absolute bottom-8 left-4 md:left-6 pl-4 flex items-center gap-2 text-sm text-white/70">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight size={16} />
          <Link href="/services" className="hover:text-white transition-colors">
            Services
          </Link>
          <ChevronRight size={16} />
          <span className="text-white">{sector.name}</span>
        </nav>
      </div>
    </section>
  );
}
