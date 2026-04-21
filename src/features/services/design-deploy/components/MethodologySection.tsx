"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMethodologySteps } from "@/hooks/useMethodologySteps";
import type { MethodologyStep } from "../data/design-deploy.data";

interface Props {
  eyebrow: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
  steps: MethodologyStep[];
  image: string;
}

export function MethodologySection({
  eyebrow,
  title,
  ctaLabel,
  ctaHref,
  steps,
  image,
}: Readonly<Props>) {
  const { activeStep, stepsContainerRef, setStepRef } = useMethodologySteps({
    stepsCount: steps.length,
  });

  return (
    <section className="py-20 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm uppercase tracking-widest text-primary mb-3">
            {eyebrow}
          </p>
          <h2 className="text-4xl font-bold text-foreground">{title}</h2>

          <div className="relative mt-10 h-130">
            <div className="hidden md:block absolute left-6 top-0 bottom-0 w-px bg-border pointer-events-none" />
            <div
              ref={stepsContainerRef}
              className="space-y-10 h-full overflow-y-auto pr-3 sm:pr-5 scrollbar-hide"
            >
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeStep === index;
                const isLast = index === steps.length - 1;
                return (
                  <div
                    key={step.number}
                    ref={setStepRef(index)}
                    data-index={index}
                    className={`flex gap-6 items-start transition-all duration-300 ${isActive ? "translate-x-1" : ""}`}
                  >
                    <div className="flex flex-col items-center min-w-12">
                      <span
                        className={`text-sm font-semibold tracking-widest ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {step.number}
                      </span>
                      {!isLast && (
                        <div className="hidden md:block w-px flex-1 bg-border mt-2" />
                      )}
                    </div>
                    <div
                      className={`flex-1 rounded-2xl border p-6 transition-all duration-300 bg-background ${isActive ? "border-border shadow-lg" : "border-border shadow-sm"}`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <h3 className="text-xl font-semibold text-foreground">
                          {step.title}
                        </h3>
                        <div
                          className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-colors ${isActive ? "border-secondary/30 text-secondary bg-secondary/10" : "border-border text-muted-foreground bg-white"}`}
                        >
                          <Icon className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href={ctaHref}
            className="mt-10 inline-flex items-center gap-3 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/90 transition-colors"
          >
            {ctaLabel} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="relative flex items-center justify-center h-full">
          <div className="w-full h-140 md:h-155 overflow-hidden shadow-2xl rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
