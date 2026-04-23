"use client";

import * as React from "react";
import { Loader, Plus, Trash2, Upload, Video, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ImageUploadField } from "@/features/admin/services/ImageUploadField";
import {
  uploadSectorMedia,
  type SectorInput,
  type SectorRow,
} from "@/features/services/hooks/useSectorsAdmin";

// ─── Constants ────────────────────────────────────────────────────────────────

export const SECTOR_GROUPS = [
  { value: "cross-sector", label: "Cross-Sector Domain" },
  { value: "primary", label: "Primary Sector" },
  { value: "secondary", label: "Secondary Sector" },
  { value: "tertiary", label: "Tertiary Sector" },
  { value: "quaternary", label: "Quaternary Sector" },
  { value: "quinary", label: "Quinary Sector" },
];

export const ICON_NAMES = [
  "Target",
  "Zap",
  "Brain",
  "Users",
  "Landmark",
  "Building2",
  "Mountain",
  "Sprout",
  "Factory",
  "Truck",
  "ShoppingBag",
  "Hotel",
  "Heart",
  "TrendingUp",
  "CheckCircle",
];

// ─── Types ────────────────────────────────────────────────────────────────────

export type SectorFormValues = Omit<SectorInput, "sortOrder"> & {
  sortOrder: number;
};

export function defaultFormValues(): SectorFormValues {
  return {
    id: "",
    slug: "",
    name: "",
    title: "",
    subtitle: "",
    focus: "",
    sectorGroupId: "cross-sector",
    iconName: "Zap",
    heroImage: "",
    overviewImage: "",
    overviewVideo: "",
    overviewDescription: "",
    technologies: [],
    benefits: [],
    useCases: [],
    stats: [
      { value: "", label: "" },
      { value: "", label: "" },
      { value: "", label: "" },
    ],
    corePillars: [{ title: "", description: "" }],
    whyReasons: [{ icon: "TrendingUp", title: "", description: "" }],
    keyBenefits: [],
    whereToStartItems: [],
    focusAreasItems: [],
    sortOrder: 0,
  };
}

export function sectorToFormValues(s: SectorRow): SectorFormValues {
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    title: s.title,
    subtitle: s.subtitle,
    focus: s.focus,
    sectorGroupId: s.sectorGroupId,
    iconName: s.iconName,
    heroImage: s.heroImage,
    overviewImage: s.overviewImage,
    overviewVideo: s.overviewVideo,
    overviewDescription: s.overviewDescription,
    technologies: s.technologies,
    benefits: s.benefits,
    useCases: s.useCases,
    stats: s.stats.length === 3 ? s.stats : defaultFormValues().stats,
    corePillars: s.corePillars,
    whyReasons: s.whyReasons,
    keyBenefits: s.keyBenefits,
    whereToStartItems: s.whereToStartItems,
    focusAreasItems: s.focusAreasItems,
    sortOrder: s.sortOrder,
  };
}

// ─── Video Upload Field ───────────────────────────────────────────────────────

function VideoUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const result = await uploadSectorMedia(file, "overview-videos");
      onChange(result.url);
      toast.success("Video uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center w-full h-24 rounded-lg border-2 border-dashed transition-colors cursor-pointer
          ${value ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"}`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <Loader size={20} className="animate-spin text-primary" />
            <span className="text-xs">Uploading…</span>
          </div>
        ) : value ? (
          <div className="flex flex-col items-center gap-1 text-primary">
            <Video size={20} />
            <span className="text-xs font-medium truncate max-w-[90%]">
              {value.split("/").pop()}
            </span>
            <span className="text-xs text-muted-foreground">
              Click to replace
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <Upload size={20} strokeWidth={1.5} />
            <span className="text-xs font-medium">
              Drop video or click to upload
            </span>
            <span className="text-xs">MP4, WebM · max 50 MB</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or leave blank"
          className="flex-1 text-xs h-8"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-2 shrink-0"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={14} />
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => onChange("")}
          >
            <X size={14} />
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StringListField({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...values, ""])}
        >
          <Plus size={12} /> Add
        </Button>
      </div>
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={v}
            onChange={(e) => {
              const n = [...values];
              n[i] = e.target.value;
              onChange(n);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(values.filter((_, j) => j !== i))}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ))}
    </div>
  );
}

function PairListField({
  label,
  values,
  fields,
  onChange,
}: {
  label: string;
  values: Record<string, string>[];
  fields: { key: string; placeholder: string; textarea?: boolean }[];
  onChange: (v: Record<string, string>[]) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange([
              ...values,
              Object.fromEntries(fields.map((f) => [f.key, ""])),
            ])
          }
        >
          <Plus size={12} /> Add
        </Button>
      </div>
      {values.map((item, i) => (
        <div key={i} className="border border-border rounded-md p-3 space-y-2">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
            >
              <Trash2 size={14} />
            </Button>
          </div>
          {fields.map((f) => (
            <div key={f.key}>
              <Label className="text-xs text-muted-foreground capitalize">
                {f.key}
              </Label>
              {f.textarea ? (
                <Textarea
                  rows={2}
                  value={item[f.key] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => {
                    const n = [...values];
                    n[i] = { ...n[i], [f.key]: e.target.value };
                    onChange(n);
                  }}
                />
              ) : (
                <Input
                  value={item[f.key] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => {
                    const n = [...values];
                    n[i] = { ...n[i], [f.key]: e.target.value };
                    onChange(n);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
      {children}
    </h2>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

interface Props {
  defaultValues: SectorFormValues;
  onSubmit: (values: SectorFormValues) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
  isEdit: boolean;
}

export function SectorAdminForm({
  defaultValues,
  onSubmit,
  onCancel,
  isPending,
  isEdit,
}: Props) {
  const [v, setV] = React.useState<SectorFormValues>(defaultValues);
  const set = <K extends keyof SectorFormValues>(
    key: K,
    val: SectorFormValues[K],
  ) => setV((prev) => ({ ...prev, [key]: val }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(v);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Two-column layout: left = form fields, right = media + stats */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start">
        {/* ── LEFT COLUMN ── */}
        <div className="space-y-8">
          {/* Identity */}
          <section className="space-y-4">
            <SectionHeading>Identity</SectionHeading>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>
                  ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={v.id}
                  onChange={(e) => set("id", e.target.value)}
                  placeholder="experience"
                  required
                  disabled={isEdit}
                />
              </div>
              <div className="space-y-1">
                <Label>
                  Slug <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={v.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="experience-4-0"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={v.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Experience 4.0"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={v.sortOrder}
                  onChange={(e) => set("sortOrder", Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label>
                  Sector Group <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={v.sectorGroupId}
                  onValueChange={(val) => val && set("sectorGroupId", val)}
                >
                  <SelectTrigger className={"w-full"}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTOR_GROUPS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Icon</Label>
                <Select
                  value={v.iconName}
                  onValueChange={(val) => val && set("iconName", val)}
                >
                  <SelectTrigger className={"w-full"}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_NAMES.map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator />

          {/* Content */}
          <section className="space-y-4">
            <SectionHeading>Content</SectionHeading>
            <div className="space-y-1">
              <Label>
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                value={v.title}
                onChange={(e) => set("title", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>
                Subtitle <span className="text-destructive">*</span>
              </Label>
              <Input
                value={v.subtitle}
                onChange={(e) => set("subtitle", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>
                Focus / Overview Intro{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={3}
                value={v.focus}
                onChange={(e) => set("focus", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Overview Description</Label>
              <Textarea
                rows={4}
                value={v.overviewDescription}
                onChange={(e) => set("overviewDescription", e.target.value)}
              />
            </div>
          </section>

          <Separator />

          {/* Lists */}
          <section className="space-y-6">
            <SectionHeading>Lists</SectionHeading>
            <StringListField
              label="Technologies"
              values={v.technologies}
              onChange={(val) => set("technologies", val)}
            />
            <StringListField
              label="Benefits"
              values={v.benefits}
              onChange={(val) => set("benefits", val)}
            />
            <StringListField
              label="Use Cases"
              values={v.useCases}
              onChange={(val) => set("useCases", val)}
            />
          </section>

          <Separator />

          {/* Core Pillars */}
          <section className="space-y-4">
            <SectionHeading>Core Pillars</SectionHeading>
            <PairListField
              label="Pillars"
              values={v.corePillars}
              fields={[
                { key: "title", placeholder: "Pillar title" },
                {
                  key: "description",
                  placeholder: "Description",
                  textarea: true,
                },
              ]}
              onChange={(val) =>
                set("corePillars", val as typeof v.corePillars)
              }
            />
          </section>

          <Separator />

          {/* Why Reasons */}
          <section className="space-y-4">
            <SectionHeading>Why Reasons</SectionHeading>
            <PairListField
              label="Reasons"
              values={v.whyReasons}
              fields={[
                { key: "icon", placeholder: "Icon name e.g. TrendingUp" },
                { key: "title", placeholder: "Title" },
                {
                  key: "description",
                  placeholder: "Description",
                  textarea: true,
                },
              ]}
              onChange={(val) => set("whyReasons", val as typeof v.whyReasons)}
            />
          </section>

          <Separator />

          {/* Key Benefits */}
          <section className="space-y-4">
            <SectionHeading>Key Benefits</SectionHeading>
            <PairListField
              label="Benefits"
              values={v.keyBenefits}
              fields={[
                { key: "icon", placeholder: "Icon name e.g. Zap" },
                { key: "title", placeholder: "Title" },
                {
                  key: "description",
                  placeholder: "Description",
                  textarea: true,
                },
              ]}
              onChange={(val) =>
                set("keyBenefits", val as typeof v.keyBenefits)
              }
            />
          </section>

          <Separator />

          {/* Where to Start */}
          <section className="space-y-4">
            <SectionHeading>Where to Start</SectionHeading>
            <PairListField
              label="Items"
              values={v.whereToStartItems}
              fields={[
                { key: "title", placeholder: "Title" },
                {
                  key: "description",
                  placeholder: "Description",
                  textarea: true,
                },
              ]}
              onChange={(val) =>
                set("whereToStartItems", val as typeof v.whereToStartItems)
              }
            />
          </section>

          <Separator />

          {/* Focus Areas */}
          <section className="space-y-4">
            <SectionHeading>Focus Areas</SectionHeading>
            <PairListField
              label="Areas"
              values={v.focusAreasItems}
              fields={[
                { key: "number", placeholder: "01" },
                { key: "title", placeholder: "Title" },
                {
                  key: "description",
                  placeholder: "Description",
                  textarea: true,
                },
              ]}
              onChange={(val) =>
                set("focusAreasItems", val as typeof v.focusAreasItems)
              }
            />
          </section>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-6 xl:sticky xl:top-4">
          {/* Media */}
          <section className="border border-border rounded-lg p-4 space-y-4">
            <SectionHeading>Media</SectionHeading>
            <div className="space-y-1">
              <Label>
                Hero Image <span className="text-destructive">*</span>
              </Label>
              <ImageUploadField
                value={v.heroImage}
                onChange={(val) => set("heroImage", val)}
                folder="sector-hero"
                placeholder="/images/hero.png"
                uploadFn={uploadSectorMedia}
              />
            </div>
            <div className="space-y-1">
              <Label>Overview Image</Label>
              <ImageUploadField
                value={v.overviewImage}
                onChange={(val) => set("overviewImage", val)}
                folder="sector-overview"
                placeholder="/images/overview.png"
                uploadFn={uploadSectorMedia}
              />
            </div>
            <div className="space-y-1">
              <Label>Overview Video</Label>
              <VideoUploadField
                value={v.overviewVideo}
                onChange={(val) => set("overviewVideo", val)}
              />
            </div>
          </section>

          {/* Stats */}
          <section className="border border-border rounded-lg p-4 space-y-4">
            <SectionHeading>Stats (3)</SectionHeading>
            {v.stats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Stat {i + 1}
                </Label>
                <Input
                  placeholder="Value e.g. 40%"
                  value={stat.value}
                  onChange={(e) => {
                    const n = [...v.stats] as typeof v.stats;
                    n[i] = { ...n[i], value: e.target.value };
                    set("stats", n);
                  }}
                />
                <Input
                  placeholder="Label e.g. Faster Delivery"
                  value={stat.label}
                  onChange={(e) => {
                    const n = [...v.stats] as typeof v.stats;
                    n[i] = { ...n[i], label: e.target.value };
                    set("stats", n);
                  }}
                />
              </div>
            ))}
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader size={14} className="animate-spin" /> Saving…
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Sector"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
