import { type ValueProp } from "../data/why-work-with-us";
import { type ComponentType, type SVGProps } from "react";

interface ValuePropsProps {
  items: ValueProp[];
}

export function ValueProps({ items }: ValuePropsProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Work With Us
          </h2>
          <p className="text-lg text-gray-600">
            At DQ, we simplify digital transformation. From crafting strategies
            to implementing seamless experiences, our services drive efficiency,
            accelerate growth, and ensure long-term success.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((prop, index) => {
            const Icon = prop.icon as ComponentType<SVGProps<SVGSVGElement>>;
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-md transition-all duration-300"
              >
                <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-secondary" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {prop.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
