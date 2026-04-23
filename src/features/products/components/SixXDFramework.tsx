import { Card, CardContent } from "@/components/ui/card";
import { sixXDFramework } from "../data/products.data";

export function SixXDFramework() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pioneer your Business Future with 6XD
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The Six Dimensions of Digital Transformation (6XD) redefines digital transformation,
            unlocking growth and driving faster, more efficient outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sixXDFramework.map((item) => (
            <Card key={item.number} className="flex flex-col h-full">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-secondary font-bold text-2xl">{item.number}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{item.title}</h3>
                <p className="text-muted-foreground flex-1 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
