/**
 * The written case studies that live as standalone pages in /public.
 * Every figure here is copied from the matching page, so the card and the
 * case study always say the same thing. Add a page to /public, then add it here.
 */
export type CaseStudy = {
  href: string;
  brand: string;
  industry: string;
  platform: string;
  summary: string;
  highlights: string[];
};

export type CaseStudyGroup = {
  id: string;
  title: string;
  intro: string;
  items: CaseStudy[];
};

export const CASE_STUDY_GROUPS: CaseStudyGroup[] = [
  {
    id: "email",
    title: "Email marketing",
    intro: "Strategy, copy, design and the automation flows that keep selling after launch day.",
    items: [
      {
        href: "/aurora.html",
        brand: "AuroraSkin",
        industry: "Skincare",
        platform: "Omnisend",
        summary:
          "Account audit, on-brand Figma emails, conversion copy and four automation flows for a growing skincare brand.",
        highlights: [
          "57.45% open rate on order confirmations",
          "$2,804+ in abandoned cart flow sales",
        ],
      },
      {
        href: "/kobefamily.html",
        brand: "Golden Kobe Family",
        industry: "Pet products",
        platform: "Klaviyo, email + SMS",
        summary:
          "A brand new pet brand launched with every email designed, every word written and five Klaviyo flows live from day one.",
        highlights: ["5 live automation flows", "20+ custom emails designed"],
      },
      {
        href: "/otmclo.html",
        brand: "OTMCLO",
        industry: "Streetwear",
        platform: "Klaviyo, email + SMS",
        summary:
          "Strategy, copy, design and four live Klaviyo automations for a streetwear brand that had no email setup at all.",
        highlights: ["4 live flows", "13+ emails written, plus SMS copy"],
      },
      {
        href: "/nextcrest.html",
        brand: "Nexcrest LLC",
        industry: "Real estate",
        platform: "Klaviyo, RESimply, Make.com",
        summary:
          "A 12-email nurture sequence, with every new CRM lead sent into Klaviyo automatically through Make.com webhooks.",
        highlights: ["12 custom email templates", "Leads sync from the CRM in real time"],
      },
      {
        href: "/dosestrips.html",
        brand: "Dose Strips",
        industry: "Health supplements",
        platform: "Klaviyo, Figma",
        summary:
          "Welcome and abandoned cart series designed and written from scratch for a supplement most buyers had never heard of.",
        highlights: ["8 custom email templates", "2 full series built"],
      },
      {
        href: "/cosh.html",
        brand: "Universal Containers",
        industry: "B2B industrial, UK",
        platform: "Mailchimp, Figma",
        summary:
          "B2B emails for a UK chemical storage supplier, written for procurement and site safety teams rather than shoppers.",
        highlights: ["4 email templates", "3 campaign angles: safety, compliance, discount"],
      },
    ],
  },
  {
    id: "systems",
    title: "CRM and project systems",
    intro:
      "The admin side of the business, organised: pipelines, trackers and automations your team actually uses.",
    items: [
      {
        href: "/ogproperties.html",
        brand: "OG Properties",
        industry: "Real estate agency",
        platform: "monday.com CRM",
        summary:
          "A transaction CRM that takes every deal from pre-listing to close, creating the right closing tasks automatically.",
        highlights: ["25 active automations", "$27.2M sold volume tracked in 2023"],
      },
      {
        href: "/homeservice.html",
        brand: "Home Services CRM",
        industry: "Painting and home improvement",
        platform: "monday.com CRM",
        summary:
          "Lead intake, follow-up tracking, commercial accounts and email outreach in one CRM, built from scratch.",
        highlights: ["6 service types tracked", "4 lead sources"],
      },
      {
        href: "/facadeteam.html",
        brand: "The Facade Team",
        industry: "Construction",
        platform: "monday.com",
        summary:
          "Dependency-linked Gantt charts, a three-board workspace and workload dashboards for a multi-elevation facade project.",
        highlights: ["3 connected boards", "4 building elevations tracked"],
      },
    ],
  },
];

export const CASE_STUDY_COUNT = CASE_STUDY_GROUPS.reduce((n, g) => n + g.items.length, 0);

export const PLATFORMS = ["Klaviyo", "Omnisend", "Mailchimp", "monday.com", "Make.com", "Figma"];
