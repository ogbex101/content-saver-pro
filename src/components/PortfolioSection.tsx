import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Project } from "@/lib/site-content";
import ImageLightbox, { LightboxItem, LightboxSlide } from "./ImageLightbox";
import SectionHeading from "./SectionHeading";

const buildLightboxItem = (p: Project): LightboxItem => {
  const slides: LightboxSlide[] = [];

  // Featured image first
  if (p.featured_image_url) {
    slides.push({ image_url: p.featured_image_url });
  }
  // figma preview as second slide
  if (p.figma_preview_url && p.figma_preview_url !== p.featured_image_url) {
    slides.push({ image_url: p.figma_preview_url, caption: "Figma Preview" });
  }
  // Gallery images
  if (Array.isArray(p.project_images)) {
    p.project_images.forEach((img) => {
      if (img.image_url && img.image_url !== p.featured_image_url) {
        slides.push({ image_url: img.image_url, caption: img.caption ?? undefined });
      }
    });
  }

  return {
    title: p.title,
    description: p.description ?? null,
    caseStudy: p.key_result ?? null,
    industry: p.industry ?? null,
    platform: p.platform ?? null,
    link_url: p.figma_link ?? null,
    slides,
  };
};

const PortfolioSection = ({ projects }: { projects: Project[] }) => {
  const [lightboxItem, setLightboxItem] = useState<LightboxItem | null>(null);
  if (projects.length === 0) return null;

  // Duplicate list for seamless infinite scroll
  const loop = projects.length > 0 ? [...projects, ...projects] : [];

  return (
    <section id="portfolio" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
      <div className="container mx-auto px-5 md:px-8">
        <SectionHeading
          eyebrow="My work"
          title="Featured"
          accent="designs"
          intro="Email designs and campaign pieces. Tap any of them to see it full size."
        />

        {projects.length > 0 && (
          <>
            {/* Marquee — designs glide left to right */}
            <div
              className="relative w-full overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
              }}
            >
              <div
                className="flex gap-5 w-max animate-marquee-rtl hover:[animation-play-state:paused]"
                style={{ animationDuration: `${Math.max(20, projects.length * 5)}s` }}
              >
                {loop.map((p, i) => (
                  <div
                    key={`${p.id}-${i}`}
                    aria-hidden={i >= projects.length || undefined}
                    className="group relative w-[220px] sm:w-[260px] md:w-[300px] flex-shrink-0 rounded-2xl overflow-hidden bg-card border border-border shadow-md hover:shadow-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setLightboxItem(buildLightboxItem(p))}
                      onKeyDown={(e) => e.key === "Enter" && setLightboxItem(buildLightboxItem(p))}
                      className="relative w-full aspect-[3/4] bg-muted overflow-hidden"
                    >
                      {p.featured_image_url ? (
                        <img
                          src={p.featured_image_url}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No image
                        </div>
                      )}
                      {/* Preview overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-end justify-center pb-16">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
                          Click to preview
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/95 via-foreground/60 to-transparent p-3">
                        {p.industry && (
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-accent text-accent-foreground uppercase tracking-wider">
                            {p.industry}
                          </span>
                        )}
                        <h3 className="font-display text-sm md:text-base font-medium text-background mt-1.5 line-clamp-1">
                          {p.title}
                        </h3>
                        {p.key_result && (
                          <p className="text-accent text-[11px] font-semibold line-clamp-1">
                            {p.key_result}
                          </p>
                        )}
                        {/* Render description HTML (for case study link) */}
                        {p.description && (
                          <div
                            className="text-background/80 text-[10px] mt-1.5"
                            dangerouslySetInnerHTML={{ __html: p.description }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10 text-center"
            >
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 border border-foreground/20 text-foreground px-7 py-3 rounded-full text-sm font-semibold tracking-wide hover:border-accent hover:text-accent transition-all duration-300"
              >
                View all work <ArrowRight size={15} />
              </Link>
            </motion.div>
          </>
        )}
      </div>

      <ImageLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </section>
  );
};

export default PortfolioSection;
