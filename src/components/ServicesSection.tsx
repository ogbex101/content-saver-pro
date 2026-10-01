import { motion } from "framer-motion";
import { Pen } from "lucide-react";
import { iconMap } from "@/lib/icons";
import type { Service } from "@/lib/site-content";
import SectionHeading from "./SectionHeading";

const ServicesSection = ({ services }: { services: Service[] }) => {
  if (services.length === 0) return null;

  return (
    <section id="services" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
      <div className="container mx-auto px-5 md:px-8">
        <SectionHeading
          eyebrow="What I do"
          title="How I can"
          accent="help"
          intro="Hand over one of these, or the whole lot."
        />

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
