"use client";

import * as React from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { Service } from "@/features/services/hooks/useServicesAdmin";

// ─── Schema ──────────────────────────────────────────────────────────────────

const deliverableSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
});

const stageSchema = z.object({
  number: z.number().min(1),
  title: z.string().min(1, "Required"),
  subtitle: z.string().min(1, "Required"),
  outcome: z.string().min(1, "Required"),
  achieved: z.string().min(1, "Required"),
  deliverables: z.string().min(1, "Required"),
});

const requiredInputSchema = z.object({
  category: z.string().min(1, "Required"),
  items: z.string().min(1, "Required"),
});

const schema = z.object({
  id: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(400),
  provider: z.string().min(1),
  category: z.string().min(1, "Required"),
  tagsRaw: z.string().optional(),
  serviceCategory: z.string().min(1, "Required"),
  serviceAvailability: z.string().min(1, "Required"),
  serviceReadiness: z.string().min(1, "Required"),
  duration: z.string().min(1, "Required"),
  sortOrder: z.number().min(0),
  isPublished: z.boolean(),
  // overview
  overviewParagraphs: z.string().min(1, "Required"),
  overviewKeyAreas: z.string().min(1, "Required"),
  overviewTargetAudience: z.string().min(1, "Required"),
  // delivery stages
  stages: z.array(stageSchema),
  // deliverables
  deliverables: z.array(deliverableSchema),
  // required inputs
  requiredInputs: z.array(requiredInputSchema),
});

export type ServiceFormValues = z.infer<typeof schema>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function joinLines(arr: string[]) { return arr.join("\n"); }
function splitLines(s: string) { return s.split("\n").map((l) => l.trim()).filter(Boolean); }

export function serviceToFormValues(s: Service): ServiceFormValues {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    provider: s.provider,
    category: s.category,
    tagsRaw: s.tags.join(", "),
    serviceCategory: s.serviceCategory,
    serviceAvailability: s.serviceAvailability,
    serviceReadiness: s.serviceReadiness,
    duration: s.duration,
    sortOrder: s.sortOrder,
    isPublished: s.isPublished,
    overviewParagraphs: joinLines(s.overview.paragraphs),
    overviewKeyAreas: joinLines(s.overview.keyAreas),
    overviewTargetAudience: joinLines(s.overview.targetAudience),
    stages: s.deliveryStages.map((st) => ({
      number: st.number,
      title: st.title,
      subtitle: st.subtitle,
      outcome: st.outcome,
      achieved: joinLines(st.achieved),
      deliverables: joinLines(st.deliverables),
    })),
    deliverables: s.deliverables,
    requiredInputs: s.requiredInputs.map((r) => ({
      category: r.category,
      items: r.items.join(", "),
    })),
  };
}

export const defaultFormValues: ServiceFormValues = {
  id: "",
  title: "",
  description: "",
  provider: "DigitalQatalyst",
  category: "Design Services",
  tagsRaw: "",
  serviceCategory: "",
  serviceAvailability: "Available",
  serviceReadiness: "Ready to Order",
  duration: "",
  sortOrder: 0,
  isPublished: true,
  overviewParagraphs: "",
  overviewKeyAreas: "",
  overviewTargetAudience: "",
  stages: [{ number: 1, title: "", subtitle: "", outcome: "", achieved: "", deliverables: "" }],
  deliverables: [{ title: "", description: "" }],
  requiredInputs: [{ category: "", items: "" }],
};

export function formValuesToInput(v: ServiceFormValues) {
  return {
    id: v.id,
    title: v.title,
    description: v.description,
    provider: v.provider,
    category: v.category,
    tags: (v.tagsRaw ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    serviceCategory: v.serviceCategory,
    serviceAvailability: v.serviceAvailability,
    serviceReadiness: v.serviceReadiness,
    duration: v.duration,
    sortOrder: v.sortOrder,
    isPublished: v.isPublished,
    overview: {
      paragraphs: splitLines(v.overviewParagraphs),
      keyAreas: splitLines(v.overviewKeyAreas),
      targetAudience: splitLines(v.overviewTargetAudience),
    },
    deliveryStages: v.stages.map((st) => ({
      number: st.number,
      title: st.title,
      subtitle: st.subtitle,
      outcome: st.outcome,
      achieved: splitLines(st.achieved),
      deliverables: splitLines(st.deliverables),
    })),
    deliverables: v.deliverables,
    requiredInputs: v.requiredInputs.map((r) => ({
      category: r.category,
      items: r.items.split(",").map((i) => i.trim()).filter(Boolean),
    })),
  };
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export function ServicesAdminForm({
  defaultValues,
  onSubmit,
  onCancel,
  isPending,
  isEdit,
}: {
  defaultValues: ServiceFormValues;
  onSubmit: (values: ServiceFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
  isEdit: boolean;
}) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const titleValue = form.watch("title");
  React.useEffect(() => {
    if (!isEdit) form.setValue("id", toSlug(titleValue ?? ""));
  }, [titleValue, isEdit, form]);

  const stages = useFieldArray({ control: form.control, name: "stages" });
  const deliverables = useFieldArray({ control: form.control, name: "deliverables" });
  const requiredInputs = useFieldArray({ control: form.control, name: "requiredInputs" });

  return (
    <form id="svc-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="general" className="flex flex-col">
        <TabsList className="mb-6 w-full gap-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stages">Delivery Stages</TabsTrigger>
          <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
          <TabsTrigger value="inputs">Required Inputs</TabsTrigger>
        </TabsList>

        {/* ── General ── */}
        <TabsContent value="general" className="mt-6">
          <FieldGroup>
            <Controller name="title" control={form.control} render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Title</FieldLabel>
                <Input {...field} placeholder="Digital Workspace Strategy" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />
            <Controller name="id" control={form.control} render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>ID (slug)</FieldLabel>
                <Input {...field} placeholder="digital-workspace-strategy" disabled={isEdit} aria-invalid={fieldState.invalid} />
                <FieldDescription>Used in the URL. Auto-generated from title.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />
            <Controller name="description" control={form.control} render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Description</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea {...field} rows={3} className="resize-none" aria-invalid={fieldState.invalid} />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">{field.value.length}/400</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <Controller name="provider" control={form.control} render={({ field }) => (
                <Field><FieldLabel>Provider</FieldLabel><Input {...field} /></Field>
              )} />
              <Controller name="category" control={form.control} render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category</FieldLabel>
                  <Input {...field} placeholder="Design Services" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )} />
              <Controller name="serviceCategory" control={form.control} render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Service Category</FieldLabel>
                  <Input {...field} placeholder="Digital Core / DWS" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )} />
              <Controller name="duration" control={form.control} render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Duration</FieldLabel>
                  <Input {...field} placeholder="1–2 weeks" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )} />
              <Controller name="serviceAvailability" control={form.control} render={({ field }) => (
                <Field><FieldLabel>Availability</FieldLabel><Input {...field} placeholder="Available" /></Field>
              )} />
              <Controller name="serviceReadiness" control={form.control} render={({ field }) => (
                <Field><FieldLabel>Readiness</FieldLabel><Input {...field} placeholder="Ready to Order" /></Field>
              )} />
              <Controller name="sortOrder" control={form.control} render={({ field }) => (
                <Field><FieldLabel>Sort Order</FieldLabel><Input {...field} type="number" min={0} onChange={(e) => field.onChange(e.target.valueAsNumber)} /></Field>
              )} />
            </div>
            <Controller name="tagsRaw" control={form.control} render={({ field }) => (
              <Field>
                <FieldLabel>Tags</FieldLabel>
                <Input {...field} placeholder="Core Systems, Cloud Architecture" />
                <FieldDescription>Comma-separated.</FieldDescription>
              </Field>
            )} />
            <Controller name="isPublished" control={form.control} render={({ field }) => (
              <Field orientation="horizontal">
                <FieldLabel>Published</FieldLabel>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </Field>
            )} />
          </FieldGroup>
        </TabsContent>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="mt-6">
          <FieldGroup>
            <Controller name="overviewParagraphs" control={form.control} render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Overview Paragraphs</FieldLabel>
                <InputGroupTextarea {...field} rows={6} className="resize-none" aria-invalid={fieldState.invalid} />
                <FieldDescription>One paragraph per line.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />
            <Controller name="overviewKeyAreas" control={form.control} render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Key Areas</FieldLabel>
                <InputGroupTextarea {...field} rows={4} className="resize-none" aria-invalid={fieldState.invalid} />
                <FieldDescription>One item per line.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />
            <Controller name="overviewTargetAudience" control={form.control} render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Target Audience</FieldLabel>
                <InputGroupTextarea {...field} rows={4} className="resize-none" aria-invalid={fieldState.invalid} />
                <FieldDescription>One item per line.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )} />
          </FieldGroup>
        </TabsContent>

        {/* ── Delivery Stages ── */}
        <TabsContent value="stages" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Delivery Stages</p>
            <Button type="button" variant="outline" size="sm"
              onClick={() => stages.append({ number: stages.fields.length + 1, title: "", subtitle: "", outcome: "", achieved: "", deliverables: "" })}>
              <Plus size={14} /> Add Stage
            </Button>
          </div>
          {stages.fields.map((f, i) => (
            <Card key={f.id} className="py-0 gap-0">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-muted-foreground">Stage {i + 1}</p>
                  <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => stages.remove(i)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <Controller name={`stages.${i}.number`} control={form.control} render={({ field }) => (
                    <Field><FieldLabel>No.</FieldLabel><Input {...field} type="number" min={1} onChange={(e) => field.onChange(e.target.valueAsNumber)} /></Field>
                  )} />
                  <div className="col-span-3">
                    <Controller name={`stages.${i}.title`} control={form.control} render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Title</FieldLabel>
                        <Input {...field} placeholder="Envision" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )} />
                  </div>
                </div>
                <Controller name={`stages.${i}.subtitle`} control={form.control} render={({ field }) => (
                  <Field><FieldLabel>Subtitle</FieldLabel><Input {...field} placeholder="Strategic clarity and direction" /></Field>
                )} />
                <Controller name={`stages.${i}.outcome`} control={form.control} render={({ field }) => (
                  <Field><FieldLabel>Outcome</FieldLabel><InputGroupTextarea {...field} rows={2} className="resize-none" /></Field>
                )} />
                <Controller name={`stages.${i}.achieved`} control={form.control} render={({ field }) => (
                  <Field>
                    <FieldLabel>What&apos;s Achieved</FieldLabel>
                    <InputGroupTextarea {...field} rows={3} className="resize-none" />
                    <FieldDescription>One item per line.</FieldDescription>
                  </Field>
                )} />
                <Controller name={`stages.${i}.deliverables`} control={form.control} render={({ field }) => (
                  <Field>
                    <FieldLabel>Deliverables</FieldLabel>
                    <InputGroupTextarea {...field} rows={2} className="resize-none" />
                    <FieldDescription>One item per line.</FieldDescription>
                  </Field>
                )} />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ── Deliverables ── */}
        <TabsContent value="deliverables" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Deliverables</p>
            <Button type="button" variant="outline" size="sm" onClick={() => deliverables.append({ title: "", description: "" })}>
              <Plus size={14} /> Add
            </Button>
          </div>
          {deliverables.fields.map((f, i) => (
            <Card key={f.id} className="py-0 gap-0">
              <CardContent className="p-4 space-y-3">
                <Controller name={`deliverables.${i}.title`} control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Title</FieldLabel>
                    <Input {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
                <Controller name={`deliverables.${i}.description`} control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Description</FieldLabel>
                    <InputGroupTextarea {...field} rows={2} className="resize-none" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
                <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deliverables.remove(i)}>
                  <Trash2 size={14} /> Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ── Required Inputs ── */}
        <TabsContent value="inputs" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Required Inputs</p>
            <Button type="button" variant="outline" size="sm" onClick={() => requiredInputs.append({ category: "", items: "" })}>
              <Plus size={14} /> Add
            </Button>
          </div>
          {requiredInputs.fields.map((f, i) => (
            <Card key={f.id} className="py-0 gap-0">
              <CardContent className="p-4 space-y-3">
                <Controller name={`requiredInputs.${i}.category`} control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Category</FieldLabel>
                    <Input {...field} placeholder="Business Vision" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
                <Controller name={`requiredInputs.${i}.items`} control={form.control} render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Items</FieldLabel>
                    <Input {...field} placeholder="Strategy, Business model, Value streams" />
                    <FieldDescription>Comma-separated.</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )} />
                <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => requiredInputs.remove(i)}>
                  <Trash2 size={14} /> Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
        <Button type="submit" form="svc-form" disabled={isPending}>
          {isPending ? "Saving…" : isEdit ? "Save changes" : "Create service"}
        </Button>
      </div>
    </form>
  );
}
