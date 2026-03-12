interface ParallaxSectionProps {
  image: string;
  title: string;
  id: string;
  subtitle?: string;
  darkOverlay?: boolean;
}

const ParallaxSection = ({ image, title, id, subtitle, darkOverlay = true }: ParallaxSectionProps) => {
  return (
    <section
      id={id}
      className="relative h-[70vh] overflow-hidden flex items-end justify-end"
      style={{
        backgroundImage: `url(${image})`,
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {darkOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      )}
      <div className="relative z-10 p-12 md:p-16 text-right">
        {subtitle && (
          <p className="text-white/80 text-lg mb-2 font-serif">{subtitle}</p>
        )}
        <h2 className="text-4xl md:text-5xl font-serif italic text-white">
          {title}
        </h2>
      </div>
    </section>
  );
};

export default ParallaxSection;
