import { useScrollReveal } from "../../hooks/useParallax";
import { ReactNode } from "react";

interface ContentSectionProps {
  children: ReactNode;
  className?: string;
}

const ContentSection = ({ children, className = "" }: ContentSectionProps) => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      className={`max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-16 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default ContentSection;
