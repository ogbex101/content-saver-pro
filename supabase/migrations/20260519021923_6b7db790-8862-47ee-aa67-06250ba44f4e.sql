
-- Add slideshow timing column
ALTER TABLE public.profile
  ADD COLUMN IF NOT EXISTS slideshow_interval_seconds integer NOT NULL DEFAULT 5;

-- Update stats + humanize copy
UPDATE public.profile SET
  projects_completed = 190,
  happy_clients = 100,
  five_star_reviews = 100,
  case_studies = 20,
  about_intro = 'Hi, I''m Blessing — a writer at heart and an email marketer by craft.',
  hero_intro = 'I help brands turn quiet inboxes into real conversations. For over four years I''ve been writing emails, planning campaigns, and quietly obsessing over the words that make people click, reply, and come back.',
  about_text = 'I didn''t fall into email marketing by accident. I''ve always loved words — the way a good sentence can change how someone feels in a single breath. Email gave me a place where that feeling could also move numbers.

These days I split my time between writing email copy, building campaigns, and helping busy founders get their week back as a virtual assistant. I''m calm, organised, and slightly addicted to a tidy inbox.

If you''re looking for someone who actually reads your brand before writing for it, who answers her messages, and who treats your launch like it''s her own — that''s me.',
  my_story = 'I''m Blessing. I grew up in Lagos, the kid who always wrote the birthday cards, the goodbye notes, the long messages no one asked for. Words just felt like home.

When I found email marketing, it clicked. It wasn''t about being loud — it was about being thoughtful. Picking the right word. Showing up in someone''s inbox like a friend, not a billboard.

Four years in, I''ve worked with founders, coaches, agencies and small teams across more than ten industries. Some weeks I''m writing welcome sequences. Other weeks I''m cleaning up a messy ESP, building automations, or jumping in as a VA so someone can finally take a weekend off.

What I love most isn''t the open rates — it''s the moment a client says, ''people are actually replying.'' That''s the part that never gets old.';

-- Replace services
DELETE FROM public.services;
INSERT INTO public.services (title, description, icon, sort_order) VALUES
  ('Project Management', 'Plans, timelines and the calm follow-through that gets things shipped.', 'ClipboardList', 1),
  ('Virtual Assistant', 'Inbox, calendar and admin handled, so you can focus on the real work.', 'Mail', 2),
  ('Email Marketer', 'Campaigns, sequences and copy that actually get opened and replied to.', 'Mail', 3),
  ('Figma Design Expert', 'Clean, on-brand layouts for emails, decks and landing pages.', 'Sparkles', 4),
  ('Automation Expert', 'Workflows and tools wired up so the busywork runs itself.', 'Settings', 5),
  ('Research & Problem Solver', 'Digs into the data, finds the gap, and writes the fix in plain English.', 'Lightbulb', 6);

-- Replace skills
DELETE FROM public.skills;
INSERT INTO public.skills (title, description, icon, sort_order) VALUES
  ('Project Management', 'Owning timelines end-to-end', 'ClipboardList', 1),
  ('Virtual Assistant', 'Calm, organised support', 'Mail', 2),
  ('Email Marketer', 'Copy that converts', 'Mail', 3),
  ('Figma Design Expert', 'Polished on-brand layouts', 'Sparkles', 4),
  ('Automation Expert', 'Workflows that run themselves', 'Settings', 5),
  ('Research & Problem Solver', 'Spots gaps, ships fixes', 'Lightbulb', 6);

-- Seed mock testimonials (plain text, no links)
DELETE FROM public.testimonials;
INSERT INTO public.testimonials (quote, client_name, rating, date_text, sort_order) VALUES
  ('Blessing rewrote our welcome sequence and our reply rate honestly tripled. She just gets tone.', 'Amara O., Founder', 5, 'Mar 2026', 1),
  ('Calm, fast, and she actually reads your brand before writing a word. Rare combination.', 'Daniel K., Coach', 5, 'Feb 2026', 2),
  ('I came for email copy and stayed for the project management. My week feels lighter.', 'Priya S., Agency Owner', 5, 'Jan 2026', 3),
  ('Our Figma email templates look like a real brand now. Clients keep asking who made them.', 'Tunde A., Creative Lead', 5, 'Dec 2025', 4),
  ('She set up automations that quietly do the work of a part-time hire. Worth every cent.', 'Ifeoma N., E-commerce', 5, 'Nov 2025', 5),
  ('Best VA I''ve worked with. Replies are clear, deadlines are real, no chasing.', 'Marcus L., Consultant', 5, 'Oct 2025', 6);
