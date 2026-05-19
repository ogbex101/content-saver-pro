import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "./AnimatedSection";

const BrandsSection = () => {
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("brands").select("*").order("sort_order").then(({ data }) => setBrands(data ?? []));
  }, []);

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 md:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-bold">Trusted By</span>
          <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4">Brands I've Worked With</h2>
          <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto font-semibold">Trusted by businesses across multiple industries</p>
        </AnimatedSection>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {brands.map((b, i) => (
            <AnimatedSection key={b.id} delay={i * 0.04}>
              <div
                className="flex flex-col items-center justify-center p-5 rounded-2xl border border-border/50 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300 min-h-[5rem] gap-2"
                style={{ backgroundColor: b.bg_color === "black" ? "#000000" : "#ffffff" }}
              >
                {b.logo_url && (
                  <img src={b.logo_url} alt={b.name || "Brand"} className="max-h-10 max-w-full object-contain" loading="lazy" />
                )}
                {b.name && (
                  <span className={`text-xs font-bold text-center ${b.bg_color === "black" ? "text-white" : "text-gray-700"}`}>{b.name}</span>
                )}
                {!b.logo_url && !b.name && (
                  <span className="text-xs font-bold text-muted-foreground/50">—</span>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
