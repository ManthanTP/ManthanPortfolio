# PRD PROMPT — MANTHAN PATEL PORTFOLIO
### Ready to paste into Lovable / Bolt / Cursor / v0 / any text-to-code tool
---

## PROJECT OVERVIEW

- **Project name:** Manthan Patel — Interactive Developer Portfolio
- **One line description:** A cinematic, animated full stack portfolio website for Manthan Patel that works as a developer showcase, interactive resume, and smart personal dashboard — all in one.
- **Primary goal:** Make any recruiter, founder, or collaborator who lands on this site immediately understand who Manthan is, be impressed by his work, and take action — either downloading his resume or sending a message — within the first 60 seconds of visiting.

---

## TARGET USER

- **Who is the main user:** Recruiters, startup founders, fellow developers, and college professors/jury members who are evaluating Manthan for jobs, freelance work, collaborations, or academic review.
- **What problem are they coming to solve:** They want to quickly understand what Manthan builds, how good he is, and whether he is worth reaching out to — without wading through a boring PDF resume.
- **What does success look like for them:** They leave the site having downloaded his resume, viewed at least one project in detail, or sent a contact message — feeling confident that Manthan is skilled, professional, and someone worth hiring or working with.

---

## PAGES AND STRUCTURE

Build these 12 pages/sections. Mobile layout is the primary design. Desktop is an enhanced version of mobile.

---

**Page name:** Splash / Loading Screen
**Purpose:** Cinematic first impression before the site reveals. Show only once per session using sessionStorage.
**Key elements:**
- Animated "MP" logo reveal with neon glow and scale animation
- Floating particle background (stars/digital particles)
- Cycling typewriter text: "Initializing Portfolio..." → "Loading Experience..." → "Preparing Projects..." → "Almost Ready..." → "Welcome, Manthan's Universe"
- Animated progress bar (tied to actual asset loading)
- Skip button appears after 1.5 seconds
- Exit: radial scale-out + blur dissolve transition (800ms) into Home page
- Mobile: centered logo, minimal particles. Desktop: cyber grid background, denser particles

---

**Page name:** Home
**Purpose:** Hero landing section. Maximum impact in the first 5 seconds. Convert visitors to scroll further or click a CTA.
**Key elements:**
- Mobile layout stacks vertically: profile image (circular, floating animation, glowing border ring) → animated name reveal (character by character, 30ms stagger) → typewriter cycling subtitle (Developer • AI Builder • Innovator • Full Stack Engineer) → two CTA buttons (View Projects = primary violet, Download Resume = secondary outline) → Live status pill ("🟢 Currently Building: Smart Campus AI Platform", updates from database) → stats grid 2×2 (Projects: 12, APIs: 25+, Skills: 30+, GitHub: 500+, all animate from 0 on scroll) → social icons row (GitHub, LinkedIn, Instagram, X)
- Desktop layout: profile image floats RIGHT, text content on LEFT, stats in single horizontal row of 4, social dock as vertical floating bar on left edge, mouse-follow light particle blob in background, Three.js low-poly floating sphere as background element
- Animated gradient mesh background with sparse floating particles on both layouts

---

**Page name:** About
**Purpose:** Tell Manthan's story. Humanize the portfolio. Help visitors connect with him personally.
**Key elements:**
- Profile card with photo and personal tagline quote
- "My Story" section: 2–3 paragraphs about passion, journey, and vision
- Vertical animated timeline (mobile) / horizontal scroll-trigger timeline (desktop): 2020 Started Coding → 2021 First Website → 2022 Built AI Apps → 2024 Full Stack Developer
- Personality cards in 2×2 grid: Creativity 🎨, Innovation 🚀, Leadership 👥, Problem Solving 🧩 — tap/hover to flip and reveal description
- "By The Numbers" stats: 1200h coded, 12 projects, 300+ bugs squashed, 25+ APIs integrated — all animated from 0 on viewport entry
- Timeline items animate on scroll (slide up + opacity)

---

**Page name:** Projects
**Purpose:** The primary showcase. This is the most important content page on the site.
**Key elements:**
- Horizontal scrollable filter chip row: All / AI / Web Apps / Dashboards / Mobile — animated active state, instant client-side filter
- Mobile: vertical card list. Desktop: 2–3 column masonry grid. Featured projects render first with a larger "spotlight" card.
- Each project card contains: cover image/video, project title, short description, tech stack as icon chips, "View Details →" button
- On card click: navigate to full detail page at /projects/:slug
- Project detail page contains: back button, hero image/video, overview text, tech stack chips, architecture section, feature bullet list, challenges section, horizontal swipe gallery (mobile) / lightbox gallery (desktop), GitHub link + Live Demo link
- Initial projects in database: (1) Smart Campus Sustainability System — category AI/Dashboard, featured, features QR attendance + carbon tracking + AI dashboard, stack React/Supabase/Claude AI. (2) Emergency Crowd Management System — category AI/Web App, featured, features SOS alerts + walkie-talkie + live analytics. (3) Bus Tracking System — category Mobile/Web App, features GPS tracking + ETA prediction + notifications.
- All project data loads from Supabase `projects` table — new projects added via Admin Dashboard without code changes

---

**Page name:** Skills
**Purpose:** Visually communicate technical depth. Make the tech stack feel alive, not like a boring list.
**Key elements:**
- Orbit animation (centered, 300px on mobile / 500px on desktop): tech icon SVGs orbit around Manthan's profile image at different radii and speeds using GSAP. Icons pause on hover and show tooltip with skill name.
- Skill bars by category with animated fill (0 → value on scroll):
  - Frontend: React 85%, Tailwind CSS 90%, Vite 80%
  - Backend: Supabase 82%, Node.js 70%, REST APIs 88%
  - AI & Tools: AI Integration 78%, GSAP 75%, Git 92%
- Radar/spider chart built with Recharts showing category overview (Frontend, Backend, AI/ML, Tools, Database, DevOps) — animated draw on viewport entry
- Desktop: orbit on left, skill bars + chart on right in two columns
- All skill data editable from Admin Dashboard

---

**Page name:** Experience
**Purpose:** Show professional and project growth over time. Make the journey feel earned.
**Key elements:**
- Vertical timeline on mobile with left-aligned dots and lines: each entry has year, title, organization, description, and tag chips — entries animate in on scroll (slide up + opacity)
- Desktop: center timeline with entries alternating left and right
- Each timeline dot pulses on hover
- "Achievement Unlocks" section below timeline: cards appear with scale + glow burst animation. Example achievements: 🏆 Built First Full Stack App, 🏆 Integrated AI APIs, 🏆 Built Real-time Dashboard
- Achievement cards in 1-column list (mobile) / 3-column grid (desktop)
- All data from Supabase `experience` table, editable via Admin

---

**Page name:** Achievements
**Purpose:** Celebrate certifications, milestones, and coding activity.
**Key elements:**
- "Certificates" section: touch-swipe horizontal carousel on mobile, arrow navigation on desktop. Each card shows certificate image, title, issuer, and date.
- "GitHub Activity" section: contribution heatmap grid (52 weeks × 7 days of colored squares). Fetched from GitHub API for username. Cells animate in from left on scroll entry. Shows total contribution count below.
- "Badges & Milestones" section: badge cards with icon + label + description. Examples: 🥇 Hackathon Winner, 🚀 Shipped 10 Apps, 🤖 AI Integrator, 📦 Open Source Contributor. Hover/tap reveals full description.
- Certificate data from Supabase `certificates` table

---

**Page name:** Gallery
**Purpose:** Visual showcase of UI designs, project screenshots, and events.
**Key elements:**
- Filter chips: All / UI Designs / Project Screenshots / Events
- Masonry grid layout: 2 columns mobile, 3–4 columns desktop. Images vary in height (Pinterest-style).
- Lazy loading with blur-up placeholder on all images
- Tap/click opens a fullscreen lightbox viewer with prev/next navigation. Mobile: swipe gesture to navigate between images.
- Filter change triggers animated re-layout using Framer Motion layout animation
- Images loaded from Supabase Storage

---

**Page name:** Blog
**Purpose:** Knowledge sharing. Show Manthan thinks deeply about the things he builds.
**Key elements:**
- Search bar at top: client-side fuzzy search using Fuse.js
- Filter chips: All / AI / Development / UI Design / Campus Innovation
- Blog post cards: cover image, title, category tag, read time (auto-calculated from word count), date
- Blog post detail page (/blog/:slug): reading progress bar fixed at very top of viewport filling as user scrolls, cover image, title, date + read time, MDX rendered content with syntax-highlighted code blocks (Shiki), Like button (♡) with Supabase counter + optimistic UI, Share button (Web Share API on mobile, clipboard copy on desktop), Related Posts section at bottom
- All posts stored in Supabase `posts` table as MDX content. Slug auto-generated from title. Status: draft or published.

---

**Page name:** Resume
**Purpose:** Give visitors clean, immediate access to Manthan's resume.
**Key elements:**
- Embedded PDF preview via iframe (fallback: "Click to view PDF" link if iframe fails)
- Two buttons: "⬇ Download PDF" (animated, triggers download + analytics event) and "👁 View Full Screen"
- Download counter displayed: "Downloaded X times"
- "Key Highlights" section: React Developer, AI Integration Specialist, Full Stack Engineer — displayed as styled cards
- Visual condensed timeline (reuse Experience component, show only 3 most recent entries)
- Resume PDF stored in Supabase Storage, URL set via Admin Dashboard

---

**Page name:** Contact
**Purpose:** Convert interested visitors into real conversations. Make reaching out feel easy and human.
**Key elements:**
- Section headline: "Let's Connect"
- Contact form fields: Name (required), Email (required + valid format), Subject, Message (required, min 10 chars). Validation via React Hook Form + Zod. Honeypot hidden field for spam protection.
- On submit: save to Supabase `messages` table, send email notification via Resend API, show animated checkmark + success toast "Message sent! I'll reply within 24h 👋"
- "Schedule a Call" section: Cal.com calendar embed
- "Find Me" section: Google Maps embed showing Manthan's city/region in India
- Social links row with animated hover (each platform shows its brand color on hover): GitHub, LinkedIn, Instagram, X, Email

---

**Page name:** Admin Dashboard
**Purpose:** Let Manthan manage all website content without touching code. Full CMS functionality.
**URL:** /admin (protected route — redirect to /admin/login if unauthenticated)
**Key elements:**

Login screen: MP logo, email field, password field, Sign In button. Auth via Supabase Auth (single user, email/password). Session timeout: 8 hours inactivity.

After login, show overview dashboard with: total visitors today, resume downloads today, active users (Supabase Realtime), last 5 contact messages preview, top 3 projects by view count, quick action buttons (Add Project, New Blog Post).

Admin sidebar sections:
1. **Projects Manager** — table of all projects with edit/delete actions. "Add Project" form: title, slug (auto-generated), description, category (multi-select), tech stack (JSON chip builder), images upload (Supabase Storage), GitHub URL, live URL, featured toggle, visible toggle.
2. **Blog Manager** — table of posts with draft/published status. Rich text or MDX editor. Cover image upload. Publish/unpublish toggle.
3. **Media Library** — file browser for Supabase Storage. Folders: projects, gallery, certificates, resume. Upload files, copy public URL, delete files. File validation: images/PDF/video only, max 10MB.
4. **Resume Manager** — upload new resume PDF, preview current resume, view download count.
5. **Contact Messages** — list of all messages with read/unread status. Mark as read, delete, reply button (opens email client with pre-filled to address).
6. **Skills Manager** — add/edit/delete skills. Set name, category, proficiency (0–100 slider), icon.
7. **Experience Manager** — add/edit/delete experience entries. Drag-to-reorder timeline.
8. **Analytics Dashboard** — line chart (visitors over time: daily/weekly/monthly), bar chart (page views by section), doughnut chart (device types), table (traffic sources), resume download trend.
9. **Site Settings** — update "Currently Building" status text (shows on Home live pill), social media URLs, update AI chat dynamic context (textarea field that updates `site_settings.ai_context` in Supabase — this is appended to the AI assistant's knowledge at runtime).

---

## FEATURES — MUST HAVE

These are non-negotiable. The site does not launch without them.

1. **Cinematic Splash Screen** — Animated logo reveal, cycling loading text, progress bar, blur dissolve exit. Once per session only.
2. **Mobile Bottom Navigation Bar** — Fixed bottom bar with glassmorphism background, 7 icon links (Home, Projects, Skills, Gallery, Blog, Resume, Contact), animated active indicator, iOS safe area padding.
3. **Desktop Top Navbar** — Fixed, transparent → glassmorphism on scroll, auto-hide on scroll down, reveal on scroll up. Contains logo, nav links, theme toggle, music toggle.
4. **Dark/Light Theme Toggle** — Smooth 400ms CSS transition across all color tokens. Persists in localStorage. Detects system preference on first visit.
5. **Animated Project Cards with Filter** — Glassmorphism cards, horizontal filter chips, stagger animation on load and filter change, client-side instant filtering.
6. **Project Detail Pages** — Full page route per project (/projects/:slug) with hero media, tech stack, features, gallery, and external links.
7. **Skills Orbit Animation** — Tech icons orbiting profile image at different radii/speeds using GSAP. Pause on hover. Animated progress bars per skill.
8. **Animated Scroll Reveals** — Every section entry uses Framer Motion: fade up (y: 20→0, opacity: 0→1). Stagger children 80ms. Respect prefers-reduced-motion.
9. **Contact Form** — Validated form saving to Supabase, email notification via Resend, success animation. Spam protection via honeypot.
10. **Resume PDF Download** — Tracked download button, embedded preview, download counter.
11. **Floating AI Chat Widget** — Glassmorphism button bottom-right. Opens chat sheet. Uses built-in Claude AI (no API key). System prompt hardcoded with Manthan's full bio, projects, skills, contact info. Dynamic context appended from Supabase `site_settings.ai_context`. Tappable quick-command chips. Typing animation on responses. Can trigger React Router navigation and resume download via JSON action responses in replies.
12. **Admin Dashboard** — Protected /admin route with full CMS: manage projects, blog, skills, experience, media, resume, messages, analytics, and AI context.
13. **Supabase Backend** — All dynamic data (projects, posts, skills, experience, certificates, gallery, messages, analytics, site settings) stored in Supabase PostgreSQL with Row Level Security.
14. **Visitor Analytics** — Track page views, session duration, device type, rough location — stored in Supabase `analytics` table, visible in Admin Dashboard.
15. **Mobile-first responsive layout** — Every page designed for 375px width first, then enhanced for 1280px+ desktop.

---

## FEATURES — NICE TO HAVE

Add these after the core build is stable.

1. **Ambient Music Player** — Floating glassmorphism pill player. Page-based auto-switching moods (cinematic on Home, energetic on Projects, calm on Blog). Cross-fade 1.5s between tracks.
2. **Real-time Visitor Notifications** — Live popup toasts (top-right) powered by Supabase Realtime: "Someone in Mumbai is viewing your projects", "Resume just downloaded", "New visitor from San Francisco". Auto-dismiss 4s.
3. **Custom Cursor (Desktop)** — 32px outer ring with 200ms lag + 6px inner dot with 0ms lag. Expands on hover, ripple on click, 6-ghost trail. Changes color per active section.
4. **Lenis Smooth Scroll** — Applied globally on desktop (lerp 0.1). Disabled on mobile for native performance. Integrated with GSAP ScrollTrigger.
5. **GitHub Contribution Heatmap** — Animated grid fetched from GitHub API. Cells animate in from left on scroll.
6. **Three.js Hero Object** — Low-poly floating geometric sphere on Home page hero. Reacts to mouse position on desktop.
7. **Blog Like System** — ♡ like button on posts. Supabase increment. Optimistic UI update.
8. **Meeting Scheduler** — Cal.com embed on Contact page.

---

## DESIGN REQUIREMENTS

- **Overall feel:** Premium, futuristic, cinematic, smooth — like Apple.com crossed with Vercel crossed with a sci-fi dashboard. Not generic. Not corporate. Not Bootstrap.
- **Color palette (exact values — do not change these):**
  - Background primary: `#05050a` (near-black)
  - Background secondary: `#0d0d1a` (card/panel backgrounds)
  - Surface elevated: `#12122a`
  - Accent primary: `#6c63ff` (electric violet — main brand color)
  - Accent cyan: `#00f5d4` (neon cyan — secondary highlights)
  - Accent amber: `#f4a738` (warm amber — warning/achievement states)
  - Text primary: `#f0f0ff`
  - Text secondary: `#8585a8`
  - Border: `rgba(108,99,255,0.2)`
  - Glassmorphism: `rgba(13,13,26,0.6)` background + `backdrop-filter: blur(20px)` + `border: 1px solid rgba(108,99,255,0.15)`
  - Light mode background: `#f8f7ff` with dark ink text
- **Font stack (import from Google Fonts):**
  - Hero/Display text: **Syne** (weight 700, 800)
  - Section headings: **Space Grotesk** (weight 600, 700)
  - Body text: **DM Sans** (weight 400, 500)
  - Code/mono text: **JetBrains Mono** (weight 400, 500)
  - Accent labels/badges: **Orbitron** (weight 500)
- **Motion defaults:**
  - Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
  - Fast transitions: 150–200ms
  - Normal transitions: 300–400ms
  - Cinematic/page enters: 600ms–1.2s
  - Page section enter: fade up (translateY 20px → 0, opacity 0 → 1)
  - Child stagger: 80ms delay per item
  - Always add `@media (prefers-reduced-motion: reduce)` to disable all non-essential animations
- **Reference sites I like:** https://vercel.com, https://linear.app, https://framer.com
- **What to avoid:**
  - No Bootstrap or Material UI feel
  - No generic gradient cards (purple-to-pink)
  - No Comic Sans or system fonts anywhere
  - No light theme as default (dark is default)
  - No cramped mobile layouts — use generous padding
  - No animations that feel janky or CPU-heavy on mobile
  - No lorem ipsum in the final build — all placeholder text should be realistic/branded

---

## TECHNICAL REQUIREMENTS

- **Authentication needed:** Yes — Admin Dashboard only. Single user login via Supabase Auth (email + password). All other pages are public.
- **Database needed:** Yes — Supabase (PostgreSQL). Tables needed:
  - `projects` — id, slug, title, description, category (text[]), tech_stack (jsonb), images (text[]), video_url, github_url, live_url, featured (bool), visible (bool), order_index, created_at, updated_at
  - `posts` — id, slug, title, excerpt, content (MDX text), cover_url, category (text[]), tags (text[]), status (draft/published), likes (int), read_time (int), published_at, created_at
  - `skills` — id, name, category, proficiency (0–100), icon_url, order_index
  - `experience` — id, title, org, start_date, end_date, current (bool), description, tags (text[]), type (work/freelance/project/achievement), order_index
  - `certificates` — id, title, issuer, date, image_url, credential_url
  - `gallery` — id, title, image_url, category, order_index
  - `analytics` — id, event_type, page, project_id, session_id, device, country, city, duration, created_at
  - `messages` — id, name, email, subject, body, read (bool), created_at
  - `site_settings` — key (text PK), value (text), updated_at. Seed with: `current_project = "Smart Campus AI Platform"`, `ai_context = ""` (editable from Admin)
  - Enable Row Level Security (RLS) on all tables. Public users: read-only on projects (visible=true), posts (published only), skills, experience, certificates, gallery, site_settings. Public users: insert-only on analytics and messages. Admin (authenticated): full read/write on everything.
- **Payments needed:** No
- **Mobile responsive:** Yes — mobile-first. Primary design target is 375px. Enhanced layouts at 640px (tablet) and 1024px+ (desktop). Use Tailwind CSS breakpoints: sm, md, lg, xl.
- **Integrations:**
  - Supabase JS client (database, auth, storage, realtime)
  - Resend API (contact form email notification) — call via Supabase Edge Function `send-contact-email`
  - GitHub REST API (contribution heatmap — public endpoint, no auth required for public repos)
  - Google Maps embed (Contact page — static iframe embed, no API key needed for basic embed)
  - Cal.com embed (Contact page — iframe or React component)
  - Built-in Claude AI (AI chat widget — no API key, uses Anthropic built-in capability, model: claude-sonnet-4-20250514)
  - Vercel Analytics (frontend performance tracking)

---

## CONTENT

- **Copy:** AI should generate realistic placeholder copy for all sections based on the persona described. Manthan is a full stack developer and AI builder from India, studying/working in the tech space, passionate about AI, automation, and building real products that solve real problems. Tone: confident, technical but approachable, not corporate.
- **Images:** Use placeholder images from https://picsum.photos for project thumbnails and gallery. Profile image: use a placeholder avatar. All images should be swappable by Manthan later via Admin Dashboard.
- **Logo:** Text-based logo — animated "MP" initials in Orbitron font, violet (#6c63ff) color, with a subtle animated gradient border or glow on the container. No image logo needed.

---

## SUCCESS CRITERIA

The website is done well when all of the following are true:

1. A first-time visitor on mobile understands who Manthan is and what he does within 5 seconds of the splash screen clearing.
2. The Projects page loads, filters work instantly, and clicking a project card navigates to a full detail page without errors.
3. The contact form submits successfully, shows an animated success state, and the message appears in the Admin Dashboard messages list.
4. The Admin Dashboard is accessible only after login. Manthan can add a new project via the Admin form and it appears live on the Projects page without any code changes.
5. The AI chat widget opens, shows the welcome message, answers "Who is Manthan?" correctly using the hardcoded system prompt, and the AI context edited in Site Settings is reflected in answers after the widget is reopened.
6. The Resume PDF download button triggers a file download AND increments the download counter shown on the Resume page.
7. Lighthouse mobile performance score is 90 or above. No layout shift on page load. Animations are smooth (no jank) on a mid-range Android device.
8. Dark/light theme toggle works on every page, persists on refresh, and every text element remains readable in both modes.
9. All 12 pages render correctly on 375px mobile width with no horizontal overflow.
10. The site works fully offline for static content (only database-driven sections like live status and analytics need connectivity).

---

## ADDITIONAL NOTES FOR THE BUILDER

- Use **React 18 + Vite + Tailwind CSS v3** as the base. Do not use Next.js.
- Use **Framer Motion** for all scroll-reveal animations and page transitions.
- Use **GSAP** for the skills orbit animation and any timeline-based sequences.
- Use **Zustand** for global state (theme, music player state, AI chat open/closed, current section).
- Use **React Router v6** for client-side routing. Routes: /, /about, /projects, /projects/:slug, /skills, /experience, /achievements, /gallery, /blog, /blog/:slug, /resume, /contact, /admin, /admin/login.
- Use **React Hook Form + Zod** for all form validation.
- Use **Recharts** for the skills radar chart and all Admin analytics charts.
- Mobile bottom navigation should have 7 items maximum. On screens narrower than 360px, hide labels and show icons only.
- The AI chat widget's system prompt is assembled at runtime as: [HARDCODED_BASE_PROMPT] + "\n\n=== LATEST UPDATES ===\n" + [value of site_settings.ai_context from Supabase]. Fetch site_settings.ai_context when the chat widget first opens.
- AI chat navigation actions: when the AI responds with JSON like `{"action":"navigate","to":"/projects"}`, the widget should close and React Router should navigate to that route. When it responds with `{"action":"download","type":"resume"}`, trigger the resume download programmatically.
- Supabase Storage buckets needed: `avatars`, `projects`, `gallery`, `certificates`, `resume`, `blog-covers`.
- The `/admin` route must check Supabase auth session on mount. If no active session, redirect immediately to `/admin/login`. Do not flash admin content before the check completes.
- Deploy target is **Vercel**. Set up environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as client-side variables. `RESEND_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` only in Supabase Edge Function environment, never in the frontend bundle.
- Add a `robots.txt` that allows all crawlers except disallows `/admin`. Add basic Open Graph meta tags to every page (og:title, og:description, og:image). Add JSON-LD schema type `Person` to the Home page.

---
*Paste this entire document as your first message. Do not start building before sending this.*
*PRD Version: 1.1 | Project: Manthan Patel Portfolio | Status: Ready for Build*
