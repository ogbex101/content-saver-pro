// Renders custom sections created from the admin panel.
import type { CustomSection } from "@/lib/site-content";
import SectionHeading from "./SectionHeading";

const CustomSections = ({ sections }: { sections: CustomSection[] }) => {
  const visible = sections.filter((s) => s.title?.trim() && (s.items?.length ?? 0) > 0);
  if (visible.length === 0) return null;

  return (
    <>
      {visible.map((s) => (
        <section key={s.id} className="py-24 bg-background relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
          <div className="container mx-auto px-5 md:px-8">
            <SectionHeading eyebrow="More work" title={s.title} intro={s.subtitle ?? undefined} />
            <div
              className={`max-w-6xl mx-auto ${s.layout === "list" ? "space-y-4" : "grid md:grid-cols-2 lg:grid-cols-3 gap-6"}`}
            >
              {s.items.map((it, i) => {
                const body = (
                  <>
                    {it.image_url && (
                      <img
                        src={it.image_url}
                        alt={it.title}
                        loading="lazy"
                        className="w-full aspect-[16/10] object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="font-display font-semibold text-base mb-1">{it.title}</h3>
                    {it.description && (
                      <p className="text-sm text-muted-foreground">{it.description}</p>
                    )}
                  </>
                );
                const cls =
                  "block bg-card border border-border rounded-2xl p-5 hover:border-accent/50 transition-colors";
                return it.link ? (
                  <a
                    key={i}
                    href={it.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                  >
                    {body}
                  </a>
                ) : (
                  <div key={i} className={cls}>
                    {body}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default CustomSections;
