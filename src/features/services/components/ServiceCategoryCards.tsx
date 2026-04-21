"use client";

import Link from "next/link";
import { ChevronRight, Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePublishedServiceCategories } from "@/features/services/hooks/useServiceCategories";

export function ServiceCategoryCards() {
  const { data: categories = [], isLoading } = usePublishedServiceCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {categories.map((cat) => (
        <Card key={cat.id} className="rounded-xl hover:shadow-md transition-all">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">{cat.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{cat.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {cat.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal rounded">
                  {tag}
                </Badge>
              ))}
            </div>
            <Link
              href={`/services/${cat.slug}`}
              className="inline-flex items-center gap-1 text-secondary hover:text-secondary/80 font-medium text-sm transition-colors"
            >
              Read more <ChevronRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
