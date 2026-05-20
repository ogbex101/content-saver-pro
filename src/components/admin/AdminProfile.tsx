import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Save } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";
import MultiImageUpload from "./MultiImageUpload";

const AdminProfile = () => {
  const [profile, setProfile] = useState<(Tables<"profile"> & { hero_images?: string[]; hero_rotation_enabled?: boolean; my_story?: string; slideshow_interval_seconds?: number }) | null>(null);
  const [contact, setContact] = useState<Tables<"contact_info"> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("profile").select("*").limit(1).single().then(({ data }) => setProfile(data as any));
    supabase.from("contact_info").select("*").limit(1).single().then(({ data }) => setContact(data));
  }, []);

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    const heroImages = (profile as any).hero_images ?? [];
    const { error } = await supabase.from("profile").update({
      name: profile.name,
      title: profile.title,
      location: profile.location,
      hero_tagline: profile.hero_tagline,
      hero_intro: profile.hero_intro,
      about_text: profile.about_text,
      about_intro: (profile as any).about_intro ?? "",
      profile_image_url: profile.profile_image_url,
      projects_completed: profile.projects_completed,
      happy_clients: profile.happy_clients,
      five_star_reviews: profile.five_star_reviews,
      case_studies: profile.case_studies,
      hero_images: heroImages,
      hero_rotation_enabled: (profile as any).hero_rotation_enabled ?? false,
      slideshow_interval_seconds: (profile as any).slideshow_interval_seconds ?? 5,
      slideshow_transition: (profile as any).slideshow_transition ?? "slide",
    } as any).eq("id", profile.id);
    if (!error) toast.success("Profile saved!");
    else toast.error(error.message);
    setSaving(false);
  };

  const saveContact = async () => {
    if (!contact) return;
    setSaving(true);
    const { error } = await supabase.from("contact_info").update({
      phone: contact.phone,
      email: contact.email,
      instagram_url: contact.instagram_url,
      linkedin_url: contact.linkedin_url,
      pinterest_url: contact.pinterest_url,
    }).eq("id", contact.id);
    if (!error) toast.success("Contact info saved!");
    else toast.error(error.message);
    setSaving(false);
  };

  if (!profile || !contact) return <div className="p-6 text-muted-foreground font-bold">Loading...</div>;

  const field = (label: string, value: string, onChange: (v: string) => void, textarea = false) => (
    <div key={label}>
      <label className="text-xs font-bold text-muted-foreground mb-1.5 block">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={5} className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-card text-sm font-semibold resize-none focus:outline-none focus:ring-2 focus:ring-gold/50" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-card text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50" />
      )}
    </div>
  );

  const numField = (label: string, value: number, onChange: (v: number) => void) => (
    <div key={label}>
      <label className="text-xs font-bold text-muted-foreground mb-1.5 block">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)} className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-card text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50" />
    </div>
  );

  const heroImages: string[] = (profile as any).hero_images ?? [];

  return (
    <div className="space-y-8">
      {/* Profile */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Profile & About</h2>
          <button onClick={saveProfile} disabled={saving} className="flex items-center gap-2 gradient-gold text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 hover:shadow-lg">
            <Save size={14} /> Save
          </button>
        </div>
        
        {/* Profile Image Upload */}
        <div className="mb-6">
          <ImageUpload
            folder="profile"
            currentUrl={profile.profile_image_url}
            label="Profile Photo"
            onUpload={(url) => setProfile({ ...profile, profile_image_url: url })}
            onRemove={() => setProfile({ ...profile, profile_image_url: null })}
          />
        </div>

        {/* Hero Rotation Images */}
        <div className="mb-6 p-4 rounded-xl bg-surface border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold">Hero Photo Rotation</h3>
              <p className="text-xs text-muted-foreground font-semibold">Upload up to 3 photos. A random one will show on each page load.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(profile as any).hero_rotation_enabled ?? false}
                onChange={(e) => setProfile({ ...profile, hero_rotation_enabled: e.target.checked } as any)}
                className="w-4 h-4 rounded accent-gold"
              />
              <span className="text-xs font-bold">Enable</span>
            </label>
          </div>
          <MultiImageUpload
            folder="profile/hero"
            images={heroImages.map(url => ({ image_url: url }))}
            onChange={(imgs) => setProfile({ ...profile, hero_images: imgs.slice(0, 3).map(i => i.image_url) } as any)}
            label="Hero Photos (max 3)"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {field("Name", profile.name, (v) => setProfile({ ...profile, name: v }))}
          {field("Title", profile.title, (v) => setProfile({ ...profile, title: v }))}
          {field("Location", profile.location, (v) => setProfile({ ...profile, location: v }))}
          {field("Hero Tagline", profile.hero_tagline, (v) => setProfile({ ...profile, hero_tagline: v }))}
        </div>
        <div className="mt-4 space-y-4">
          {field("Hero Intro", profile.hero_intro, (v) => setProfile({ ...profile, hero_intro: v }), true)}
          {field("About Intro (bold line in About section)", (profile as any).about_intro ?? "", (v) => setProfile({ ...profile, about_intro: v } as any))}
          {field("About Text", profile.about_text, (v) => setProfile({ ...profile, about_text: v }), true)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {numField("Projects Completed", profile.projects_completed, (v) => setProfile({ ...profile, projects_completed: v }))}
          {numField("Happy Clients", profile.happy_clients, (v) => setProfile({ ...profile, happy_clients: v }))}
          {numField("Five-Star Reviews", profile.five_star_reviews, (v) => setProfile({ ...profile, five_star_reviews: v }))}
          {numField("Case Studies", profile.case_studies, (v) => setProfile({ ...profile, case_studies: v }))}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-surface border border-border/50">
          <h3 className="text-sm font-bold mb-1">Featured Projects Slideshow</h3>
          <p className="text-xs text-muted-foreground font-semibold mb-3">How many seconds each project stays visible before the slideshow advances.</p>
          <div className="max-w-xs">
            {numField(
              "Interval (seconds)",
              (profile as any).slideshow_interval_seconds ?? 5,
              (v) => setProfile({ ...profile, slideshow_interval_seconds: Math.max(1, v) } as any)
            )}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Contact Information</h2>
          <button onClick={saveContact} disabled={saving} className="flex items-center gap-2 gradient-gold text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 hover:shadow-lg">
            <Save size={14} /> Save
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {field("Phone", contact.phone, (v) => setContact({ ...contact, phone: v }))}
          {field("Email", contact.email, (v) => setContact({ ...contact, email: v }))}
          {field("Instagram URL", contact.instagram_url ?? "", (v) => setContact({ ...contact, instagram_url: v }))}
          {field("LinkedIn URL", contact.linkedin_url ?? "", (v) => setContact({ ...contact, linkedin_url: v }))}
          {field("Pinterest URL", contact.pinterest_url ?? "", (v) => setContact({ ...contact, pinterest_url: v }))}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;