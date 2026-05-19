import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/portfolio/$id")({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { id } = Route.useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("projects")
      .select("*, project_results(*), project_images(*)")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError("Project not found");
        else setProject(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-gold font-bold text-xl mb-4">{error || "Project not found"}</p>
          <Link to="/portfolio" className="text-muted-foreground hover:text-gold font-bold">← Back to Portfolio</Link>
        </div>
      </div>
    );
  }

  const allImages: string[] = [];
  if (project.featured_image_url) allImages.push(project.featured_image_url);
  if (project.figma_preview_url) allImages.push(project.figma_preview_url);
  const sortedGallery = project.project_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) ?? [];
  sortedGallery.forEach((img: any) => allImages.push(img.image_url));

  const prevImg = () => setCurrentImgIdx((currentImgIdx - 1 + allImages.length) % allImages.length);
  const nextImg = () => setCurrentImgIdx((currentImgIdx + 1) % allImages.length);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <Link to="/portfolio" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-gold transition-colors">
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>
          <span className="text-xs font-bold text-muted-foreground">{project.platform}</span>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
        <div className="mb-10">
          <span className="text-xs font-bold px-3 py-1 rounded-full gradient-gold text-primary-foreground">{project.industry}</span>
          <h1 className="text-3xl md:text-5xl font-black mt-4 mb-3">{project.title}</h1>
          <p className="text-gold font-bold text-xl">{project.key_result}</p>
        </div>

        {allImages.length > 0 && (
          <div className="mb-12">
            <div className="relative bg-card rounded-2xl border border-border overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImgIdx}
                  src={allImages[currentImgIdx]}
                  alt={project.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-h-[70vh] object-contain mx-auto"
                />
              </AnimatePresence>

              {allImages.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-background/80 backdrop-blur rounded-full flex items-center justify-center border border-border hover:border-gold transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-background/80 backdrop-blur rounded-full flex items-center justify-center border border-border hover:border-gold transition-colors">
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur px-4 py-1.5 rounded-full border border-border text-xs font-bold text-muted-foreground">
                    {currentImgIdx + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {allImages.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImgIdx(idx)}
                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImgIdx ? "border-gold" : "border-border/50 opacity-60 hover:opacity-100"}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
          <div>
            <h2 className="text-xl font-bold mb-4 text-gold">About This Project</h2>
            <p className="text-foreground leading-relaxed text-base font-semibold whitespace-pre-line">{project.description}</p>

            {project.figma_link && (
              <a href={project.figma_link} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 gradient-gold text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-gold/25">
                <ExternalLink size={16} /> View Figma Design
              </a>
            )}
          </div>

          {project.project_results && project.project_results.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-bold text-sm mb-4 text-gold">Key Results</h3>
              <div className="space-y-4">
                {project.project_results.sort((a: any, b: any) => a.sort_order - b.sort_order).map((r: any) => (
                  <div key={r.id} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <p className="text-xs text-muted-foreground font-bold">{r.label}</p>
                    <p className="text-sm font-bold text-gold">{r.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
