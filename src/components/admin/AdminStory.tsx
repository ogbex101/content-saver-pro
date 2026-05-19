import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";
import { toast } from "sonner";

const AdminStory = () => {
  const [story, setStory] = useState("");
  const [profileId, setProfileId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("profile").select("id, my_story").limit(1).single().then(({ data }) => {
      if (data) {
        setProfileId(data.id);
        setStory((data as any).my_story ?? "");
      }
    });
  }, []);

  const save = async () => {
    if (!profileId) return;
    setSaving(true);
    const { error } = await supabase.from("profile").update({ my_story: story } as any).eq("id", profileId);
    if (!error) toast.success("Story saved!");
    else toast.error(error.message);
    setSaving(false);
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold">My Story</h2>
          <p className="text-sm text-muted-foreground font-semibold mt-1">Write your personal narrative. Separate paragraphs with blank lines.</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 gradient-gold text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 hover:shadow-lg">
          <Save size={14} /> Save
        </button>
      </div>
      <textarea
        value={story}
        onChange={(e) => setStory(e.target.value)}
        rows={20}
        placeholder="Write your story here... Use blank lines between paragraphs.

Example:
It all started with a curiosity that I couldn't shake — a deep desire to understand how words could move people to action.

Four years later, I've helped over 130 clients across multiple industries..."
        className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background text-sm font-semibold resize-none focus:outline-none focus:ring-2 focus:ring-gold/50 leading-relaxed"
      />
    </div>
  );
};

export default AdminStory;