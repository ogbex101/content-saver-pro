import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

type Transition = "slide" | "fade" | "zoom" | "flip";

const variantsFor = (t: Transition) => {
  switch (t) {
    case "fade":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    case "zoom":
      return {
        initial: { opacity: 0, scale: 1.05 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.97 },
      };
    case "flip":
      return {
        initial: { opacity: 0, rotateY: 25 },
        animate: { opacity: 1, rotateY: 0 },
        exit: { opacity: 0, rotateY: -25 },
      };
    case "slide":
    default:
      return {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -60 },
      };
  }
};

const PortfolioSection = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [intervalSec, setIntervalSec] = useState(5);
  const [transition, setTransition] = useState<Transition>("slide");
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*, project_results(*), project_images(*)")
      .eq("featured_on_homepage", true)
      .order("sort_order")
      .limit(8)
      .then(({ data }) => setProjects(data ?? []));
    supabase
      .from("profile")
      .select("slideshow_interval_seconds, slideshow_transition")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data?.slideshow_interval_seconds) setIntervalSec(data.slideshow_interval_seconds);
        if ((data as any)?.slideshow_transition) setTransition((data as any).slideshow_transition as Transition);
      });
  }, []);

  // Continuous, non-stopping auto-advance
  useEffect(() => {
    if (projects.length <= 1) return;
    timerRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % projects.length);
    }, Math.max(1, intervalSec) * 1000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, intervalSec, projects.length]);

  const go = (delta: number) => {
    if (projects.length === 0) return;
    setIndex((i) => (i + delta + projects.length) % projects.length);
  };

  const current = projects[index];
  const v = variantsFor(transition);

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
      <div className="container mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-accent text-[11px] tracking-[0.35em] uppercase font-semibold">My work</span>
          <h2 className="font-display text-4xl md:text-6xl font-light mt-4 mb-3">
            Featured <span className="italic font-medium text-accent">projects</span>
          </h2>
          <div className="w-16 h-px bg-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto">Campaigns and designs that delivered real results.</p>
        </motion.div>

        {current && (
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-card border border-border shadow-xl">
              {/* Stage — shows the full design at its natural aspect ratio */}
              <div className="relative w-full bg-muted overflow-hidden" style={{ perspective: 1200 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={v.initial}
                    animate={v.animate}
                    exit={v.exit}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full"
                  >
                    {current.featured_image_url ? (
                      <img
                        src={current.featured_image_url}
                        alt={current.title}
                        className="block w-full h-auto object-contain"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] flex items-center justify-center text-muted-foreground">No image</div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <button
                  onClick={() => go(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur flex items-center justify-center text-foreground hover:bg-background shadow-lg transition-all"
                  aria-label="Previous"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => go(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur flex items-center justify-center text-foreground hover:bg-background shadow-lg transition-all"
                  aria-label="Next"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Caption + footer */}
              <div className="p-5 md:p-6 bg-card border-t border-border">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-accent text-accent-foreground uppercase tracking-[0.15em]">{current.industry}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.15em]">{current.platform}</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-medium text-foreground mb-1">{current.title}</h3>
                <p className="text-accent font-semibold text-sm md:text-base mb-4">{current.key_result}</p>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {projects.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-foreground" : "w-1.5 bg-foreground/20 hover:bg-foreground/40"}`}
                        aria-label={`Go to ${i + 1}`}
                      />
                    ))}
                  </div>
                  <Link
                    to={`/project/${current.id}`}
                    className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide hover:bg-foreground/90 transition-all whitespace-nowrap"
                  >
                    View details <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10 text-center"
            >
              <Link to="/portfolio" className="inline-flex items-center gap-2 border border-foreground/20 text-foreground px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:border-accent hover:text-accent transition-all duration-300">
                View all designs <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
