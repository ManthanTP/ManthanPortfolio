-- Idempotent Supabase Migrations for Manthan Portfolio
-- Phase 7 Upgrade

-- 1. Alter projects table to add new editable fields
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS problem TEXT;

-- 2. Function: increment_post_likes
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.posts
  SET likes = COALESCE(likes, 0) + 1
  WHERE id = post_id;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_post_likes(UUID) TO anon, authenticated;

-- 3. Function: increment_page_visits
CREATE OR REPLACE FUNCTION increment_page_visits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.site_settings (key, value, updated_at)
  VALUES ('total_visitors', '1', timezone('utc'::text, now()))
  ON CONFLICT (key)
  DO UPDATE SET
    value = (COALESCE(NULLIF(public.site_settings.value, ''), '0')::bigint + 1)::text,
    updated_at = timezone('utc'::text, now());
END;
$$;

GRANT EXECUTE ON FUNCTION increment_page_visits() TO anon, authenticated;

-- 4. Seed new settings keys (idempotent, won't overwrite existing user data)
INSERT INTO public.site_settings (key, value)
VALUES
  ('hero_tagline', 'Full-stack developer building AI-powered web applications and high-performance interfaces.'),
  ('availability_status', 'open'),
  ('availability_text', 'Available for freelance & full-time roles'),
  ('career_start_date', '2023-09'),
  ('show_phone', 'false'),
  ('show_map', 'false'),
  ('blog_min_posts', '1'),
  ('bg_video_enabled', 'true'),
  ('quick_info_enabled', 'true'),
  ('music_url', ''),
  ('music_title', 'Ambient Focus'),
  ('drive_cards', '[{"icon":"Sparkles","title":"AI & Automation First","statement":"Leveraging generative AI and intelligent workflows to compress dev cycles and build adaptive user experiences.","proof_label":"Explore AgentFlow","project_slug":"agentflow"},{"icon":"Cpu","title":"High-Performance Web Architecture","statement":"Obsessed with sub-second response times, fluid 60fps animations, and zero-jank frontend systems.","proof_label":"View NexStore","project_slug":"nexstore"},{"icon":"Palette","title":"Craft & Design Systems","statement":"Bridging typography, deliberate spacing, and micro-interactions into interfaces that feel tactile and memorable.","proof_label":"Inspect DevLens","project_slug":"devlens"},{"icon":"Compass","title":"End-to-End Ownership","statement":"From schema design and database optimization to polished responsive interfaces and CI/CD pipelines.","proof_label":"Check NeuroScribe","project_slug":"neuroscribe"}]')
ON CONFLICT (key) DO NOTHING;

-- 5. Alter gallery_items table to add credit and description
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS credit TEXT;
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS description TEXT;
