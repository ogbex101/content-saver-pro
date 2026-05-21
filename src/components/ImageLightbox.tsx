import { useEffect, useRef, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface LightboxSlide {
  image_url: string;
  caption?: string | null;
}

export interface LightboxItem {
  title: string;
  description?: string | null;
  caseStudy?: string | null; // maps to key_result or any extra detail
  slides: LightboxSlide[];
  tool?: string | null;
  industry?: string | null;
  platform?: string | null;
  link_url?: string | null;
}

interface Props {
  item: LightboxItem | null;
  onClose: () => void;
}

const AUTOPLAY_MS = 3500;

const ImageLightbox = ({ item, onClose }: Props) => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slides = item?.slides ?? [];
  const total = slides.length;

  const go = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  const prev = useCallback(() => go(index - 1, -1), [go, index]);
  const next = useCallback(() => go(index + 1, 1), [go, index]);

  // Reset when item changes
  useEffect(() => {
    setIndex(0);
    setPlaying(true);
    setDirection(1);
  }, [item]);

  // Autoplay
  useEffect(() => {
    if (!playing || total <= 1) return;
    timerRef.current = setTimeout(() => go(index + 1, 1), AUTOPLAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, index, total, go]);

  // Keyboard navigation
  useEffect(() => {
    if (!item) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [item, onClose, prev, next]);

  if (!item) return null;

  const currentSlide = slides[index];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-card rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Image side */}
            <div className="relative w-full md:w-[55%] flex-shrink-0 bg-muted overflow-hidden" style={{ minHeight: 260 }}>
              <AnimatePresence custom={direction} mode="popLayout" initial={false}>
                <motion.img
                  key={`${index}`}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  src={currentSlide?.image_url}
                  alt={currentSlide?.caption ?? item.title}
                  className="w-full h-full object-cover absolute inset-0"
                  style={{ minHeight: 260 }}
                />
              </AnimatePresence>

              {/* Slide controls — only when multiple slides */}
              {total > 1 && (
                <>
                  {/* Prev / Next */}
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 backdrop-blur flex items-center justify-center hover:bg-background transition-colors z-10"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 backdrop-blur flex items-center justify-center hover:bg-background transition-colors z-10"
                    aria-label="Next"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Play/pause + dot indicators */}
                  <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 z-10">
                    <button
                      onClick={() => setPlaying((p) => !p)}
                      className="w-7 h-7 rounded-full bg-background/70 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                      aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                    >
                      {playing ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                        className={`rounded-full transition-all duration-300 ${i === index ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"}`}
                        aria-label={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Caption */}
              {currentSlide?.caption && (
                <div className="absolute top-3 left-3 right-12 z-10">
                  <span className="text-[10px] bg-background/70 backdrop-blur px-2 py-1 rounded-full text-foreground font-medium">
                    {currentSlide.caption}
                  </span>
                </div>
              )}
            </div>

            {/* Info side */}
            <div className="flex flex-col p-6 md:p-8 overflow-y-auto flex-1 min-w-0">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tool && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/20 text-accent">
                    {item.tool}
                  </span>
                )}
                {item.industry && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                    {item.industry}
                  </span>
                )}
                {item.platform && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                    {item.platform}
                  </span>
                )}
              </div>

              <h2 className="font-display text-xl md:text-2xl font-bold mb-3 leading-snug">{item.title}</h2>

              {item.caseStudy && (
                <div className="mb-4 p-3 rounded-xl bg-accent/10 border border-accent/20">
                  <p className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Key Result</p>
                  <p className="text-sm font-semibold text-foreground">{item.caseStudy}</p>
                </div>
              )}

              {item.description && (
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Case Study</p>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{item.description}</p>
                </div>
              )}

              {item.link_url && (
                <a
                  href={item.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  View Live →
                </a>
              )}

              {/* Slide counter */}
              {total > 1 && (
                <p className="mt-4 text-[11px] text-muted-foreground font-medium">
                  {index + 1} / {total}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;
