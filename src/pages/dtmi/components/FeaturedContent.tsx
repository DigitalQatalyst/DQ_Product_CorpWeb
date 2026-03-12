export function FeaturedContent() {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
          {/* Case Studies */}
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Case Studies
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-md">
              Explore real-world success stories and practical implementations
              of digital transformation across industries.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-500 rounded-lg font-semibold border border-gray-300">
              Coming Soon
            </div>
          </div>

          {/* Vertical Divider - visible on desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2"></div>

          {/* Expert Interviews */}
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Expert Interviews
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-md">
              Gain insights from industry leaders and experts sharing their
              knowledge on digital transformation trends.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-500 rounded-lg font-semibold border border-gray-300">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
