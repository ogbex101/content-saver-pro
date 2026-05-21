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
  category: string;
}

const Track = ({ items, reverse = false }: { items: Automation[]; reverse?: boolean }) => {
  const loop = [...items, ...items];
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <div
        className={`flex gap-5 w-max ${reverse ? "animate-marquee-ltr" : "animate-marquee-rtl"} hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${Math.max(24, items.length * 6)}s` }}
      >
        {loop.map((a, i) => (
          <div
            key={`${a.id}-${i}`}
            className="group w-[260px] sm:w-[300px] md:w-[340px] flex-shrink-0 bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-gold/50 hover:shadow-xl hover:shadow-gold/10 transition-all duration-500"
          >
            {a.image_url && (
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={a.image_url}
                  alt={a.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}
            <div className="p-4">
              {a.tool && <span className="text-[10px] font-bold uppercase tracking-wider text-gold">{a.tool}</span>}
              <h3 className="font-bold text-sm md:text-base mt-1 mb-1.5 line-clamp-1 group-hover:text-gold transition-colors">{a.title}</h3>
              {a.description && <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">{a.description}</p>}
              {a.link_url && (
                <a href={a.link_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gold">
                  See it in action <ArrowRight size={11} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SubSection = ({ title, items, reverse }: { title: string; items: Automation[]; reverse?: boolean }) => {
  if (items.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, x: reverse ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mb-12"
    >
      <div className="container mx-auto px-5 md:px-8 mb-5">
        <h3 className="text-lg md:text-2xl font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-gold rounded-full" />
          {title}
        </h3>
      </div>
      <Track items={items} reverse={reverse} />
    </motion.div>
  );
};

const ProjectManagementSection = () => {
  const [items, setItems] = useState<Automation[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("automations")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        setItems((data as Automation[]) ?? []);
        setLoaded(true);
      });
  }, []);

  const pm = items.filter((i) => i.category !== "n8n");
  const n8n = items.filter((i) => i.category === "n8n");

  if (!loaded || items.length === 0) return null;

  return (
    <section id="automations" className="py-20 md:py-28 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 gradient-radial opacity-60 pointer-events-none" />
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 container mx-auto px-5 md:px-8"
        >
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-bold inline-flex items-center gap-2">
            <Zap size={12} /> Workflow & Systems
          </span>
          <h2 className="text-2xl md:text-4xl font-black mt-3 mb-4">Project Management &amp; Automation</h2>
          <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto font-semibold">
            Smart systems and automations that keep projects on track, on time, and on budget.
          </p>
        </motion.div>

        <SubSection title="Project Management" items={pm} />
        <SubSection title="n8n Automation" items={n8n} reverse />
      </div>
    </section>
  );
};

export default ProjectManagementSection;
