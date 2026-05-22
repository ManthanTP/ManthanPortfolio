-- Supabase Schema for Manthan's Portfolio

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT[] DEFAULT '{}',
    tech_stack JSONB DEFAULT '[]'::jsonb,
    features TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    video_url TEXT,
    github_url TEXT,
    live_url TEXT,
    featured BOOLEAN DEFAULT false,
    visible BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Posts Table (Blog)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    category TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    likes INTEGER DEFAULT 0,
    read_time INTEGER DEFAULT 5,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    proficiency INTEGER DEFAULT 50,
    icon_url TEXT,
    order_index INTEGER DEFAULT 0
);

-- 4. Experience Table
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    org TEXT NOT NULL,
    start_date TEXT NOT NULL, -- Stored as YYYY-MM
    end_date TEXT,
    current BOOLEAN DEFAULT false,
    description TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    type TEXT DEFAULT 'work' CHECK (type IN ('work', 'freelance', 'project', 'achievement')),
    order_index INTEGER DEFAULT 0
);

-- 5. Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT NOT NULL,
    image_url TEXT NOT NULL,
    credential_url TEXT
);

-- 6. Gallery Items Table
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
);

-- 7. Messages Table (Contact Form)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    body TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access (Anyone can read data to view the portfolio)
CREATE POLICY "Public profiles are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public skills are viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public experience is viewable by everyone" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Public certificates are viewable by everyone" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Public gallery is viewable by everyone" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Public settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);

-- 2. Contact Form Submissions (Anyone can insert a message, but not read them)
CREATE POLICY "Anyone can insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- 3. Admin Access (For simplicity right now, since we haven't set up full Supabase Auth with custom claims, 
-- we will allow anon keys to do CRUD if we want a fully demoable admin dashboard without auth, 
-- BUT for security, you should only allow authenticated users. 
-- Since this is your personal portfolio, let's allow authenticated users to manage content.)

CREATE POLICY "Admins can manage projects" ON public.projects USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage posts" ON public.posts USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage skills" ON public.skills USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage experience" ON public.experience USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage certificates" ON public.certificates USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage gallery" ON public.gallery_items USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage messages" ON public.messages USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage settings" ON public.site_settings USING (auth.role() = 'authenticated');
