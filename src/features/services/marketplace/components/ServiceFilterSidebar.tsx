import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const FILTER_CONFIG = [
  {
    id: "serviceCategory",
    title: "Service Category",
    options: [
      { id: "digital-experience",     label: "Digital Experience" },
      { id: "digital-core-dws",       label: "Digital Core / DWS" },
      { id: "connected-intelligence", label: "Connected Intelligence" },
    ],
  },
  {
    id: "serviceAvailability",
    title: "Service Availability",
    options: [
      { id: "available",   label: "Available" },
      { id: "coming-soon", label: "Coming Soon" },
    ],
  },
  {
    id: "serviceReadiness",
    title: "Service Readiness",
    options: [
      { id: "ready-to-order", label: "Ready to Order" },
      { id: "has-dependency", label: "Has Dependency" },
    ],
  },
] as const;

type ActiveFilters = Record<string, string[]>;

interface Props {
  filters: ActiveFilters;
  onFilterChange: (filterId: string, optionId: string) => void;
}

export function ServiceFilterSidebar({ filters, onFilterChange }: Readonly<Props>) {
  return (
    <div className="space-y-1">
      {FILTER_CONFIG.map((group) => (
        <Collapsible key={group.id} defaultOpen>
          <CollapsibleTrigger className="flex w-full justify-between items-center text-left font-medium text-foreground py-3 border-b border-border group">
            {group.title}
            <ChevronDown
              size={16}
              className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 pb-2 space-y-2">
            {group.options.map((opt) => {
              const checked = (filters[group.id] ?? []).includes(opt.id);
              return (
                <div key={opt.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`${group.id}-${opt.id}`}
                    checked={checked}
                    onCheckedChange={() => onFilterChange(group.id, opt.id)}
                  />
                  <Label
                    htmlFor={`${group.id}-${opt.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {opt.label}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
