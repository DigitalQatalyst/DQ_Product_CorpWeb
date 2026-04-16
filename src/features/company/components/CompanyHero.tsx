import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CompanyHero() {
  return (
    <section className="relative overflow-hidden h-screen">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/about_us_hero.png" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-primary/30" />
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-primary-foreground">
            Transform Your Business for the Digital Future
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mb-10 mx-auto">
            We simplify digital transformation, combining strategy, technology, and expertise to guide your success in the digital economy
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-full hover:bg-secondary/80 transition-all hover:-translate-y-1 hover:shadow-xl group"
          >
            Start Your Transformation Journey
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
