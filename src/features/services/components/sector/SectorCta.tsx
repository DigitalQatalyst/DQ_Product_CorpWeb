import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectorCta({ name }: { name: string }) {
  return (
    <section className="relative py-20 overflow-hidden" style={{ backgroundImage: "url('/images/Form_background.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-primary/80" />
      <div className="relative container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform with {name}?</h2>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Our experts are ready to help you design and deploy a tailored {name} strategy for your organization.</p>
        <Link href="/consultation" className="inline-flex items-center gap-2 h-14 px-8 bg-secondary text-secondary-foreground font-bold rounded-lg hover:-translate-y-1 hover:shadow-xl transition-all group">
          Get in Touch <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
