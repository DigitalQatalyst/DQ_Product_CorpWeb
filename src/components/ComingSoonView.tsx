import React from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../config/brand";

export interface ComingSoonAction {
  label: string;
  to?: string; // react-router link
  href?: string; // external or anchor link
  variant?: "primary" | "secondary";
}

export interface ComingSoonViewProps {
  title?: string;
  description?: string;
  bullets?: string[];
  primaryAction?: ComingSoonAction;
  secondaryAction?: ComingSoonAction;
  logoText?: string;
  /**
   * Use a preset to avoid Tailwind purging dynamic class names in production.
   */
  gradientPreset?: 'indigoBlueTeal' | 'purpleFuchsiaRose';
}

const ComingSoonView: React.FC<ComingSoonViewProps> = ({
  title = "Coming Soon",
  description = "We're working hard to bring you this experience as part of your digital transformation journey.",
  bullets = [
    "Beautifully designed for digital transformation",
    "Fast, secure and reliable platform",
    "Built to accelerate your digital journey",
  ],
  primaryAction = { label: "Back to Home", to: "/", variant: "secondary" },
  secondaryAction = { label: "Get Consultation", to: "/consultation", variant: "primary" },
  logoText = BRAND.shortName,
  gradientPreset = 'indigoBlueTeal',
}) => {
  // Preset-based classes to ensure Tailwind includes them in production builds
  const presetClasses: Record<NonNullable<ComingSoonViewProps['gradientPreset']>, string> = {
    indigoBlueTeal: 'bg-gradient-to-br from-brand-navy via-brand-navy-dark to-brand-navy',
    purpleFuchsiaRose: 'bg-gradient-to-br from-brand-purple via-brand-coral to-brand-teal',
  };
  const gradientClass = presetClasses[gradientPreset] || presetClasses.indigoBlueTeal;

  const ActionButton: React.FC<{ action: ComingSoonAction }> = ({ action }) => {
    const base = "px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105";
    const variantClass =
      action.variant === "primary"
        ? "bg-brand-coral text-white hover:bg-brand-coral-dark shadow-lg hover:shadow-xl"
        : "bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/30";

    if (action.to) {
      return (
        <Link to={action.to} className={`${base} ${variantClass}`}>
          {action.label}
        </Link>
      );
    }
    if (action.href) {
      return (
        <a href={action.href} className={`${base} ${variantClass}`}>
          {action.label}
        </a>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-screen ${gradientClass} flex items-center justify-center px-6 relative overflow-hidden`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-coral/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-purple/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 rounded-2xl bg-brand-coral flex items-center justify-center ring-4 ring-brand-coral/20 shadow-2xl">
            <span className="text-white text-4xl font-bold">{logoText}</span>
          </div>
          <div className="mt-4">
            <h2 className="text-white/90 text-lg font-medium">{BRAND.name}</h2>
            <p className="text-brand-coral text-sm font-medium mt-1">{BRAND.tagline}</p>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-white/80 text-lg md:text-xl mb-8">
          {description}
        </p>
        {bullets && bullets.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left text-white/90 mb-8 shadow-xl">
            <ul className="space-y-3">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-center">
                  <div className="w-2 h-2 bg-brand-coral rounded-full mr-3 flex-shrink-0"></div>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {primaryAction && <ActionButton action={primaryAction} />}
          {secondaryAction && <ActionButton action={secondaryAction} />}
        </div>
      </div>
    </div>
  );
};

export default ComingSoonView;
