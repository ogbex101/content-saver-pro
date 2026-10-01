import { motion } from "framer-motion";
import { Pen } from "lucide-react";
import type { Skill } from "@/lib/site-content";
import { iconMap } from "@/lib/icons";
import SectionHeading from "./SectionHeading";

/** Receives only the skills that are not already listed as services. */
const SkillsSection = ({ skills }: { skills: Skill[] }) => {
  if (skills.length === 0) return null;

  return (
    <section id="skills" className="py-24 md:py-32 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
      <div className="container mx-auto px-5 md:px-8">
        <SectionHeading eyebrow="Expertise" title="My" accent="skills" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 max-w-3xl mx-auto">
          {skills.map((s, i) => {
            const Icon = iconMap[s.icon] ?? Pen;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ scale: 1.03 }}
                className="text-center p-6 rounded-2xl bg-card border border-border hover:border-accent/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} />
                </div>
                <h3 className="font-display font-semibold text-sm mb-1">{s.title}</h3>
                <p className="text-muted-foreground text-xs">{s.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
