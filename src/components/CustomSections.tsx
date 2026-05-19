// Renders custom sections created from the admin panel.
// Stub for this turn — full layout switcher lands next turn.
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface CustomSection {
  id: string;
  title: string;
  subtitle: string | null;
  layout: "grid" | "carousel" | "list" | "cards";
  items: Array<{ title: string; description?: string; image_url?: string; link?: string }>;
  sort_order: number;
}

const CustomSections = () => {
  const [sections, setSections] = useState<CustomSection[]>([]);

  useEffect(() => {
    supabase
      .from("custom_sections" as any)
      .select("*")
      .eq("published", true)
      .order("sort_order")
      .then(({ data }) => setSections((data as any) ?? []));
  }, []);

  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((s) => (
        <section key={s.id} className="py-24 bg-background">
          <div className="container mx-auto px-5 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-black">{s.title}</h2>
              {s.subtitle && <p className="text-muted-foreground mt-3 font-semibold max-w-2xl mx-auto">{s.subtitle}</p>}
            </motion.div>
            <div className={`max-w-6xl mx-auto ${s.layout === "list" ? "space-y-4" : "grid md:grid-cols-2 lg:grid-cols-3 gap-6"}`}>
              {s.items?.map((it, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:border-gold/50 transition-colors">
                  {it.image_url && <img src={it.image_url} alt={it.title} className="w-full aspect-[16/10] object-cover rounded-lg mb-4" />}
                  <h3 className="font-bold text-base mb-1">{it.title}</h3>
                  {it.description && <p className="text-sm text-muted-foreground">{it.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default CustomSections;
