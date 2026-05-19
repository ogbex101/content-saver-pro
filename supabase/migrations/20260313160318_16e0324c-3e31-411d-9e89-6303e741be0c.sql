
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- PROFILE (single row for site owner info)
CREATE TABLE public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Blessing Adepitan',
  title TEXT NOT NULL DEFAULT 'Writer • Email Marketing Specialist • Virtual Assistant',
  location TEXT NOT NULL DEFAULT 'Lagos, Nigeria',
  hero_tagline TEXT NOT NULL DEFAULT 'I''m a WRITER, I''m an EMAIL MARKETER',
  hero_intro TEXT NOT NULL DEFAULT 'Email Marketing Specialist and Content Creator with 4+ years of experience crafting email campaigns and content that connect, engage, and convert.',
  about_text TEXT NOT NULL DEFAULT '',
  profile_image_url TEXT,
  projects_completed INTEGER NOT NULL DEFAULT 165,
  happy_clients INTEGER NOT NULL DEFAULT 130,
  five_star_reviews INTEGER NOT NULL DEFAULT 30,
  case_studies INTEGER NOT NULL DEFAULT 11,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profile is publicly readable" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update profile" ON public.profile FOR UPDATE TO authenticated USING (true);
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON public.profile FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SERVICES
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
CREATE POLICY "Auth users can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update services" ON public.services FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete services" ON public.services FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SKILLS
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
CREATE POLICY "Auth users can insert skills" ON public.skills FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update skills" ON public.skills FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete skills" ON public.skills FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- BRANDS
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brands are publicly readable" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Auth users can insert brands" ON public.brands FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update brands" ON public.brands FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete brands" ON public.brands FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PROJECTS (portfolio)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  industry TEXT NOT NULL,
  platform TEXT NOT NULL,
  key_result TEXT NOT NULL,
  description TEXT NOT NULL,
  figma_link TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are publicly readable" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Auth users can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update projects" ON public.projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete projects" ON public.projects FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PROJECT RESULTS (metrics for each project)
CREATE TABLE public.project_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.project_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project results are publicly readable" ON public.project_results FOR SELECT USING (true);
CREATE POLICY "Auth users can insert project results" ON public.project_results FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update project results" ON public.project_results FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete project results" ON public.project_results FOR DELETE TO authenticated USING (true);

-- TESTIMONIALS
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
CREATE POLICY "Auth users can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CONTACT INFO (single row)
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
CREATE POLICY "Auth users can update contact info" ON public.contact_info FOR UPDATE TO authenticated USING (true);
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- USER ROLES for admin access
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
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
