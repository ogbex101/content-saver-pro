
-- Create project_images table for multi-image gallery per project
CREATE TABLE public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project images are publicly readable"
  ON public.project_images FOR SELECT TO public USING (true);

CREATE POLICY "Admins can insert project images"
  ON public.project_images FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update project images"
  ON public.project_images FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete project images"
  ON public.project_images FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add figma_preview_url to projects table for figma design thumbnail
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS figma_preview_url text;
