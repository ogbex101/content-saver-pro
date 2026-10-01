import { motion } from "framer-motion";
import type { Profile } from "@/lib/site-content";
import { paragraphs } from "@/lib/display";
import SectionHeading from "./SectionHeading";

const MyStorySection = ({ profile }: { profile: Profile | null }) => {
  const story = paragraphs(profile?.my_story).slice(0, 4);
  if (story.length === 0) return null;
  const imgUrl = profile?.profile_image_url;
  const name = profile?.name?.trim();

  return (
    <section id="mystory" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
      <div className="container mx-auto px-5 md:px-8 max-w-5xl">
        <SectionHeading eyebrow="My journey" title="My" accent="story" />

        <div
          className={`grid gap-8 md:gap-12 items-start ${imgUrl ? "md:grid-cols-[1fr_1.5fr]" : "max-w-3xl mx-auto"}`}
        >
          {imgUrl && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:sticky md:top-28"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl border border-border">
                <img
                  src={imgUrl}
                  alt={name || "Portrait"}
                  className="w-full aspect-[4/5] object-cover"
                  loading="lazy"
                />
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
            {story.map((p, i) => (
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
