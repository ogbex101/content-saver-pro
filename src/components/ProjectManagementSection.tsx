import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, LayoutDashboard, ArrowRight } from "lucide-react";
import type { Automation } from "@/lib/site-content";
import ImageLightbox, { LightboxItem } from "./ImageLightbox";
import SectionHeading from "./SectionHeading";

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
    className="group w-[260px] sm:w-[300px] md:w-[340px] flex-shrink-0 bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-accent/50 hover:shadow-xl transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
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
        <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
          {item.tool}
        </span>
      )}
      <h3 className="font-bold text-sm md:text-base mt-1 mb-1.5 line-clamp-1 group-hover:text-accent transition-colors">
        {item.title}
      </h3>
      {item.description && (
        <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">
          {item.description}
        </p>
      )}
      {item.link_url && (
        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-accent">
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
          <div key={`${a.id}-${i}`} aria-hidden={i >= items.length || undefined}>
            <Card item={a} onClick={() => onCardClick(a)} />
          </div>
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
          <span className="w-1.5 h-6 bg-accent rounded-full flex-shrink-0" />
          <h3 className="font-display text-lg md:text-2xl font-semibold flex items-center gap-2">
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

const ProjectManagementSection = ({ automations: items }: { automations: Automation[] }) => {
  const [lightboxItem, setLightboxItem] = useState<LightboxItem | null>(null);

  const pm = items.filter((i) => i.category !== "n8n");
  const n8n = items.filter((i) => i.category === "n8n");

  if (items.length === 0) return null;

  const handleCardClick = (a: Automation) => setLightboxItem(buildLightboxItem(a));

  return (
    <>
      {/* ── Project Management & Automation ── */}
      {pm.length > 0 && (
        <section
          id="project-management"
          className="py-20 md:py-28 bg-surface relative overflow-hidden"
        >
          <div className="absolute inset-0 gradient-radial opacity-60 pointer-events-none" />
          <div className="relative">
            <div className="container mx-auto px-5 md:px-8">
              <SectionHeading
                eyebrow="Project systems"
                title="Project management"
                accent="& automation"
                intro="Trackers, boards and workflows that keep deliverables on time without anyone chasing."
              />
            </div>
            <SubSection
              title="Project Management"
              subtitle="Frameworks, trackers, and workflows built to manage complex deliverables."
              icon={<LayoutDashboard size={18} className="text-accent" />}
              items={pm}
              onCardClick={handleCardClick}
            />
          </div>
        </section>
      )}

      {/* ── n8n Automation ── */}
      {n8n.length > 0 && (
        <section
          id="n8n-automation"
          className="py-20 md:py-28 bg-background relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
          <div className="relative">
            <div className="container mx-auto px-5 md:px-8">
              <SectionHeading
                eyebrow="Workflow automation"
                title="n8n"
                accent="automation"
                intro="Workflows that move data, send the follow-ups and connect your tools, so repetitive work runs itself."
              />
            </div>
            <SubSection
              title="n8n Workflows"
              subtitle="Automated pipelines built with n8n to handle data, notifications, and integrations."
              icon={<Zap size={18} className="text-accent" />}
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
