
-- 1) Move has_role out of the API-exposed public schema
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Recreate a public.has_role wrapper used by the app's RPC call (client calls supabase.rpc('has_role'))
-- but lock it down so only authenticated users can execute it and only for themselves.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY INVOKER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL
     AND auth.uid() = _user_id
     AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- 2) Repoint all RLS policies to private.has_role
-- brands
DROP POLICY IF EXISTS "Admins can delete brands" ON public.brands;
DROP POLICY IF EXISTS "Admins can insert brands" ON public.brands;
DROP POLICY IF EXISTS "Admins can update brands" ON public.brands;
CREATE POLICY "Admins can delete brands" ON public.brands FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert brands" ON public.brands FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update brands" ON public.brands FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- contact_info
DROP POLICY IF EXISTS "Admins can update contact info" ON public.contact_info;
CREATE POLICY "Admins can update contact info" ON public.contact_info FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- profile
DROP POLICY IF EXISTS "Admins can update profile" ON public.profile;
CREATE POLICY "Admins can update profile" ON public.profile FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- project_images
DROP POLICY IF EXISTS "Admins can delete project images" ON public.project_images;
DROP POLICY IF EXISTS "Admins can insert project images" ON public.project_images;
DROP POLICY IF EXISTS "Admins can update project images" ON public.project_images;
CREATE POLICY "Admins can delete project images" ON public.project_images FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert project images" ON public.project_images FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update project images" ON public.project_images FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- project_results
DROP POLICY IF EXISTS "Admins can delete project results" ON public.project_results;
DROP POLICY IF EXISTS "Admins can insert project results" ON public.project_results;
DROP POLICY IF EXISTS "Admins can update project results" ON public.project_results;
CREATE POLICY "Admins can delete project results" ON public.project_results FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert project results" ON public.project_results FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update project results" ON public.project_results FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- projects
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- services
DROP POLICY IF EXISTS "Admins can delete services" ON public.services;
DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
DROP POLICY IF EXISTS "Admins can update services" ON public.services;
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- skills
DROP POLICY IF EXISTS "Admins can delete skills" ON public.skills;
DROP POLICY IF EXISTS "Admins can insert skills" ON public.skills;
DROP POLICY IF EXISTS "Admins can update skills" ON public.skills;
CREATE POLICY "Admins can delete skills" ON public.skills FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert skills" ON public.skills FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update skills" ON public.skills FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- testimonials
DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- 3) Restrict portfolio storage bucket to admin writes + admin listing.
-- Public direct URL reads (/storage/v1/object/public/...) keep working because the bucket is public.
DROP POLICY IF EXISTS "Public can read portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Public read portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete portfolio" ON storage.objects;

CREATE POLICY "Admins can list portfolio files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'portfolio' AND private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload portfolio files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio' AND private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio' AND private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio' AND private.has_role(auth.uid(), 'admin'));
