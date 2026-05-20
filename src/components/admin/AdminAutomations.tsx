import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";

interface Automation {
  id: string;
  title: string;
  description: string | null;
  tool: string | null;
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
}

const empty = { title: "", description: "", tool: "", image_url: "", link_url: "" };

const AdminAutomations = () => {
  const [items, setItems] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("automations" as any)
      .select("*")
      .order("sort_order");
    if (error) toast.error(error.message);
    setItems((data as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (item: Automation) => {
    setEditing(item.id);
    setAdding(false);
    setForm({
      title: item.title,
      description: item.description ?? "",
      tool: item.tool ?? "",
      image_url: item.image_url ?? "",
      link_url: item.link_url ?? "",
    });
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setForm(empty);
  };

  const cancel = () => { setAdding(false); setEditing(null); setForm(empty); };

  const save = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      tool: form.tool.trim() || null,
      image_url: form.image_url || null,
      link_url: form.link_url.trim() || null,
    };

    if (editing) {
      const { error } = await supabase.from("automations" as any).update(payload).eq("id", editing);
      if (error) return toast.error(error.message);
      toast.success("Updated!");
    } else {
      const { error } = await supabase.from("automations" as any).insert([{ ...payload, sort_order: items.length }]);
      if (error) return toast.error(error.message);
      toast.success("Added!");
    }
    cancel();
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this automation?")) return;
    const { error } = await supabase.from("automations" as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted!");
    load();
  };

  const FormFields = (
    <div className="space-y-3 p-4 rounded-lg border bg-surface">
      <input
        placeholder="Title (e.g. Client Onboarding Workflow)"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
      />
      <input
        placeholder="Tool (e.g. ClickUp, Notion, Asana)"
        value={form.tool}
        onChange={(e) => setForm({ ...form, tool: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={3}
        className="w-full px-3 py-2 rounded-lg border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold/50"
      />
      <input
        placeholder="Link URL (optional)"
        value={form.link_url}
        onChange={(e) => setForm({ ...form, link_url: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
      />
      <ImageUpload
        folder="automations"
        currentUrl={form.image_url}
        onUpload={(url) => setForm({ ...form, image_url: url })}
        onRemove={() => setForm({ ...form, image_url: "" })}
        label="Cover image"
      />
      <div className="flex gap-2">
        <button onClick={save} className="flex items-center gap-1 bg-gold hover:bg-gold-dark text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-semibold">
          <Check size={14} /> Save
        </button>
        <button onClick={cancel} className="flex items-center gap-1 border px-3 py-1.5 rounded-lg text-sm font-semibold">
          <X size={14} /> Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-gold" />
          <h2 className="text-lg font-bold">Project Management Automations</h2>
        </div>
        {!adding && !editing && (
          <button onClick={startAdd} className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            <Plus size={14} /> Add
          </button>
        )}
      </div>

      {adding && <div className="mb-4">{FormFields}</div>}

      {loading ? (
        <div className="p-6 text-muted-foreground font-semibold">Loading...</div>
      ) : items.length === 0 && !adding ? (
        <div className="p-6 text-center text-muted-foreground font-semibold text-sm">
          No automations yet. Click "Add" to create your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="p-4 rounded-lg border">
              {editing === item.id ? (
                FormFields
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3 flex-1 min-w-0">
                    {item.image_url && (
                      <img src={item.image_url} alt="" className="w-16 h-16 rounded-lg object-cover border flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      {item.tool && <span className="text-[10px] font-bold uppercase tracking-wider text-gold">{item.tool}</span>}
                      <h3 className="font-bold text-sm">{item.title}</h3>
                      {item.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
                      {item.link_url && <a href={item.link_url} target="_blank" rel="noreferrer" className="text-xs text-gold hover:underline mt-1 inline-block">{item.link_url}</a>}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => startEdit(item)} className="p-1.5 rounded hover:bg-muted"><Pencil size={14} /></button>
                    <button onClick={() => remove(item.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAutomations;
