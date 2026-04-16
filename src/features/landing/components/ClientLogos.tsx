"use client";

const LOGOS = [
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

const track = [...LOGOS, ...LOGOS, ...LOGOS];

export function ClientLogos() {
  return (
    <section className="w-full bg-white py-12 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-center text-gray-600 text-sm font-bold uppercase tracking-wider mb-2">
          Trusted By Leading Organizations
        </h3>
      </div>

      <div className="relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div
          className="flex"
          style={{ animation: "logo-scroll 15s linear infinite" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.animationPlayState = "paused")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.animationPlayState = "running")
          }
        >
          {track.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="shrink-0 mx-8 flex items-center justify-center"
              style={{ width: 180, height: 80 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes logo-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}
