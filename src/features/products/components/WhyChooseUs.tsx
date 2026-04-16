"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { stats, testimonials } from "../data/products.data";

export function WhyChooseUs() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setCurrent((p) => (p + 1) % testimonials.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Our Products?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our products accelerate digital transformation, deliver measurable
            results, and ensure expert support with top-tier security.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <Card
              key={s.value}
              className="flex flex-col h-full hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-8 flex flex-col flex-1">
                <div className="text-4xl font-bold text-primary mb-2">
                  {s.value}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {s.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  {s.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials carousel */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={`${t.name}-${t.title}`} className="min-w-full px-4">
                  <Card className="bg-primary/5 border-primary/10">
                    <CardContent className="p-8 md:p-12">
                      <svg
                        className="w-12 h-12 text-primary/30 mb-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <p className="text-lg md:text-xl text-foreground mb-6 leading-relaxed italic">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                          {t.initials}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">
                            {t.name}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {t.title}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((t, i) => (
              <button
                key={`${t.name}-${t.title}`}
                onClick={() => setCurrent(i)}
                aria-label={`View testimonial ${i + 1}`}
                className={`w-3 h-3 rounded-full transition-all ${
                  current === i ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
