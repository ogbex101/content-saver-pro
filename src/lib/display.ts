/**
 * Display rules for the public page. Content stays editable in the admin
 * dashboard; these helpers only decide how (and whether) it is shown, so a
 * prospect arriving from an outreach message never sees placeholder copy,
 * sample reviews or a contact link that goes nowhere.
 */

/** Public address of the site. Change this if the site moves to a custom domain. */
export const SITE_URL = "https://content-saver-pro.lovable.app";

/**
 * Phone numbers are stored as typed (e.g. "0816 676 9019" or "+2348166769019").
 * tel: and wa.me links need the full international number, so a Nigerian
 * local number (11 digits starting with 0) gets the +234 country code.
 */
export function internationalDigits(raw?: string | null): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (/^0\d{10}$/.test(digits)) digits = `234${digits.slice(1)}`;
  if (digits.length < 8 || digits.length > 15 || digits.startsWith("0")) return null;
  return digits;
}

export function phoneDisplay(raw?: string | null): string | null {
  const digits = internationalDigits(raw);
  if (!digits) return null;
  if (digits.startsWith("234") && digits.length === 13) {
    return `+234 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return `+${digits}`;
}

export const telHref = (raw?: string | null) => {
  const digits = internationalDigits(raw);
  return digits ? `tel:+${digits}` : null;
};

export const whatsappHref = (raw?: string | null, message?: string) => {
  const digits = internationalDigits(raw);
  if (!digits) return null;
  return message
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${digits}`;
};

/** Template leftovers such as hello@youremail.com never reach the page. */
export function cleanEmail(raw?: string | null): string | null {
  const email = (raw ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (/@(youremail|example|email)\.(com|org|net)$/i.test(email)) return null;
  return email;
}

export function mailtoHref(email: string, subject: string, body?: string) {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${email}?${params.join("&")}`;
}

const normalize = (text?: string | null) =>
  (text ?? "")
    .toLowerCase()
    .replace(/[‘’“”'"]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Six sample reviews were seeded into the testimonials table by the site
 * builder (migration 20260519021923, "Seed mock testimonials"). They are not
 * from real clients, so they are never shown publicly, even if they are still
 * in the database. Real testimonials added in the admin dashboard show as usual.
 */
const SAMPLE_TESTIMONIALS = [
  "Blessing rewrote our welcome sequence and our reply rate honestly tripled. She just gets tone.",
  "Calm, fast, and she actually reads your brand before writing a word. Rare combination.",
  "I came for email copy and stayed for the project management. My week feels lighter.",
  "Our Figma email templates look like a real brand now. Clients keep asking who made them.",
  "She set up automations that quietly do the work of a part-time hire. Worth every cent.",
  "Best VA I've worked with. Replies are clear, deadlines are real, no chasing.",
].map(normalize);

export function realTestimonials<T extends { quote?: string | null; client_name?: string | null }>(
  testimonials: T[],
): T[] {
  return testimonials.filter((t) => {
    const quote = normalize(t.quote);
    return quote.length > 0 && !!t.client_name?.trim() && !SAMPLE_TESTIMONIALS.includes(quote);
  });
}

/** Skills that repeat a service word for word are shown once, under services. */
export function distinctSkills<T extends { title?: string | null }>(
  skills: T[],
  services: { title?: string | null }[],
): T[] {
  const serviceTitles = new Set(services.map((s) => normalize(s.title)));
  return skills.filter((s) => normalize(s.title) && !serviceTitles.has(normalize(s.title)));
}

export type ProfileStats = {
  projects_completed?: number | null;
  happy_clients?: number | null;
  five_star_reviews?: number | null;
  case_studies?: number | null;
};

/**
 * Only numbers set in the admin dashboard are shown, and 0 hides a stat.
 * The page never claims more than it shows: the case study count is left out
 * (the case studies section already shows the real number), and "five-star
 * reviews" only appears when at least one review is on the page.
 */
export function publicStats(
  profile: ProfileStats | null | undefined,
  opts: { hasReviews?: boolean } = {},
) {
  if (!profile) return [];
  return [
    { value: profile.projects_completed ?? 0, label: "Projects completed" },
    { value: profile.happy_clients ?? 0, label: "Happy clients" },
    { value: opts.hasReviews ? (profile.five_star_reviews ?? 0) : 0, label: "Five-star reviews" },
  ].filter((s) => Number.isFinite(s.value) && s.value > 0);
}

/** "Writer • Email Marketing Specialist" → ["Writer", "Email Marketing Specialist"] */
export const splitRoles = (text?: string | null) =>
  (text ?? "")
    .split(/,\s*|•|·|\|/)
    .map((s) => s.trim())
    .filter(Boolean);

/** First sentence (or the first ~160 characters) of a paragraph, for link previews. */
export function summarySentence(text?: string | null, max = 160): string {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const first = clean.match(/^.+?[.!?](\s|$)/)?.[0].trim() ?? clean;
  if (first.length <= max) return first;
  return `${first.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export const paragraphs = (text?: string | null) =>
  (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
