"use client";

import * as React from "react";
import Image from "next/image";
import { Loader, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  /** The stored path/URL value (controlled) */
  value: string;
  onChange: (value: string) => void;
  /** Subfolder inside the bucket, e.g. "hero", "blueprint" */
  folder?: string;
  label?: string;
  placeholder?: string;
}

/**
 * Shows a file picker that uploads to /api/admin/services/image and writes
 * the returned public URL back via onChange. Also allows manual URL entry.
 */
export function ImageUploadField({
  value,
  onChange,
  folder = "misc",
  placeholder = "/images/example.png",
}: Props) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);

      const res = await fetch("/api/admin/services/image", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      onChange(json.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          title="Upload image"
        >
          {uploading ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            title="Clear"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {value && (
        <div className="relative h-24 w-full rounded-md border border-border overflow-hidden bg-muted">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-contain"
            unoptimized={value.startsWith("/")}
          />
        </div>
      )}

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
