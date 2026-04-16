import { Separator } from "@/components/ui/separator";

interface Section {
  title: string;
  content: React.ReactNode;
}

interface Props {
  title: string;
  lastUpdated: string;
  sections: Section[];
}

export function LegalPage({ title, lastUpdated, sections }: Readonly<Props>) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-4xl font-bold text-foreground text-center mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground text-center mb-12">Last Updated: {lastUpdated}</p>
        <Separator className="mb-12" />
        <div className="space-y-10 text-muted-foreground">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">{s.title}</h2>
              {s.content}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
