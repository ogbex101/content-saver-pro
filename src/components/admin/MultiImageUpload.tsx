import { useState, useRef } from "react";
import { Upload, X, Image, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageItem {
  id?: string;
  image_url: string;
  caption?: string;
}

interface Props {
  folder: string;
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  label?: string;
}

const MultiImageUpload = ({ folder, images, onChange, label = "Gallery Images" }: Props) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const validFiles = files.filter(f => {
      if (!f.type.startsWith("image/")) { toast.error(`${f.name} is not an image`); return false; }
      if (f.size > 5 * 1024 * 1024) { toast.error(`${f.name} exceeds 5MB`); return false; }
      return true;
    });

    if (validFiles.length === 0) return;
    setUploading(true);

    const newImages: ImageItem[] = [];
    for (const file of validFiles) {
      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("portfolio").upload(fileName, file);
      if (error) { toast.error(`Failed: ${file.name}`); continue; }
      const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(fileName);
      newImages.push({ image_url: publicUrl });
    }

    onChange([...images, ...newImages]);
    toast.success(`${newImages.length} image(s) uploaded!`);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-2 block">{label}</label>
      <div className="flex flex-wrap gap-2">
        {images.map((img, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border flex-shrink-0">
            <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            <button onClick={() => removeImage(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-primary-foreground rounded-full flex items-center justify-center">
              <X size={10} />
            </button>
          </div>
        ))}
        <label className="cursor-pointer flex flex-col items-center justify-center w-20 h-20 rounded-lg border-2 border-dashed hover:border-gold/50 transition-colors flex-shrink-0">
          {uploading ? (
            <span className="text-[10px] text-muted-foreground">Uploading...</span>
          ) : (
            <>
              <Plus size={16} className="text-muted-foreground mb-0.5" />
              <span className="text-[10px] text-muted-foreground">Add</span>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>
    </div>
  );
};

export default MultiImageUpload;
