import { useState, useRef } from "react";
import { Upload, X, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  folder: string;
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  className?: string;
  compact?: boolean;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];

const ImageUpload = ({ folder, currentUrl, onUpload, onRemove, label = "Upload Image", className = "", compact = false }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPG, PNG, GIF, WebP, or SVG image.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from("portfolio").upload(fileName, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(fileName);
      setPreview(publicUrl);
      onUpload(publicUrl);
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error("Upload failed: " + (err.message || "Unknown error"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {preview ? (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border flex-shrink-0">
            <img src={preview} alt="" className="w-full h-full object-cover" />
            <button onClick={handleRemove} className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
              <X size={10} />
            </button>
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg border-2 border-dashed flex items-center justify-center flex-shrink-0 text-muted-foreground">
            <Image size={16} />
          </div>
        )}
        <label className="cursor-pointer text-xs text-gold hover:underline font-medium">
          {uploading ? "Uploading..." : preview ? "Change" : label}
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="" className="w-32 h-32 rounded-xl object-cover border" />
          <button onClick={handleRemove} className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow">
            <X size={12} />
          </button>
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed hover:border-gold/50 transition-colors">
          <Upload size={20} className="text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground">{uploading ? "Uploading..." : "Click to upload"}</span>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
