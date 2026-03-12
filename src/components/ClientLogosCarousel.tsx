import React from "react";

const ClientLogosCarousel: React.FC = () => {
  const logos = [
    { name: "Pasqual Bruni", src: "/images/logo-pasqualbruni.svg" },
    { name: "Mubadala", src: "/images/logo-Mubadala.svg" },
    { name: "ADNOC", src: "/images/logo-adnoc.svg" },
    { name: "RTA Dubai", src: "/images/logo-rta_dubai 1.svg" },
    { name: "Government of Dubai", src: "/images/logo-Government_of_Dubai.svg" },
    { name: "Schneider Electric", src: "/images/logo-schneider-electric 1.svg" },
    { name: "QNB", src: "/images/logo-QNB.svg" },
    { name: "STC", src: "/images/logo-stc.svg" },
    { name: "SAIB", src: "/images/logo-saib.svg" },
    { name: "DFSA", src: "/images/logo-dfsa.svg" },
  ];

  // Triple logos for ultra-smooth seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="w-full bg-white py-12 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-center text-gray-600 text-sm font-bold uppercase tracking-wider mb-2">
          Trusted By Leading Organizations
        </h3>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

        {/* Scrolling Logos */}
        <div className="flex animate-scroll">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
              style={{ width: "180px", height: "80px" }}
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-scroll {
          animation: scroll 15s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default ClientLogosCarousel;
