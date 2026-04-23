"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, Loader, Save } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ProductCtaType, ProductDetail } from "@/features/products/hooks/useProductsAdmin";
import {
  useAdminProduct,
  useUpsertProduct,
  usePatchProduct,
  useUploadProductImage,
} from "@/features/products/hooks/useProductsAdmin";

type Props =
  | { readonly mode: "create"; readonly productId?: never }
  | { readonly mode: "edit"; readonly productId: string };

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

function parseLines(val: string) {
  return val.split("\n").map((s) => s.trim()).filter(Boolean);
}

function stringifyLines(arr: string[]) {
  return (arr ?? []).join("\n");
}

export function AdminProductEditorPage(props: Props) {
  const router = useRouter();
  const isEdit = props.mode === "edit";

  const { data: existing, isLoading } = useAdminProduct(isEdit ? props.productId : "");
  const upsertMutation = useUpsertProduct();
  const patchMutation = usePatchProduct();
  const uploadMutation = useUploadProductImage();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [product, setProduct] = useState({
    id: "", name: "", code: "", description: "", category: "",
    tagsCsv: "", ctaType: "waitlist" as ProductCtaType,
    isPublished: true, imagePath: null as string | null, imageUrl: "",
  });
  const [detail, setDetail] = useState<ProductDetail>(emptyDetail());

  // Populate form when existing data loads
  useEffect(() => {
    if (!existing) return;
    setProduct({
      id: existing.product.id,
      name: existing.product.name,
      code: existing.product.code,
      description: existing.product.description,
      category: existing.product.category,
      tagsCsv: existing.product.tags.join(", "),
      ctaType: existing.product.ctaType,
      isPublished: existing.product.isPublished,
      imagePath: existing.product.imagePath,
      imageUrl: existing.product.imageUrl ?? "",
    });
    setDetail(existing.detail);
  }, [existing]);

  const tags = useMemo(
    () => product.tagsCsv.split(",").map((t) => t.trim()).filter(Boolean),
    [product.tagsCsv],
  );

  const isSaving = upsertMutation.isPending || patchMutation.isPending || uploadMutation.isPending;

  async function save() {
    try {
      const id = isEdit ? props.productId : product.id.trim();
      if (!id) { toast.error("Product ID is required"); return; }

      if (isEdit) {
        await upsertMutation.mutateAsync({
          id,
          name: product.name,
          code: product.code,
          description: product.description,
          category: product.category,
          tags,
          ctaType: product.ctaType,
          isPublished: product.isPublished,
          detail,
        });
      } else {
        await upsertMutation.mutateAsync({ id, name: product.name, code: product.code, description: product.description, category: product.category, tags, ctaType: product.ctaType, isPublished: product.isPublished, detail });
      }

      if (imageFile) {
        await uploadMutation.mutateAsync({ id, file: imageFile });
        setImageFile(null);
      }

      toast.success(isEdit ? "Product updated." : "Product created.");
      router.push(`/admin/products/${encodeURIComponent(id)}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  function updateCapability(idx: number, patch: Partial<{ title: string; body: string; accent: "primary" | "secondary" }>) {
    setDetail((d) => ({ ...d, capabilities: d.capabilities.map((c, i) => (i === idx ? { ...c, ...patch } : c)) }));
  }
  function removeCapability(idx: number) {
    setDetail((d) => ({ ...d, capabilities: d.capabilities.filter((_, i) => i !== idx) }));
  }
  function updatePracticalValue(idx: number, patch: Partial<{ icon: string; title: string; subtitle: string }>) {
    setDetail((d) => ({ ...d, practicalValues: d.practicalValues.map((x, i) => (i === idx ? { ...x, ...patch } : x)) }));
  }
  function removePracticalValue(idx: number) {
    setDetail((d) => ({ ...d, practicalValues: d.practicalValues.filter((_, i) => i !== idx) }));
  }

  if (isEdit && isLoading) {
    return <div className="flex justify-center py-20"><Loader className="animate-spin text-primary" size={28} /></div>;
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
              {isEdit ? `Edit: ${product.id}` : "New Product"}
            </h1>
            <p className="text-sm text-muted-foreground">Marketplace fields + full detail-page content.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="space-y-6">
        <Card className="py-0 gap-0">
            <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Basic info</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">ID (slug)</div>
                  <Input value={product.id} onChange={(e) => setProduct((p) => ({ ...p, id: e.target.value }))} placeholder="e.g. dtmp" disabled={isEdit} />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Code</div>
                  <Input value={product.code} onChange={(e) => setProduct((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. DTMP" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Name</div>
                <Input value={product.name} onChange={(e) => setProduct((p) => ({ ...p, name: e.target.value }))} placeholder="Product name" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Category</div>
                <Input value={product.category} onChange={(e) => setProduct((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. Platform" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Description</div>
                <Textarea value={product.description} onChange={(e) => setProduct((p) => ({ ...p, description: e.target.value }))} placeholder="Short description" className="min-h-24" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Tags (comma-separated)</div>
                <Input value={product.tagsCsv} onChange={(e) => setProduct((p) => ({ ...p, tagsCsv: e.target.value }))} placeholder="Architecture-led, Data-driven" />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                  </div>
                )}
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
                <Textarea value={stringifyLines(detail.aboutParagraphs)} onChange={(e) => setDetail((d) => ({ ...d, aboutParagraphs: parseLines(e.target.value) }))} className="min-h-28" />
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">Feature descriptions — one per tag</div>
                {tags.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Add tags above to edit descriptions.</div>
                ) : tags.map((t) => (
                  <div key={t} className="space-y-1">
                    <div className="text-sm font-medium">{t}</div>
                    <Textarea value={detail.featureDescriptions[t] ?? ""} onChange={(e) => setDetail((d) => ({ ...d, featureDescriptions: { ...d.featureDescriptions, [t]: e.target.value } }))} className="min-h-20" placeholder={`Description for ${t}`} />
                  </div>
                ))}
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
                <Textarea value={detail.problemStatement} onChange={(e) => setDetail((d) => ({ ...d, problemStatement: e.target.value }))} className="min-h-24" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Solution statement</div>
                <Textarea value={detail.solutionStatement} onChange={(e) => setDetail((d) => ({ ...d, solutionStatement: e.target.value }))} className="min-h-24" />
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
                <Input value={detail.capabilitiesLabel} onChange={(e) => setDetail((d) => ({ ...d, capabilitiesLabel: e.target.value }))} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Capabilities</div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setDetail((d) => ({ ...d, capabilities: [...d.capabilities, { title: "", body: "", accent: "primary" as const }] }))}>Add</Button>
                </div>
                {detail.capabilities.map((cap, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input value={cap.title} onChange={(e) => updateCapability(idx, { title: e.target.value })} placeholder="Title" />
                        <Select value={cap.accent} onValueChange={(v) => updateCapability(idx, { accent: v as "primary" | "secondary" })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary">primary</SelectItem>
                            <SelectItem value="secondary">secondary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea value={cap.body} onChange={(e) => updateCapability(idx, { body: e.target.value })} placeholder="Body" className="min-h-20" />
                      <div className="flex justify-end">
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeCapability(idx)}>Remove</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Practical value</div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setDetail((d) => ({ ...d, practicalValues: [...d.practicalValues, { icon: "", title: "", subtitle: "" }] }))}>Add</Button>
                </div>
                {detail.practicalValues.map((pv, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input value={pv.title} onChange={(e) => updatePracticalValue(idx, { title: e.target.value })} placeholder="Title" />
                        <Input value={pv.subtitle} onChange={(e) => updatePracticalValue(idx, { subtitle: e.target.value })} placeholder="Subtitle" />
                      </div>
                      <Textarea value={pv.icon} onChange={(e) => updatePracticalValue(idx, { icon: e.target.value })} placeholder="SVG path (d=...)" className="min-h-20 font-mono text-xs" />
                      <div className="flex justify-end">
                        <Button type="button" variant="destructive" size="sm" onClick={() => removePracticalValue(idx)}>Remove</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right sticky panel ── */}
        <div className="space-y-4 xl:sticky xl:top-6">
          <Card className="py-0 gap-0">
            <CardHeader className="px-4 py-3 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-sm">Status</h2>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Published</span>
                <Switch checked={product.isPublished} onCheckedChange={(v) => setProduct((p) => ({ ...p, isPublished: v }))} />
              </div>
              <Separator />
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">CTA Type</div>
                <Select value={product.ctaType} onValueChange={(v) => setProduct((p) => ({ ...p, ctaType: v as ProductCtaType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waitlist">waitlist</SelectItem>
                    <SelectItem value="demo">demo</SelectItem>
                    <SelectItem value="tour">tour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="py-0 gap-0">
            <CardHeader className="px-4 py-3 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-sm">Product Image</h2>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {product.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt="Product" className="w-full rounded-md object-cover aspect-video border border-border" />
              )}
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              {imageFile && <p className="text-xs text-muted-foreground truncate">{imageFile.name}</p>}
              {product.imagePath && !imageFile && (
                <p className="text-xs text-muted-foreground flex items-center gap-1"><ImageIcon size={12} />{product.imagePath}</p>
              )}
            </CardContent>
          </Card>

          <Button onClick={save} disabled={isSaving} className="w-full">
            {isSaving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "Saving…" : "Save Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}
