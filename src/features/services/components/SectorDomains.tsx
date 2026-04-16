import Link from "next/link";
import { getSectorsByGroup } from "@/data/sectors";

const groups = getSectorsByGroup();

export function SectorDomains() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Tailored Services for Your Industry Needs
          </h2>
          <p className="text-lg text-muted-foreground">
            From optimizing customer experiences to boosting operational efficiency, our services
            are designed to drive transformation with adaptable, innovative strategies.
          </p>
        </div>

        <div className="space-y-6 max-w-6xl mx-auto">
          {groups.map((group) => (
            <div key={group.id} className="bg-background p-8 rounded-xl border border-border">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
                {group.label}
              </h3>
              <p className="text-muted-foreground mb-4">{group.description}</p>
              <div
                className={`grid grid-cols-1 gap-4 ${
                  group.items.length >= 3
                    ? "md:grid-cols-2 lg:grid-cols-3"
                    : "md:grid-cols-2"
                }`}
              >
                {group.items.map((item) => (
                  <div
                    key={item.slug}
                    className="px-4 py-3 bg-primary/5 rounded-xl border border-primary/10"
                  >
                    <div className="text-sm font-medium text-foreground mb-1">{item.title}</div>
                    <Link
                      href={`/services/sectors/${item.slug}`}
                      className="text-primary hover:text-primary/80 text-xs font-semibold transition-colors"
                    >
                      Read more →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
