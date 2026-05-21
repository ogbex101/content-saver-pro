import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Zap, LayoutDashboard, ArrowRight } from "lucide-react";
import ImageLightbox, { LightboxItem } from "./ImageLightbox";

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

const buildLightboxItem = (a: Automation): LightboxItem => ({
  title: a.title,
  description: a.description,
  tool: a.tool,
  link_url: a.link_url,
  slides: a.image_url ? [{ image_url: a.image_url }] : [],
});

const Card = ({ item, onClick }: { item: Automation; onClick: () => void }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
    className="group w-[260px] sm:w-[300px] md:w-[340px] flex-shrink-0 bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-gold/50 hover:shadow-xl hover:shadow-gold/10 transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
  >
    {item.image_url && (
      <div className="aspect-[16/10] overflow-hidden bg-muted relative">
        <img
          src={item.image_url}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Click-to-preview hint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
            Preview
          </span>
        </div>
      </div>
    )}
    <div className="p-4">
      {item.tool && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-gold">{item.tool}</span>
      )}
      <h3 className="font-bold text-sm md:text-base mt-1 mb-1.5 line-clamp-1 group-hover:text-gold transition-colors">
        {item.title}
      </h3>
      {item.description && (
        <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">
          {item.description}
        </p>
      )}
      {item.link_url && (
        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gold">
          See it in action <ArrowRight size={11} />
        </span>
      )}
    </div>
  </div>
);

const Track = ({
  items,
  reverse = false,
  onCardClick,
}: {
  items: Automation[];
  reverse?: boolean;
  onCardClick: (item: Automation) => void;
}) => {
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
          <Card key={`${a.id}-${i}`} item={a} onClick={() => onCardClick(a)} />
        ))}
      </div>
    </div>
  );
};

interface SubSectionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  items: Automation[];
  reverse?: boolean;
  onCardClick: (item: Automation) => void;
}

const SubSection = ({ title, subtitle, icon, items, reverse, onCardClick }: SubSectionProps) => {
  if (items.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, x: reverse ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mb-16"
    >
      <div className="container mx-auto px-5 md:px-8 mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-1.5 h-6 bg-gold rounded-full flex-shrink-0" />
          <h3 className="text-lg md:text-2xl font-bold flex items-center gap-2">
            {icon}
            {title}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground font-medium ml-4 pl-3">{subtitle}</p>
      </div>
      <Track items={items} reverse={reverse} onCardClick={onCardClick} />
    </motion.div>
  );
};

const ProjectManagementSection = () => {
  const [items, setItems] = useState<Automation[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<LightboxItem | null>(null);

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

  const handleCardClick = (a: Automation) => setLightboxItem(buildLightboxItem(a));

  return (
    <>
      {/* ── Project Management & Automation ── */}
      {pm.length > 0 && (
        <section id="project-management" className="py-20 md:py-28 bg-surface relative overflow-hidden">
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
                <LayoutDashboard size={12} /> Project Systems
              </span>
              <h2 className="text-2xl md:text-4xl font-black mt-3 mb-4">
                Project Management &amp; Automation
              </h2>
              <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-4" />
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto font-semibold">
                Structured systems that keep projects on track, on time, and on budget.
              </p>
            </motion.div>
            <SubSection
              title="Project Management"
              subtitle="Frameworks, trackers, and workflows built to manage complex deliverables."
              icon={<LayoutDashboard size={18} className="text-gold" />}
              items={pm}
              onCardClick={handleCardClick}
            />
          </div>
        </section>
      )}

      {/* ── n8n Automation ── */}
      {n8n.length > 0 && (
        <section id="n8n-automation" className="py-20 md:py-28 bg-background relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16 container mx-auto px-5 md:px-8"
            >
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-bold inline-flex items-center gap-2">
                <Zap size={12} /> Workflow Automation
              </span>
              <h2 className="text-2xl md:text-4xl font-black mt-3 mb-4">
                n8n Automation
              </h2>
              <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-4" />
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto font-semibold">
                Smart n8n workflows that eliminate repetitive work and connect your tools seamlessly.
              </p>
            </motion.div>
            <SubSection
              title="n8n Workflows"
              subtitle="Automated pipelines built with n8n to handle data, notifications, and integrations."
              icon={<Zap size={18} className="text-gold" />}
              items={n8n}
              reverse
              onCardClick={handleCardClick}
            />
          </div>
        </section>
      )}

      <ImageLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
};

export default ProjectManagementSection;
