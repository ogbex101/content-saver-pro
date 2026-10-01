import type { Brand } from "@/lib/site-content";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";

const BrandsSection = ({ brands }: { brands: Brand[] }) => {
  const visible = brands.filter((b) => b.logo_url || b.name?.trim());
  if (visible.length === 0) return null;

  return (
    <section id="brands" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading eyebrow="Clients" title="Brands I've" accent="worked with" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {visible.map((b, i) => (
            <AnimatedSection key={b.id} delay={i * 0.04}>
              <div
                className="flex flex-col items-center justify-center p-5 rounded-2xl border border-border/60 hover:border-accent/40 hover:shadow-lg transition-all duration-300 min-h-[5rem] gap-2"
                style={{ backgroundColor: b.bg_color === "black" ? "#000000" : "#ffffff" }}
              >
                {b.logo_url && (
                  <img
                    src={b.logo_url}
                    alt={b.name || "Client logo"}
                    className="max-h-10 max-w-full object-contain"
                    loading="lazy"
                  />
                )}
                {b.name && (
                  <span
                    className={`text-xs font-semibold text-center ${b.bg_color === "black" ? "text-white" : "text-gray-700"}`}
                  >
                    {b.name}
                  </span>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
