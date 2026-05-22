import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/* ─── Type Definitions ─── */

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string[];
  tech_stack: { name: string; icon?: string }[];
  features?: string[];
  images: string[];
  video_url?: string;
  github_url?: string;
  live_url?: string;
  featured: boolean;
  visible: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string;
  category: string[];
  tags: string[];
  status: 'draft' | 'published';
  likes: number;
  read_time: number;
  published_at: string;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon_url?: string;
  order_index: number;
}

export interface Experience {
  id: string;
  title: string;
  org: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  tags: string[];
  type: 'work' | 'freelance' | 'project' | 'achievement';
  order_index: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image_url: string;
  credential_url?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  order_index: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  page: string;
  project_id?: string;
  session_id: string;
  device: string;
  country?: string;
  city?: string;
  duration?: number;
  created_at: string;
}
