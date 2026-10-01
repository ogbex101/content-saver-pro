import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, ArrowDown } from "lucide-react";
import type { Profile } from "@/lib/site-content";
import { splitRoles } from "@/lib/display";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const HeroSection = ({
  profile,
  hasCaseStudies,
}: {
  profile: Profile | null;
  hasCaseStudies: boolean;
}) => {
  const name = profile?.name?.trim() ?? "";
  const [firstName, ...rest] = name.split(/\s+/);
  const roles = splitRoles(profile?.hero_tagline || profile?.title);
  const intro = profile?.hero_intro?.trim();
  const location = profile?.location?.trim();
  const projects = profile?.projects_completed ?? 0;

  const heroImages = Array.isArray(profile?.hero_images)
    ? (profile!.hero_images as unknown[]).filter((u): u is string => typeof u === "string" && !!u)
    : [];
  const rotation = !!profile?.hero_rotation_enabled && heroImages.length > 0;

  // The server always renders the first photo; the random pick happens after
  // the page loads, so the server and browser HTML agree.
  const [imgUrl, setImgUrl] = useState<string | null>(
    rotation ? heroImages[0] : (profile?.profile_image_url ?? null),
  );
  useEffect(() => {
    if (rotation && heroImages.length > 1) {
      setImgUrl(heroImages[Math.floor(Math.random() * heroImages.length)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotation, heroImages.length]);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden bg-background"
    >
      <div className="absolute top-32 -right-32 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-foreground/[0.04] blur-3xl pointer-events-none" />

      <div className="container mx-auto px-5 md:px-8 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1 text-left">
            {name && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-semibold text-muted-foreground mb-5"
              >
                <span className="w-8 h-px bg-accent" /> Hello, I'm
              </motion.div>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight mb-6"
            >
              {name ? (
                <>
                  {firstName}
                  <span className="text-accent">.</span>
                  {rest.length > 0 && <span className="block font-semibold">{rest.join(" ")}</span>}
                </>
              ) : (
                <>
                  Email, admin <span className="block font-semibold">and automation.</span>
                </>
              )}
            </motion.h1>
            {roles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:text-base text-muted-foreground mb-3"
              >
                {roles.map((role, i) => (
                  <span key={role} className="flex items-center gap-3">
                    {i > 0 && <span className="w-1 h-1 rounded-full bg-accent" />}
                    <span className="font-medium text-foreground/80">{role}</span>
                  </span>
                ))}
              </motion.div>
            )}
            {location && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex items-center gap-2 text-xs text-muted-foreground mb-7"
              >
                <MapPin size={13} className="text-accent" />{" "}
                <span className="font-medium">{location}</span>
                <span className="text-muted-foreground/70">· Working with clients remotely</span>
              </motion.div>
            )}
            {intro && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-foreground/70 leading-relaxed mb-9 text-base md:text-lg max-w-xl font-normal"
              >
                {intro}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href={hasCaseStudies ? "#case-studies" : "#portfolio"}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(hasCaseStudies ? "case-studies" : "portfolio");
                }}
                className="group inline-flex items-center gap-2 bg-foreground text-background px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-foreground/90 transition-all duration-300"
              >
                {hasCaseStudies ? "See case studies" : "View my work"}
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("contact");
                }}
                className="inline-flex items-center gap-2 border border-foreground/20 text-foreground px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:border-accent hover:text-accent transition-all duration-300"
              >
                Let's talk
              </a>
            </motion.div>
          </div>

          {imgUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="order-1 lg:order-2 relative mx-auto lg:ml-auto"
            >
              <div className="relative">
                <div className="absolute -inset-4 border border-accent/30 rounded-[2rem] -rotate-3" />
                <div className="absolute -inset-2 bg-accent/10 rounded-[1.5rem] rotate-2" />
                <div className="relative w-[280px] h-[340px] sm:w-[340px] sm:h-[420px] lg:w-[420px] lg:h-[520px] rounded-[1.5rem] overflow-hidden shadow-2xl shadow-foreground/10 bg-muted">
                  <img
                    src={imgUrl}
                    alt={name || "Portrait"}
                    className="w-full h-full object-cover"
                  />
                </div>
                {projects > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="absolute -bottom-5 -left-5 bg-card border border-border shadow-xl rounded-2xl px-5 py-3"
                  >
                    <div className="text-2xl font-display font-semibold text-foreground">
                      {projects}+
                    </div>
                    <div className="text-[10px] tracking-widest uppercase text-muted-foreground font-semibold">
                      Projects completed
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center mt-20"
        >
          <button
            onClick={() => scrollTo("services")}
            aria-label="Scroll to services"
            className="animate-bounce text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowDown size={22} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
