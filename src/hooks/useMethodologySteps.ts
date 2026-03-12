import { useEffect, useRef, useState, useCallback } from 'react';

interface UseMethodologyStepsOptions {
  stepsCount: number;
  autoScrollInterval?: number;
}

// Helper function to handle intersection observer entries
const handleIntersection = (
  entry: IntersectionObserverEntry,
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
) => {
  if (!entry.isIntersecting) return;
  
  const target = entry.target as HTMLElement;
  const indexStr = target.dataset.index;
  if (!indexStr) return;
  
  const index = parseInt(indexStr, 10);
  if (Number.isNaN(index)) return;
  
  setActiveStep((prev) => (prev === index ? prev : index));
};

export const useMethodologySteps = ({ stepsCount, autoScrollInterval = 5500 }: UseMethodologyStepsOptions) => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepsContainerRef = useRef<HTMLDivElement | null>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize refs array
  stepRefs.current = stepRefs.current.slice(0, stepsCount);

  // Helper function to set step ref at a specific index
  const setStepRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    stepRefs.current[index] = el;
  }, []);

  // Intersection observer for active step detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => handleIntersection(entry, setActiveStep));
      },
      { threshold: 0.6, rootMargin: "-10% 0px -10% 0px" }
    );

    stepRefs.current.forEach((el) => el && observer.observe(el));

    return () => {
      stepRefs.current.forEach((el) => el && observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    const container = stepsContainerRef.current;
    if (!container || !stepRefs.current.length) return;

    let nextIndex = 0;

    const scrollToStep = (index: number) => {
      const target = stepRefs.current[index];
      if (!target) return;
      container.scrollTo({
        top: target.offsetTop - (stepRefs.current[0]?.offsetTop ?? 0),
        behavior: "smooth"
      });
    };

    scrollToStep(0);

    autoScrollTimer.current = setInterval(() => {
      nextIndex = (nextIndex + 1) % stepRefs.current.length;
      scrollToStep(nextIndex);
    }, autoScrollInterval);

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
        autoScrollTimer.current = null;
      }
    };
  }, [autoScrollInterval]);

  return {
    activeStep,
    stepRefs,
    stepsContainerRef,
    setStepRef
  };
};
