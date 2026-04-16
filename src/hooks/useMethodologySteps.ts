"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface UseMethodologyStepsOptions {
  stepsCount: number;
  autoScrollInterval?: number;
}

export function useMethodologySteps({
  stepsCount,
  autoScrollInterval = 5500,
}: UseMethodologyStepsOptions) {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepsContainerRef = useRef<HTMLDivElement | null>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const setStepRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stepRefs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number.parseInt(
            (entry.target as HTMLElement).dataset.index ?? "",
            10,
          );
          if (!Number.isNaN(idx)) setActiveStep((p) => (p === idx ? p : idx));
        });
      },
      { threshold: 0.6, rootMargin: "-10% 0px -10% 0px" },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = stepsContainerRef.current;
    if (!container || !stepRefs.current.length) return;
    let nextIndex = 0;
    const scrollToStep = (index: number) => {
      const target = stepRefs.current[index];
      if (!target) return;
      container.scrollTo({
        top: target.offsetTop - (stepRefs.current[0]?.offsetTop ?? 0),
        behavior: "smooth",
      });
    };
    scrollToStep(0);
    autoScrollTimer.current = setInterval(() => {
      nextIndex = (nextIndex + 1) % stepRefs.current.length;
      scrollToStep(nextIndex);
    }, autoScrollInterval);
    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };
  }, [autoScrollInterval]);

  return { activeStep, stepRefs, stepsContainerRef, setStepRef };
}
