import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import type { Project } from "@/lib/site-content";
import { SITE_URL } from "@/lib/display";

async function fetchProjects(): Promise<{ projects: Project[]; failed: boolean }> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*, project_results(*), project_images(*)")
      .order("sort_order");
    if (error) throw error;
    return { projects: (data as Project[]) ?? [], failed: false };
  } catch (error) {
    console.error("[portfolio] projects:", error);
    return { projects: [], failed: true };
  }
}

export const Route = createFileRoute("/portfolio")({
  loader: () => fetchProjects(),
  staleTime: 60_000,
  head: () => ({
    meta: [
      { title: "All work | Email designs, campaigns and systems" },
      {
        name: "description",
        content:
          "Every email design, campaign and system in the portfolio, with the platform and result for each.",
      },
      { property: "og:title", content: "All work | Email designs, campaigns and systems" },
      { property: "og:url", content: `${SITE_URL}/portfolio` },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { projects, failed } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft size={16} /> Back to home
          </Link>
          <p className="font-display text-xl font-semibold">All work</p>
          <Link
            to="/"
            hash="contact"
            className="text-sm font-semibold text-foreground hover:text-accent transition-colors"
          >
            Hire me
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 py-14">
        <SectionHeading
          eyebrow="Complete collection"
          title="All"
          accent="work"
          intro="Email designs, campaigns and systems. Open any project for the full set of images and results."
        />

        {failed ? (
          <div className="text-center py-20">
            <p className="text-foreground font-semibold mb-4">The projects didn't load.</p>
            <button
              onClick={() => window.location.reload()}
              className="text-muted-foreground hover:text-accent font-semibold underline"
            >
              Try again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-semibold">
            No projects yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {projects.map((p, i) => (
              <AnimatedSection key={p.id} delay={Math.min(i, 8) * 0.05}>
                <Link
                  to="/portfolio/$id"
                  params={{ id: p.id }}
                  className="block group rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
                >
                  <div className="w-full aspect-[16/10] overflow-hidden bg-muted">
                    {p.featured_image_url && (
                      <img
                        src={p.featured_image_url}
                        alt={p.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      {p.industry && (
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-accent text-accent-foreground uppercase tracking-wider">
                          {p.industry}
                        </span>
                      )}
                      {p.platform && (
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                          {p.platform}
                        </span>
                      )}
                    </div>
                    <h2 className="font-display font-semibold text-base mb-1.5 group-hover:text-accent transition-colors">
                      {p.title}
                    </h2>
                    {p.key_result && (
                      <p className="text-accent font-semibold text-xs">{p.key_result}</p>
                    )}
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-3 group-hover:text-accent transition-colors font-semibold uppercase tracking-wider">
                      View details <ArrowRight size={11} />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
