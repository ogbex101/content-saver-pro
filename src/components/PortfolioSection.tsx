import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

const PortfolioSection = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [interval, setIntervalSec] = useState(5);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*, project_results(*), project_images(*)")
      .eq("featured_on_homepage", true)
      .order("sort_order")
      .limit(8)
      .then(({ data }) => setProjects(data ?? []));
    supabase.from("profile").select("slideshow_interval_seconds").limit(1).single().then(({ data }) => {
      if (data?.slideshow_interval_seconds) setIntervalSec(data.slideshow_interval_seconds);
    });
  }, []);

  useEffect(() => {
    if (!playing || projects.length <= 1) return;
    timerRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % projects.length);
    }, Math.max(1, interval) * 1000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, playing, interval, projects.length]);

  const go = (delta: number) => {
    if (projects.length === 0) return;
    setIndex((i) => (i + delta + projects.length) % projects.length);
  };

  const current = projects[index];

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
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-card border border-border shadow-xl">
              {/* Slideshow stage — fixed height, captures top of design */}
              <div className="relative w-full h-[280px] sm:h-[380px] md:h-[460px] lg:h-[520px] bg-muted overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    {current.featured_image_url ? (
                      <img
                        src={current.featured_image_url}
                        alt={current.title}
                        /* object-top so we capture the hero/top of each design */
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                    )}
                    {/* Caption overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/95 via-foreground/70 to-transparent p-5 md:p-8">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-accent text-accent-foreground uppercase tracking-[0.15em]">{current.industry}</span>
                        <span className="text-[10px] text-background/80 font-semibold uppercase tracking-[0.15em]">{current.platform}</span>
                      </div>
                      <h3 className="font-display text-xl md:text-3xl font-medium text-background mb-1">{current.title}</h3>
                      <p className="text-accent font-semibold text-sm md:text-base">{current.key_result}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <button
                  onClick={() => { setPlaying(false); go(-1); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur flex items-center justify-center text-foreground hover:bg-background shadow-lg transition-all"
                  aria-label="Previous"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => { setPlaying(false); go(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur flex items-center justify-center text-foreground hover:bg-background shadow-lg transition-all"
                  aria-label="Next"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/90 backdrop-blur flex items-center justify-center text-foreground hover:bg-background shadow-lg transition-all"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </div>

              {/* Footer with dots + view details */}
              <div className="flex items-center justify-between gap-4 p-4 md:p-5 bg-card">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {projects.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setPlaying(false); setIndex(i); }}
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
