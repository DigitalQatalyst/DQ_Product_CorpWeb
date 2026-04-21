"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { offeringClasses, type ProductClass } from "../data/products.data";

const tabs: { id: ProductClass; label: string }[] = [
  { id: "all", label: "All Offerings" },
  ...offeringClasses.map((c) => ({ id: c.id, label: c.label })),
];

export function ProductOfferings() {
  const [selected, setSelected] = useState<ProductClass>("all");

  const visible = offeringClasses.filter(
    (c) => selected === "all" || selected === c.id
  );

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Four Classes of DQ Offerings
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            DQ offerings progress from blueprint advisory to automated transformation platforms and
            live economic ecosystems.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelected(tab.id)}
              className={`pb-4 px-2 font-medium transition-all relative ${
                selected === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {selected === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
              )}
            </button>
          ))}
        </div>

        {/* Offering groups */}
        {visible.map((cls) => (
          <div key={cls.id} className="mb-16">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground">{cls.title}</h3>
              <p className="text-muted-foreground">{cls.subtitle}</p>
            </div>
            <div className={`grid gap-6 ${cls.cols === "3" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              {cls.items.map((item) => (
                <Card key={item.title} className="flex flex-col h-full">
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                      <item.icon className="text-secondary" size={32} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-4">{item.title}</h4>
                    <p className="text-muted-foreground flex-1 mb-6 leading-relaxed">
                      {item.description}
                    </p>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-medium transition-colors mt-auto"
                    >
                      {item.linkLabel} <ArrowRight size={18} />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
