import { Card, CardContent } from "@/components/ui/card";
import { values } from "../data/company.data";

export function ValuesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
          Values That Drive Your Digital Transformation
        </h2>
        <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-8">
          At DQ, our values are the foundation of everything we do. They guide how we operate and ensure we create lasting, impactful transformation for our clients.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-primary" size={22} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
