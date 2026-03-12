import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

// Simple className merger
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface AttractButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  particleCount?: number;
  attractRadius?: number;
  children?: React.ReactNode;
}

interface Particle {
  id: number;
  x: number;
  y: number;
}

export default function AttractButton({
  className,
  particleCount = 12,
  attractRadius = 50,
  children,
  ...props
}: AttractButtonProps) {
  const [isAttracting, setIsAttracting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particlesControl = useAnimation();

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 60, // Constrain to ±60px (within button width)
      y: Math.random() * 20 - 10,  // Constrain to ±10px (within button height)
    }));
    setParticles(newParticles);
  }, [particleCount]);

  const handleInteractionStart = useCallback(async () => {
    setIsAttracting(true);
    await particlesControl.start({
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
      },
    });
  }, [particlesControl]);

  const handleInteractionEnd = useCallback(async () => {
    setIsAttracting(false);
    await particlesControl.start((i) => ({
      x: particles[i].x,
      y: particles[i].y,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    }));
  }, [particlesControl, particles]);

  return (
    <button
      className={cn(
        "min-w-40 relative touch-none px-8 py-3 rounded-lg font-semibold",
        "bg-primary text-white",
        "hover:bg-primary-600",
        "border border-primary-600",
        "transition-all duration-300 shadow-md",
        className
      )}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      {...props}
    >
      {particles.map((_, index) => (
        <motion.div
          key={index}
          custom={index}
          initial={{ x: particles[index].x, y: particles[index].y }}
          animate={particlesControl}
          className={cn(
            "absolute w-1.5 h-1.5 rounded-full",
            "bg-primary-300",
            "transition-opacity duration-300",
            isAttracting ? "opacity-100" : "opacity-40"
          )}
        />
      ))}
      <span className="relative w-full flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
