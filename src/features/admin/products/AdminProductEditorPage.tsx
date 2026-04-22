"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, Save, Upload } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ProductCtaType, ProductDetail } from "@/features/products/api/products.queries";
import type { AdminProductWithDetail } from "./admin-products.types";
import {
  getAdminProductWithDetail,
  upsertAdminProduct,
  patchAdminProduct,
  uploadProductImage,
} from "@/features/products/api/products.admin";

type Props =
  | { readonly mode: "create"; readonly productId?: never }
  | { readonly mode: "edit"; readonly productId: string };

type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

function emptyDetail(): ProductDetail {
  return {
    aboutParagraphs: [],
    featureDescriptions: {},
    problemStatement: "",
    solutionStatement: "",
    capabilitiesLabel: "Key Capabilities",
    capabilities: [],
    practicalValues: [],
  };
}

function parseLines(val: string): string[] {
  return val
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function stringifyLines(arr: string[]): string {
  return (arr ?? []).join("\n");
}

export function AdminProductEditorPage(props: Props) {
  const router = useRouter();
  const [saveState, setSaveState] = useState<SaveState>({ kind: "idle" });
  const [loading, setLoading] = useState(props.mode === "edit");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [product, setProduct] = useState({
    id: "",
    name: "",
    code: "",
    description: "",
    category: "",
    tagsCsv: "",
    ctaType: "waitlist" as ProductCtaType,
    isPublished: true,
    imagePath: null as string | null,
    imageUrl: "" as string,
  });

  const [detail, setDetail] = useState<ProductDetail>(emptyDetail());

  function updateCapability(
    idx: number,
    patch: Partial<{ title: string; body: string; accent: "primary" | "secondary" }>,
  ) {
    setDetail((d) => ({
      ...d,
      capabilities: d.capabilities.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    }));
  }

  function removeCapability(idx: number) {
    setDetail((d) => ({ ...d, capabilities: d.capabilities.filter((_, i) => i !== idx) }));
  }

  function updatePracticalValue(
    idx: number,
    patch: Partial<{ icon: string; title: string; subtitle: string }>,
  ) {
    setDetail((d) => ({
      ...d,
      practicalValues: d.practicalValues.map((x, i) => (i === idx ? { ...x, ...patch } : x)),
    }));
  }

  function removePracticalValue(idx: number) {
    setDetail((d) => ({
      ...d,
      practicalValues: d.practicalValues.filter((_, i) => i !== idx),
    }));
  }

  useEffect(() => {
    if (props.mode !== "edit") return;
    const productId = props.productId;
    async function load() {
      setLoading(true);
      try {
        const data = await getAdminProductWithDetail(productId);
        if (!data) throw new Error("Product not found");
        setProduct({
          id: data.product.id,
          name: data.product.name,
          code: data.product.code,
          description: data.product.description,
          category: data.product.category,
          tagsCsv: data.product.tags.join(", "),
          ctaType: data.product.ctaType,
          isPublished: data.product.isPublished,
          imagePath: data.product.imagePath,
          imageUrl: data.product.imageUrl ?? "",
        });
        setDetail(data.detail);
        setLoading(false);
      } catch (e) {
        setSaveState({ kind: "error", message: e instanceof Error ? e.message : "Failed to load" });
        setLoading(false);
      }
    }
    void load();
  }, [props]);

  const tags = useMemo(
    () =>
      product.tagsCsv
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [product.tagsCsv],
  );

  async function save() {
    setSaveState({ kind: "saving" });
    try {
      const id = props.mode === "create" ? product.id.trim() : props.productId;
      if (!id) throw new Error("Product ID is required");

      if (props.mode === "create") {
        await upsertAdminProduct({ id, name: product.name, code: product.code, description: product.description, category: product.category, tags, ctaType: product.ctaType, isPublished: product.isPublished, detail });
      } else {
        await patchAdminProduct(id, { name: product.name, code: product.code, description: product.description, category: product.category, tags, ctaType: product.ctaType, isPublished: product.isPublished });
      }

      if (imageFile) {
        await uploadProductImage(id, imageFile);
      }

      setSaveState({ kind: "saved" });
      router.push(`/admin/products/${encodeURIComponent(id)}`);
      router.refresh();
    } catch (e) {
      setSaveState({ kind: "error", message: e instanceof Error ? e.message : "Save failed" });
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin/products")}>
            <ArrowLeft size={16} /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {props.mode === "create" ? "New Product" : `Edit Product: ${product.id}`}
            </h1>
            <p className="text-sm text-muted-foreground">
              Marketplace fields + full detail-page content.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button onClick={save} disabled={saveState.kind === "saving"}>
            <Save size={16} /> Save
          </Button>
        </div>
      </div>

      {saveState.kind === "error" && (
        <div className="text-sm text-destructive">{saveState.message}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="py-0 gap-0">
            <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Basic info</h2>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={product.isPublished}
                    onCheckedChange={(v) => setProduct((p) => ({ ...p, isPublished: v }))}
                  />
                  <span className="text-xs text-muted-foreground">
                    {product.isPublished ? "Published" : "Unpublished"}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">ID (slug)</div>
                  <Input
                    value={product.id}
                    onChange={(e) => setProduct((p) => ({ ...p, id: e.target.value }))}
                    placeholder="e.g. dtmp"
                    disabled={props.mode === "edit"}
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Code</div>
                  <Input
                    value={product.code}
                    onChange={(e) => setProduct((p) => ({ ...p, code: e.target.value }))}
                    placeholder="e.g. DTMP"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Name</div>
                <Input
                  value={product.name}
                  onChange={(e) => setProduct((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Product name"
                />
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Category</div>
                <Input
                  value={product.category}
                  onChange={(e) => setProduct((p) => ({ ...p, category: e.target.value }))}
                  placeholder="e.g. Platform"
                />
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Description</div>
                <Textarea
                  value={product.description}
                  onChange={(e) => setProduct((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Short description for cards + metadata"
                  className="min-h-24"
                />
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Tags (comma-separated)</div>
                <Input
                  value={product.tagsCsv}
                  onChange={(e) => setProduct((p) => ({ ...p, tagsCsv: e.target.value }))}
                  placeholder="Architecture-led, Data-driven, Best-Practice-based"
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {tags.map((t) => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">CTA Type</div>
                  <Select
                    value={product.ctaType}
                    onValueChange={(v) => setProduct((p) => ({ ...p, ctaType: v as ProductCtaType }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select CTA type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waitlist">waitlist</SelectItem>
                      <SelectItem value="demo">demo</SelectItem>
                      <SelectItem value="tour">tour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Image</div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    />
                    <Button type="button" variant="outline" disabled>
                      <Upload size={16} /> Upload
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <ImageIcon size={14} />
                    {product.imagePath ?? "No image uploaded yet"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="py-0 gap-0">
            <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">About + Key Features</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">About paragraphs (one per line)</div>
                <Textarea
                  value={stringifyLines(detail.aboutParagraphs)}
                  onChange={(e) => setDetail((d) => ({ ...d, aboutParagraphs: parseLines(e.target.value) }))}
                  className="min-h-28"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Feature descriptions</div>
                <div className="text-xs text-muted-foreground">
                  Each product tag can have a matching description.
                </div>
                <div className="space-y-3">
                  {tags.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      Add tags above to edit their descriptions here.
                    </div>
                  ) : (
                    tags.map((t) => (
                      <div key={t} className="space-y-1">
                        <div className="text-sm font-medium text-foreground">{t}</div>
                        <Textarea
                          value={detail.featureDescriptions[t] ?? ""}
                          onChange={(e) =>
                            setDetail((d) => ({
                              ...d,
                              featureDescriptions: { ...d.featureDescriptions, [t]: e.target.value },
                            }))
                          }
                          className="min-h-20"
                          placeholder={`Description for ${t}`}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="py-0 gap-0">
            <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Problem / Solution</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Problem statement</div>
                <Textarea
                  value={detail.problemStatement}
                  onChange={(e) => setDetail((d) => ({ ...d, problemStatement: e.target.value }))}
                  className="min-h-24"
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Solution statement</div>
                <Textarea
                  value={detail.solutionStatement}
                  onChange={(e) => setDetail((d) => ({ ...d, solutionStatement: e.target.value }))}
                  className="min-h-24"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="py-0 gap-0">
            <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Capabilities + Practical Value</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Capabilities label</div>
                <Input
                  value={detail.capabilitiesLabel}
                  onChange={(e) => setDetail((d) => ({ ...d, capabilitiesLabel: e.target.value }))}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-foreground">Capabilities</div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDetail((d) => ({
                        ...d,
                        capabilities: [...d.capabilities, { title: "", body: "", accent: "primary" }],
                      }))
                    }
                  >
                    Add
                  </Button>
                </div>
                {detail.capabilities.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No capabilities.</div>
                ) : (
                  detail.capabilities.map((cap, idx) => (
                    <Card key={`${cap.title}-${idx}`}>
                      <CardContent className="p-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            value={cap.title}
                            onChange={(e) => updateCapability(idx, { title: e.target.value })}
                            placeholder="Title"
                          />
                          <Select
                            value={cap.accent}
                            onValueChange={(v) =>
                              updateCapability(idx, {
                                accent: v as "primary" | "secondary",
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="primary">primary</SelectItem>
                              <SelectItem value="secondary">secondary</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          value={cap.body}
                          onChange={(e) => updateCapability(idx, { body: e.target.value })}
                          placeholder="Body"
                          className="min-h-20"
                        />
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeCapability(idx)}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-foreground">Practical value</div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDetail((d) => ({
                        ...d,
                        practicalValues: [...d.practicalValues, { icon: "", title: "", subtitle: "" }],
                      }))
                    }
                  >
                    Add
                  </Button>
                </div>
                {detail.practicalValues.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No practical value items.</div>
                ) : (
                  detail.practicalValues.map((pv, idx) => (
                    <Card key={`${pv.title}-${idx}`}>
                      <CardContent className="p-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            value={pv.title}
                            onChange={(e) => updatePracticalValue(idx, { title: e.target.value })}
                            placeholder="Title"
                          />
                          <Input
                            value={pv.subtitle}
                            onChange={(e) => updatePracticalValue(idx, { subtitle: e.target.value })}
                            placeholder="Subtitle"
                          />
                        </div>
                        <Textarea
                          value={pv.icon}
                          onChange={(e) => updatePracticalValue(idx, { icon: e.target.value })}
                          placeholder="SVG path (d=...)"
                          className="min-h-20 font-mono text-xs"
                        />
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removePracticalValue(idx)}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="py-0 gap-0">
            <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Preview hints</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">Marketplace card</span> uses name, code, description, tags, and image.
              </div>
              <div>
                <span className="font-medium text-foreground">Detail page</span> uses all sections on the left.
              </div>
              <div className="text-xs">
                Image upload is saved on <span className="font-medium text-foreground">Save</span>.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

