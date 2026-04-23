"use client";

import * as React from "react";
import { ImageIcon, Loader, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@supabase/supabase-js";

interface Props {
  value: string;
  onChange: (value: string) => void;
  folder?: string;
  placeholder?: string;
  bucket?: string;
}

async function uploadDirect(file: File, folder: string, bucket: string): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const ext = file.name.split(".").pop() ?? "png";
  const path = `${folder}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function ImageUploadField({
  value,
  onChange,
  folder = "misc",
  placeholder = "https:// or /images/example.png",
  bucket = "service-images",
}: Props) {
  const [uploading, setUploading] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadDirect(file, folder, bucket);
      onChange(url);
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-contain p-2"
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
