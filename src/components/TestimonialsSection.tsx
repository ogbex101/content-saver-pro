import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Testimonial } from "@/lib/site-content";
import SectionHeading from "./SectionHeading";

/** Receives real testimonials only (see realTestimonials in lib/display). */
const TestimonialsSection = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const [page, setPage] = useState(0);
  if (testimonials.length === 0) return null;

  const perPage = 3;
  const totalPages = Math.max(1, Math.ceil(testimonials.length / perPage));
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
      <div className="container mx-auto px-5 md:px-8">
        <SectionHeading eyebrow="Kind words" title="What clients" accent="say" />

        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto"
          >
            {visible.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-7 rounded-2xl bg-card border border-border h-full flex flex-col relative hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                <Quote size={28} className="text-accent/30 absolute top-5 right-5" />
                {t.rating > 0 && (
                  <div className="flex gap-0.5 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                    {[...Array(Math.min(5, t.rating))].map((_, j) => (
                      <Star key={j} size={13} className="fill-accent text-accent" />
                    ))}
                  </div>
                )}
                <p className="text-foreground/80 text-[15px] leading-relaxed flex-1 mb-5">
                  "{t.quote}"
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-sm text-foreground">{t.client_name}</p>
                  {t.date_text && (
                    <p className="text-xs text-muted-foreground mt-0.5">{t.date_text}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-10">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              aria-label="Previous testimonials"
              className="w-10 h-10 rounded-full border border-border hover:border-accent flex items-center justify-center disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-muted-foreground font-semibold">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              aria-label="Next testimonials"
              className="w-10 h-10 rounded-full border border-border hover:border-accent flex items-center justify-center disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
