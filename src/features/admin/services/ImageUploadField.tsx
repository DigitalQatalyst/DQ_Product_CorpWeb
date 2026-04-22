"use client";

import * as React from "react";
import Image from "next/image";
import { ImageIcon, Loader, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadServiceImage } from "@/features/services/api/serviceImages.admin";

interface Props {
  value: string;
  onChange: (value: string) => void;
  /** Subfolder inside the service-images bucket, e.g. "hero", "blueprint" */
  folder?: string;
  placeholder?: string;
}

export function ImageUploadField({
  value,
  onChange,
  folder = "misc",
  placeholder = "https:// or /images/example.png",
}: Props) {
  const [uploading, setUploading] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const result = await uploadServiceImage(file, folder);
      onChange(result.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      {/* Drop zone / preview */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`
          relative flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed
          transition-colors cursor-pointer overflow-hidden
          ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"}
          ${value ? "h-40" : "h-28"}
        `}
      >
        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10 gap-2">
            <Loader size={24} className="animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Uploading…</span>
          </div>
        )}

        {value ? (
          <>
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-contain p-2"
              unoptimized={value.startsWith("/")}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <Upload size={16} /> Replace image
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground pointer-events-none select-none">
            <ImageIcon size={28} strokeWidth={1.5} />
            <p className="text-sm font-medium">Drop image here or click to upload</p>
            <p className="text-xs">JPEG, PNG, WebP, GIF · max 5 MB</p>
          </div>
        )}
      </div>

      {/* URL input row */}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-xs h-8"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-2 shrink-0"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          title="Upload image"
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
            title="Clear"
          >
            <X size={14} />
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
