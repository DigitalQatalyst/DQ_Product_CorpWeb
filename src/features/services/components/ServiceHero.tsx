import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ServiceHero() {
  return (
    <section className="relative text-white overflow-hidden" style={{ height: "100vh" }}>
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/Service_landing_hero_image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(3,15,53,0.95), rgba(3,15,53,0.70), rgba(3,15,53,0.30))",
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Accelerate Your Digital Transformation
          </h1>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Drive growth, enhance customer experiences, and stay ahead of the competition with
            DQ&apos;s transformation services
          </p>
          <div className="flex justify-center">
            <Link
              href="/services/marketplace"
              className="h-14 px-8 bg-[#FF6B4D] text-white font-bold rounded-lg hover:bg-[#E63D1A] transition-all transform hover:-translate-y-1 hover:shadow-xl inline-flex items-center gap-2 group"
            >
              Browse Services
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
