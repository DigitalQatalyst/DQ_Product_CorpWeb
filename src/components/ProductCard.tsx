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
      className="flex flex-col min-h-[340px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="px-4 py-5 flex-grow flex flex-col">
        {product.icon && (
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
              {product.icon}
            </div>
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[48px] leading-snug text-lg">
            {product.name} ({product.code})
          </h3>
        </div>

        <div className="mb-5 flex-grow">
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          {product.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-gray-100 p-4">
        <button
          onClick={handleLearnMore}
          className="w-full px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-primary-600 rounded-md hover:bg-primary-50 transition-colors whitespace-nowrap flex items-center justify-center"
        >
          Learn More
        </button>
      </div>
    </div>
  );
}
