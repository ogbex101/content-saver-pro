
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Blessing Adepitan',
  title TEXT NOT NULL DEFAULT 'Writer • Email Marketing Specialist • Virtual Assistant',
  location TEXT NOT NULL DEFAULT 'Lagos, Nigeria',
  hero_tagline TEXT NOT NULL DEFAULT 'I''m a WRITER, I''m an EMAIL MARKETER',
  hero_intro TEXT NOT NULL DEFAULT '',
  about_text TEXT NOT NULL DEFAULT '',
  profile_image_url TEXT,
  projects_completed INTEGER NOT NULL DEFAULT 165,
  happy_clients INTEGER NOT NULL DEFAULT 130,
  five_star_reviews INTEGER NOT NULL DEFAULT 30,
  case_studies INTEGER NOT NULL DEFAULT 11,
  hero_images jsonb DEFAULT '[]'::jsonb,
  hero_rotation_enabled boolean NOT NULL DEFAULT false,
  my_story text NOT NULL DEFAULT '',
  about_intro text NOT NULL DEFAULT '',
  slideshow_interval_seconds integer NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profile is publicly readable" ON public.profile FOR SELECT USING (true);
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON public.profile FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Pen',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are publicly readable" ON public.services FOR SELECT USING (true);
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Pen',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skills are publicly readable" ON public.skills FOR SELECT USING (true);
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  bg_color text NOT NULL DEFAULT 'white',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brands are publicly readable" ON public.brands FOR SELECT USING (true);
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  industry TEXT NOT NULL,
  platform TEXT NOT NULL,
  key_result TEXT NOT NULL,
  description TEXT NOT NULL,
  figma_link TEXT,
  featured_image_url TEXT,
  figma_preview_url text,
  featured_on_homepage boolean NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are publicly readable" ON public.projects FOR SELECT USING (true);
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.project_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);
ALTER TABLE public.project_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project results are publicly readable" ON public.project_results FOR SELECT USING (true);

CREATE TABLE public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project images are publicly readable" ON public.project_images FOR SELECT TO public USING (true);

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  date_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Testimonials are publicly readable" ON public.testimonials FOR SELECT USING (true);
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL DEFAULT '+2348166769019',
  email TEXT NOT NULL DEFAULT 'Adepitanayomide100@gmail.com',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/virtualassistant_4u/',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/blessing-adepitan-email-marketer-email-copywriter',
  pinterest_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contact info is publicly readable" ON public.contact_info FOR SELECT USING (true);
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Admin write policies
CREATE POLICY "Admins can update profile" ON public.profile FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert skills" ON public.skills FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update skills" ON public.skills FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete skills" ON public.skills FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert brands" ON public.brands FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update brands" ON public.brands FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete brands" ON public.brands FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert project results" ON public.project_results FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update project results" ON public.project_results FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete project results" ON public.project_results FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert project images" ON public.project_images FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update project images" ON public.project_images FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete project images" ON public.project_images FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact info" ON public.contact_info FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);
CREATE POLICY "Portfolio files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Authenticated users can upload portfolio files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio');
CREATE POLICY "Authenticated users can update portfolio files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio');
CREATE POLICY "Authenticated users can delete portfolio files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio');

-- Seed profile
INSERT INTO public.profile (hero_intro, about_text, about_intro, my_story, projects_completed, happy_clients, five_star_reviews, case_studies) VALUES (
  'I help brands turn quiet inboxes into real conversations. For over four years I''ve been writing emails, planning campaigns, and quietly obsessing over the words that make people click, reply, and come back.',
  'I didn''t fall into email marketing by accident. I''ve always loved words. These days I split my time between writing email copy, building campaigns, and helping busy founders get their week back as a virtual assistant.',
  'Hi, I''m Blessing — a writer at heart and an email marketer by craft.',
  'I''m Blessing. I grew up in Lagos, the kid who always wrote the birthday cards, the goodbye notes, the long messages no one asked for. Words just felt like home.',
  190, 100, 100, 20
);

INSERT INTO public.services (title, description, icon, sort_order) VALUES
  ('Project Management', 'Plans, timelines and the calm follow-through that gets things shipped.', 'ClipboardList', 1),
  ('Virtual Assistant', 'Inbox, calendar and admin handled, so you can focus on the real work.', 'Mail', 2),
  ('Email Marketer', 'Campaigns, sequences and copy that actually get opened and replied to.', 'Mail', 3),
  ('Figma Design Expert', 'Clean, on-brand layouts for emails, decks and landing pages.', 'Sparkles', 4),
  ('Automation Expert', 'Workflows and tools wired up so the busywork runs itself.', 'Settings', 5),
  ('Research & Problem Solver', 'Digs into the data, finds the gap, and writes the fix in plain English.', 'Lightbulb', 6);

INSERT INTO public.skills (title, description, icon, sort_order) VALUES
  ('Project Management', 'Owning timelines end-to-end', 'ClipboardList', 1),
  ('Virtual Assistant', 'Calm, organised support', 'Mail', 2),
  ('Email Marketer', 'Copy that converts', 'Mail', 3),
  ('Figma Design Expert', 'Polished on-brand layouts', 'Sparkles', 4),
  ('Automation Expert', 'Workflows that run themselves', 'Settings', 5),
  ('Research & Problem Solver', 'Spots gaps, ships fixes', 'Lightbulb', 6);

INSERT INTO public.testimonials (quote, client_name, rating, date_text, sort_order) VALUES
  ('Blessing rewrote our welcome sequence and our reply rate honestly tripled. She just gets tone.', 'Amara O., Founder', 5, 'Mar 2026', 1),
  ('Calm, fast, and she actually reads your brand before writing a word. Rare combination.', 'Daniel K., Coach', 5, 'Feb 2026', 2),
  ('I came for email copy and stayed for the project management. My week feels lighter.', 'Priya S., Agency Owner', 5, 'Jan 2026', 3),
  ('Our Figma email templates look like a real brand now. Clients keep asking who made them.', 'Tunde A., Creative Lead', 5, 'Dec 2025', 4),
  ('She set up automations that quietly do the work of a part-time hire. Worth every cent.', 'Ifeoma N., E-commerce', 5, 'Nov 2025', 5),
  ('Best VA I''ve worked with. Replies are clear, deadlines are real, no chasing.', 'Marcus L., Consultant', 5, 'Oct 2025', 6);

INSERT INTO public.contact_info DEFAULT VALUES;
