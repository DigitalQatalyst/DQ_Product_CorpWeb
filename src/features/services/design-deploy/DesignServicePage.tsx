"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MethodologySection } from "./components/MethodologySection";
import { designDeployData } from "../data/design-deploy.data";

export function DesignServicePage({ serviceId }: { serviceId: string }) {
  const data = designDeployData.find((s) => s.slug === serviceId) ?? designDeployData[0];
  const { hero, blueprintSection, stats, methodology, transformationApproach, industryExpertise } = data;
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative h-130 overflow-hidden">
        <Image src={hero.backgroundImage} alt={hero.title} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-r from-primary/85 to-primary/30" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{hero.title}</h1>
          <p className="text-white/80 text-lg mb-6 max-w-2xl">{hero.subtitle}</p>
          <Link href="/consultation" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-colors w-fit">
            Get in Touch <ArrowRight size={18} />
          </Link>
          <div className="mt-10 flex items-center text-sm text-white/70 gap-2 flex-wrap">
            {hero.breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {crumb.href ? <Link href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</Link> : <span className="text-white">{crumb.label}</span>}
                {i < hero.breadcrumbs.length - 1 && <span>›</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Blueprint + FAQs */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative max-w-xl mx-auto w-full pb-10">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <Image src={blueprintSection.imagePrimary} alt="Transformation workshop" width={600} height={520} className="w-full h-130 object-cover" />
            </div>
            <div className="absolute bottom-0 left-14 w-2/3 rounded-3xl overflow-hidden shadow-2xl border-8 border-background">
              <Image src={blueprintSection.imageOverlay} alt="Digital future" width={400} height={260} className="w-full h-65 object-cover" />
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{blueprintSection.title}</h2>
            <p className="text-muted-foreground text-lg">{blueprintSection.description}</p>
            <div className="flex flex-wrap gap-4">
              <Link href={blueprintSection.primaryCta.href} className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/90 transition-colors">
                {blueprintSection.primaryCta.label} <ArrowRight size={16} />
              </Link>
              <Link href={blueprintSection.secondaryCta.href} className="inline-flex items-center px-6 py-3 border border-border text-foreground font-semibold rounded-full hover:bg-muted transition-colors">
                {blueprintSection.secondaryCta.label}
              </Link>
            </div>
            <div className="space-y-3 pt-2">
              {blueprintSection.faqs.map((faq, i) => (
                <div key={i} className="border border-border rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-foreground hover:bg-muted/40 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {openFaq === i ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                  </button>
                  {openFaq === i && <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">{faq.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container mx-auto px-4 mt-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.value}>
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-foreground mb-2">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <MethodologySection
        eyebrow={methodology.eyebrow}
        title={methodology.title}
        ctaLabel={methodology.ctaLabel}
        ctaHref="/consultation"
        steps={methodology.steps}
        image={methodology.image}
      />

      {/* Transformation Approach */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">{transformationApproach.eyebrow}</p>
            <h2 className="text-4xl font-bold text-foreground">{transformationApproach.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformationApproach.steps.map((step) => (
              <div key={step.number} className="group relative border border-border rounded-2xl p-6 bg-background hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/80 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                <div className="relative z-10">
                  <p className="text-sm text-muted-foreground group-hover:text-white/60 mb-3 transition-colors">{step.number}.</p>
                  <h3 className="font-semibold text-foreground group-hover:text-white mb-2 transition-colors">{step.title}</h3>
                  <p className="text-muted-foreground group-hover:text-white/80 text-sm transition-colors">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Expertise */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-3">{industryExpertise.title}</h2>
            <p className="text-muted-foreground text-lg">{industryExpertise.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {industryExpertise.cards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.title} className="flex flex-col">
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-secondary" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{card.title}</h3>
                    <Separator className="mb-4" />
                    <p className="text-muted-foreground flex-1">{card.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center">
            <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/90 transition-colors">
              {industryExpertise.ctaLabel} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
