import { useState } from "react";
import { Phone, Mail, Instagram, Linkedin, Send, MessageCircle } from "lucide-react";
import type { ContactInfo } from "@/lib/site-content";
import { cleanEmail, mailtoHref, phoneDisplay, telHref, whatsappHref } from "@/lib/display";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";

const inputCls =
  "w-full px-5 py-3.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all";

const ContactSection = ({ contact, name }: { contact: ContactInfo | null; name: string }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  // Everything comes from Admin > Profile > Contact. Nothing is hardcoded, so
  // replies always go to whoever the page belongs to.
  const email = cleanEmail(contact?.email);
  const phone = phoneDisplay(contact?.phone);
  const tel = telHref(contact?.phone);
  const firstName = name.split(/\s+/)[0] || "there";
  const whatsapp = whatsappHref(
    contact?.phone,
    `Hi ${firstName}, I saw your portfolio and I'd like to talk about a project.`,
  );
  const socials = [
    { href: contact?.linkedin_url, label: "LinkedIn", Icon: Linkedin },
    { href: contact?.instagram_url, label: "Instagram", Icon: Instagram },
  ].filter((s): s is { href: string; label: string; Icon: typeof Linkedin } => !!s.href?.trim());

  if (!email && !phone && socials.length === 0) return null;

  const messageBody = () => `${form.message}\n\nFrom: ${form.name} (${form.email})`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    window.location.href = mailtoHref(email, `Project enquiry from ${form.name}`, messageBody());
    setSent(true);
  };

  const whatsappWithForm = () => {
    const text = form.message.trim()
      ? `Hi ${firstName}, this is ${form.name || "a visitor from your portfolio"}.\n\n${form.message}`
      : `Hi ${firstName}, I saw your portfolio and I'd like to talk about a project.`;
    return whatsappHref(contact?.phone, text);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <SectionHeading
          eyebrow="Let's talk"
          title="Get in"
          accent="touch"
          intro="Tell me a little about your business and what you need help with."
        />

        <div className={`grid gap-10 md:gap-12 ${email ? "md:grid-cols-2" : "max-w-md mx-auto"}`}>
          <AnimatedSection className="space-y-4">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/40 transition-all"
              >
                <span className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground font-semibold">Email</span>
                  <span className="block font-semibold text-sm break-all">{email}</span>
                </span>
              </a>
            )}
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/40 transition-all"
              >
                <span className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={20} />
                </span>
                <span>
                  <span className="block text-xs text-muted-foreground font-semibold">
                    WhatsApp
                  </span>
                  <span className="block font-semibold text-sm">Message me on WhatsApp</span>
                </span>
              </a>
            )}
            {phone && tel && (
              <a
                href={tel}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/40 transition-all"
              >
                <span className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center flex-shrink-0">
                  <Phone size={20} />
                </span>
                <span>
                  <span className="block text-xs text-muted-foreground font-semibold">Phone</span>
                  <span className="block font-semibold text-sm">{phone}</span>
                </span>
              </a>
            )}
            {socials.length > 0 && (
              <div className="flex gap-3 pt-2">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:border-accent/50 hover:text-accent transition-all"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            )}
          </AnimatedSection>

          {email && (
            <AnimatedSection delay={0.15}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="sr-only" htmlFor="contact-name">
                  Your name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                />
                <label className="sr-only" htmlFor="contact-email">
                  Your email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="Your email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                />
                <label className="sr-only" htmlFor="contact-message">
                  What do you need help with?
                </label>
                <textarea
                  id="contact-message"
                  placeholder="What do you need help with?"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputCls} resize-none`}
                />
                <button
                  type="submit"
                  className="w-full bg-foreground text-background py-3.5 rounded-xl font-semibold tracking-wide text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all duration-300"
                >
                  <Send size={16} /> Send message
                </button>
                {sent && (
                  <p className="text-xs text-muted-foreground leading-relaxed" role="status">
                    Your email app should now be open with the message ready to send. If nothing
                    opened, email{" "}
                    <a href={`mailto:${email}`} className="underline hover:text-accent">
                      {email}
                    </a>
                    {whatsapp && (
                      <>
                        {" "}
                        or{" "}
                        <a
                          href={whatsappWithForm() ?? whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-accent"
                        >
                          send it on WhatsApp
                        </a>
                      </>
                    )}
                    .
                  </p>
                )}
              </form>
            </AnimatedSection>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
