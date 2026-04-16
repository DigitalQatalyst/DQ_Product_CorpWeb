import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ProductsHero() {
  return (
    <section className="relative h-screen overflow-hidden">
      <Image
        src="/images/Service_landing_hero_image.png"
        alt="Products at Digital Qatalyst"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-r from-[hsl(var(--primary))]/95 via-[hsl(var(--primary))]/70 to-[hsl(var(--primary))]/30" />
      <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex flex-col justify-center items-center">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Digital Products That Turn Strategy into Execution
          </h1>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            DQ products operationalize your vision through unified, scalable
            systems built for measurable growth and sustained transformation
          </p>
          <Link
            href="/products/marketplace"
            className="inline-flex items-center gap-2 h-14 px-8 bg-white text-primary font-bold rounded-lg hover:-translate-y-1 hover:shadow-xl transition-all group"
          >
            Explore Our Products
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
