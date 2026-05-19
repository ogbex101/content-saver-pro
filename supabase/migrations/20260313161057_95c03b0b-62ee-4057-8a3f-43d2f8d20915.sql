
-- Create public storage bucket for portfolio assets
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- Allow public read access
CREATE POLICY "Portfolio files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload portfolio files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update portfolio files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete portfolio files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio');

-- Add image columns to projects table
ALTER TABLE public.projects ADD COLUMN featured_image_url TEXT;
