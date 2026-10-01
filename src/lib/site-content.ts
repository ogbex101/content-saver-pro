import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { realTestimonials } from "@/lib/display";

export type Profile = Tables<"profile">;
export type ContactInfo = Tables<"contact_info">;
export type Service = Tables<"services">;
export type Skill = Tables<"skills">;
export type Brand = Tables<"brands">;
export type Testimonial = Tables<"testimonials">;
export type Project = Tables<"projects"> & {
  project_results?: unknown[];
  project_images?: { image_url: string; caption?: string | null; sort_order?: number }[];
};
export type Automation = Tables<"automations">;
export type CustomSection = {
  id: string;
  title: string;
  subtitle: string | null;
  layout: "grid" | "carousel" | "list" | "cards";
  items: Array<{ title: string; description?: string; image_url?: string; link?: string }>;
  sort_order: number;
};

export type SiteContent = {
  profile: Profile | null;
  contact: ContactInfo | null;
  services: Service[];
  skills: Skill[];
  brands: Brand[];
  projects: Project[];
  automations: Automation[];
  customSections: CustomSection[];
  testimonials: Testimonial[];
};

/**
 * One failed table must not take the whole page down, so every query is
 * wrapped and falls back to "nothing to show" for that section.
 */
async function safe<T>(
  label: string,
  run: () => PromiseLike<{ data: unknown; error: unknown }>,
  empty: T,
): Promise<T> {
  try {
    const { data, error } = await run();
    if (error) {
      console.error(`[site-content] ${label}:`, error);
      return empty;
    }
    return (data as T) ?? empty;
  } catch (error) {
    console.error(`[site-content] ${label}:`, error);
    return empty;
  }
}

/**
 * Everything the home page shows, loaded in the route loader. It runs on the
 * server for the first visit, so the HTML that link previews, search engines
 * and slow phones receive already contains the content, not empty sections.
 */
export async function fetchSiteContent(): Promise<SiteContent> {
  const [
    profile,
    contact,
    services,
    skills,
    brands,
    projects,
    automations,
    customSections,
    testimonials,
  ] = await Promise.all([
    safe<Profile | null>(
      "profile",
      () => supabase.from("profile").select("*").limit(1).maybeSingle(),
      null,
    ),
    safe<ContactInfo | null>(
      "contact_info",
      () => supabase.from("contact_info").select("*").limit(1).maybeSingle(),
      null,
    ),
    safe<Service[]>(
      "services",
      () => supabase.from("services").select("*").order("sort_order"),
      [],
    ),
    safe<Skill[]>("skills", () => supabase.from("skills").select("*").order("sort_order"), []),
    safe<Brand[]>("brands", () => supabase.from("brands").select("*").order("sort_order"), []),
    safe<Project[]>(
      "projects",
      () =>
        supabase
          .from("projects")
          .select("*, project_results(*), project_images(*)")
          .eq("featured_on_homepage", true)
          .order("sort_order")
          .limit(12),
      [],
    ),
    safe<Automation[]>(
      "automations",
      () => supabase.from("automations").select("*").order("sort_order"),
      [],
    ),
    safe<CustomSection[]>(
      "custom_sections",
      () =>
        supabase
          .from("custom_sections" as never)
          .select("*")
          .eq("published", true)
          .order("sort_order"),
      [],
    ),
    safe<Testimonial[]>(
      "testimonials",
      () => supabase.from("testimonials").select("*").order("sort_order"),
      [],
    ),
  ]);

  return {
    profile,
    contact,
    services,
    skills,
    brands,
    projects,
    automations,
    customSections,
    // Sample reviews are dropped here, so they never even reach the browser.
    testimonials: realTestimonials(testimonials),
  };
}
