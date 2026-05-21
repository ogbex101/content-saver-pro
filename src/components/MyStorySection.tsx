import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const MyStorySection = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.from("profile").select("*").limit(1).single().then(({ data }) => setProfile(data));
  }, []);

  if (!profile) return <section id="mystory" className="py-20 md:py-28 bg-background" />;

  const story = (profile?.my_story && profile.my_story.trim()) ? profile.my_story : "";
  const imgUrl = profile?.profile_image_url;
  const paragraphs = story.split("\n\n").filter((p: string) => p.trim());

  return (
    <section id="mystory" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
      <div className="container mx-auto px-5 md:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="text-accent text-[11px] tracking-[0.35em] uppercase font-semibold">My journey</span>
          <h2 className="font-display text-3xl md:text-5xl font-light mt-4 mb-3">
            My <span className="italic font-medium text-accent">story</span>
          </h2>
          <div className="w-16 h-px bg-foreground/30 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 md:gap-12 items-start">
          {imgUrl && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:sticky md:top-28"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl border border-border">
                <img src={imgUrl} alt="Blessing" className="w-full aspect-[4/5] object-cover" loading="lazy" />
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-4"
          >
            {paragraphs.slice(0, 4).map((p: string, i: number) => (
              <p
                key={i}
                className={`leading-relaxed ${i === 0 ? "font-display text-base md:text-lg text-foreground font-light" : "text-foreground/70 text-sm md:text-base"}`}
              >
                {p}
              </p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MyStorySection;
