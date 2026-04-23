import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function MarketplaceBanner() {
  return (
    <section className="py-16 bg-linear-to-r from-primary to-primary/80">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Services Marketplace
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Browse our comprehensive marketplace of digital transformation
            services and solutions designed to help your business thrive in the
            digital era.
          </p>
          <div className="flex justify-center">
            <Link
              href="/services/marketplace"
              className="inline-flex items-center gap-2 h-14 px-8 bg-secondary text-secondary-foreground font-bold rounded-lg hover:-translate-y-1 hover:shadow-xl transition-all group"
            >
              Browse Services
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
