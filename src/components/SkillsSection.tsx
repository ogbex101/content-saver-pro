import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Pen, Mail, Settings, TrendingUp, Lightbulb, BarChart3, Target, Sparkles, ClipboardList, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = { Pen, Mail, Settings, TrendingUp, Lightbulb, BarChart3, Target, Sparkles, ClipboardList };

const SkillsSection = () => {
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("skills").select("*").order("sort_order").then(({ data }) => setSkills(data ?? []));
  }, []);

  return (
    <section id="skills" className="py-24 md:py-32 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
      <div className="container mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-accent text-[11px] tracking-[0.35em] uppercase font-semibold">Expertise</span>
          <h2 className="font-display text-4xl md:text-6xl font-light mt-4 mb-3">
            My <span className="italic font-medium text-accent">skills</span>
          </h2>
          <div className="w-16 h-px bg-foreground/30 mx-auto" />
        </motion.div>

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
