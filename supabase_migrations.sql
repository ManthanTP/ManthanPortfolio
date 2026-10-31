-- Idempotent Supabase Migrations for Manthan Portfolio
-- Phase 7 Upgrade & Cinematic Redesign

-- 1. Alter projects table to add new editable fields
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS problem TEXT;

-- 2. Alter gallery_items table to add credit and description
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS credit TEXT;
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. Function: increment_post_likes
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

-- 4. Function: increment_page_visits
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

-- 5. Seed new settings keys (idempotent, won't overwrite existing user data)
INSERT INTO public.site_settings (key, value)
VALUES
  ('hero_tagline', 'Full-stack developer building AI-powered web applications and high-performance interfaces.'),
  ('availability_status', 'open'),
  ('availability_text', 'Available for freelance & full-time roles'),
  ('career_start_date', '2023-09'),
  ('show_phone', 'false'),
  ('show_map', 'true'),
  ('blog_min_posts', '1'),
  ('bg_video_enabled', 'false'),
  ('quick_info_enabled', 'true'),
  ('music_url', ''),
  ('music_title', 'Ambient Focus'),
  ('hero_portrait_dark', ''),
  ('hero_portrait_light', ''),
  ('about_stats', '[{"label":"Hours Coded","value":"1200","suffix":"+"},{"label":"Projects Built","value":"5","suffix":"+"},{"label":"Hackathons Joined","value":"2","suffix":"+"}]'),
  ('drive_cards', '[{"icon":"Sparkles","title":"Problem solving","statement":"Take a messy real-world workflow, find the one decision that unblocks it, and turn that into a system people trust.","proof_label":"InstitutePulse","proof_type":"project","proof_id":"institutepulse","project_slug":"institutepulse"},{"icon":"Palette","title":"Creativity","statement":"Interfaces that feel designed, not assembled. Balancing fluid motion with crisp predictability.","proof_label":"Pocket Ledger","proof_type":"project","proof_id":"pocket-ledger","project_slug":"pocket-ledger"},{"icon":"Cpu","title":"Innovation","statement":"Use AI only where it removes real work. Connecting LLM tool-calling to verifiable operational bottlenecks.","proof_label":"Meditrip","proof_type":"project","proof_id":"meditrip","project_slug":"meditrip"},{"icon":"Compass","title":"Leadership","statement":"Own the technical delivery when teammates and live production events rely on it under zero-tolerance latency.","proof_label":"Experience","proof_type":"experience","proof_id":"experience","project_slug":"gcl"}]')
ON CONFLICT (key) DO NOTHING;

-- 6. Add metrics column to projects and tag column to skills
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS metrics JSONB;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS tag TEXT;

-- 7. Normalize project title typos
UPDATE public.projects SET title = 'InstitutePulse' WHERE title ILIKE '%Institute Pulse%';
UPDATE public.projects SET title = 'Suraksha.pro' WHERE title ILIKE '%Suraksha .pro%';
