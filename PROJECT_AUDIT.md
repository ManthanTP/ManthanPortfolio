# PROJECT TECHNICAL AUDIT REPORT

## 1. STACK AND TOOLING

- Framework: React 19 (react ^19.2.6, react-dom ^19.2.6)
- Bundler: Vite 8 (vite ^8.0.12, @vitejs/plugin-react ^6.0.1)
- Language: TypeScript 6 (typescript ~6.0.2, tsconfig.json, tsconfig.app.json, tsconfig.node.json)
- Package Manager: npm (package-lock.json)
- Dependencies from package.json by purpose:
  - UI & Styling: tailwindcss (^4.3.0), @tailwindcss/vite (^4.3.0), react-image-crop (^11.0.10)
  - Animation: framer-motion (^12.39.0), gsap (^3.15.0 - installed, unused in src/)
  - Routing: react-router-dom (^7.15.1)
  - Backend & Client: @supabase/supabase-js (^2.106.1)
  - State Management: zustand (^5.0.13)
  - Forms & Validation: react-hook-form (^7.76.0), @hookform/resolvers (^5.2.2), zod (^4.4.3)
  - Search: fuse.js (^7.3.0)
  - Charts: recharts (^3.8.1 - installed, unused in src/)
  - Icons: NOT FOUND as external library (custom inline SVGs in src/components/ui/Icons.tsx)
  - Linting & Dev Tools: @eslint/js (^10.0.1), eslint (^10.3.0), eslint-plugin-react-hooks (^7.1.1), eslint-plugin-react-refresh (^0.5.2), globals (^17.6.0), typescript-eslint (^8.59.2), @types/node (^24.12.3), @types/react (^19.2.14), @types/react-dom (^19.2.3)
- Build and Dev Scripts:
  - dev: vite
  - build: tsc -b && vite build
  - lint: eslint .
  - preview: vite preview
- Vercel Config (vercel.json):
  - SPA rewrite: rewrites all paths /(.*) to /index.html
  - Static caching headers: Cache-Control public, max-age=31536000, immutable for /assets/(.*)

## 2. FOLDER STRUCTURE

- Root files:
  - index.html: HTML5 entry point with viewport-fit, OpenGraph, Twitter card, theme-color, and Schema.org Person JSON-LD
  - package.json: Project metadata, scripts, and dependencies
  - package-lock.json: npm lockfile
  - tsconfig.json / tsconfig.app.json / tsconfig.node.json: TypeScript project references and compiler options
  - vite.config.ts: Vite configuration loading React and Tailwind CSS plugins
  - vercel.json: Vercel routing rewrites and asset cache headers
  - eslint.config.js: Flat ESLint configuration with react-hooks and react-refresh rules
  - supabase_schema.sql: PostgreSQL database schema, RLS policies, and table definitions
  - README.md: Project documentation
- public/:
  - favicon.png: Site favicon asset (462 KB)
  - icons.svg: SVG symbol definitions sprite sheet (unused by application code)
  - robots.txt: Web crawler rules allowing public access, disallowing /admin, pointing to sitemap.xml
- src/:
  - main.tsx: Application bootstrap mounting App in React.StrictMode
  - App.tsx: Root router configuration, splash display condition, settings prefetching, and visit analytics trigger
  - index.css: Global design tokens, CSS variables, dark/light theme definitions, keyframes, glassmorphism classes, Tailwind import
- src/assets/:
  - hero.png: Profile/hero graphic asset
- src/components/chat/:
  - ChatWidget.tsx: Floating chat button and simulated AI chat dialog with rule-based responses
- src/components/layout/:
  - Layout.tsx: Public layout container with ambient background video, video overlay, Navbar, page transitions, footer, and MobileNav
  - Navbar.tsx: Top fixed glassmorphic navigation bar with logo, smooth-scroll section links, and theme toggle button
  - MobileNav.tsx: Bottom fixed navigation bar for screens under 1024px with active section indicator
- src/components/ui/:
  - AnimatedCounter.tsx: IntersectionObserver-triggered number counter with cubic easing
  - Icons.tsx: Collection of inline SVG icon components (social, navigation, and system icons)
  - ImageCropperModal.tsx: Modal wrapper around react-image-crop for cropping gallery images via HTML canvas
  - ParticleBackground.tsx: HTML5 canvas particle field animation with velocity and window resizing
  - ScrollReveal.tsx: Framer Motion scroll-triggered viewport entrance wrapper
  - TypewriterText.tsx: Animated typewriter cycling through string array with blinking cursor
- src/hooks/:
  - useActiveSection.ts: IntersectionObserver hook calculating which section occupies maximum viewport ratio
- src/lib/:
  - supabase.ts: Supabase client instance and TypeScript interface definitions for all data models
  - api.ts: Centralized API abstraction layer for CRUD operations, RPC calls, and Supabase Storage uploads
  - data.ts: Fallback demo datasets (DEMO_PROJECTS, DEMO_SKILLS, DEMO_EXPERIENCE, DEMO_CERTIFICATES, DEMO_POSTS, DEMO_GALLERY, PERSONALITY_CARDS, TIMELINE_ITEMS, ACHIEVEMENTS, SOCIAL_LINKS, ORBIT_SKILLS)
- src/pages/:
  - Home.tsx: One-page public portfolio combining Hero, About, Projects, Skills, Experience, Gallery, Blog, Resume, and Contact
  - About.tsx: Bio section with profile image, intro text, "What Drives Me" interactive flip cards, and By The Numbers counters
  - Projects.tsx: Filterable projects grid with category chips and links to detailed views
  - ProjectDetail.tsx: Dynamic project detail page (/project/:slug) rendering header, description, tech stack, key features, gallery, and URLs
  - Skills.tsx: Categorized technical skills display with category icons and animated pills
  - Experience.tsx: Alternating vertical timeline of work experience and achievement unlock cards
  - Gallery.tsx: Multi-category media masonry grid with lightbox supporting multiple images and video files
  - Blog.tsx: Blog article listing with Fuse.js client-side search and category filtering
  - BlogPost.tsx: Single blog post view (/blog/:slug) with reading progress bar, custom markdown parser, realtime likes, and share button
  - Contact.tsx: Contact form with Zod validation, direct contact links (email/phone), and Google Maps iframe embed
  - Resume.tsx: PDF preview iframe, download button with counter, career highlights, and recent experience summary
  - Splash.tsx: Initial animated loading splash screen with progress bar, message rotation, and skip action
  - Achievements.tsx: Unused/orphaned component with certificates carousel and mock GitHub contribution heatmap
- src/pages/admin/:
  - AdminLogin.tsx: Email and password login form using supabase.auth.signInWithPassword
  - AdminLayout.tsx: Protected dashboard layout with desktop sidebar, mobile navigation, and session authentication guard
  - AdminDashboard.tsx: Overview metric cards (visitors, downloads, messages, projects) and recent messages list
  - AdminPages.tsx: Consolidated file housing all admin management sub-views (ProjectsManager, BlogManager, MediaLibrary, GalleryManager, ResumeManager, MessagesManager, SkillsManager, ExperienceManager, SiteSettings)
- src/stores/:
  - useAppStore.ts: Zustand store tracking active section, chat open state, audio state, and splash completion
  - useSettingsStore.ts: Zustand store fetching and caching key-value pairs from site_settings table
  - useThemeStore.ts: Zustand store managing dark/light theme state with localStorage persistence

## 3. ROUTING AND PAGES

- Public Routes (nested inside Layout.tsx):
  - Path: /
    - Component: Home
    - Access: Public
    - What it shows: Complete single-page portfolio containing all public sections in order:
      1. Hero (#home): Profile picture, animated name heading, typewriter subtitle, CTA buttons ("View Projects", "Download Resume"), status pill, stats counter cards, social profile links
      2. About (#about): Story profile card, bio paragraph, "What Drives Me" flip cards, "By The Numbers" animated counters
      3. Projects (#projects): Category filter chips ('All', 'AI', 'Web Apps', 'Dashboards', 'Mobile'), responsive project cards grid with featured badges and tech stack tags
      4. Skills (#skills): Category-based cards with icons, skill pills, and hover animations
      5. Experience (#experience): Dual-column vertical timeline of work/freelance history, followed by "Achievement Unlocks" cards
      6. Gallery (#gallery): Category filter chips ('All', 'UI Designs', 'Project Screenshots', 'Events'), masonry media grid with image/video previews, click-to-open lightbox
      7. Blog (#blog): Fuse.js search input, category tags, published article cards with reading times and dates
      8. Resume (#resume): Conditionally rendered (only if settings.show_resume_section !== 'false'); displays PDF preview iframe, download PDF button, download counter, key highlights, and recent experience
      9. Contact (#contact): Contact form (name, email, subject, message), social links, direct email/phone cards, Google Maps embed
  - Path: /project/:slug
    - Component: ProjectDetail
    - Access: Public
    - What it shows: Back button to /#projects, hero image, category tags, project title, long description, tech stack tags, key features list with markdown heading/bullet support, multi-image gallery scroll, GitHub and Live Demo buttons
  - Path: /blog/:slug
    - Component: BlogPost
    - Access: Public
    - What it shows: Top reading progress bar, back button to /#blog, cover image, tags, post title, date, reading time, custom-parsed markdown content, realtime like button with counter, web share/clipboard button, and related posts grid
- Admin Routes:
  - Path: /admin/login
    - Component: AdminLogin
    - Access: Public
    - What it shows: Email/password authentication form for administrator access
  - Path: /admin (nested inside AdminLayout)
    - Component: AdminDashboard (index route)
    - Access: Protected (redirects to /admin/login if no active Supabase session)
    - What it shows: Stats summary (Total Visitors, Resume Downloads, Messages, Total Projects), quick action buttons, and recent messages feed
  - Path: /admin/projects
    - Component: ProjectsManager
    - Access: Protected
    - What it shows: Form to create/edit projects (title, slug, URLs, categories, image URLs/upload, tech stack, description, features, visible/featured flags) and existing projects list with edit/delete actions
  - Path: /admin/blog
    - Component: BlogManager
    - Access: Protected
    - What it shows: Form to create/edit blog posts (title, slug, read time, category tags, cover image URL/upload, excerpt, markdown content, published toggle) and existing posts table
  - Path: /admin/gallery
    - Component: GalleryManager
    - Access: Protected
    - What it shows: Form to add/edit media items (title, category dropdown, comma-separated media URLs, integrated image cropper modal) and grid of existing items
  - Path: /admin/media
    - Component: MediaLibrary
    - Access: Protected
    - What it shows: Direct file uploader to portfolio-media Supabase bucket, file grid with preview thumbnails, view link, and delete button
  - Path: /admin/resume
    - Component: ResumeManager
    - Access: Protected
    - What it shows: Current resume status viewer and PDF file uploader that updates Supabase storage and site_settings
  - Path: /admin/messages
    - Component: MessagesManager
    - Access: Protected
    - What it shows: List of contact form submissions with read/unread indicators, mark read/unread buttons, and delete buttons
  - Path: /admin/skills
    - Component: SkillsManager
    - Access: Protected
    - What it shows: Form to add/edit skills (name, category, proficiency slider 1-100%, icon URL/upload), demo data seed button, and existing skills list
  - Path: /admin/experience
    - Component: ExperienceManager
    - Access: Protected
    - What it shows: Form to add/edit experience (title, org, tags, current checkbox, start date, end date, type dropdown, description), demo data seed button, and existing experience list
  - Path: /admin/settings
    - Component: SiteSettings
    - Access: Protected
    - What it shows: Global settings editor for currently building status, resume visibility toggle, profile image URL, dark/light video URLs, social links, about text, AI context, By The Numbers stats editor, and Achievement Unlocks editor
- Orphaned / Unused Routes & Pages:
  - Component Achievements (src/pages/Achievements.tsx): NOT FOUND in any route definition or public section. Contains certificate carousel and mock GitHub heatmap.

## 4. DATA LAYER (SUPABASE OR OTHER)

- Client Setup File: src/lib/supabase.ts
- Environment Variable Names Only:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_PUBLISHABLE_KEY
- Tables:
  - Table: public.projects
    - Columns: id (UUID PK), slug (TEXT UNIQUE), title (TEXT), description (TEXT), category (TEXT[]), tech_stack (JSONB), features (TEXT[]), images (TEXT[]), video_url (TEXT), github_url (TEXT), live_url (TEXT), featured (BOOLEAN), visible (BOOLEAN), order_index (INTEGER), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ)
    - Relations: None
    - Read by: Home.tsx (api.projects.getVisible), Projects.tsx (api.projects.getVisible), ProjectDetail.tsx (api.projects.getBySlug), AdminDashboard.tsx (api.projects.getAll)
    - Written by: AdminPages.tsx (ProjectsManager via api.projects.create, api.projects.update, api.projects.delete)
  - Table: public.posts
    - Columns: id (UUID PK), slug (TEXT UNIQUE), title (TEXT), excerpt (TEXT), content (TEXT), cover_url (TEXT), category (TEXT[]), tags (TEXT[]), status (TEXT check: 'draft', 'published'), likes (INTEGER), read_time (INTEGER), published_at (TIMESTAMPTZ), created_at (TIMESTAMPTZ)
    - Relations: None
    - Read by: Home.tsx (api.posts.getPublished), Blog.tsx (api.posts.getPublished), BlogPost.tsx (api.posts.getBySlug, api.posts.getPublished)
    - Written by: AdminPages.tsx (BlogManager via api.posts.create, api.posts.update, api.posts.delete); public users write likes via BlogPost.tsx calling api.posts.incrementLike (executing RPC increment_post_likes)
  - Table: public.skills
    - Columns: id (UUID PK), name (TEXT), category (TEXT), proficiency (INTEGER), icon_url (TEXT), order_index (INTEGER)
    - Relations: None
    - Read by: Home.tsx (api.skills.getAll), Skills.tsx (api.skills.getAll)
    - Written by: AdminPages.tsx (SkillsManager via api.skills.create, api.skills.update, api.skills.delete)
  - Table: public.experience
    - Columns: id (UUID PK), title (TEXT), org (TEXT), start_date (TEXT), end_date (TEXT), current (BOOLEAN), description (TEXT), tags (TEXT[]), type (TEXT check: 'work', 'freelance', 'project', 'achievement'), order_index (INTEGER)
    - Relations: None
    - Read by: Home.tsx (api.experience.getAll), Experience.tsx (api.experience.getAll), Resume.tsx (api.experience.getAll)
    - Written by: AdminPages.tsx (ExperienceManager via api.experience.create, api.experience.update, api.experience.delete)
  - Table: public.certificates
    - Columns: id (UUID PK), title (TEXT), issuer (TEXT), date (TEXT), image_url (TEXT), credential_url (TEXT)
    - Relations: None
    - Read by: Defined in src/lib/api.ts (api.certificates.getAll), but NOT called by any active component
    - Written by: NOT FOUND (No admin interface or mutation exists in code)
  - Table: public.gallery_items
    - Columns: id (UUID PK), title (TEXT), image_url (TEXT), category (TEXT), order_index (INTEGER)
    - Relations: None
    - Read by: Gallery.tsx (api.gallery.getAll)
    - Written by: AdminPages.tsx (GalleryManager via api.gallery.create, api.gallery.update, api.gallery.delete)
  - Table: public.messages
    - Columns: id (UUID PK), name (TEXT), email (TEXT), subject (TEXT), body (TEXT), read (BOOLEAN), created_at (TIMESTAMPTZ)
    - Relations: None
    - Read by: AdminDashboard.tsx (api.messages.getAll), AdminPages.tsx (MessagesManager via api.messages.getAll)
    - Written by: Contact.tsx (public contact form via api.messages.create), AdminPages.tsx (MessagesManager via api.messages.update to toggle read status, and api.messages.delete)
  - Table: public.site_settings
    - Columns: key (TEXT PK), value (TEXT), updated_at (TIMESTAMPTZ)
    - Relations: None (key-value store)
    - Read by: App.tsx / useSettingsStore.ts (api.settings.getAll), About.tsx, Experience.tsx, Resume.tsx, Contact.tsx, Layout.tsx, Navbar.tsx, MobileNav.tsx, AdminDashboard.tsx (api.analytics.getVisitCount)
    - Written by: AdminPages.tsx (SiteSettings via api.settings.update), ResumeManager (api.settings.update for 'resume_url'), Resume.tsx (api.settings.update for 'resume_downloads' counter)
  - Table: public.analytics_events
    - TypeScript interface defined in src/lib/supabase.ts (AnalyticsEvent)
    - Table definition in SQL: NOT FOUND in supabase_schema.sql
    - Read/Written by: NOT FOUND in application code
- Storage Buckets:
  - Bucket Name: 'portfolio-media'
  - Upload Logic: Defined in src/lib/api.ts (api.storage.uploadFile, api.storage.uploadImage). Generates random file name with timestamp prefix, uploads via supabase.storage.from(bucket).upload(filePath, file), and obtains public URL via getPublicUrl(filePath).
  - Serving: Served directly as public HTTPS URLs from Supabase Storage CDN
  - Used in: ProjectsManager (project images), BlogManager (cover image), GalleryManager (gallery media), ResumeManager (resume PDF at path prefix 'resume/'), SkillsManager (skill icon), MediaLibrary (generic public asset management)
- Realtime Subscriptions:
  - src/pages/BlogPost.tsx: Subscribes to channel public:posts:${post.id} listening for UPDATE events on table posts to synchronize post.likes counter live. Cleaned up via supabase.removeChannel(channel) on unmount.
  - No other realtime subscriptions exist in the codebase.
- Remote Procedure Calls (RPCs):
  - increment_post_likes: Called in src/lib/api.ts (api.posts.incrementLike) via supabase.rpc('increment_post_likes', { post_id: id })
  - increment_page_visits: Called in src/lib/api.ts (api.analytics.incrementVisit) via supabase.rpc('increment_page_visits')
  - Note: Both RPC functions are called by client code but are NOT FOUND in supabase_schema.sql (must be created manually in Supabase SQL editor).
- Edge Functions: NOT FOUND (no supabase/functions directory exists).
- Row Level Security (RLS) Policies (defined in supabase_schema.sql):
  - RLS enabled on all 8 tables (projects, posts, skills, experience, certificates, gallery_items, messages, site_settings).
  - Public Read (FOR SELECT USING (true)): projects, posts, skills, experience, certificates, gallery_items, site_settings.
  - Public Insert (FOR INSERT WITH CHECK (true)): messages.
  - Authenticated Admin Access (USING (auth.role() = 'authenticated')): projects, posts, skills, experience, certificates, gallery_items, messages, site_settings.
- SQL and Migration Files:
  - Single file: supabase_schema.sql in the project root directory.

## 5. ADMIN SYSTEM

- Auth and Login:
  - Implemented in src/pages/admin/AdminLogin.tsx.
  - Form inputs: email and password.
  - Calls supabase.auth.signInWithPassword({ email, password }).
  - On success, sets window.location.href = '/admin'.
  - On failure, displays error message returned by Supabase Auth.
- Route Protection and Session Handling:
  - Implemented in src/pages/admin/AdminLayout.tsx.
  - Runs checkUser() on mount calling supabase.auth.getSession(); if !session, redirects via navigate('/admin/login').
  - Sets up listener supabase.auth.onAuthStateChange; if session becomes null, immediately redirects to /admin/login.
  - Sign out triggers supabase.auth.signOut() and navigates to /admin/login.
- Admin Pages Breakdown:
  - AdminDashboard (/admin):
    - Edits: Read-only overview dashboard.
    - Fields: None.
    - Table: Reads from messages, projects, site_settings.
  - ProjectsManager (/admin/projects):
    - Edits: Portfolio projects.
    - Fields: Title (text), Slug (text), GitHub URL (text), Live Demo URL (text), Categories (checkboxes for 'AI', 'Web Apps', 'Dashboards', 'Mobile'), Image URLs (comma-separated text or direct file upload), Tech Stack (comma-separated text), Description (textarea), Key Features (one per line textarea), Visible (checkbox), Featured (checkbox).
    - Table: public.projects.
  - BlogManager (/admin/blog):
    - Edits: Blog articles.
    - Fields: Title (text), Slug (text), Read Time in minutes (number), Tags/Categories (checkboxes for 'AI', 'Development', 'UI Design', 'Campus Innovation'), Cover Image URL (text or direct file upload), Excerpt (textarea), Content (markdown textarea), Published status (checkbox).
    - Table: public.posts.
  - GalleryManager (/admin/gallery):
    - Edits: Visual media items.
    - Fields: Title (text), Category (select dropdown: 'UI Designs', 'Project Screenshots', 'Events'), Media URLs (comma-separated text, file upload with integrated ImageCropperModal for cropping before storage upload), Order Index.
    - Table: public.gallery_items.
  - MediaLibrary (/admin/media):
    - Edits: Direct Supabase Storage files.
    - Fields: File upload input.
    - Table: Supabase Storage bucket 'portfolio-media' (not a database table).
  - ResumeManager (/admin/resume):
    - Edits: Resume PDF asset and URL.
    - Fields: PDF file input.
    - Table: Writes file to storage bucket 'portfolio-media' under 'resume/' path and writes public URL to public.site_settings with key 'resume_url'.
  - MessagesManager (/admin/messages):
    - Edits: Incoming contact messages.
    - Fields: Mark Read/Unread action, Delete action.
    - Table: public.messages.
  - SkillsManager (/admin/skills):
    - Edits: Technical skill entries.
    - Fields: Name (text), Category (text), Proficiency (slider 1-100), Icon Image URL (text or file upload).
    - Table: public.skills.
  - ExperienceManager (/admin/experience):
    - Edits: Work, project, freelance, and achievement history.
    - Fields: Title/Role (text), Organization/Company (text), Tags (comma-separated text), Currently working here (checkbox), Start Date (text), End Date (text), Type (select: 'work', 'project', 'freelance', 'achievement'), Description (textarea).
    - Table: public.experience.
  - SiteSettings (/admin/settings):
    - Edits: Global site configuration.
    - Fields: Currently Building Status (text), Show Resume Section (checkbox), Profile Image URL (text), Dark Mode Video URL (text), Light Mode Video URL (text), Social URLs (github, linkedin, instagram, x, email text inputs), About Me Text (textarea), AI Chat Context (textarea), By The Numbers stats list (label, value, suffix inputs), Achievement Unlocks list (icon, title, description inputs).
    - Table: public.site_settings.
- Content Editable from Admin vs Hardcoded in Components:

| Editable via Admin Dashboard | Hardcoded in Source Components |
|---|---|
| Project items (title, slug, URLs, category, tech stack, images, features, visibility, featured flag) | Hero typewriter subtitles (['Full Stack Developer', 'AI Builder', 'Innovator', 'React Engineer'] in Home.tsx) |
| Blog articles (title, slug, cover, excerpt, content, tags, read time, status) | Hero default avatar letter 'M' fallback (Home.tsx) |
| Gallery items (title, category, images/videos) | Hero initial fallback stats before API response (Home.tsx) |
| Technical skills (name, category, proficiency percentage, icon URL) | "What Drives Me" cards emoji, title, and description (PERSONALITY_CARDS in data.ts) |
| Experience history (title, company, start/end dates, current flag, description, tags, type) | About Me quotation: "Building things that make a difference — one line of code at a time." (About.tsx) |
| Resume PDF file, resume download URL, and resume section visibility toggle | About Me section title and subtitle copy (About.tsx) |
| Currently building status pill text (site_settings: building_status) | Resume key highlights pills (['React Developer', 'AI Integration Specialist', 'Full Stack Engineer'] in Resume.tsx) |
| Profile image URL across Hero and About (site_settings: profile_image_url) | Default background video URLs (DEFAULT_DARK_VIDEO, DEFAULT_LIGHT_VIDEO in Layout.tsx) |
| Ambient background video URLs (site_settings: bg_video_dark, bg_video_light) | Chatbot predefined commands and mock answer strings (ChatWidget.tsx) |
| Social media URLs for GitHub, LinkedIn, Instagram, X, Email (site_settings: social_*) | Direct contact email manthantp0321@gmail.com and phone +91 9686335075 (Contact.tsx) |
| About Me bio narrative paragraph (site_settings: about_text) | Google Maps iframe embed coordinates and location text (Contact.tsx) |
| About "By The Numbers" statistics (site_settings: about_stats) | Category filter arrays (Projects.tsx, Gallery.tsx, Blog.tsx) |
| Experience "Achievement Unlocks" cards (site_settings: achievements) | Fallback mock datasets when database is empty (DEMO_* in data.ts) |
| AI Chat knowledge context string (site_settings: ai_context) | Project default feature bullet points fallback (ProjectDetail.tsx) |

## 6. LOADING SCREEN LOGIC (IMPORTANT)

- Exact File and Component:
  - File: src/pages/Splash.tsx
  - Component: Splash
  - Rendered in: src/App.tsx (line 34: {!splashDone && <Splash />})
  - State: splashDone boolean stored in Zustand (src/stores/useAppStore.ts) and backed by sessionStorage ('splashDone')
- How it decides when to hide:
  - Timers: Driven by a mock setInterval running every 80ms. On each tick, it increments a local progress state by Math.random() * 3 + 1.
  - Completion: When progress >= 100, it clears the interval and triggers setTimeout(handleExit, 600).
  - Exit transition: handleExit sets exiting = true (which animates scale and blur via Framer Motion) and schedules setTimeout(() => setSplashDone(true), 800).
  - Skip option: A "Skip →" button is revealed after 1500ms via setTimeout(() => setShowSkip(true), 1500). Clicking it triggers handleExit immediately.
  - Data / Images: The loader does NOT wait for any image loading, project fetches, or Supabase queries.
- Short Logic Snippet (from src/pages/Splash.tsx, lines 21-45):
```tsx
const handleExit = useCallback(() => {
  setExiting(true);
  setTimeout(() => setSplashDone(true), 800);
}, [setSplashDone]);

useEffect(() => {
  const skipTimer = setTimeout(() => setShowSkip(true), 1500);
  return () => clearTimeout(skipTimer);
}, []);

useEffect(() => {
  const interval = setInterval(() => {
    setProgress((prev) => {
      const next = prev + Math.random() * 3 + 1;
      if (next >= 100) {
        clearInterval(interval);
        setTimeout(handleExit, 600);
        return 100;
      }
      return next;
    });
  }, 80);
  return () => clearInterval(interval);
}, [handleExit]);
```
- Explanation of Data Fetching Relative to the Loader:
  - Splash is an absolute fixed overlay (z-index: 200). Behind it in App.tsx, Layout and Home are already fully mounted on initial load.
  - Global site settings are fetched on root mount in App.tsx:21 (fetchSettings() in useEffect).
  - Public section data is fetched inside Home.tsx:60 and inside individual sub-pages (Projects.tsx:19, Skills.tsx:13, Experience.tsx:22, Gallery.tsx:17, Blog.tsx:21) immediately on their own useEffect mount.
  - Because data fetching begins simultaneously with the splash animation, network requests run in parallel with the 80ms timer loop. The loader never awaits the completion of these requests; if requests finish before progress reaches 100%, content is ready underneath. If requests take longer, components render their own internal "Loading..." fallbacks after the splash unmounts.
- Data Fetching Frequency and Architecture:
  - Fetching approach: Per-component imperative async fetching inside React useEffect hooks.
  - Caching libraries (React Query / SWR / RTK Query): NOT FOUND.
  - Global store caching: Only site_settings is stored in Zustand (useSettingsStore). Other data (projects, posts, skills, gallery) is fetched and stored in local component useState.
  - Parallelism: Home.tsx fetches projects, posts, skills, and experience in parallel using Promise.all([api.projects.getVisible(), api.posts.getPublished(), api.skills.getAll(), api.experience.getAll()]). However, child components (Projects.tsx, Skills.tsx, Experience.tsx) independently re-fetch the exact same endpoints on mount, causing redundant concurrent queries.

## 7. "WHAT DRIVES ME" SECTION

- File: src/pages/About.tsx
- Component: About (lines 110-158)
- How Flip / "Tap to Reveal" Works:
  - Local state: const [flippedCard, setFlippedCard] = useState<number | null>(null) (tracks index of currently flipped card).
  - Trigger: Click handler on the card container: onClick={() => setFlippedCard(flippedCard === i ? null : i)}.
  - Motion animation: Framer Motion animates rotation on the Y-axis: animate={{ rotateY: flippedCard === i ? 180 : 0 }} with transition={{ duration: 0.5 }}.
  - Front view (flippedCard !== i): Displays card.emoji (2.5rem), card.title (h3), and "Tap to reveal" prompt.
  - Back view (flippedCard === i): Renders child container styled with transform: 'rotateY(180deg)' displaying card.desc text.
- Content Source:
  - HARDCODED in src/lib/data.ts lines 203-208 (constant array PERSONALITY_CARDS containing Creativity, Innovation, Leadership, and Problem Solving). It does not come from Supabase or any database table.

## 8. STATS AND COUNTERS

- Numbers on Home ("Projects", "Posts", "Skills", "Experience"):
  - File and Lines: Initial defaults at src/pages/Home.tsx:42-47; computed updates at src/pages/Home.tsx:59-81.
  - "Projects": COMPUTED from projects.length returned by api.projects.getVisible() (table public.projects), line 70.
  - "Posts": COMPUTED from posts.length returned by api.posts.getPublished() (table public.posts), line 71.
  - "Skills": COMPUTED from skills.length returned by api.skills.getAll() (table public.skills), line 72 (suffix '+').
  - "Experience": COMPUTED from exp.length returned by api.experience.getAll() (table public.experience), line 73 (suffix 'yrs' - note: computes count of entries in the experience table, not actual calculated years).
- Numbers on About ("Hours coded", "Projects built", "Bugs squashed", "APIs integrated", "Hackathon joined"):
  - File and Lines: Initial defaults at src/pages/About.tsx:13-18; database fetch at src/pages/About.tsx:20-27.
  - "Hours Coded": HARDCODED fallback value 1200 (suffix '+') in About.tsx:14; dynamically OVERRIDDEN if key 'about_stats' exists in public.site_settings table (parsed from JSON).
  - "Projects Built": HARDCODED fallback value 12 in About.tsx:15; dynamically OVERRIDDEN if key 'about_stats' exists in public.site_settings table.
  - "Bugs Squashed": HARDCODED fallback value 300 (suffix '+') in About.tsx:16; dynamically OVERRIDDEN if key 'about_stats' exists in public.site_settings table.
  - "APIs Integrated": HARDCODED fallback value 25 (suffix '+') in About.tsx:17; dynamically OVERRIDDEN if key 'about_stats' exists in public.site_settings table.
  - "Hackathon joined": NOT FOUND in default About stats array (default contains Hours Coded, Projects Built, Bugs Squashed, APIs Integrated). A "Hackathon Winner" entry exists in hardcoded ACHIEVEMENTS in src/lib/data.ts:214 and default achievements in src/stores/useSettingsStore.ts:34. Can be added as a custom stat via admin 'about_stats'.

## 9. UI AND ANIMATION SYSTEM

- Styling Approach:
  - Tailwind CSS v4 via @tailwindcss/vite and @import "tailwindcss" in src/index.css.
  - Extensive Vanilla CSS custom properties for theming, typography, glassmorphism, buttons, chips, and layout containers.
  - High volume of inline CSS styles (style={{ ... }}) directly on JSX tags for fine layout and positioning.
- Theme System (Dark / Light):
  - State managed via Zustand store in src/stores/useThemeStore.ts.
  - Theme initialized from localStorage.getItem('theme'), falling back to window.matchMedia('(prefers-color-scheme: dark)').
  - Theme toggled via toggleTheme(); sets document.documentElement.setAttribute('data-theme', next) and saves to localStorage.
  - CSS variables define colors under :root (dark defaults) and [data-theme="light"] overrides.
  - Theme toggle button with animated sun/moon rotation located in Navbar.tsx:118-146.
- CSS Variables and Design Tokens (src/index.css:5-42):
  - Fonts:
    - --font-hero: 'Syne', sans-serif
    - --font-heading: 'Space Grotesk', sans-serif
    - --font-body: 'DM Sans', sans-serif
    - --font-mono: 'JetBrains Mono', monospace
    - --font-accent: 'Orbitron', sans-serif
  - Dark Theme Colors:
    - --bg-primary: #05050a
    - --bg-secondary: #0d0d1a
    - --surface-elevated: #12122a
    - --accent-violet: #6c63ff
    - --accent-cyan: #00f5d4
    - --accent-amber: #f4a738
    - --text-primary: #f0f0ff
    - --text-secondary: #8585a8
    - --border-color: rgba(108, 99, 255, 0.2)
    - --glass-bg: rgba(13, 13, 26, 0.6)
    - --glass-border: rgba(108, 99, 255, 0.15)
    - --glass-blur: 20px
    - --video-overlay: rgba(5, 5, 10, 0.85)
  - Light Theme Colors:
    - --bg-primary: #f8f7ff
    - --bg-secondary: #eeedf5
    - --surface-elevated: #e4e3ef
    - --text-primary: #0d0d1a
    - --text-secondary: #555570
    - --border-color: rgba(108, 99, 255, 0.15)
    - --glass-bg: rgba(248, 247, 255, 0.7)
    - --glass-border: rgba(108, 99, 255, 0.12)
    - --video-overlay: rgba(248, 247, 255, 0.85)
- Animation Libraries and Usages:
  - framer-motion: Main animation engine. Used for page transitions (Layout.tsx), section entrance reveals (ScrollReveal.tsx), hero elements staggering (Home.tsx), card flips (About.tsx), filter popLayout animations (Projects.tsx, Gallery.tsx, Blog.tsx), timeline progress line (Experience.tsx), interactive buttons, and modals.
  - gsap: NOT FOUND in any application source file (installed in package.json, 0 imports).
- Scroll Behavior:
  - Global smooth scrolling enabled via html { scroll-behavior: smooth; } in src/index.css:52.
  - Hash navigation scrolling with smooth scroll handler in Home.tsx:84-94, Navbar.tsx:79-85, and MobileNav.tsx:61-67.
- Particle Background Implementation:
  - File: src/components/ui/ParticleBackground.tsx.
  - Implemented using HTML5 2D canvas with requestAnimationFrame loop.
  - Scales coordinates to devicePixelRatio, updates positions (x, y) with velocity vectors (vx, vy), bounces off canvas edges, and renders circular arcs with alpha opacity.
  - Used in Splash.tsx (40 particles) and Home.tsx (300 particles).
- Custom Cursor or Effects:
  - Custom cursor: NOT FOUND (standard browser cursor).
  - Background Video: Fullscreen fixed video background in src/components/layout/Layout.tsx:38-70 with opacity overlay and dark/light mode video crossfades.
  - Glow effects: Pulsing glow rings (.animate-glow) and neon text shadow utilities (.neon-text, .neon-text-cyan).

## 10. OTHER FEATURES

- Chatbot Widget:
  - File: src/components/chat/ChatWidget.tsx.
  - What it calls: Calls local function getDemoResponse(msg) after artificial delay (setTimeout 800-1800ms).
  - AI API: NOT FOUND. It uses simulated keyword matching (checks for 'who', 'project', 'skill', 'resume', 'contact') and returns prewritten markdown strings.
  - Where key lives: NOT FOUND. No AI API key exists in the codebase or environment variables.
- Contact Form:
  - Destination: Submissions write directly to the Supabase database table public.messages via api.messages.create() in src/pages/Contact.tsx:45.
  - Email Service (Resend, SendGrid, EmailJS, etc.): NOT FOUND. No email dispatch service is configured. Messages are stored in the database and must be read via /admin/messages.
- Google Maps Embed:
  - Embedded in src/pages/Contact.tsx:296-305 using an <iframe> pointing to Google Maps embed URL for Hubballi, Karnataka, India.
- Blog System:
  - Storage: Supabase database table public.posts.
  - Format: Markdown text stored in column content.
  - Editor: Raw HTML textarea in AdminPages.tsx:356 (Rich text / WYSIWYG editor: NOT FOUND).
  - Rendering: Hand-rolled custom parser in src/pages/BlogPost.tsx:162-196 splitting text on \n\n and mapping markdown symbols (#, ##, ```, -, \d., **).
  - Likes: Optimistic UI update and Supabase RPC increment_post_likes with live realtime broadcast subscription.
- Gallery:
  - Storage: Supabase database table public.gallery_items and storage bucket 'portfolio-media'.
  - Categories: 'All', 'UI Designs', 'Project Screenshots', 'Events'.
  - Multi-image support: Supports comma-separated URLs in image_url column.
  - Video support: Detects .mp4, .webm, .ogg in image_url and renders HTML5 <video> with controls.
  - Lightbox: Custom modal (Gallery.tsx:150-213) with previous/next navigation, counter dots, title caption, and keyboard/backdrop exit.
  - Cropper: Integrated react-image-crop modal in AdminPages.tsx:586 allowing admins to crop images before uploading to storage.
- SEO and Meta Tags:
  - Configured in index.html: title, description, author, Open Graph (og:type, og:title, og:description, og:image, og:url), Twitter Card (summary_large_image, title, description), theme-color, and Schema.org Person JSON-LD.
  - Dynamic route metadata (React Helmet / meta updater): NOT FOUND. All routes share the static metadata in index.html.
- Analytics:
  - Session visit increment in src/App.tsx:24-29: Checks sessionStorage for 'mp_has_visited'. If missing, calls api.analytics.incrementVisit() (executes Supabase RPC increment_page_visits) and sets session flag.
  - Total visitor count retrieved via api.analytics.getVisitCount() (reads key 'total_visitors' from site_settings table) and displayed in the global footer (Layout.tsx:101) and AdminDashboard.tsx:34.
  - Third-party analytics (Google Analytics, Vercel Analytics, PostHog): NOT FOUND.

## 11. PERFORMANCE AND QUALITY ISSUES YOU NOTICE

- Large Assets and Missing Optimization:
  - public/favicon.png is 462 KB, which is excessively large for a favicon and delays browser tab rendering.
  - Default background videos in Layout.tsx stream full third-party sample video files (TearsOfSteel.mp4, ElephantsDream.mp4) on every initial visit without a lightweight poster image or preconnect hints.
  - Image assets in data.ts and project covers rely on external unsplash/picsum image URLs without defined dimensions, risking layout shifts (CLS).
- Missing Lazy Loading:
  - ProjectDetail.tsx hero image and Gallery.tsx detail modal lack lazy-loading and responsive srcset configurations.
  - Background video layers auto-mount and load video streams immediately, even on mobile devices where battery and bandwidth are constrained.
- Accessibility (a11y) and Missing Alt Text:
  - Profile image in Home.tsx:186 uses generic alt="Profile".
  - Cropper and thumbnail previews in AdminPages.tsx use placeholder alt="preview" or alt="icon".
  - Light mode contrast: Ambient video overlay with white/cyan neon elements can drop below WCAG AA contrast ratios in light mode.
- Unused Dependencies and Dead Code:
  - gsap (^3.15.0) in package.json is never imported in src/.
  - recharts (^3.8.1) in package.json is never imported in src/.
  - public/icons.svg is an orphaned SVG sprite sheet never referenced via <use href="...">.
  - src/pages/Achievements.tsx is an entire page component that is completely orphaned and never rendered in routing or navigation.
- Error, Empty, and Loading States:
  - If Supabase environment variables are missing or connection fails, calls to api.projects.getVisible() catch and log to console, leaving components permanently in loading state (e.g. Projects.tsx shows "Loading projects...").
  - BlogPost.tsx and ProjectDetail.tsx have rudimentary error views without structured back navigation or error reporting.
  - Contact form has honeypot protection but lacks reCAPTCHA/Turnstile and server-side rate limiting.
- Duplicated Code and State Inconsistencies:
  - Social media link generation and icon mapping are duplicated between Home.tsx and Contact.tsx.
  - Default mock data arrays are duplicated in multiple places: stats in Home.tsx, About.tsx, and AdminPages.tsx; achievements in data.ts, useSettingsStore.ts, and AdminPages.tsx.
  - In Home.tsx:73, experience counter naively sets suffix: 'yrs' to exp.length (the count of database rows), which is inaccurate if an entry is a project or freelance role.
- Fragile Custom Parsers:
  - Markdown rendering in BlogPost.tsx:162 and ProjectDetail.tsx:130 is hand-rolled using string splitting. It breaks on nested lists, tables, inline links, blockquotes, or complex formatting.
  - Gallery multiple images are stored as comma-separated strings inside a single database text column rather than a Postgres array or dedicated join table.

## 12. REDESIGN RISK MAP

- Safe to Restyle Freely (Pure UI Layer):
  - src/index.css: All CSS custom properties, color palette tokens, button styles (.btn-primary, .btn-secondary), chip styles, glassmorphism utilities, and typography declarations.
  - src/components/layout/Navbar.tsx & MobileNav.tsx: Navigation bar styling, desktop link arrangement, mobile bottom tab bar layout and colors.
  - src/components/ui/: AnimatedCounter.tsx, ParticleBackground.tsx, ScrollReveal.tsx, TypewriterText.tsx, Icons.tsx.
  - Presentation markup in Home.tsx (hero section layout, social icon links wrapper, button hierarchy).
  - Presentation cards in Projects.tsx, Skills.tsx, Experience.tsx, Gallery.tsx, Blog.tsx.
- Business Logic / MUST NOT TOUCH:
  - src/lib/supabase.ts: Supabase client initialization and data model TypeScript interfaces.
  - src/lib/api.ts: Core API methods handling CRUD operations, database queries, and storage upload procedures.
  - src/stores/: useAppStore.ts, useSettingsStore.ts, useThemeStore.ts (manages application-wide state, setting synchronization, and theme switching).
  - src/pages/admin/AdminLayout.tsx & AdminLogin.tsx: Authentication checks, session validation, onAuthStateChange subscriptions, and protected route guards.
  - src/pages/admin/AdminPages.tsx: Administrative mutations, storage uploads, cropper logic, and table schema writes.
  - src/hooks/useActiveSection.ts: IntersectionObserver math determining current scroll section.
- Fragile (Tight Coupling Between UI and Data):
  - Section IDs on Home.tsx (#home, #about, #projects, #skills, #experience, #gallery, #blog, #resume, #contact): Modifying these HTML IDs breaks smooth-scroll navigation in Navbar.tsx, MobileNav.tsx, and useActiveSection.ts.
  - JSON-serialized settings in site_settings: about_stats and achievements are stored as JSON strings inside a text column. Any schema deviation in JSON structure causes About.tsx, Experience.tsx, and SiteSettings to crash during JSON.parse.
  - Comma-delimited strings in gallery_items.image_url: Gallery.tsx and GalleryManager expect images to be joined and split with commas. Changing this format breaks lightbox carousels and cropper uploads.
  - Custom markdown parsers in BlogPost.tsx and ProjectDetail.tsx: Tightly coupled to specific newline and heading prefixes (# , ## , ```, - ). Any content edited in admin that does not strictly adhere to these prefixes fails to render correctly.
  - Resume download counter: Resume.tsx directly writes an incremented counter to site_settings under key 'resume_downloads'. Restyling the button must preserve the handleDownload async mutation.
