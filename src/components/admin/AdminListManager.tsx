import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useTableData } from "@/hooks/useTableData";
import { toast } from "sonner";

interface Props {
  table: "services" | "skills";
  label: string;
}

const AdminListManager = ({ table, label }: Props) => {
  const { data, loading, add, update, remove } = useTableData(table);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", icon: "Pen" });
  const [adding, setAdding] = useState(false);

  const startEdit = (item: any) => {
    setEditing(item.id);
    setForm({ title: item.title, description: item.description, icon: item.icon });
  };

  const saveEdit = async () => {
    if (!editing) return;
    const { error } = await update(editing, form as any);
    if (!error) { toast.success("Updated!"); setEditing(null); }
    else toast.error(error.message);
  };

  const saveNew = async () => {
    const { error } = await add({ ...form, sort_order: data.length } as any);
    if (!error) { toast.success("Added!"); setAdding(false); setForm({ title: "", description: "", icon: "Pen" }); }
    else toast.error(error.message);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await remove(id);
    if (!error) toast.success("Deleted!");
    else toast.error(error.message);
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;

  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">{label}</h2>
        <button onClick={() => { setAdding(true); setForm({ title: "", description: "", icon: "Pen" }); }} className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={14} /> Add
        </button>
      </div>

      {adding && (
        <div className="mb-4 p-4 rounded-lg border bg-surface space-y-3">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold/50" />
          <input placeholder="Icon name (e.g. Pen, Mail, Settings)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
          <div className="flex gap-2">
            <button onClick={saveNew} className="flex items-center gap-1 bg-gold hover:bg-gold-dark text-primary-foreground px-3 py-1.5 rounded-lg text-sm"><Check size={14} /> Save</button>
            <button onClick={() => setAdding(false)} className="flex items-center gap-1 border px-3 py-1.5 rounded-lg text-sm"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {data.map((item: any) => (
          <div key={item.id} className="p-4 rounded-lg border">
            {editing === item.id ? (
              <div className="space-y-3">
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold/50" />
                <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="flex items-center gap-1 bg-gold hover:bg-gold-dark text-primary-foreground px-3 py-1.5 rounded-lg text-sm"><Check size={14} /> Save</button>
                  <button onClick={() => setEditing(null)} className="flex items-center gap-1 border px-3 py-1.5 rounded-lg text-sm"><X size={14} /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  <span className="text-xs text-gold mt-1 inline-block">Icon: {item.icon}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(item)} className="p-1.5 rounded hover:bg-muted"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminListManager;
