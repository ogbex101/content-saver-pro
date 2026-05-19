import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useTableData } from "@/hooks/useTableData";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";

const AdminBrands = () => {
  const { data, loading, add, update, remove } = useTableData("brands");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", logo_url: "" as string | null, bg_color: "white" });
  const [adding, setAdding] = useState(false);

  const saveNew = async () => {
    const { error } = await add({ name: form.name || "", logo_url: form.logo_url || null, bg_color: form.bg_color, sort_order: data.length } as any);
    if (!error) { toast.success("Added!"); setAdding(false); setForm({ name: "", logo_url: null, bg_color: "white" }); }
    else toast.error(error.message);
  };

  const saveEdit = async () => {
    if (!editing) return;
    const { error } = await update(editing, { name: form.name || "", logo_url: form.logo_url || null, bg_color: form.bg_color } as any);
    if (!error) { toast.success("Updated!"); setEditing(null); }
    else toast.error(error.message);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await remove(id);
    if (!error) toast.success("Deleted!");
    else toast.error(error.message);
  };

  const BgColorPicker = () => (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-muted-foreground">Background:</span>
      <button
        type="button"
        onClick={() => setForm({ ...form, bg_color: "white" })}
        className={`w-8 h-8 rounded-lg border-2 bg-white ${form.bg_color === "white" ? "border-gold ring-2 ring-gold/30" : "border-border/50"}`}
      />
      <button
        type="button"
        onClick={() => setForm({ ...form, bg_color: "black" })}
        className={`w-8 h-8 rounded-lg border-2 bg-black ${form.bg_color === "black" ? "border-gold ring-2 ring-gold/30" : "border-border/50"}`}
      />
    </div>
  );

  if (loading) return <div className="p-6 text-muted-foreground font-bold">Loading...</div>;

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold">Brands</h2>
          <p className="text-xs text-muted-foreground font-semibold mt-1">Both name and logo are optional. Choose a background color for each brand.</p>
        </div>
        <button onClick={() => { setAdding(true); setForm({ name: "", logo_url: null, bg_color: "white" }); }} className="flex items-center gap-2 gradient-gold text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-lg">
          <Plus size={14} /> Add
        </button>
      </div>

      {adding && (
        <div className="mb-4 p-5 rounded-xl border border-border/50 bg-surface space-y-3">
          <input placeholder="Brand name (optional)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-card text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50" />
          <ImageUpload
            folder="brands"
            currentUrl={form.logo_url}
            label="Upload Logo (optional)"
            compact
            onUpload={(url) => setForm({ ...form, logo_url: url })}
            onRemove={() => setForm({ ...form, logo_url: null })}
          />
          <BgColorPicker />
          <div className="flex gap-2">
            <button onClick={saveNew} className="flex items-center gap-1.5 gradient-gold text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold"><Check size={14} /> Save</button>
            <button onClick={() => setAdding(false)} className="flex items-center gap-1.5 border border-border/50 px-4 py-2 rounded-xl text-sm font-bold"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {data.map((brand) => (
          <div key={brand.id} className="p-4 rounded-xl border border-border/50">
            {editing === brand.id ? (
              <div className="space-y-3">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Brand name (optional)" className="w-full px-3 py-2 rounded-lg border border-border/50 bg-card text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50" />
                <ImageUpload
                  folder="brands"
                  currentUrl={form.logo_url}
                  label="Logo"
                  compact
                  onUpload={(url) => setForm({ ...form, logo_url: url })}
                  onRemove={() => setForm({ ...form, logo_url: null })}
                />
                <BgColorPicker />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="text-gold font-bold text-sm"><Check size={14} /></button>
                  <button onClick={() => setEditing(null)} className="text-sm"><X size={14} /></button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded border border-border/50 flex-shrink-0 ${brand.bg_color === "black" ? "bg-black" : "bg-white"}`} />
                  {brand.logo_url ? (
                    <img src={brand.logo_url} alt={brand.name || "Brand"} className="w-8 h-8 rounded object-contain" />
                  ) : null}
                  <span className="text-sm font-bold">{brand.name || "—"}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(brand.id); setForm({ name: brand.name, logo_url: brand.logo_url, bg_color: brand.bg_color || "white" }); }} className="p-1.5 rounded-lg hover:bg-muted"><Pencil size={12} /></button>
                  <button onClick={() => handleDelete(brand.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={12} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBrands;
