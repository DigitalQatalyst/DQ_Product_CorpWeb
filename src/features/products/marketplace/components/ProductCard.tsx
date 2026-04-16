import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductType } from "@/types/product";

export function ProductCard({ product }: { readonly product: ProductType }) {
  const Icon = product.icon as React.ElementType | undefined;

  const iconFallback = Icon ? (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon size={32} className="text-primary" />
      </div>
    </div>
  ) : null;

  const thumbnailContent = product.imageUrl ? (
    <Image
      src={product.imageUrl}
      alt={product.name}
      fill
      className="object-cover"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  ) : (
    iconFallback
  );

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow overflow-hidden p-0">
      {/* Thumbnail */}
      <div className="relative h-48 bg-muted border-b border-border">
        {thumbnailContent}
      </div>

      <CardContent className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-bold text-foreground text-lg leading-tight mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            {product.code}
          </p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-4">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <Link
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium transition-colors group mt-auto"
        >
          Learn more
          <ArrowRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </CardContent>
    </Card>
  );
}
