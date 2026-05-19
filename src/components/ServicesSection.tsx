import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Pen, Mail, Settings, Target, ClipboardList, Sparkles, TrendingUp, Lightbulb, BarChart3, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = { Pen, Mail, Settings, Target, ClipboardList, Sparkles, TrendingUp, Lightbulb, BarChart3 };

const ServicesSection = () => {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").then(({ data }) => setServices(data ?? []));
  }, []);

  return (
    <section id="services" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
      <div className="container mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-accent text-[11px] tracking-[0.35em] uppercase font-semibold">What I do</span>
          <h2 className="font-display text-4xl md:text-6xl font-light mt-4 mb-3">
            My <span className="italic font-medium text-accent">services</span>
          </h2>
          <div className="w-16 h-px bg-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto">A short list of how I can help your team move faster.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] ?? Pen;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group p-7 rounded-2xl bg-card border border-border hover:border-accent/40 hover:shadow-xl transition-all duration-500 h-full relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                  <Icon size={20} />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
