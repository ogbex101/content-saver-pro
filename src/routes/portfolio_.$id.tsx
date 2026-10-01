import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/site-content";
import { SITE_URL, summarySentence } from "@/lib/display";

type ProjectResult = { id: string; label: string; value: string; sort_order: number };
type ProjectDetail = Project & {
  project_results?: ProjectResult[];
  project_images?: { image_url: string; sort_order: number }[];
};

const stripTags = (html?: string | null) =>
  (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const looksLikeHtml = (text?: string | null) => /<\/?[a-z][\s\S]*>/i.test(text ?? "");

export const Route = createFileRoute("/portfolio_/$id")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*, project_results(*), project_images(*)")
      .eq("id", params.id)
      .maybeSingle();
    if (error || !data) throw notFound();
    return data as ProjectDetail;
  },
  head: ({ loaderData, params }) => {
    const title = loaderData ? `${loaderData.title} | Case study` : "Project";
    const description = summarySentence(
      loaderData?.key_result || stripTags(loaderData?.description),
    );
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `${SITE_URL}/portfolio/${params.id}` },
        ...(loaderData?.featured_image_url
          ? [{ property: "og:image", content: loaderData.featured_image_url }]
          : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="font-display text-xl font-semibold mb-4">This project isn't available.</p>
        <Link
          to="/portfolio"
          className="text-muted-foreground hover:text-accent font-semibold underline"
        >
          See all work
        </Link>
      </div>
    </div>
  ),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const project = Route.useLoaderData();
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const allImages: string[] = [];
  if (project.featured_image_url) allImages.push(project.featured_image_url);
  if (project.figma_preview_url) allImages.push(project.figma_preview_url);
  const sortedGallery = [...(project.project_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  sortedGallery.forEach((img) => allImages.push(img.image_url));

  const prevImg = () => setCurrentImgIdx((currentImgIdx - 1 + allImages.length) % allImages.length);
  const nextImg = () => setCurrentImgIdx((currentImgIdx + 1) % allImages.length);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <Link
            to="/portfolio"
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft size={16} /> All work
          </Link>
          <span className="text-xs font-bold text-muted-foreground">{project.platform}</span>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
        <div className="mb-10">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent text-accent-foreground">
            {project.industry}
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-3">
            {project.title}
          </h1>
          <p className="text-accent font-semibold text-xl">{project.key_result}</p>
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
                  <button
                    onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-background/80 backdrop-blur rounded-full flex items-center justify-center border border-border hover:border-accent transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-background/80 backdrop-blur rounded-full flex items-center justify-center border border-border hover:border-accent transition-colors"
                  >
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
                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImgIdx ? "border-accent" : "border-border/50 opacity-60 hover:opacity-100"}`}
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
            <h2 className="text-xl font-bold mb-4 text-accent">About this project</h2>
            {looksLikeHtml(project.description) ? (
              <div
                className="text-foreground/85 leading-relaxed text-base space-y-3 [&_a]:text-accent [&_a]:underline [&_a]:font-semibold"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            ) : (
              <p className="text-foreground/85 leading-relaxed text-base whitespace-pre-line">
                {project.description}
              </p>
            )}

            {project.figma_link && (
              <a
                href={project.figma_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-foreground/90"
              >
                <ExternalLink size={16} /> View the Figma design
              </a>
            )}
          </div>

          {project.project_results && project.project_results.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-bold text-sm mb-4 text-accent">Key results</h3>
              <div className="space-y-4">
                {[...project.project_results]
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((r) => (
                    <div
                      key={r.id}
                      className="border-b border-border/50 pb-3 last:border-0 last:pb-0"
                    >
                      <p className="text-xs text-muted-foreground font-bold">{r.label}</p>
                      <p className="text-sm font-semibold text-foreground">{r.value}</p>
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
