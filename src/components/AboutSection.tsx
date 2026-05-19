import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const Counter = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toString());
  useEffect(() => {
    if (inView) animate(mv, value, { duration: 1.6, ease: "easeOut" });
  }, [inView, value]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const AboutSection = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.from("profile").select("*").limit(1).single().then(({ data }) => setProfile(data));
  }, []);

  if (!profile) return <section id="about" className="py-24 md:py-32 bg-surface" />;

  const aboutText = profile?.about_text ?? "";
  const aboutIntro = profile?.about_intro ?? "";
  const allStats = [
    { value: profile?.projects_completed ?? 190, label: "Projects Completed" },
    { value: profile?.happy_clients ?? 100, label: "Happy Clients" },
    { value: profile?.five_star_reviews ?? 100, label: "Five-Star Reviews" },
    { value: profile?.case_studies ?? 20, label: "Case Studies" },
  ];
  const stats = allStats.filter((s) => s.value > 0);
  const gridCols = stats.length === 3 ? "md:grid-cols-3" : stats.length === 2 ? "md:grid-cols-2" : stats.length === 1 ? "md:grid-cols-1" : "md:grid-cols-4";

  return (
    <section id="about" className="py-24 md:py-32 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
      <div className="container mx-auto px-5 md:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-accent text-[11px] tracking-[0.35em] uppercase font-semibold">A little about me</span>
          <h2 className="font-display text-4xl md:text-6xl font-light mt-4 mb-3">
            About <span className="italic font-medium text-accent">me</span>
          </h2>
          <div className="w-16 h-px bg-foreground/30 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-5 text-center max-w-3xl mx-auto mb-16"
        >
          <p className="font-display text-2xl md:text-3xl text-foreground font-light leading-snug italic">
            "{aboutIntro}"
          </p>
          {aboutText.split("\n\n").map((p: string, i: number) => (
            <p key={i} className="text-foreground/70 leading-relaxed text-base md:text-lg">{p}</p>
          ))}
        </motion.div>

        {stats.length > 0 && (
          <div className={`grid grid-cols-2 ${gridCols} gap-4 md:gap-6`}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-center p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                <div className="font-display text-4xl md:text-5xl font-light text-foreground">
                  <Counter value={s.value} />
                  <span className="text-accent">+</span>
                </div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mt-3 font-semibold">{s.label}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
