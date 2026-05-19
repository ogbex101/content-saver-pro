import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Star as StarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";
import MultiImageUpload from "./MultiImageUpload";

type Project = any;

const emptyForm = {
  title: "", industry: "", platform: "", key_result: "", description: "",
  figma_link: "", figma_preview_url: "" as string | null, featured_image_url: "" as string | null,
  featured_on_homepage: true,
};
const emptyResult = { label: "", value: "" };

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);
  const [galleryImages, setGalleryImages] = useState<{ id?: string; image_url: string; caption?: string }[]>([]);
  const [adding, setAdding] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase.from("projects").select("*, project_results(*), project_images(*)").order("sort_order");
    setProjects(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const startEdit = (p: Project) => {
    setEditing(p.id);
    setForm({
      title: p.title, industry: p.industry, platform: p.platform, key_result: p.key_result,
      description: p.description, figma_link: p.figma_link ?? "", figma_preview_url: p.figma_preview_url ?? null,
      featured_image_url: p.featured_image_url ?? null, featured_on_homepage: p.featured_on_homepage ?? true,
    });
    setResults(p.project_results?.map((r: any) => ({ label: r.label, value: r.value })) ?? []);
    setGalleryImages(p.project_images?.map((img: any) => ({ id: img.id, image_url: img.image_url, caption: img.caption })) ?? []);
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from("projects").update({ featured_on_homepage: !current } as any).eq("id", id);
    if (!error) { toast.success(!current ? "Featured on homepage" : "Removed from homepage"); await fetchProjects(); }
    else toast.error(error.message);
  };

  const saveProject = async (isNew: boolean) => {
    const payload = {
      title: form.title, industry: form.industry, platform: form.platform,
      key_result: form.key_result, description: form.description,
      figma_link: form.figma_link || null, figma_preview_url: form.figma_preview_url || null,
      featured_image_url: form.featured_image_url || null, featured_on_homepage: form.featured_on_homepage,
    };

    if (isNew) {
      const { data, error } = await supabase.from("projects").insert({ ...payload, sort_order: projects.length } as any).select().single();
      if (error) { toast.error(error.message); return; }
      if (results.length > 0 && data) {
        await supabase.from("project_results").insert(results.map((r, i) => ({ project_id: data.id, label: r.label, value: r.value, sort_order: i })));
      }
      if (galleryImages.length > 0 && data) {
        await supabase.from("project_images").insert(galleryImages.map((img, i) => ({ project_id: data.id, image_url: img.image_url, caption: img.caption || null, sort_order: i })) as any);
      }
      toast.success("Project added!");
      setAdding(false);
    } else if (editing) {
      const { error } = await supabase.from("projects").update(payload as any).eq("id", editing);
      if (error) { toast.error(error.message); return; }
      await supabase.from("project_results").delete().eq("project_id", editing);
      if (results.length > 0) {
        await supabase.from("project_results").insert(results.map((r, i) => ({ project_id: editing, label: r.label, value: r.value, sort_order: i })));
      }
      await (supabase.from("project_images") as any).delete().eq("project_id", editing);
      if (galleryImages.length > 0) {
        await supabase.from("project_images").insert(galleryImages.map((img, i) => ({ project_id: editing, image_url: img.image_url, caption: img.caption || null, sort_order: i })) as any);
      }
      toast.success("Updated!");
      setEditing(null);
    }
    setForm(emptyForm);
    setResults([]);
    setGalleryImages([]);
    await fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) { toast.success("Deleted!"); await fetchProjects(); }
    else toast.error(error.message);
  };

  const formFields = (
    <div className="space-y-4">
      <ImageUpload
        folder="projects"
        currentUrl={form.featured_image_url}
        label="Featured Image"
        onUpload={(url) => setForm({ ...form, featured_image_url: url })}
        onRemove={() => setForm({ ...form, featured_image_url: null })}
      />
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.featured_on_homepage}
          onChange={(e) => setForm({ ...form, featured_on_homepage: e.target.checked })}
          className="w-4 h-4 rounded accent-gold"
        />
        <span className="text-sm font-bold">⭐ Feature on Homepage</span>
      </label>
      <div className="grid md:grid-cols-2 gap-3">
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-card text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50" />
        <input placeholder="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-card text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50" />
        <input placeholder="Platform" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-card text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50" />
        <input placeholder="Key Result" value={form.key_result} onChange={(e) => setForm({ ...form, key_result: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-card text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50" />
      </div>
      <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-card text-sm font-semibold resize-none focus:outline-none focus:ring-2 focus:ring-gold/50" />
      <div className="grid md:grid-cols-2 gap-3">
        <input placeholder="Figma Link (optional)" value={form.figma_link} onChange={(e) => setForm({ ...form, figma_link: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-card text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50" />
        <ImageUpload
          folder="projects/figma"
          currentUrl={form.figma_preview_url}
          label="Figma Preview Image"
          compact
          onUpload={(url) => setForm({ ...form, figma_preview_url: url })}
          onRemove={() => setForm({ ...form, figma_preview_url: null })}
        />
      </div>

      <MultiImageUpload
        folder="projects/gallery"
        images={galleryImages}
        onChange={setGalleryImages}
        label="Gallery Screenshots"
      />

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-muted-foreground">Key Results</span>
          <button onClick={() => setResults([...results, { ...emptyResult }])} className="text-xs text-gold hover:underline font-bold">+ Add Result</button>
        </div>
        {results.map((r, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input placeholder="Label" value={r.label} onChange={(e) => { const nr = [...results]; nr[i].label = e.target.value; setResults(nr); }} className="flex-1 px-3 py-2 rounded-lg border border-border/50 bg-card text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50" />
            <input placeholder="Value" value={r.value} onChange={(e) => { const nr = [...results]; nr[i].value = e.target.value; setResults(nr); }} className="flex-1 px-3 py-2 rounded-lg border border-border/50 bg-card text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50" />
            <button onClick={() => setResults(results.filter((_, j) => j !== i))} className="text-destructive"><X size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) return <div className="p-6 text-muted-foreground font-bold">Loading...</div>;

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Portfolio Projects</h2>
        <button onClick={() => { setAdding(true); setForm(emptyForm); setResults([]); setGalleryImages([]); }} className="flex items-center gap-2 gradient-gold text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-lg">
          <Plus size={14} /> Add Project
        </button>
      </div>

      {adding && (
        <div className="mb-4 p-5 rounded-xl border border-border/50 bg-surface">
          {formFields}
          <div className="flex gap-2 mt-4">
            <button onClick={() => saveProject(true)} className="flex items-center gap-1.5 gradient-gold text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold"><Check size={14} /> Save</button>
            <button onClick={() => setAdding(false)} className="flex items-center gap-1.5 border border-border/50 px-4 py-2 rounded-xl text-sm font-bold"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="p-4 rounded-xl border border-border/50">
            {editing === p.id ? (
              <>
                {formFields}
                <div className="flex gap-2 mt-4">
                  <button onClick={() => saveProject(false)} className="flex items-center gap-1.5 gradient-gold text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold"><Check size={14} /> Save</button>
                  <button onClick={() => setEditing(null)} className="flex items-center gap-1.5 border border-border/50 px-4 py-2 rounded-xl text-sm font-bold"><X size={14} /> Cancel</button>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  {p.featured_image_url && (
                    <img src={p.featured_image_url} alt={p.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-sm">{p.title}</h3>
                      {p.featured_on_homepage && <span className="text-xs gradient-gold text-primary-foreground px-2 py-0.5 rounded-full font-bold">⭐ Featured</span>}
                    </div>
                    <p className="text-xs text-muted-foreground font-bold">{p.industry} • {p.platform}</p>
                    <span className="text-xs text-gold font-bold">{p.key_result}</span>
                    {p.project_images && p.project_images.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1 font-bold">{p.project_images.length} gallery image(s)</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggleFeatured(p.id, p.featured_on_homepage)} className="p-1.5 rounded-lg hover:bg-muted" title="Toggle homepage feature">
                    <StarIcon size={14} className={p.featured_on_homepage ? "fill-gold text-gold" : "text-muted-foreground"} />
                  </button>
                  <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg hover:bg-muted"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;