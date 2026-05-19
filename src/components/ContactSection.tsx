import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, Instagram, Linkedin, Send } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const ContactSection = () => {
  const [contact, setContact] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.from("contact_info").select("*").limit(1).single().then(({ data }) => setContact(data));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = contact?.email ?? "Adepitanayomide100@gmail.com";
    const mailto = `mailto:${email}?subject=Portfolio Inquiry from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${encodeURIComponent(form.name)} (${encodeURIComponent(form.email)})`;
    window.open(mailto);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const phone = contact?.phone ?? "+2348166769019";
  const email = contact?.email ?? "Adepitanayomide100@gmail.com";
  const instagram = contact?.instagram_url;
  const linkedin = contact?.linkedin_url;

  return (
    <section id="contact" className="py-24 md:py-32 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-bold">Let's Talk</span>
          <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4">Get In Touch</h2>
          <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto font-semibold">I would love to hear from you</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12">
          <AnimatedSection className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-gold/30 transition-all">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0"><Phone size={20} className="text-primary-foreground" /></div>
              <div>
                <p className="text-xs text-muted-foreground font-bold">Phone</p>
                <a href={`tel:${phone}`} className="font-bold text-sm hover:text-gold transition-colors">{phone}</a>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-gold/30 transition-all">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0"><Mail size={20} className="text-primary-foreground" /></div>
              <div>
                <p className="text-xs text-muted-foreground font-bold">Email</p>
                <a href={`mailto:${email}`} className="font-bold text-sm hover:text-gold transition-colors">{email}</a>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-all">
                  <Instagram size={20} />
                </a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-all">
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Your Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-5 py-3.5 rounded-xl border border-border/50 bg-card text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all" />
              <input type="email" placeholder="Your Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-5 py-3.5 rounded-xl border border-border/50 bg-card text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all" />
              <textarea placeholder="Your Message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-5 py-3.5 rounded-xl border border-border/50 bg-card text-sm font-semibold resize-none focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all" />
              <button type="submit" className="w-full gradient-gold text-primary-foreground py-3.5 rounded-xl font-bold tracking-wider uppercase text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold/25 transition-all duration-300">
                {sent ? "Opening Email Client..." : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;