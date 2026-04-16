"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HomeIcon, ChevronRight, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { dqProducts } from "@/data/products";
import {
  getFeatureDescription,
  getAboutParagraphs,
  getProductContent,
  getCategoryDescription,
} from "./data/product-detail.data";
import { WaitlistModal } from "./components/WaitlistModal";
import type { ProductType } from "@/types/product";

// Products that use "Request Demo" instead of "Join Waitlist"
const DEMO_PRODUCTS = ["dtmp", "plant40"];
// Products that use "Request Tour"
const TOUR_PRODUCTS = ["dtmcc"];

function CtaButton({ product, onWaitlist }: { product: ProductType; onWaitlist: () => void }) {
  const router = useRouter();

  if (DEMO_PRODUCTS.includes(product.id)) {
    return (
      <Button onClick={() => router.push(`/forms/product-demo/${product.code.toLowerCase()}`)}>
        Request Product Demo
      </Button>
    );
  }
  if (TOUR_PRODUCTS.includes(product.id)) {
    return <Button onClick={() => router.push("/forms/tour-request")}>Request Tour</Button>;
  }
  return <Button onClick={onWaitlist}>Join Waitlist</Button>;
}

export function ProductDetailPage({ productId }: { productId: string }) {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const product = dqProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-medium text-foreground mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button variant="outline">
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const Icon = product.icon as React.ElementType | undefined;
  const content = getProductContent(product.id);
  const aboutParagraphs = getAboutParagraphs(product.id);

  const showWaitlist = !DEMO_PRODUCTS.includes(product.id) && !TOUR_PRODUCTS.includes(product.id);

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/products" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <HomeIcon size={14} /> Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/products/marketplace" className="hover:text-foreground transition-colors">
            Products
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground">{product.code}</span>
        </nav>
      </div>

      {/* Hero banner */}
      <div className="w-full bg-gradient-to-r from-orange-50 to-red-50 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left */}
            <div className="lg:w-2/3">
              <h1 className="text-4xl font-bold text-foreground leading-tight mb-6">
                {product.name} ({product.code})
              </h1>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">{product.category}</Badge>
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>

              <CtaButton product={product} onWaitlist={() => setWaitlistOpen(true)} />
            </div>

            {/* Right — product image */}
            <div className="lg:w-1/3 w-full">
              <div className="relative rounded-lg overflow-hidden shadow-lg aspect-video bg-muted">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                ) : Icon ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto flex items-center justify-center mb-2">
                        <Icon size={48} className="text-primary" />
                      </div>
                      <p className="text-muted-foreground font-medium">{product.code}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Key Features */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.tags.map((tag) => (
              <Card key={tag} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <CheckCircle size={24} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{tag}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {getFeatureDescription(product.id, tag)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="bg-muted/40 rounded-xl p-8 border border-border">
          <h2 className="text-3xl font-bold text-foreground mb-6">About {product.code}</h2>
          <div className="space-y-4">
            {aboutParagraphs.map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>
            ))}
          </div>
        </section>

        {/* Problem / Solution / Capabilities / Practical Value */}
        <section className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4">The Problem Space</h3>
            <p className="text-muted-foreground leading-relaxed">{content.problemStatement}</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Our Unique Solution</h3>
            <p className="text-muted-foreground leading-relaxed">{content.solutionStatement}</p>
          </div>

          {content.capabilities.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{content.capabilitiesLabel}</h3>
              <div className="space-y-4">
                {content.capabilities.map((cap) => (
                  <div
                    key={cap.title}
                    className={`border-l-4 p-4 rounded-r-lg ${
                      cap.accent === "primary"
                        ? "border-primary bg-primary/5"
                        : "border-secondary bg-secondary/5"
                    }`}
                  >
                    <h4 className="font-bold text-foreground mb-2">{cap.title}</h4>
                    <p className="text-muted-foreground">{cap.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {content.practicalValues.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Practical Value</h3>
              <Card>
                <CardContent className="p-0 divide-y divide-border">
                  {content.practicalValues.map((pv) => (
                    <div key={pv.title} className="flex items-center gap-6 p-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={pv.icon} />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-lg mb-1">{pv.title}</h4>
                        <p className="text-muted-foreground">{pv.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </section>

        {/* Product Category */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Product Category</h2>
          <div className="bg-gradient-to-br from-orange-50 via-background to-red-50 rounded-xl p-8 border border-orange-100 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="text-base px-4 py-1.5 font-semibold">
                    {product.category}
                  </Badge>
                  <Separator className="flex-1" />
                </div>

                <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                  {getCategoryDescription(product.id, product.category)}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Fast Implementation", sub: "Quick deployment" },
                    { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Enterprise Ready", sub: "Scalable solution" },
                    { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", title: "24/7 Support", sub: "Always available" },
                  ].map((item) => (
                    <Card key={item.title}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.sub}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showWaitlist && (
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
