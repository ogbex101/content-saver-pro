import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "@/components/AnimatedSection";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
});

function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*, project_results(*), project_images(*)")
      .order("sort_order")
      .then(({ data, error: err }) => {
        if (err) setError("Failed to load projects");
        else setProjects(data ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-gold font-bold mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-muted-foreground hover:text-gold font-bold">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-gold transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="font-display text-xl font-bold">All Designs</h1>
          <div />
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-bold">Complete Collection</span>
          <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4">Portfolio Gallery</h2>
          <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto font-semibold">Every project, every result</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((p, i) => (
            <AnimatedSection key={p.id} delay={i * 0.05}>
              <Link
                to="/portfolio/$id"
                params={{ id: p.id }}
                className="block group rounded-xl bg-card border border-border/50 hover:border-gold/40 transition-all duration-300 overflow-hidden"
              >
                {p.featured_image_url && (
                  <div className="w-full aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={p.featured_image_url}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full gradient-gold text-primary-foreground uppercase tracking-wider">{p.industry}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">{p.platform}</span>
                  </div>
                  <h3 className="font-bold text-sm mb-1.5 group-hover:text-gold transition-colors">{p.title}</h3>
                  <p className="text-gold font-bold text-xs">{p.key_result}</p>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-3 group-hover:text-gold transition-colors font-bold uppercase tracking-wider">
                    View details <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 text-muted-foreground font-bold">No projects found.</div>
        )}
      </div>
    </div>
  );
}
