"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, Award, Building2, Star } from "lucide-react";

const impactStats = [
  { heading: "3X",   label: "Transform 3X faster with optimized processes.",                    icon: TrendingUp },
  { heading: "99%",  label: "99% success rate in delivering on time and to specification.",      icon: Award },
  { heading: "100+", label: "100+ digital business platforms designed for scalability.",         icon: Building2 },
  { heading: "15+",  label: "Over 15 years of proven expertise in digital transformation.",      icon: Star },
];

const testimonials = [
  {
    id: "abb",
    badge: "ABB | DBP Design Engagement",
    quote: "Digital Qatalyst brought architectural clarity and execution discipline that significantly elevated our Digital Business Products growth agenda. This was not simply advisory work; it was structured design that positioned us for sustainable digital growth.",
    author: "Dr. Tariq Aslam",
    position: "VP Digital | ABB EMEA",
  },
  {
    id: "pg",
    badge: "P&G | Digital Research Operations",
    quote: "Digital Qatalyst helped us rethink how research operations can function in a digitally enabled environment. The result has been improved efficiency, stronger clarity on digital priorities, and a more future-ready research function.",
    author: "Cho Edwards",
    position: "Product Manager | Procter & Gamble (UK)",
  },
];

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  const t = testimonials[current];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-6">Client Testimonials</h3>

        {/* Navigation Arrows */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={16} className="text-white" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Next testimonial"
          >
            <ChevronRight size={16} className="text-white" />
          </button>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="min-w-full">
                <div className="relative">
                  <div className="inline-block px-4 py-1.5 bg-[#FF6B4D] text-white text-xs font-bold rounded-full mb-4">
                    {testimonial.badge}
                  </div>
                  <svg className="absolute top-8 left-0 w-8 h-8 text-white opacity-30" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                  </svg>
                  <p className="text-lg text-white italic leading-relaxed px-8">
                    "{testimonial.quote}"
                  </p>
                  <svg className="absolute bottom-0 right-0 w-8 h-8 text-white opacity-30 rotate-180" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                  </svg>
                </div>
                <p className="text-gray-200 font-medium mt-4">
                  — {testimonial.author}, {testimonial.position}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === i ? "bg-[#FF6B4D] w-6" : "bg-white/40 hover:bg-white/60 w-2"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProofAndTrust() {
  return (
    <div>
      <section
        className="relative overflow-hidden py-32 mt-16"
        style={{ background: "linear-gradient(to bottom right, #030F35, #1F2F5C, #2E4580)" }}
      >
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#FF6B4D] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid-proof" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid-proof)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Why DigitalQatalyst</h2>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto mb-8">
              We Accelerate your digital transformation with speed, quality, and cost efficiency.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {impactStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/15"
                >
                  <div className="flex justify-center mb-3">
                    <Icon size={24} className="text-[#FF6B4D]" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.heading}</div>
                  <div className="text-sm text-gray-200 leading-relaxed">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Testimonial carousel */}
          <div className="mt-16 max-w-4xl mx-auto">
            <TestimonialCarousel />
          </div>
        </div>
      </section>
    </div>
  );
}
