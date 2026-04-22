"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp, Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useServiceCategoryBySlug } from "@/features/services/hooks/useServiceCategories";

export function ServiceCategoryPage({ slug }: { slug: string }) {
  const { data: cat, isLoading } = useServiceCategoryBySlug(slug);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!cat) return null;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: cat.heroTitle || cat.name },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-130 overflow-hidden">
        {cat.heroBgImage && (
          <Image src={cat.heroBgImage} alt={cat.heroTitle} fill className="object-cover" priority sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-primary/85 to-primary/30" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{cat.heroTitle}</h1>
          <p className="text-white/80 text-lg mb-6 max-w-2xl">{cat.heroSubtitle}</p>
          <Link href="/consultation" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-colors w-fit">
            Get in Touch <ArrowRight size={18} />
          </Link>
          <div className="mt-10 flex items-center text-sm text-white/70 gap-2 flex-wrap">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {crumb.href
                  ? <Link href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</Link>
                  : <span className="text-white">{crumb.label}</span>}
                {i < breadcrumbs.length - 1 && <span>›</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Blueprint + FAQs */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative max-w-xl mx-auto w-full pb-10">
            {cat.bpImagePrimary && (
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image src={cat.bpImagePrimary} alt="Primary" width={600} height={520} className="w-full h-130 object-cover" />
              </div>
            )}
            {cat.bpImageOverlay && (
              <div className="absolute bottom-0 left-14 w-2/3 rounded-3xl overflow-hidden shadow-2xl border-8 border-background">
                <Image src={cat.bpImageOverlay} alt="Overlay" width={400} height={260} className="w-full h-65 object-cover" />
              </div>
            )}
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{cat.bpTitle}</h2>
            <p className="text-muted-foreground text-lg">{cat.bpDescription}</p>
            <div className="flex flex-wrap gap-4">
              {cat.bpPrimaryCta.label && (
                <Link href={cat.bpPrimaryCta.href} className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/90 transition-colors">
                  {cat.bpPrimaryCta.label} <ArrowRight size={16} />
                </Link>
              )}
              {cat.bpSecondaryCta.label && (
                <Link href={cat.bpSecondaryCta.href} className="inline-flex items-center px-6 py-3 border border-border text-foreground font-semibold rounded-full hover:bg-muted transition-colors">
                  {cat.bpSecondaryCta.label}
                </Link>
              )}
            </div>
            <div className="space-y-3 pt-2">
              {cat.bpFaqs.map((faq, i) => (
                <div key={i} className="border border-border rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-foreground hover:bg-muted/40 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {openFaq === i ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        {cat.stats.length > 0 && (
          <div className="container mx-auto px-4 mt-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {cat.stats.map((stat, i) => (
                <Card key={i}>
                  <CardContent className="p-6 text-center">
                    <p className="text-4xl font-bold text-foreground mb-2">{stat.value}</p>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Methodology */}
      {cat.methodSteps.length > 0 && (
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <p className="text-sm uppercase tracking-widest text-primary mb-3">{cat.methodEyebrow}</p>
                  <h2 className="text-4xl font-bold text-foreground mb-6">{cat.methodTitle}</h2>
                </div>
                <div className="space-y-6">
                  {cat.methodSteps.map((step) => (
                    <div key={step.number} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/consultation"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors"
                >
                  {cat.methodCtaLabel} <ArrowRight size={16} />
                </Link>
              </div>
              {cat.methodImage && (
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image src={cat.methodImage} alt={cat.methodTitle} width={600} height={500} className="w-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Transformation Approach */}
      {cat.transformSteps.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-sm uppercase tracking-widest text-primary mb-3">{cat.transformEyebrow}</p>
              <h2 className="text-4xl font-bold text-foreground">{cat.transformTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.transformSteps.map((step) => (
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
      )}

      {/* Industry Expertise */}
      {cat.industryCards.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-3">{cat.industryTitle}</h2>
              <p className="text-muted-foreground text-lg">{cat.industryDescription}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {cat.industryCards.map((card) => (
                <Card key={card.title} className="flex flex-col">
                  <CardContent className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{card.title}</h3>
                    <Separator className="mb-4" />
                    <p className="text-muted-foreground flex-1">{card.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/90 transition-colors">
                {cat.industryCtaLabel} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
