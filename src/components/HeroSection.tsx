import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, ArrowDown } from "lucide-react";

const HeroSection = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from("profile").select("*").limit(1).single().then(({ data }) => {
      setProfile(data);
      setLoaded(true);
    });
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const name = profile?.name ?? "Blessing Adepitan";
  const tagline = profile?.hero_tagline ?? "Writer • Email Marketer";
  const intro = profile?.hero_intro ?? "";
  const location = profile?.location ?? "Lagos, Nigeria";
  const rotationEnabled = profile?.hero_rotation_enabled ?? false;
  const heroImages: string[] = profile?.hero_images ?? [];

  const imgUrl = useMemo(() => {
    if (!loaded) return null;
    if (rotationEnabled && heroImages.length > 0) {
      return heroImages[Math.floor(Math.random() * heroImages.length)];
    }
    return profile?.profile_image_url || null;
  }, [profile, loaded]);

  const parts = tagline.split(/,\s*|•/).map((s: string) => s.trim()).filter(Boolean);

  if (!loaded) return <section id="home" className="min-h-screen bg-background" />;

  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden bg-background">
      {/* Soft paper texture accents */}
      <div className="absolute top-32 -right-32 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-foreground/[0.04] blur-3xl pointer-events-none" />

      <div className="container mx-auto px-5 md:px-8 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text — left on desktop, top on mobile */}
          <div className="order-2 lg:order-1 text-left">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-semibold text-muted-foreground mb-5"
            >
              <span className="w-8 h-px bg-accent" /> Hello, I'm
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight mb-6"
            >
              {name.split(" ")[0]}
              <span className="text-accent">.</span>
              <span className="block font-semibold">{name.split(" ").slice(1).join(" ")}</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:text-base text-muted-foreground mb-3"
            >
              {parts.map((p: string, i: number) => (
                <span key={i} className="flex items-center gap-3">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-accent" />}
                  <span className="font-medium text-foreground/80">{p}</span>
                </span>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex items-center gap-2 text-xs text-muted-foreground mb-7"
            >
              <MapPin size={13} className="text-accent" /> <span className="font-medium">{location}</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-foreground/70 leading-relaxed mb-9 text-base md:text-lg max-w-xl font-normal"
            >
              {intro}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <button onClick={() => scrollTo("portfolio")} className="group inline-flex items-center gap-2 bg-foreground text-background px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-foreground/90 transition-all duration-300">
                View my work
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={() => scrollTo("contact")} className="inline-flex items-center gap-2 border border-foreground/20 text-foreground px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:border-accent hover:text-accent transition-all duration-300">
                Let's connect
              </button>
            </motion.div>
          </div>

          {/* Image — right on desktop, top on mobile */}
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
                {imgUrl && <img src={imgUrl} alt={name} className="w-full h-full object-cover" />}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute -bottom-5 -left-5 bg-card border border-border shadow-xl rounded-2xl px-5 py-3"
              >
                <div className="text-2xl font-display font-semibold text-foreground">190+</div>
                <div className="text-[10px] tracking-widest uppercase text-muted-foreground font-semibold">Projects shipped</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex justify-center mt-20">
          <button onClick={() => scrollTo("about")} className="animate-bounce text-muted-foreground hover:text-accent transition-colors">
            <ArrowDown size={22} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
