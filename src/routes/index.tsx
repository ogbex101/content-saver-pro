import { createFileRoute } from "@tanstack/react-router";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar, { type NavItem } from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MyStorySection from "@/components/MyStorySection";
import ServicesSection from "@/components/ServicesSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import SkillsSection from "@/components/SkillsSection";
import BrandsSection from "@/components/BrandsSection";
import PortfolioSection from "@/components/PortfolioSection";
import ProjectManagementSection from "@/components/ProjectManagementSection";
import CustomSections from "@/components/CustomSections";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { fetchSiteContent } from "@/lib/site-content";
import { CASE_STUDY_COUNT } from "@/lib/case-studies";
import {
  SITE_URL,
  distinctSkills,
  paragraphs,
  publicStats,
  splitRoles,
  summarySentence,
} from "@/lib/display";

const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const Route = createFileRoute("/")({
  // Runs on the server for the first request, so the page arrives with its
  // content already in the HTML (link previews and search engines read it).
  loader: () => fetchSiteContent(),
  staleTime: 60_000,
  head: ({ loaderData }) => {
    const profile = loaderData?.profile;
    const name = profile?.name?.trim();
    const roles = splitRoles(profile?.title || profile?.hero_tagline).join(", ");
    const title = [name, roles || "Email Marketing & Virtual Assistant"]
      .filter(Boolean)
      .join(" | ");
    const description =
      summarySentence(profile?.hero_intro) ||
      "Email marketing, virtual assistance and CRM automation, with written case studies.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `${SITE_URL}/` },
        { property: "og:image", content: OG_IMAGE },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    };
  },
  component: Index,
});

function Index() {
  const content = Route.useLoaderData();
  const { profile, contact } = content;
  const name = profile?.name?.trim() ?? "";
  const skills = distinctSkills(content.skills, content.services);
  const testimonials = content.testimonials;
  const hasAbout =
    !!profile?.about_intro?.trim() ||
    paragraphs(profile?.about_text).length > 0 ||
    publicStats(profile, { hasReviews: testimonials.length > 0 }).length > 0;

  const nav: NavItem[] = [
    content.services.length > 0 && { label: "Services", id: "services" },
    CASE_STUDY_COUNT > 0 && { label: "Case studies", id: "case-studies" },
    content.projects.length > 0 && { label: "Designs", id: "portfolio" },
    hasAbout && { label: "About", id: "about" },
    testimonials.length > 0 && { label: "Testimonials", id: "testimonials" },
    { label: "Contact", id: "contact" },
  ].filter(Boolean) as NavItem[];

  return (
    <>
      <Navbar name={name} items={nav} />
      <ErrorBoundary>
        <HeroSection profile={profile} hasCaseStudies={CASE_STUDY_COUNT > 0} />
      </ErrorBoundary>
      <ErrorBoundary>
        <ServicesSection services={content.services} />
      </ErrorBoundary>
      <ErrorBoundary>
        <CaseStudiesSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <PortfolioSection projects={content.projects} />
      </ErrorBoundary>
      <ErrorBoundary>
        <ProjectManagementSection automations={content.automations} />
      </ErrorBoundary>
      <ErrorBoundary>
        <BrandsSection brands={content.brands} />
      </ErrorBoundary>
      <ErrorBoundary>
        <AboutSection profile={profile} hasReviews={testimonials.length > 0} />
      </ErrorBoundary>
      <ErrorBoundary>
        <MyStorySection profile={profile} />
      </ErrorBoundary>
      <ErrorBoundary>
        <SkillsSection skills={skills} />
      </ErrorBoundary>
      <ErrorBoundary>
        <CustomSections sections={content.customSections} />
      </ErrorBoundary>
      <ErrorBoundary>
        <TestimonialsSection testimonials={testimonials} />
      </ErrorBoundary>
      <ErrorBoundary>
        <ContactSection contact={contact} name={name} />
      </ErrorBoundary>
      <Footer name={name} />
    </>
  );
}
