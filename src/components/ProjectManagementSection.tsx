// Stub: full implementation lands in next turn.
// Renders nothing until the admin creates automations in the upcoming admin tab.
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";

interface Automation {
  id: string;
  title: string;
  description: string | null;
  tool: string | null;
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
}

const ProjectManagementSection = () => {
  const [items, setItems] = useState<Automation[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("automations" as any)
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        setItems((data as any) ?? []);
        setLoaded(true);
      });
  }, []);

  if (!loaded || items.length === 0) return null;

  return (
    <section id="automations" className="py-24 md:py-32 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 gradient-radial opacity-60 pointer-events-none" />
      <div className="container mx-auto px-5 md:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-bold inline-flex items-center gap-2">
            <Zap size={12} /> Workflow & Systems
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4">Project Management Automation</h2>
          <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto font-semibold">
            Smart systems and automations that keep projects on track, on time, and on budget.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-gold/50 hover:shadow-xl hover:shadow-gold/10 transition-all duration-500"
            >
              {a.image_url && (
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img src={a.image_url} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}
              <div className="p-6">
                {a.tool && <span className="text-[10px] font-bold uppercase tracking-wider text-gold">{a.tool}</span>}
                <h3 className="font-bold text-lg mt-2 mb-2 group-hover:text-gold transition-colors">{a.title}</h3>
                {a.description && <p className="text-sm text-muted-foreground font-medium leading-relaxed">{a.description}</p>}
                {a.link_url && (
                  <a href={a.link_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gold">
                    See it in action <ArrowRight size={11} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectManagementSection;
