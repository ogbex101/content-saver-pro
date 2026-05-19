import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Star } from "lucide-react";
import { useTableData } from "@/hooks/useTableData";
import { toast } from "sonner";

const emptyForm = { client_name: "", quote: "", rating: 5, date_text: "" };

const AdminTestimonials = () => {
  const { data, loading, add, update, remove } = useTableData("testimonials");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [adding, setAdding] = useState(false);

  const saveNew = async () => {
    const { error } = await add({ ...form, date_text: form.date_text || null, sort_order: data.length } as any);
    if (!error) { toast.success("Added!"); setAdding(false); setForm(emptyForm); }
    else toast.error(error.message);
  };

  const saveEdit = async () => {
    if (!editing) return;
    const { error } = await update(editing, { ...form, date_text: form.date_text || null } as any);
    if (!error) { toast.success("Updated!"); setEditing(null); }
    else toast.error(error.message);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await remove(id);
    if (!error) toast.success("Deleted!");
    else toast.error(error.message);
  };

  const formUI = (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <input placeholder="Client Name" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
        <input placeholder="Date (e.g. Nov 2024)" value={form.date_text} onChange={(e) => setForm({ ...form, date_text: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
      </div>
      <textarea placeholder="Quote" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold/50" />
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Rating:</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setForm({ ...form, rating: n })}>
            <Star size={16} className={n <= form.rating ? "fill-gold text-gold" : "text-muted-foreground"} />
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;

  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">Testimonials</h2>
        <button onClick={() => { setAdding(true); setForm(emptyForm); }} className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={14} /> Add
        </button>
      </div>

      {adding && (
        <div className="mb-4 p-4 rounded-lg border bg-surface">
          {formUI}
          <div className="flex gap-2 mt-3">
            <button onClick={saveNew} className="flex items-center gap-1 bg-gold hover:bg-gold-dark text-primary-foreground px-3 py-1.5 rounded-lg text-sm"><Check size={14} /> Save</button>
            <button onClick={() => setAdding(false)} className="flex items-center gap-1 border px-3 py-1.5 rounded-lg text-sm"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {data.map((t: any) => (
          <div key={t.id} className="p-4 rounded-lg border">
            {editing === t.id ? (
              <>
                {formUI}
                <div className="flex gap-2 mt-3">
                  <button onClick={saveEdit} className="flex items-center gap-1 bg-gold hover:bg-gold-dark text-primary-foreground px-3 py-1.5 rounded-lg text-sm"><Check size={14} /> Save</button>
                  <button onClick={() => setEditing(null)} className="flex items-center gap-1 border px-3 py-1.5 rounded-lg text-sm"><X size={14} /> Cancel</button>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{t.client_name}</span>
                    <div className="flex gap-0.5">{[...Array(t.rating)].map((_, i) => <Star key={i} size={10} className="fill-gold text-gold" />)}</div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">"{t.quote}"</p>
                  {t.date_text && <span className="text-xs text-muted-foreground">{t.date_text}</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(t.id); setForm({ client_name: t.client_name, quote: t.quote, rating: t.rating, date_text: t.date_text ?? "" }); }} className="p-1.5 rounded hover:bg-muted"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;
