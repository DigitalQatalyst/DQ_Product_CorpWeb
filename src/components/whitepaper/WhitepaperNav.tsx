import { useEffect, useState } from "react";

const sections = [
  { id: "hook", label: "Hook" },
  { id: "foreword", label: "Foreword" },
  { id: "executive-summary", label: "Executive summary" },
  { id: "chapter-1", label: "Chapter 1" },
  { id: "chapter-2", label: "Chapter 2" },
  { id: "chapter-3", label: "Chapter 3" },
  { id: "conclusion", label: "Conclusion" },
  { id: "references", label: "References" },
];

const WhitepaperNav = () => {
  const [active, setActive] = useState("hook");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto flex items-center gap-2 px-4">
        <div className="flex-shrink-0 py-3 pr-6">
          <span className="text-2xl font-bold tracking-tight text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            DQ
          </span>
          <span className="text-[10px] block -mt-1 text-gray-600">DigitalQatalyst</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto py-3">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`px-3 py-1.5 text-sm whitespace-nowrap transition-colors rounded-sm ${
                active === id
                  ? "text-gray-900 font-medium border-b-2 border-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default WhitepaperNav;
