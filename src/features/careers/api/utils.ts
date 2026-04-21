export function parseJsonbStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[];
  if (val && typeof val === "object" && "items" in val)
    return (val as { items: string[] }).items;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === "object" && "items" in parsed)
        return (parsed as { items: string[] }).items ?? [];
      return [];
    } catch {
      return [];
    }
  }
  return [];
}

export function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function arrayToLines(value: string[] | undefined | null): string {
  return (value ?? []).join("\n");
}

