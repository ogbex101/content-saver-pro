-- Add featured_on_homepage to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured_on_homepage boolean NOT NULL DEFAULT true;

-- Add hero rotation fields to profile
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS hero_images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS hero_rotation_enabled boolean NOT NULL DEFAULT false;

-- Add my_story to profile
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS my_story text NOT NULL DEFAULT '';

-- Make brands name have a default so it's optional in practice
ALTER TABLE public.brands ALTER COLUMN name SET DEFAULT '';