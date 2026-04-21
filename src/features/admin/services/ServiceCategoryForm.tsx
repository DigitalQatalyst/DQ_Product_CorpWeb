"use client";

import * as React from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Plus, Trash2, Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import type {
  ServiceCategory,
  ServiceCategoryInput,
} from "@/features/services/api/serviceCategories";
import { ImageUploadField } from "./ImageUploadField";

// ─── Schema ──────────────────────────────────────────────────────────────────

const ctaSchema = z.object({
  label: z.string().min(1, "Required"),
  href: z.string().min(1, "Required"),
});
const faqSchema = z.object({
  question: z.string().min(1, "Required"),
  answer: z.string().min(1, "Required"),
});
const statSchema = z.object({
  value: z.string().min(1, "Required"),
  label: z.string().min(1, "Required"),
});
const stepSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
});
const cardSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
});

const schema = z.object({
  name: z.string().min(3).max(60),
  slug: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  description: z.string().min(10).max(200),
  tagsRaw: z.string().optional(),
  isPublished: z.boolean(),
  // hero
  heroTitle: z.string().min(1, "Required"),
  heroSubtitle: z.string().min(1, "Required"),
  heroBgImage: z.string().min(1, "Required"),
  // blueprint
  bpTitle: z.string().min(1, "Required"),
  bpDescription: z.string().min(1, "Required"),
  bpPrimaryCta: ctaSchema,
  bpSecondaryCta: ctaSchema,
  bpImagePrimary: z.string().min(1, "Required"),
  bpImageOverlay: z.string().min(1, "Required"),
  bpFaqs: z.array(faqSchema),
  // stats
  stats: z.array(statSchema),
  // methodology
  methodEyebrow: z.string().min(1, "Required"),
  methodTitle: z.string().min(1, "Required"),
  methodCtaLabel: z.string().min(1, "Required"),
  methodImage: z.string().min(1, "Required"),
  methodSteps: z.array(stepSchema),
  // transformation
  transformEyebrow: z.string().min(1, "Required"),
  transformTitle: z.string().min(1, "Required"),
  transformSteps: z.array(stepSchema),
  // industry
  industryTitle: z.string().min(1, "Required"),
  industryDescription: z.string().min(1, "Required"),
  industryCtaLabel: z.string().min(1, "Required"),
  industryCards: z.array(cardSchema),
});

export type CategoryFormValues = z.infer<typeof schema>;

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function categoryToFormValues(cat: ServiceCategory): CategoryFormValues {
  return {
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    tagsRaw: cat.tags.join(", "),
    isPublished: cat.isPublished,
    heroTitle: cat.heroTitle,
    heroSubtitle: cat.heroSubtitle,
    heroBgImage: cat.heroBgImage,
    bpTitle: cat.bpTitle,
    bpDescription: cat.bpDescription,
    bpPrimaryCta: cat.bpPrimaryCta,
    bpSecondaryCta: cat.bpSecondaryCta,
    bpImagePrimary: cat.bpImagePrimary,
    bpImageOverlay: cat.bpImageOverlay,
    bpFaqs: cat.bpFaqs.length ? cat.bpFaqs : [{ question: "", answer: "" }],
    stats: cat.stats.length ? cat.stats : [{ value: "", label: "" }],
    methodEyebrow: cat.methodEyebrow,
    methodTitle: cat.methodTitle,
    methodCtaLabel: cat.methodCtaLabel,
    methodImage: cat.methodImage,
    methodSteps: cat.methodSteps.length
      ? cat.methodSteps
      : [{ number: "01", title: "", description: "" }],
    transformEyebrow: cat.transformEyebrow,
    transformTitle: cat.transformTitle,
    transformSteps: cat.transformSteps.length
      ? cat.transformSteps
      : [{ number: "01", title: "", description: "" }],
    industryTitle: cat.industryTitle,
    industryDescription: cat.industryDescription,
    industryCtaLabel: cat.industryCtaLabel,
    industryCards: cat.industryCards.length
      ? cat.industryCards
      : [{ title: "", description: "" }],
  };
}

export const defaultFormValues: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  tagsRaw: "",
  isPublished: true,
  heroTitle: "",
  heroSubtitle: "",
  heroBgImage: "",
  bpTitle: "",
  bpDescription: "",
  bpPrimaryCta: { label: "Get Started", href: "/consultation" },
  bpSecondaryCta: { label: "Explore Service Domains", href: "/services" },
  bpImagePrimary: "",
  bpImageOverlay: "",
  bpFaqs: [{ question: "", answer: "" }],
  stats: [{ value: "", label: "" }],
  methodEyebrow: "",
  methodTitle: "",
  methodCtaLabel: "Contact Us",
  methodImage: "",
  methodSteps: [{ number: "01", title: "", description: "" }],
  transformEyebrow: "",
  transformTitle: "",
  transformSteps: [{ number: "01", title: "", description: "" }],
  industryTitle: "",
  industryDescription: "",
  industryCtaLabel: "Explore All Industries",
  industryCards: [{ title: "", description: "" }],
};

export function formValuesToInput(
  values: CategoryFormValues,
): ServiceCategoryInput {
  return {
    name: values.name,
    slug: values.slug,
    description: values.description,
    tags: (values.tagsRaw ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    isPublished: values.isPublished,
    heroTitle: values.heroTitle,
    heroSubtitle: values.heroSubtitle,
    heroBgImage: values.heroBgImage,
    bpTitle: values.bpTitle,
    bpDescription: values.bpDescription,
    bpPrimaryCta: values.bpPrimaryCta,
    bpSecondaryCta: values.bpSecondaryCta,
    bpImagePrimary: values.bpImagePrimary,
    bpImageOverlay: values.bpImageOverlay,
    bpFaqs: values.bpFaqs,
    stats: values.stats,
    methodEyebrow: values.methodEyebrow,
    methodTitle: values.methodTitle,
    methodCtaLabel: values.methodCtaLabel,
    methodImage: values.methodImage,
    methodSteps: values.methodSteps,
    transformEyebrow: values.transformEyebrow,
    transformTitle: values.transformTitle,
    transformSteps: values.transformSteps,
    industryTitle: values.industryTitle,
    industryDescription: values.industryDescription,
    industryCtaLabel: values.industryCtaLabel,
    industryCards: values.industryCards,
  };
}

// ─── Reusable repeater ───────────────────────────────────────────────────────

function ArrayField<T extends Record<string, string>>({
  label,
  fields,
  append,
  remove,
  renderItem,
}: {
  label: string;
  fields: (T & { id: string })[];
  append: () => void;
  remove: (i: number) => void;
  renderItem: (index: number) => React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <Button type="button" variant="outline" size="sm" onClick={append}>
          <Plus size={14} /> Add
        </Button>
      </div>
      {fields.map((f, i) => (
        <Card key={f.id} className="py-0 gap-0">
          <CardContent className="p-4 space-y-3">
            {renderItem(i)}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => remove(i)}
            >
              <Trash2 size={14} /> Remove
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Main form ───────────────────────────────────────────────────────────────

export function ServiceCategoryForm({
  defaultValues,
  onSubmit,
  onCancel,
  isPending,
  isEdit,
}: {
  defaultValues: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
  isEdit: boolean;
}) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const nameValue = form.watch("name");
  React.useEffect(() => {
    if (!isEdit) form.setValue("slug", toSlug(nameValue ?? ""));
  }, [nameValue, isEdit, form]);

  const faqs = useFieldArray({ control: form.control, name: "bpFaqs" });
  const stats = useFieldArray({ control: form.control, name: "stats" });
  const methodSteps = useFieldArray({
    control: form.control,
    name: "methodSteps",
  });
  const transformSteps = useFieldArray({
    control: form.control,
    name: "transformSteps",
  });
  const industryCards = useFieldArray({
    control: form.control,
    name: "industryCards",
  });

  return (
    <form
      id="sc-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <Tabs defaultValue="general" className="flex flex-col">
        <TabsList className="mb-6 w-full gap-2 bg-none">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="blueprint">Blueprint</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="methodology">Methodology</TabsTrigger>
          <TabsTrigger value="transformation">Transformation</TabsTrigger>
          <TabsTrigger value="industry">Industry</TabsTrigger>
        </TabsList>
        {/* ── General ── */}
        <TabsContent value="general" className="mt-6">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Design Services"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Slug</FieldLabel>
                  <Input
                    {...field}
                    placeholder="design-services"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Auto-generated from name. Used in the URL.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Card Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      rows={3}
                      className="resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/200
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="tagsRaw"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Tags</FieldLabel>
                  <Input {...field} placeholder="Strategy, Architecture" />
                  <FieldDescription>Comma-separated.</FieldDescription>
                </Field>
              )}
            />
            <Controller
              name="isPublished"
              control={form.control}
              render={({ field }) => (
                <Field orientation="horizontal">
                  <FieldLabel>Published</FieldLabel>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </TabsContent>

        {/* ── Hero ── */}
        <TabsContent value="hero" className="mt-6">
          <FieldGroup>
            <Controller
              name="heroTitle"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Hero Title</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Design 4.0"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="heroSubtitle"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Hero Subtitle</FieldLabel>
                  <InputGroupTextarea
                    {...field}
                    rows={2}
                    className="resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="heroBgImage"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Background Image</FieldLabel>
                  <ImageUploadField
                    value={field.value}
                    onChange={field.onChange}
                    folder="hero"
                    placeholder="/images/hero.png"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </TabsContent>

        {/* ── Blueprint ── */}
        <TabsContent value="blueprint" className="mt-6 space-y-6">
          <FieldGroup>
            <Controller
              name="bpTitle"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Section Title</FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="bpDescription"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <InputGroupTextarea
                    {...field}
                    rows={3}
                    className="resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="bpPrimaryCta.label"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Primary CTA Label</FieldLabel>
                    <Input {...field} />
                  </Field>
                )}
              />
              <Controller
                name="bpPrimaryCta.href"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Primary CTA Href</FieldLabel>
                    <Input {...field} />
                  </Field>
                )}
              />
              <Controller
                name="bpSecondaryCta.label"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Secondary CTA Label</FieldLabel>
                    <Input {...field} />
                  </Field>
                )}
              />
              <Controller
                name="bpSecondaryCta.href"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Secondary CTA Href</FieldLabel>
                    <Input {...field} />
                  </Field>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="bpImagePrimary"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Primary Image</FieldLabel>
                    <ImageUploadField
                      value={field.value}
                      onChange={field.onChange}
                      folder="blueprint"
                      placeholder="/images/primary.svg"
                    />
                  </Field>
                )}
              />
              <Controller
                name="bpImageOverlay"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Overlay Image</FieldLabel>
                    <ImageUploadField
                      value={field.value}
                      onChange={field.onChange}
                      folder="blueprint"
                      placeholder="/images/overlay.svg"
                    />
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
          <Separator />
          <ArrayField
            label="FAQs"
            fields={
              faqs.fields as ((typeof faqs.fields)[number] & { id: string })[]
            }
            append={() => faqs.append({ question: "", answer: "" })}
            remove={faqs.remove}
            renderItem={(i) => (
              <>
                <Controller
                  name={`bpFaqs.${i}.question`}
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Question</FieldLabel>
                      <Input {...field} />
                    </Field>
                  )}
                />
                <Controller
                  name={`bpFaqs.${i}.answer`}
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Answer</FieldLabel>
                      <InputGroupTextarea
                        {...field}
                        rows={2}
                        className="resize-none"
                      />
                    </Field>
                  )}
                />
              </>
            )}
          />
        </TabsContent>

        {/* ── Stats ── */}
        <TabsContent value="stats" className="mt-6">
          <ArrayField
            label="Stats"
            fields={
              stats.fields as ((typeof stats.fields)[number] & { id: string })[]
            }
            append={() => stats.append({ value: "", label: "" })}
            remove={stats.remove}
            renderItem={(i) => (
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name={`stats.${i}.value`}
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Value</FieldLabel>
                      <Input {...field} placeholder="99%" />
                    </Field>
                  )}
                />
                <Controller
                  name={`stats.${i}.label`}
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Label</FieldLabel>
                      <Input {...field} placeholder="Success rate" />
                    </Field>
                  )}
                />
              </div>
            )}
          />
        </TabsContent>

        {/* ── Methodology ── */}
        <TabsContent value="methodology" className="mt-6 space-y-6">
          <FieldGroup>
            <Controller
              name="methodEyebrow"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Eyebrow Text</FieldLabel>
                  <Input {...field} />
                </Field>
              )}
            />
            <Controller
              name="methodTitle"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input {...field} />
                </Field>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="methodCtaLabel"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>CTA Label</FieldLabel>
                    <Input {...field} />
                  </Field>
                )}
              />
              <Controller
                name="methodImage"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Image</FieldLabel>
                    <ImageUploadField
                      value={field.value}
                      onChange={field.onChange}
                      folder="methodology"
                      placeholder="/images/method.svg"
                    />
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
          <Separator />
          <ArrayField
            label="Steps"
            fields={
              methodSteps.fields as ((typeof methodSteps.fields)[number] & {
                id: string;
              })[]
            }
            append={() =>
              methodSteps.append({
                number: String(methodSteps.fields.length + 1).padStart(2, "0"),
                title: "",
                description: "",
              })
            }
            remove={methodSteps.remove}
            renderItem={(i) => (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-4">
                  <Controller
                    name={`methodSteps.${i}.number`}
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>No.</FieldLabel>
                        <Input {...field} placeholder="01" />
                      </Field>
                    )}
                  />
                  <div className="col-span-3">
                    <Controller
                      name={`methodSteps.${i}.title`}
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Title</FieldLabel>
                          <Input {...field} />
                        </Field>
                      )}
                    />
                  </div>
                </div>
                <Controller
                  name={`methodSteps.${i}.description`}
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Description</FieldLabel>
                      <InputGroupTextarea
                        {...field}
                        rows={2}
                        className="resize-none"
                      />
                    </Field>
                  )}
                />
              </div>
            )}
          />
        </TabsContent>

        {/* ── Transformation ── */}
        <TabsContent value="transformation" className="mt-6 space-y-6">
          <FieldGroup>
            <Controller
              name="transformEyebrow"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Eyebrow Text</FieldLabel>
                  <Input {...field} />
                </Field>
              )}
            />
            <Controller
              name="transformTitle"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input {...field} />
                </Field>
              )}
            />
          </FieldGroup>
          <Separator />
          <ArrayField
            label="Steps"
            fields={
              transformSteps.fields as ((typeof transformSteps.fields)[number] & {
                id: string;
              })[]
            }
            append={() =>
              transformSteps.append({
                number: String(transformSteps.fields.length + 1).padStart(
                  2,
                  "0",
                ),
                title: "",
                description: "",
              })
            }
            remove={transformSteps.remove}
            renderItem={(i) => (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-4">
                  <Controller
                    name={`transformSteps.${i}.number`}
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>No.</FieldLabel>
                        <Input {...field} placeholder="01" />
                      </Field>
                    )}
                  />
                  <div className="col-span-3">
                    <Controller
                      name={`transformSteps.${i}.title`}
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Title</FieldLabel>
                          <Input {...field} />
                        </Field>
                      )}
                    />
                  </div>
                </div>
                <Controller
                  name={`transformSteps.${i}.description`}
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Description</FieldLabel>
                      <InputGroupTextarea
                        {...field}
                        rows={2}
                        className="resize-none"
                      />
                    </Field>
                  )}
                />
              </div>
            )}
          />
        </TabsContent>

        {/* ── Industry ── */}
        <TabsContent value="industry" className="mt-6 space-y-6">
          <FieldGroup>
            <Controller
              name="industryTitle"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Section Title</FieldLabel>
                  <Input {...field} />
                </Field>
              )}
            />
            <Controller
              name="industryDescription"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <InputGroupTextarea
                    {...field}
                    rows={2}
                    className="resize-none"
                  />
                </Field>
              )}
            />
            <Controller
              name="industryCtaLabel"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>CTA Label</FieldLabel>
                  <Input {...field} />
                </Field>
              )}
            />
          </FieldGroup>
          <Separator />
          <ArrayField
            label="Industry Cards"
            fields={
              industryCards.fields as ((typeof industryCards.fields)[number] & {
                id: string;
              })[]
            }
            append={() => industryCards.append({ title: "", description: "" })}
            remove={industryCards.remove}
            renderItem={(i) => (
              <>
                <Controller
                  name={`industryCards.${i}.title`}
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Title</FieldLabel>
                      <Input {...field} />
                    </Field>
                  )}
                />
                <Controller
                  name={`industryCards.${i}.description`}
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Description</FieldLabel>
                      <InputGroupTextarea
                        {...field}
                        rows={2}
                        className="resize-none"
                      />
                    </Field>
                  )}
                />
              </>
            )}
          />
        </TabsContent>
      </Tabs>

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" form="sc-form" disabled={isPending}>
          {isPending && <Loader className="animate-spin" size={14} />}
          {isEdit ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
