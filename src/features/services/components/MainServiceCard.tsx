import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ServiceContent } from "../data/design-deploy.data";

export function MainServiceCard({
  service,
}: Readonly<{ service: ServiceContent }>) {
  const Icon = service.cardIcon;
  return (
    <Card className="rounded-xl hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
          <Icon className="w-8 h-8 text-secondary" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {service.cardTitle}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          {service.cardDescription}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {service.tags.map((tag: string) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-normal rounded"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-1 text-secondary hover:text-secondary/80 font-medium text-sm transition-colors"
        >
          Read more <ChevronRight className="w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
