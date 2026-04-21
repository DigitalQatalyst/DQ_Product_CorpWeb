"use client";

import { useState, cloneElement } from "react";
import { Briefcase, Package, Users, ArrowRight, Lock, Clock } from "lucide-react";
import Link from "next/link";

const SERVICES = [
  {
    id: "services-marketplace",
    title: "Services Marketplace",
    description: "Maximize ROI with our affordable, data-driven and architecture-led digital transformation services",
    icon: <Briefcase />,
    href: "/marketplace/services",
    isActive: true,
  },
  {
    id: "products-marketplace",
    title: "Products Marketplace",
    description: "Discover digital products engineered for your organization's success in the digital economy",
    icon: <Package />,
    href: "/products",
    isActive: true,
  },
  {
    id: "careers-marketplace",
    title: "Careers Marketplace",
    description: "Discover exciting career opportunities and join our team of digital transformation experts",
    icon: <Users />,
    href: "/careers",
    isActive: true,
  },
];

function ServiceCard({
  service,
}: {
  service: (typeof SERVICES)[number];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { isActive } = service;

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all duration-500 transform p-6 h-full min-h-[290px] flex flex-col ${
        isActive
          ? "bg-white border-gray-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer hover:border-[#FF6B4D]/20"
          : "bg-gray-50 border-gray-200 opacity-75 hover:opacity-85"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full relative">
        {!isActive && (
          <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full text-gray-800 flex items-center animate-pulse">
            <Clock size={12} className="mr-1" />
            Coming Soon
          </div>
        )}

        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 ${
            isHovered ? "transform -translate-y-1" : ""
          } ${isActive ? "bg-secondary/10 border border-secondary/20" : "bg-gray-100"}`}
        >
          {cloneElement(service.icon as React.ReactElement<{ size?: number; className?: string }>, {
            size: 24,
            className: isActive ? "text-secondary" : "text-gray-400",
          })}
        </div>

        <h2 className="font-display text-lg font-semibold text-gray-900 mb-2 whitespace-nowrap overflow-hidden truncate">
          {service.title}
        </h2>
        <p className="font-sans text-sm text-gray-600 mb-6 flex-grow line-clamp-4 min-h-[5rem]">
          {service.description}
        </p>

        {isActive ? (
          <Link
            href={service.href}
            className="mt-auto px-4 py-2.5 rounded-lg font-medium w-full transition-all duration-300 flex items-center justify-center bg-secondary text-white hover:bg-secondary/80"
          >
            Explore Now
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        ) : (
          <button
            disabled
            className="mt-auto px-4 py-2.5 rounded-lg font-medium w-full flex items-center justify-center bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            <Lock size={14} className="mr-2" />
            Coming Soon
          </button>
        )}
      </div>
    </div>
  );
}

export function ServicesSection() {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div id="services-marketplaces" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">
              Explore Our Digital Transformation Marketplaces
            </h2>
            <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
              Find expert solutions and resources tailored for your business needs.
            </p>
          </div>

          {/* Cards — desktop: 3 col, tablet: 2 col, mobile: 1 col */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {SERVICES.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>

          {/* Mobile: vertical stack */}
          <div className="block sm:hidden space-y-6">
            {SERVICES.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
