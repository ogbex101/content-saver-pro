import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  eyebrow: string;
  /** Plain part of the heading. */
  title: string;
  /** Italic accent word(s) after the title. */
  accent?: string;
  intro?: ReactNode;
  className?: string;
}

/** One heading style for every section, so the page reads as one piece. */
const SectionHeading = ({ eyebrow, title, accent, intro, className = "" }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`text-center mb-12 md:mb-14 ${className}`}
  >
    <span className="text-accent text-[11px] tracking-[0.35em] uppercase font-semibold">
      {eyebrow}
    </span>
    <h2 className="font-display text-3xl md:text-5xl font-light mt-4 mb-3">
      {title}
      {accent && (
        <>
          {" "}
          <span className="italic font-medium text-accent">{accent}</span>
        </>
      )}
    </h2>
    <div className="w-16 h-px bg-foreground/30 mx-auto" />
    {intro && (
      <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mt-4">{intro}</p>
    )}
  </motion.div>
);

export default SectionHeading;
