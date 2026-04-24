import Link from "next/link";
import { ArrowRight, Palette, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ServiceCategory } from "@/features/services/hooks/useServiceCategories";

const categoryIcons: Record<string, React.ReactNode> = {
  "Design Services": <Palette size={24} className="text-secondary" />,
  "Deploy Services (SaaS)": <Rocket size={24} className="text-secondary" />,
  "Deploy Services (On-Prem)": <Rocket size={24} className="text-secondary" />,
};

export function ServiceCategoryCards({ categories }: { categories: ServiceCategory[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {categories.map((cat) => (
        <Card key={cat.id} className="rounded-xl hover:shadow-md transition-all">
          <CardContent className="p-6">
            {/* Icon */}
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              {categoryIcons[cat.name] || <Palette size={24} className="text-secondary" />}
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mb-2">{cat.name}</h3>
            
            {/* Description */}
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{cat.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {cat.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs font-normal rounded-md border-border">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Read more link */}
            <Link
              href={`/service-category/${cat.slug}`}
              className="inline-flex items-center gap-1 text-secondary hover:text-secondary/80 font-medium text-sm transition-colors"
            >
              Read more <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
