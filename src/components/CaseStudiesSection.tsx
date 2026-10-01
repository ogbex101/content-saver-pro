import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CASE_STUDY_GROUPS, PLATFORMS } from "@/lib/case-studies";
import SectionHeading from "./SectionHeading";

/**
 * The written case studies are the strongest proof on the site, so they get
 * their own section near the top with plain links a prospect can open.
 */
const CaseStudiesSection = () => (
  <section id="case-studies" className="py-24 md:py-32 bg-surface relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
    <div className="container mx-auto px-5 md:px-8 max-w-6xl">
      <SectionHeading
        eyebrow="Proof"
        title="Case"
        accent="studies"
        intro="What each client had before, what was built, and what it did. Open any of them for the full write-up."
      />

      <div className="flex flex-wrap justify-center gap-2 mb-14 -mt-4">
        {PLATFORMS.map((p) => (
          <span
            key={p}
            className="text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full border border-border bg-card text-foreground/70"
          >
            {p}
          </span>
        ))}
      </div>

      <div className="space-y-14">
        {CASE_STUDY_GROUPS.map((group) => (
          <div key={group.id}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-1 mb-5">
              <h3 className="font-display text-xl md:text-2xl font-semibold">{group.title}</h3>
              <p className="text-sm text-muted-foreground max-w-md md:text-right">{group.intro}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.items.map((cs, i) => (
                <motion.a
                  key={cs.href}
                  href={cs.href}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
                  className="group flex flex-col h-full p-6 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-display text-lg font-semibold leading-tight">{cs.brand}</p>
                      <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mt-1">
                        {cs.industry}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="shrink-0 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </div>
                  <p className="text-sm text-foreground/75 leading-relaxed mb-4">{cs.summary}</p>
                  <ul className="mt-auto space-y-1.5 mb-4">
                    {cs.highlights.map((h) => (
                      <li key={h} className="flex gap-2 text-sm font-medium text-foreground">
                        <span className="mt-2 w-1 h-1 rounded-full bg-accent shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-border text-xs">
                    <span className="text-muted-foreground">{cs.platform}</span>
                    <span className="font-semibold text-accent">Read the case study</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CaseStudiesSection;
