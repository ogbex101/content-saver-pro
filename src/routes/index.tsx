import { createFileRoute } from "@tanstack/react-router";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MyStorySection from "@/components/MyStorySection";
import ServicesSection from "@/components/ServicesSection";
import SkillsSection from "@/components/SkillsSection";
import BrandsSection from "@/components/BrandsSection";
import PortfolioSection from "@/components/PortfolioSection";
import ProjectManagementSection from "@/components/ProjectManagementSection";
import CustomSections from "@/components/CustomSections";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Navbar />
      <ErrorBoundary><HeroSection /></ErrorBoundary>
      <ErrorBoundary><AboutSection /></ErrorBoundary>
      <ErrorBoundary><MyStorySection /></ErrorBoundary>
      <ErrorBoundary><ServicesSection /></ErrorBoundary>
      <ErrorBoundary><SkillsSection /></ErrorBoundary>
      <ErrorBoundary><BrandsSection /></ErrorBoundary>
      <ErrorBoundary><PortfolioSection /></ErrorBoundary>
      <ErrorBoundary><ProjectManagementSection /></ErrorBoundary>
      <ErrorBoundary><CustomSections /></ErrorBoundary>
      <ErrorBoundary><TestimonialsSection /></ErrorBoundary>
      <ErrorBoundary><ContactSection /></ErrorBoundary>
      <Footer />
    </>
  );
}
