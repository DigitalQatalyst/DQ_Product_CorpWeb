import { beliefs } from "../data/company.data";

export function BeliefsSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-primary-foreground/60 mb-2">Our Beliefs</p>
          <h2 className="text-3xl font-bold mb-4">Key Pillars Driving Digital Transformation</h2>
          <p className="text-primary-foreground/70">
            Our core pillars define how we guide organizations through their digital transformation journey. These principles shape how we drive sustainable growth and innovation.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {beliefs.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="bg-primary-foreground/5 p-6 rounded-xl border border-primary-foreground/10 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-primary-foreground/10 rounded-lg flex items-center justify-center mb-4">
                <Icon className="text-primary-foreground" size={22} />
              </div>
              <h3 className="text-xl font-semibold text-primary-foreground mb-3">{title}</h3>
              <p className="text-primary-foreground/80 text-sm">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
