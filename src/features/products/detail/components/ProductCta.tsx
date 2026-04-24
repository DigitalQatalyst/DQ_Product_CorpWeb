"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { WaitlistModal } from "./WaitlistModal";
import type { ProductType } from "@/types/product";
import type { ProductCtaType } from "@/features/products/hooks/useProducts";

interface Props {
  product: ProductType & { ctaType: ProductCtaType };
}

export function ProductCta({ product }: Props) {
  const router = useRouter();
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const label =
    product.ctaType === "demo" ? "Request Product Demo"
    : product.ctaType === "tour" ? "Request Tour"
    : "Join Waitlist";

  const handleClick = () => {
    if (product.ctaType === "demo") router.push(`/forms/product-demo/${product.code.toLowerCase()}`);
    else if (product.ctaType === "tour") router.push("/forms/tour-request");
    else setWaitlistOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 h-14 px-8 bg-secondary text-secondary-foreground font-bold rounded-lg hover:-translate-y-1 hover:shadow-xl transition-all group"
      >
        {label}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      {product.ctaType === "waitlist" && (
        <WaitlistModal
          open={waitlistOpen}
          onClose={() => setWaitlistOpen(false)}
          productName={`${product.name} (${product.code})`}
          productCode={product.code}
        />
      )}
    </>
  );
}
