import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "framer-motion";
import type { Profile } from "@/lib/site-content";
import { paragraphs, publicStats } from "@/lib/display";
import SectionHeading from "./SectionHeading";

/**
 * Starts on the real number (so the server HTML, link previews and
 * no-JavaScript visitors see it), then counts up once it scrolls into view.
 */
const Counter = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduceMotion = useReducedMotion();
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => Math.floor(v).toString());
  useEffect(() => {
    if (!inView || reduceMotion) return;
    mv.set(0);
    const controls = animate(mv, value, { duration: 1.6, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, reduceMotion, value, mv]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const AboutSection = ({
  profile,
  hasReviews,
}: {
  profile: Profile | null;
  hasReviews: boolean;
}) => {
  const aboutIntro = profile?.about_intro?.trim();
  const aboutParagraphs = paragraphs(profile?.about_text);
  const stats = publicStats(profile, { hasReviews });
  if (!aboutIntro && aboutParagraphs.length === 0 && stats.length === 0) return null;

  const gridCols =
    stats.length === 3
      ? "md:grid-cols-3"
      : stats.length === 2
        ? "md:grid-cols-2"
        : stats.length === 1
          ? "md:grid-cols-1"
          : "md:grid-cols-4";

  return (
    <section id="about" className="py-24 md:py-32 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
      <div className="container mx-auto px-5 md:px-8 max-w-5xl">
        <SectionHeading eyebrow="A little about me" title="About" accent="me" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-5 text-center max-w-3xl mx-auto mb-16"
        >
          {aboutIntro && (
            <p className="font-display text-2xl md:text-3xl text-foreground font-light leading-snug italic">
              "{aboutIntro}"
            </p>
          )}
          {aboutParagraphs.map((p, i) => (
            <p key={i} className="text-foreground/70 leading-relaxed text-base md:text-lg">
              {p}
            </p>
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
                <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mt-3 font-semibold">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
