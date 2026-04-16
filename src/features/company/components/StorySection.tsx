export function StorySection() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-primary font-semibold mb-3">
            Perfecting Life&apos;s Transactions
          </p>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Transformation should feel human—and measurable.
          </h2>
          <p className="text-muted-foreground mb-6">
            At DigitalQatalyst, we empower organizations with affordable, results-oriented digital transformations, helping them thrive in the Economy 4.0.
          </p>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-lg aspect-video bg-muted relative">
          <video
            className="w-full h-full object-cover"
            controls
            playsInline
            poster="/images/Landing page video thumbnail.png"
          >
            <source src="/videos/Why Work with Us - DQ.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
