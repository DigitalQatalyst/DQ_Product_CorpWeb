import React from "react";
import { useNavigate } from "react-router-dom";
import type { ProductCardProps } from "../types/product";

export function ProductCard({ product, onClick }: ProductCardProps) {
  const navigate = useNavigate();

  const handleViewDemo = (event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(product.demoUrl, "_blank");
  };

  const handleLearnMore = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  return (
    <div
      className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Product Image/Screenshot */}
      <div className="relative h-48 bg-gray-50 border-b border-gray-200">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to icon if image fails to load
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback icon container */}
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-gray-50 ${product.imageUrl ? 'hidden' : 'flex'}`}
        >
          <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            {product.icon}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {product.code}
          </p>
        </div>

        <div className="mb-4 flex-grow">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>

        {/* Learn More Link */}
        <div className="mt-auto">
          <button
            onClick={handleLearnMore}
            className="text-primary hover:text-primary-600 text-sm font-medium transition-colors flex items-center gap-1 group"
          >
            Learn more
            <svg 
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
