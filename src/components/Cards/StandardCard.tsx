import React from 'react';
import { ArrowRight, Bookmark, Star } from 'lucide-react';

// Standard design tokens for consistent card styling
const CARD_DESIGN_TOKENS = {
  layout: {
    minHeight: 'min-h-[340px]',
    borderRadius: 'rounded-xl', // Consistent border radius
    shadow: {
      default: 'shadow-md',
      hover: 'hover:shadow-xl'
    },
    padding: {
      content: 'p-6',
      footer: 'p-4'
    }
  },
  colors: {
    background: 'bg-white',
    border: 'border border-gray-100',
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      muted: 'text-gray-500'
    },
    brand: {
      primary: 'bg-primary text-white',
      primaryHover: 'hover:bg-primary-600',
      secondary: 'text-primary-600 border-primary-600 hover:bg-primary-50',
      accent: 'bg-primary/10 text-primary-600'
    }
  },
  transitions: {
    default: 'transition-all duration-300',
    hover: 'hover:scale-[1.02]'
  },
  typography: {
    title: 'text-lg font-bold leading-snug',
    subtitle: 'text-sm font-medium',
    body: 'text-sm leading-relaxed',
    caption: 'text-xs'
  }
};

// Standard tag component with brand colors
export const StandardTag: React.FC<{
  text: string;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md';
}> = ({ text, variant = 'primary', size = 'sm' }) => {
  const variants = {
    primary: 'bg-primary-50 text-primary-700 border border-primary-200',
    secondary: 'bg-secondary-50 text-secondary-700 border border-secondary-200',
    accent: 'bg-gray-50 text-gray-700 border border-gray-200'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {text}
    </span>
  );
};

// Standard button component with brand styling
export const StandardButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  icon,
  fullWidth = false
}) => {
  const variants = {
    primary: `${CARD_DESIGN_TOKENS.colors.brand.primary} ${CARD_DESIGN_TOKENS.colors.brand.primaryHover} font-semibold`,
    secondary: `bg-white ${CARD_DESIGN_TOKENS.colors.brand.secondary} border font-medium`,
    ghost: 'bg-transparent text-gray-600 hover:text-primary-600 hover:bg-gray-50 font-medium'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
