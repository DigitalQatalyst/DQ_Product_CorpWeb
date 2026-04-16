import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Filters {
  category: string;
  tag: string;
}

interface Props {
  readonly filters: Filters;
  readonly categories: string[];
  readonly onFilterChange: (type: keyof Filters, value: string) => void;
}

export function FilterSidebar({
  filters,
  categories,
  onFilterChange,
}: Readonly<Props>) {
  return (
    <div className="space-y-2">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full justify-between items-center text-left font-medium text-foreground py-3 border-b border-border group">
          Category
          <ChevronDown
            size={16}
            className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={filters.category === cat}
                onCheckedChange={() => onFilterChange("category", cat)}
              />
              <Label
                htmlFor={`cat-${cat}`}
                className="text-sm font-normal cursor-pointer"
              >
                {cat}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
