
-- Fix RLS policies to require admin role for write operations

-- PROFILE
DROP POLICY "Authenticated users can update profile" ON public.profile;
CREATE POLICY "Admins can update profile" ON public.profile FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- SERVICES
DROP POLICY "Auth users can insert services" ON public.services;
DROP POLICY "Auth users can update services" ON public.services;
DROP POLICY "Auth users can delete services" ON public.services;
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- SKILLS
DROP POLICY "Auth users can insert skills" ON public.skills;
DROP POLICY "Auth users can update skills" ON public.skills;
DROP POLICY "Auth users can delete skills" ON public.skills;
CREATE POLICY "Admins can insert skills" ON public.skills FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update skills" ON public.skills FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete skills" ON public.skills FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- BRANDS
DROP POLICY "Auth users can insert brands" ON public.brands;
DROP POLICY "Auth users can update brands" ON public.brands;
DROP POLICY "Auth users can delete brands" ON public.brands;
CREATE POLICY "Admins can insert brands" ON public.brands FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update brands" ON public.brands FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete brands" ON public.brands FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- PROJECTS
DROP POLICY "Auth users can insert projects" ON public.projects;
DROP POLICY "Auth users can update projects" ON public.projects;
DROP POLICY "Auth users can delete projects" ON public.projects;
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- PROJECT RESULTS
DROP POLICY "Auth users can insert project results" ON public.project_results;
DROP POLICY "Auth users can update project results" ON public.project_results;
DROP POLICY "Auth users can delete project results" ON public.project_results;
CREATE POLICY "Admins can insert project results" ON public.project_results FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update project results" ON public.project_results FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete project results" ON public.project_results FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- TESTIMONIALS
DROP POLICY "Auth users can insert testimonials" ON public.testimonials;
DROP POLICY "Auth users can update testimonials" ON public.testimonials;
DROP POLICY "Auth users can delete testimonials" ON public.testimonials;
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- CONTACT INFO
DROP POLICY "Auth users can update contact info" ON public.contact_info;
CREATE POLICY "Admins can update contact info" ON public.contact_info FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
