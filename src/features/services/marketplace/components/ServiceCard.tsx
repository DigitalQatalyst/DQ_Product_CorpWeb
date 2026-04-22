import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Service } from "@/features/services/hooks/useServices";

interface Props {
  service: Service;
}

export function ServiceCard({ service }: Readonly<Props>) {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardContent className="flex-1 p-6">
        <div className="mb-3">
          <h3 className="font-semibold text-foreground leading-snug mb-1">{service.title}</h3>
          <p className="text-xs text-muted-foreground">{service.provider}</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
          {service.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {service.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Link
          href={`/services/${service.id}`}
          className="flex-1 inline-flex items-center justify-center h-8 px-3 text-sm font-medium rounded-md border border-border bg-background hover:bg-muted transition-colors"
        >
          View Details
        </Link>
        <Link
          href={`/services/${service.id}?action=true`}
          className="flex-1 inline-flex items-center justify-center h-8 px-3 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          Request Service
        </Link>
      </CardFooter>
    </Card>
  );
}
