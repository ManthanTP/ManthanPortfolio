# MANTHAN PATEL — INTERACTIVE DEVELOPER PORTFOLIO
### Ultra-detailed build prompt for Lovable / Bolt / Cursor / v0 / any text-to-code tool
### Same spec depth as production — paste this as your FIRST and ONLY message before building

---

Build a full stack animated developer portfolio for **Manthan Patel** using **React 18, TypeScript, Tailwind CSS v3, Framer Motion, GSAP, Zustand, React Router v6, and Supabase**. The page title is **"Manthan Patel — Developer & AI Builder"**.

---

## GLOBAL STYLES

- **Background:** `#05050a` on `html`, `body`, `#root`, and the main wrapper
- **Font family:** `'Syne'` (weights 400–800), `'DM Sans'` (weights 300–500), `'Orbitron'` (weights 400–700), `'JetBrains Mono'` (weights 400–500) — all imported from Google Fonts
- **Global reset:** `box-sizing: border-box`, `margin: 0`, `padding: 0`
- **Main wrapper:** `overflowX: clip`
- **CSS variables on `:root`:**
  ```css
  --bg:        #05050a;
  --bg2:       #0d0d1a;
  --surface:   #12122a;
  --violet:    #6c63ff;
  --violet-dim: rgba(108,99,255,0.15);
  --cyan:      #00f5d4;
  --amber:     #f4a738;
  --text:      #f0f0ff;
  --muted:     #8585a8;
  --border:    rgba(108,99,255,0.2);
  --glass:     rgba(13,13,26,0.7);
  ```
- **CSS class `.grad-text`:** `background: linear-gradient(135deg, #6c63ff 0%, #00f5d4 100%)` with `-webkit-background-clip: text` and `-webkit-text-fill-color: transparent`
- **CSS class `.hero-heading`:** `font-family: 'Syne'`, `font-weight: 800`, `letter-spacing: -0.03em`, `line-height: 1`, uses `.grad-text`
- **CSS class `.glass`:** `background: rgba(13,13,26,0.7)`, `backdrop-filter: blur(20px)`, `border: 1px solid rgba(108,99,255,0.2)`, `border-radius: 16px`
- **Custom scrollbar:** 4px width, `--bg` track, `--violet` thumb, `border-radius: 2px`
- **Global easing variable:** `cubic-bezier(0.16, 1, 0.3, 1)` — use for all Framer Motion transitions
- **`prefers-reduced-motion`:** All animations wrapped with a check — when reduced motion is preferred, disable all transforms and use opacity-only transitions

---

## SECTION ORDER

1. SplashScreen
2. HeroSection
3. AboutSection
4. ProjectsSection
5. SkillsSection
6. ExperienceSection
7. AchievementsSection
8. GallerySection
9. BlogSection
10. ResumeSection
11. ContactSection
12. AdminDashboard (route `/admin`)

Plus global: `Navbar` (desktop), `BottomNav` (mobile), `FloatingAIWidget`, `NotificationSystem`, `MusicPlayer`

---

## SECTION 1 — SPLASH SCREEN

Full viewport (`position: fixed`, `inset: 0`, `z-index: 9999`). Show **once per session** — check `sessionStorage.getItem('splashSeen')`; if set, skip entirely and render main site immediately. On complete, set `sessionStorage.setItem('splashSeen', '1')`.

**Background:** `#05050a`. Overlaid with `CyberGrid` component (see Reusable Components). Two layers of `Particles` components — one violet (`108,99,255`), one cyan (`0,245,212`).

**Scanline effect:** Absolutely positioned `div`, `left: 0`, `right: 0`, `height: 2px`, `background: linear-gradient(90deg, transparent, rgba(108,99,255,0.5), transparent)`. Animation `@keyframes scanline` — `top` goes from `-10%` to `110%` over `3s linear infinite`.

**Logo block** — centered absolutely:
- Outer pulse ring: `position: absolute`, `inset: -20px`, `border-radius: 24px`, `border: 1px solid rgba(108,99,255,0.3)`, animation `pulse-ring 2.5s ease-in-out infinite`
- Logo box: `width: 100px`, `height: 100px`, `border-radius: 20px`, `background: linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,245,212,0.1))`, `border: 1px solid rgba(108,99,255,0.4)`, `box-shadow: 0 0 30px rgba(108,99,255,0.3), 0 0 60px rgba(108,99,255,0.1)`, animation `logo-morph 4s ease-in-out infinite` (keyframe: `0%,100% border-radius:20px`, `50% border-radius:50%`)
- "MP" text inside: `font-family: 'Orbitron'`, `font-size: 36px`, `font-weight: 700`, `letter-spacing: 2px`, uses `.grad-text`

**Name block** below logo — `text-align: center`, `margin-top: 24px`:
- `"Manthan Patel"` — `font-family: 'Syne'`, `font-size: 28px`, `font-weight: 700`
- `"DEVELOPER • AI BUILDER • INNOVATOR"` — `font-family: 'JetBrains Mono'`, `font-size: 12px`, `color: var(--violet)`, `letter-spacing: 3px`

**Cycling message** — `font-family: 'JetBrains Mono'`, `font-size: 13px`, `color: var(--muted)`. Cycles every `700ms` through: `"Initializing Portfolio..."` → `"Loading Experience..."` → `"Preparing Projects..."` → `"Almost Ready..."` → `"Welcome, Manthan's Universe"`. Transition: `opacity` fade `0.3s`.

**Progress bar** — `width: 260px`, `height: 2px`, `background: rgba(108,99,255,0.15)`, `border-radius: 2px`. Inner fill: `background: linear-gradient(90deg, var(--violet), var(--cyan))`, `box-shadow: 0 0 10px var(--cyan)`. Progress increments via `setInterval` at `60ms` steps of `random * 3 + 1`. At 100%, wait `300ms` then trigger exit. Percentage label: `font-family: 'JetBrains Mono'`, `font-size: 11px`, `color: var(--muted)`, right-aligned.

**Skip button** — appears after `1500ms` with `fadeIn 0.5s ease`. `position: absolute`, `bottom: 40px`, `right: 24px`. `background: transparent`, `border: 1px solid var(--border)`, `color: var(--muted)`, `padding: 6px 16px`, `border-radius: 8px`, `font-size: 12px`. On click: trigger exit animation.

**Exit animation** — Framer Motion `AnimatePresence`. Exit: `opacity: 0`, `scale: 1.05`, `filter: blur(8px)` over `900ms` with the global easing. After exit, render main site.

---

## SECTION 2 — HERO SECTION

Full viewport height (`min-height: 100vh`). `position: relative`, `overflow: hidden`. Background: `var(--bg)`. Contains `CyberGrid`, two `Particles` layers (violet 25 particles, cyan 10 particles), and two radial gradient orbs positioned absolutely (violet orb top-right, cyan orb bottom-left).

**Navbar (desktop only — hidden below `md`):**
- `position: fixed`, `top: 0`, `left: 0`, `right: 0`, `z-index: 1000`, `height: 72px`
- Background transitions from `transparent` to `.glass` when `window.scrollY > 50` — `transition: all 0.4s ease`
- `border-bottom` appears at scroll > 50: `1px solid var(--border)`
- Left side: Logo mark — `width: 38px`, `height: 38px`, `border-radius: 10px`, `border: 1px solid rgba(108,99,255,0.4)`, "MP" in `Orbitron` `.grad-text` font-size 14px. Next to it: `"Manthan"` in Syne 16px bold.
- Right side: nav links — `"home"`, `"projects"`, `"skills"`, `"experience"`, `"gallery"`, `"blog"`, `"resume"`, `"contact"`. `font-size: 14px`, `font-weight: 500`, `color: var(--muted)`. Active link: `color: var(--text)` with animated `2px` bottom border in `linear-gradient(90deg, var(--violet), var(--cyan))`. Hover: `color: var(--text)`, `transition: 200ms`. `text-transform: capitalize`.
- Far right: Theme toggle icon button + Music toggle icon button. Each `width: 36px`, `height: 36px`, `border-radius: 8px`, `border: 1px solid var(--border)`, `background: var(--bg2)`.
- Navbar fades in: Framer Motion `y: -20 → 0`, `opacity: 0 → 1`, `delay: 0`, `duration: 0.6`.

**Mobile bottom navigation (hidden above `md`):**
- `position: fixed`, `bottom: 0`, `left: 0`, `right: 0`, `z-index: 1000`, `height: 68px`
- Uses `.glass` class + `border-top: 1px solid var(--border)` + `border-radius: 20px 20px 0 0`
- `padding-bottom: env(safe-area-inset-bottom)`
- 7 items: Home `⌂`, Projects `⊞`, Skills `⚡`, Gallery `🖼`, Blog `✍`, Resume `📄`, Contact `✉`
- Each item: `display: flex`, `flex-direction: column`, `align-items: center`, `gap: 3px`, `padding: 8px 12px`, `border-radius: 12px`. `font-size: 10px`, `font-weight: 500`. Inactive: `color: var(--muted)`. Active: `color: var(--violet)` + active dot `4px × 4px` violet circle below icon.
- Icon font-size: `20px`. On screens < `360px`: hide labels, show icons only.
- Active section tracked via `IntersectionObserver` on all section IDs.

**Hero content — Mobile layout (flex column, center-aligned):**

1. Profile image (centered, margin-bottom: 24px):
   - Outer: `position: relative`, `width: 110px`, `height: 110px`
   - Pulse ring: `position: absolute`, `inset: -8px`, `border-radius: 50%`, `border: 2px solid rgba(108,99,255,0.4)`, animation `pulse-ring 2.5s ease-in-out infinite`
   - Spinning outer ring: `position: absolute`, `inset: -20px`, `border-radius: 50%`, `border: 1px dashed rgba(108,99,255,0.3)`, animation `spin-slow 18s linear infinite`
   - Spinning inner ring (reverse): `position: absolute`, `inset: -32px`, `border-radius: 50%`, `border: 1px dashed rgba(0,245,212,0.15)`, animation `spin-slow 12s linear infinite reverse`
   - Image container: `width: 110px`, `height: 110px`, `border-radius: 50%`, `background: linear-gradient(135deg, rgba(108,99,255,0.25), rgba(0,245,212,0.15))`, `border: 2px solid rgba(108,99,255,0.5)`, `box-shadow: 0 0 60px rgba(108,99,255,0.3), inset 0 0 40px rgba(108,99,255,0.05)`. Image tag: `src` = Manthan's profile photo (placeholder: `https://api.dicebear.com/7.x/avataaars/svg?seed=manthan`). `object-fit: cover`. Animation `float 4s ease-in-out infinite` on the whole block.

2. Label: `"HEY, I'M"` — `font-family: 'JetBrains Mono'`, `font-size: 11px`, `color: var(--violet)`, `letter-spacing: 3px`, `margin-bottom: 8px`. FadeIn: `delay: 0.1`, `y: 20`.

3. Heading: `"Manthan"` on line 1 with `.grad-text .hero-heading`, `"Patel"` on line 2 plain `--text` color. `font-size: clamp(40px, 12vw, 80px)`. FadeIn: `delay: 0.2`, `y: 30`, `duration: 0.8`.

4. Typewriter subtitle: `font-size: 18px`, `color: var(--muted)`, `min-height: 32px`, `margin-bottom: 28px`. Cycles: `["Developer", "AI Builder", "Innovator", "Full Stack Engineer"]`. See `Typewriter` component. FadeIn: `delay: 0.3`, `y: 20`.

5. CTA buttons row — `display: flex`, `gap: 12px`, `justify-content: center`, `margin-bottom: 28px`. FadeIn: `delay: 0.4`, `y: 20`.
   - Primary (`ViewProjectsButton`): `background: linear-gradient(135deg, var(--violet), #9b8fff)`, `color: white`, `padding: 12px 24px`, `border-radius: 12px`, `font-size: 15px`, `font-weight: 500`. Hover: `translateY(-2px)` + `box-shadow: 0 8px 25px rgba(108,99,255,0.5)`. Label: `"View Projects →"`. On click: smooth scroll to `#projects`.
   - Secondary (`ResumeButton`): `background: transparent`, `border: 1px solid var(--border)`, `color: var(--text)`, same sizing. Hover: `border-color: var(--violet)`, `color: var(--violet)`. On click: trigger resume download from Supabase Storage.

6. Live status pill: `display: inline-flex`, `align-items: center`, `gap: 8px`, `padding: 8px 16px`, `border-radius: 100px`, `background: rgba(0,245,212,0.08)`, `border: 1px solid rgba(0,245,212,0.2)`, `font-size: 13px`, `color: var(--cyan)`. Left dot: `8px × 8px` circle, `background: var(--cyan)`, `box-shadow: 0 0 8px var(--cyan)`, animation `pulse-ring 2s infinite`. Text: `"Currently Building: Smart Campus AI Platform"` — fetched live from Supabase `site_settings` where `key = 'current_project'`. FadeIn: `delay: 0.5`, `y: 20`.

7. Stats grid — `display: grid`, `grid-template-columns: 1fr 1fr`, `gap: 12px`, `margin-bottom: 28px`. 4 cards. Each stat card: `background: var(--bg2)`, `border: 1px solid var(--border)`, `border-radius: 16px`, `padding: 20px 16px`, `text-align: center`. Hover: `border-color: var(--violet)`, `translateY(-4px)`. Icon (20px), counter value (Syne 26px bold violet), label (12px muted). Counter animates 0 → end using `AnimatedCounter` component (triggered on viewport entry). Data: `{icon:"⊞", end:12, label:"Projects Built"}, {icon:"⚡", end:25, suffix:"+", label:"APIs Integrated"}, {icon:"◈", end:30, suffix:"+", label:"Technologies"}, {icon:"⌘", end:500, suffix:"+", label:"GitHub Commits"}`. FadeIn: `delay: 0.6`, `y: 20`.

8. Social icons row — `display: flex`, `gap: 12px`, `justify-content: center`. Each: `44px × 44px`, `border-radius: 12px`, `background: var(--bg2)`, `border: 1px solid var(--border)`. Hover: border changes to platform color + `translateY(-4px)`. 4 icons: GitHub (color `#f0f0ff`), LinkedIn (`#0a66c2`), Instagram (`#e1306c`), X (`#f0f0ff`). Use Lucide React icons. FadeIn: `delay: 0.7`.

**Hero content — Desktop layout (md+):**
- `display: flex`, `align-items: center`, `gap: 80px`, max-width `900px`, centered
- Left column (flex:1): label → heading → typewriter → CTA buttons → live status pill. Same content, larger sizing: heading `clamp(52px, 6vw, 80px)`, typewriter `22px`.
- Right column: Profile image (200px × 200px instead of 110px) + Stats 2×2 grid below it + Social row. Three.js low-poly rotating sphere rendered as `<canvas>` behind/around the profile image (desktop only, lazy-loaded via `React.lazy`).
- Social dock: vertical floating bar on left edge of viewport, `position: fixed`, `left: 24px`, `top: 50%`, `transform: translateY(-50%)`. Icons stacked vertically, `gap: 10px`.

**Scroll indicator:** `position: absolute`, `bottom: 80px`, `left: 50%`, `transform: translateX(-50%)`. "scroll" in `11px muted mono` + `↓` `18px`. Animation `float 2s ease-in-out infinite`. Hidden once user scrolls > 100px.

---

## SECTION 3 — ABOUT

Background: `linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)`. `padding: clamp(80px, 10vw, 120px) 20px`. `position: relative`, `overflow: hidden`. `id="about"`.

**Section label + heading** — `margin-bottom: 48px`. FadeIn `delay:0`, `y:40`:
- Label: `"01 / ABOUT"` — `font-family: 'JetBrains Mono'`, `font-size: 11px`, `color: var(--cyan)`, `letter-spacing: 4px`, `margin-bottom: 8px`
- H2: `"About "` plain + `"Me"` with `.grad-text`, `.hero-heading`, `font-size: clamp(32px, 6vw, 52px)`

**Intro card** — FadeIn `delay:0.1`, `y:30`. `padding: 28px`, `border-radius: 20px`, `background: var(--bg2)`, `border: 1px solid var(--border)`, `margin-bottom: 48px`. Inner layout: flex row with `gap: 20px`. Left: avatar circle `64px × 64px` (same style as hero profile, smaller). Right: name bold Syne 20px + two body paragraphs in DM Sans 15px `color: var(--muted)` `line-height: 1.7`.

Paragraph 1: `"I'm a full stack developer and AI builder from India, passionate about creating digital experiences that actually solve real problems. I don't just write code — I build products people love using."`

Paragraph 2: `"My superpower is combining clean frontend design with powerful AI backends. Whether it's a smart campus system, an emergency response tool, or a real-time dashboard — I obsess over every detail until it feels right."`

**Journey timeline** — `margin-bottom: 48px`. FadeIn `delay:0.2`. Heading: Syne 22px bold `"My Journey"`, `margin-bottom: 24px`.

4 timeline entries. Each entry: `display: flex`, `gap: 20px`, `padding-bottom: 24px` (last item no padding). Entry animates: `fadeUp 0.6s (i * 0.1 + 0.3)s ease both` when section is visible.

Left column of each entry: `width: 12px`, flex column. Dot: `12px × 12px` circle, `background: var(--violet)`, `box-shadow: 0 0 0 4px rgba(108,99,255,0.2)`, `flex-shrink: 0`. Hover: `box-shadow: 0 0 0 8px rgba(108,99,255,0.2), 0 0 20px rgba(108,99,255,0.5)`. Connector line below dot (except last): `flex: 1`, `width: 1px`, `background: linear-gradient(180deg, rgba(108,99,255,0.5), rgba(108,99,255,0.1))`.

Right column: year in `Orbitron 11px violet` + horizontal rule `20px × 1px border-color` + title in Syne 15px bold. Description in DM Sans 13px muted `line-height: 1.6`.

Data: `{year:"2020", title:"Started Coding", desc:"Wrote first lines of HTML/CSS. Fell in love with building things."}, {year:"2021", title:"First Website", desc:"Built and deployed a real website. Started learning JavaScript deeply."}, {year:"2022", title:"Built AI Apps", desc:"Discovered AI APIs. Started automating everything with code."}, {year:"2024", title:"Full Stack Developer", desc:"Shipping full stack products with React, Supabase, and AI integration."}`

**Personality trait cards** — `margin-bottom: 48px`. FadeIn `delay:0.3`. Heading: Syne 22px `"I'm Driven By..."`, `margin-bottom: 20px`. Grid: `grid-template-columns: 1fr 1fr`, `gap: 12px`.

Each card: `background: var(--bg2)`, `border: 1px solid var(--border)`, `border-radius: 16px`, `padding: 24px`, cursor pointer. Hover: `border-color: var(--cyan)`, `box-shadow: 0 0 30px rgba(0,245,212,0.1)`, `translateY(-4px)`, all `transition: 0.3s`. Tap/hover reveals back face with description (CSS `perspective` + `rotateY` flip, or Framer Motion `rotateY` toggle). Front: emoji (28px) + title (Syne bold). Back: description (DM Sans 13px muted).

Data: `{emoji:"🎨", title:"Creative", desc:"Designs that make people say wow. Always pixel-perfect."}, {emoji:"🚀", title:"Innovative", desc:"First to try new tech. AI-first approach to every problem."}, {emoji:"👥", title:"Leader", desc:"Built and led project teams. Mentors peers in tech."}, {emoji:"🧩", title:"Problem Solver", desc:"Turns complex problems into elegant, simple solutions."}`

**By The Numbers grid** — FadeIn `delay:0.4`. Heading: Syne 22px `"By The Numbers"`, `margin-bottom: 20px`. Grid: `1fr 1fr`, `gap: 12px`.

Each cell: `padding: 20px`, `border-radius: 16px`, `background: linear-gradient(135deg, rgba(108,99,255,0.08), rgba(0,245,212,0.04))`, `border: 1px solid var(--border)`, `text-align: center`. Counter value: Syne 32px 800 weight `.grad-text`. Label: DM Sans 12px muted `margin-top: 4px`. Animates with `counter-up 0.6s (i * 0.1 + 0.5)s ease both`.

Data: `{end:1200, suffix:"h", label:"Hours Coded"}, {end:12, suffix:"", label:"Projects Shipped"}, {end:300, suffix:"+", label:"Bugs Squashed"}, {end:25, suffix:"+", label:"APIs Integrated"}`

**Desktop layout (md+):** Timeline becomes center-axis with entries alternating left/right. Trait cards become `1fr 1fr 1fr 1fr` row. Numbers become single row of 4.

---

## SECTION 4 — PROJECTS

Background: `var(--bg)`. `padding: clamp(80px, 10vw, 120px) 20px clamp(100px, 12vw, 140px)`. `id="projects"`. Top divider: `1px` line `background: linear-gradient(90deg, transparent, var(--violet), transparent)`.

**Section label + heading** — FadeIn `delay:0`:
- Label: `"02 / PROJECTS"` — `JetBrains Mono 11px`, `color: var(--cyan)`, `letter-spacing: 4px`
- H2: `"What I've "` + `"Built"` `.grad-text`. Inline with project count: `"{n} projects"` DM Sans 13px muted right-aligned

**Filter chips row** — FadeIn `delay:0.1`. `display: flex`, `gap: 8px`, `flex-wrap: wrap`, `margin-bottom: 36px`, `overflow-x: auto`, `-ms-overflow-style: none`, `scrollbar-width: none`. Chips: `["All", "AI", "Web App", "Dashboard", "Mobile"]`. Each chip: `padding: 4px 12px`, `border-radius: 100px`, `font-size: 12px`, `font-weight: 500`, `border: 1px solid var(--border)`, `color: var(--muted)`, `background: var(--bg2)`, `cursor: pointer`, `transition: 0.2s`, `white-space: nowrap`. Active/hover: `border-color: var(--violet)`, `color: var(--violet)`, `background: rgba(108,99,255,0.1)`. Filtering is instant client-side; cards re-animate with stagger on filter change.

**Project cards** — Mobile: vertical single-column. Desktop (md+): `grid-template-columns: 1fr 1fr`, `gap: 20px`. Each card animates: `card-in 0.6s (i * 0.12)s ease both` when visible. Transition `translateY(-8px)` + `box-shadow: 0 20px 60px rgba(108,99,255,0.2)` on hover.

Card wrapper: `.glass`, `border-radius: 20px`, `overflow: hidden`, `cursor: pointer`. Featured cards additionally have `border-color: rgba(108,99,255,0.3)`.

Featured badge strip (only if `featured: true`): `padding: 6px 16px`, `background: linear-gradient(90deg, rgba(108,99,255,0.3), rgba(0,245,212,0.1))`, `border-bottom: 1px solid var(--border)`, `font-size: 11px`, `color: var(--cyan)`, `font-weight: 600`, `letter-spacing: 2px`. Text: `"★ FEATURED PROJECT"`.

Card body: `padding: 24px`. Flex row `gap: 16px`.

Left: emoji icon block — `56px × 56px`, `border-radius: 16px`, `flex-shrink: 0`. Background and border use project's accent color at 15% and 30% opacity.

Right: title (Syne 18px bold, `margin-bottom: 8px`), description (DM Sans 14px muted `line-height: 1.6`, `margin-bottom: 16px`), tech stack chips (each: `padding: 3px 10px`, `border-radius: 6px`, `background: rgba(108,99,255,0.1)`, `border: 1px solid rgba(108,99,255,0.2)`, `font-size: 11px`, `color: var(--violet)`, `font-family: JetBrains Mono`), bottom row with category tags + `"View Details →"` in 13px violet.

On card click: navigate to `/projects/:slug` via React Router.

**Project data:**
```
{
  id:1, slug:"smart-campus", title:"Smart Campus Sustainability System",
  desc:"AI-powered platform tracking carbon footprint, QR attendance, and sustainability metrics.",
  category:["AI","Dashboard"], emoji:"🌱", color:"#00f5d4", featured:true,
  stack:["React","Supabase","Claude AI","GSAP"],
  features:["QR Attendance System","Carbon Footprint Tracking","AI Analytics Dashboard","Real-time Reports","Admin Controls"],
  github:"#", live:"#"
},
{
  id:2, slug:"emergency-crowd", title:"Emergency Crowd Management System",
  desc:"Real-time emergency response with SOS alerts, walkie-talkie, and live crowd analytics.",
  category:["AI","Web App"], emoji:"🚨", color:"#f4a738", featured:true,
  stack:["React","Supabase","WebRTC","Maps API"],
  features:["SOS Alert System","Walkie-Talkie Feature","Live Crowd Analytics","Emergency Routing","Multi-admin Support"],
  github:"#", live:"#"
},
{
  id:3, slug:"bus-tracking", title:"Smart Bus Tracking System",
  desc:"GPS-based bus tracking with real-time ETA prediction and push notifications.",
  category:["Mobile","Web App"], emoji:"🚌", color:"#6c63ff", featured:false,
  stack:["React","Node.js","GPS API","Supabase"],
  features:["Live GPS Tracking","ETA Prediction","Push Notifications","Route Optimization","Driver Dashboard"],
  github:"#", live:"#"
},
{
  id:4, slug:"finance-dashboard", title:"AI Personal Finance Dashboard",
  desc:"Smart finance tracker using AI to categorize expenses and predict spending patterns.",
  category:["AI","Dashboard"], emoji:"💰", color:"#9b8fff", featured:false,
  stack:["React","Supabase","Claude AI","Recharts"],
  features:["AI Expense Categorization","Spending Predictions","Budget Alerts","Visual Reports","Export to PDF"],
  github:"#", live:"#"
}
```

**Project detail page `/projects/:slug`:** Full page with back button `"← Back"`, hero image block `160px` tall with project emoji centered, description, Features section (vertical list with colored diamond icons), Tech Stack chips, two CTA buttons (`"⌥ GitHub Repo"` primary, `"↗ Live Demo"` outline), all using same design tokens. On mobile: renders as bottom sheet modal (`position: fixed`, `inset: 0`, slide up from bottom, max-height `90vh`, scrollable). On desktop: full route page.

---

## SECTION 5 — SKILLS

Background: `linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)`. Top divider: cyan gradient line. `padding: clamp(80px,10vw,120px) 20px`. `id="skills"`.

**Section label + heading** — `"03 / SKILLS"` label + `"Tech Arsenal"` H2 with `.grad-text .hero-heading`. FadeIn `delay:0`, `y:40`.

**Orbit animation** — centered, `380px × 380px` on mobile, `500px × 500px` on desktop (`md+`). FadeIn `delay:0.1`.

Three orbit rings: `80px`, `130px`, `175px` radius. Each: `position: absolute`, `width: radius*2`, `height: radius*2`, `border-radius: 50%`, `border: 1px dashed rgba(108,99,255, 0.15/0.12/0.09)` (decreasing opacity outward). Animated with GSAP `gsap.to()` — ring 1 rotates `360deg` in `18s` linear infinite, ring 2 in `14s` reverse, ring 3 in `20s` normal.

Center node: `90px × 90px` circle, `background: linear-gradient(135deg, rgba(108,99,255,0.3), rgba(0,245,212,0.2))`, `border: 2px solid rgba(108,99,255,0.5)`, `box-shadow: 0 0 40px rgba(108,99,255,0.3)`, profile avatar inside, `z-index: 2`.

9 orbiting icon nodes. Each: `34px × 34px`, `border-radius: 10px`, `background: var(--bg2)`, `border: 1px solid var(--border)`, `display: flex`, `align-items: center`, `justify-content: center`, `font-size: 16px`. Positioned with GSAP at `radius × cos(angle)`, `radius × sin(angle)` from center, animated to orbit continuously. On hover: pause orbit + `scale(1.3)` + show tooltip (`position: absolute`, `background: var(--surface)`, `.glass`, `font-size: 11px`, `padding: 4px 8px`).

Icons distributed: `[{emoji:"⚛️",r:80},{emoji:"🎨",r:80},{emoji:"🗄️",r:80},{emoji:"🤖",r:130},{emoji:"⚡",r:130},{emoji:"🔧",r:130},{emoji:"🌐",r:175},{emoji:"📱",r:175},{emoji:"🚀",r:175}]`

**Skill bars** — three groups below orbit. Each group: `margin-bottom: 32px`. Group header: `4px × 20px` colored accent bar + group name in Syne 16px bold. Each skill item: label left + percentage right in `JetBrains Mono 12px` in group color. Bar track: `height: 4px`, `border-radius: 100px`, `background: rgba(255,255,255,0.05)`. Fill: animates `width: 0 → ${level}%` on viewport entry, `transition: width 1.2s (si + gi*4)*0.1 + 0.5s cubic-bezier(0.16,1,0.3,1)`, color = group color with `box-shadow: 0 0 8px ${color}66`.

Groups:
- Frontend (color `#6c63ff`): React 85%, Tailwind CSS 90%, Vite 80%, Framer Motion 75%
- Backend (color `#00f5d4`): Supabase 82%, Node.js 70%, REST APIs 88%, PostgreSQL 72%
- AI & Tools (color `#f4a738`): AI Integration 78%, GSAP 75%, Git 92%, Figma 68%

**Desktop (md+):** orbit left 50%, skill bars right 50% in flex row.

---

## SECTION 6 — EXPERIENCE

Background: `var(--bg)`. `id="experience"`. `padding: clamp(80px,10vw,120px) 20px`. Top separator.

**Section label + heading** — `"04 / EXPERIENCE"` + `"My Journey"` H2.

**Vertical timeline (mobile):** Left-aligned dots + line. Entries from Supabase `experience` table. Slide-in on scroll per entry with `(i * 0.15)s` stagger. Each entry: year/date chip (Orbitron 11px violet), title (Syne 16px bold), org (DM Sans 14px muted), description (DM Sans 14px muted `line-height:1.7`), tag chips (small `border-radius: 6px` violet-tinted). Timeline dot pulses on hover. Connector line gradient violet to transparent.

**Center timeline (desktop md+):** Alternating left-right entries, center line, dots on center line.

**Achievement Unlocks section** below timeline:

Heading: `"Achievement Unlocks"`. Cards appear with `scale(0.8) → scale(1)` + `box-shadow: 0 0 30px rgba(108,99,255,0.3) → box-shadow: 0 0 0` burst animation on viewport entry. Each card: `background: var(--bg2)`, `border: 1px solid rgba(108,99,255,0.3)`, `border-radius: 16px`, `padding: 20px`, `text-align: center`. Trophy emoji (32px) + achievement name (Syne 15px bold) + description (DM Sans 13px muted). Mobile: vertical list. Desktop: 3-column grid.

Default achievements: `{emoji:"🏆", title:"First Full Stack App", desc:"Built and deployed a complete product solo"}, {emoji:"🏆", title:"Integrated AI APIs", desc:"Connected real AI intelligence to production apps"}, {emoji:"🏆", title:"Built Real-time Dashboard", desc:"Live data streaming and analytics from scratch"}`

---

## SECTION 7 — ACHIEVEMENTS

Background: `var(--bg2)`. `id="achievements"`. `padding: clamp(80px,10vw,120px) 20px`.

**Section label + heading** — `"05 / ACHIEVEMENTS"` + `"Recognition"` H2.

**Certificate carousel:**
- Mobile: horizontal swipe (touch `touchstart`/`touchmove`/`touchend` delta detection, `translate3d` for snap). Desktop: arrow `←` `→` navigation buttons.
- Each card: `background: var(--surface)`, `border: 1px solid var(--border)`, `border-radius: 16px`, `padding: 20px`, `min-width: 280px`. Certificate image `height: 160px`, `border-radius: 12px`, `object-fit: cover`. Title (Syne 16px bold), issuer (14px muted), date (JetBrains Mono 12px violet).
- Data from Supabase `certificates` table. Placeholder: 3 mock entries.

**GitHub heatmap:**
- 52 columns × 7 rows grid of `10px × 10px` squares, `gap: 2px`, `border-radius: 2px`.
- Each cell color-coded: 0 contributions = `rgba(108,99,255,0.05)`, 1–3 = `rgba(108,99,255,0.2)`, 4–6 = `rgba(108,99,255,0.4)`, 7–9 = `rgba(108,99,255,0.7)`, 10+ = `var(--violet)`.
- Fetched from GitHub REST API `GET /users/{username}/contributions` (public). Fallback: render with randomized placeholder data.
- Animate cells from left on viewport entry: each column `translateX(-20px) opacity(0) → origin` with `(col * 10)ms` stagger.
- Below: `"365 contributions in the last year"` in 14px muted.

**Badge cards:**
- Grid `1fr 1fr` mobile, `repeat(4, 1fr)` desktop.
- Each badge: `background: var(--bg2)`, `border: 1px solid var(--border)`, `border-radius: 12px`, `padding: 16px`, `text-align: center`. Emoji (28px), title (Syne 14px bold), truncated description shown on hover with `max-height` animated expand.
- Default: `{emoji:"🥇", title:"Hackathon Winner", desc:"Competed and won in tech hackathons"}, {emoji:"🚀", title:"Shipped 10 Apps", desc:"10 full products live and in use"}, {emoji:"🤖", title:"AI Integrator", desc:"Built real AI into production apps"}, {emoji:"📦", title:"Open Source Contributor", desc:"Contributed to community projects"}`

---

## SECTION 8 — GALLERY

Background: `var(--bg)`. `id="gallery"`. `padding: clamp(80px,10vw,120px) 20px`.

**Section label + heading** — `"06 / GALLERY"` + `"Visual Work"` H2.

**Filter chips:** `["All", "UI Designs", "Screenshots", "Events"]` — same chip style as Projects.

**Masonry grid:** CSS `columns: 2` on mobile, `columns: 3` on desktop (lg+), `gap: 12px`. Images: `display: block`, `width: 100%`, `margin-bottom: 12px`, `border-radius: 12px`, `object-fit: cover`, `cursor: pointer`. Use `break-inside: avoid`. Lazy loading: `loading="lazy"`. Blur-up placeholder: `filter: blur(20px)` on load, remove on `onLoad`. Filter change triggers Framer Motion `layout` animation on each image wrapper.

**Lightbox:** On image click, `position: fixed`, `inset: 0`, `z-index: 2000`, `background: rgba(5,5,10,0.95)`, `backdrop-filter: blur(20px)`. Image centered with `max-height: 90vh`, `max-width: 90vw`. Prev/next buttons (desktop). Touch swipe `delta > 50px` to navigate (mobile). `×` close button top-right. ESC key closes.

Images loaded from Supabase Storage `gallery` bucket. Placeholder: use `https://picsum.photos/seed/{i}/400/300` for 9 items.

---

## SECTION 9 — BLOG

Background: `var(--bg2)`. `id="blog"`. `padding: clamp(80px,10vw,120px) 20px`.

**Section label + heading** — `"07 / BLOG"` + `"Thoughts"` H2.

**Search bar:** Full-width on mobile, `max-width: 500px` centered on desktop. `background: var(--bg)`, `border: 1px solid var(--border)`, `border-radius: 12px`, `padding: 12px 16px`, Lucide `Search` icon left. Client-side fuzzy search via **Fuse.js** on `title`, `excerpt`, `tags` fields. Debounce `300ms`.

**Filter chips:** `["All", "AI", "Development", "UI Design", "Campus Innovation"]`

**Post cards grid:** 1-column mobile, 2-column desktop. Each card: `.glass`, `border-radius: 16px`, `overflow: hidden`, `cursor: pointer`. Cover image `height: 180px`, `object-fit: cover`. Body: `padding: 20px`. Category chip + read time + date row. Title (Syne 18px bold). Excerpt (DM Sans 14px muted 2-line clamp). Hover: `translateY(-4px)` + glow.

**Post detail page `/blog/:slug`:**
- Reading progress bar: `position: fixed`, `top: 0`, `left: 0`, `height: 2px`, `z-index: 1001`. Width = `(scrollY / (docHeight - viewportH)) * 100%`. Background: `linear-gradient(90deg, var(--violet), var(--cyan))`.
- Cover image `height: 240px`. Title H1 (Syne 32px). Date + read time row. MDX content rendered with syntax highlighting (Shiki — `github-dark` theme).
- Like button: `♡` → `♥`, color: `var(--amber)` when liked. Supabase increment `posts.likes`. Optimistic UI.
- Share: Web Share API on mobile, clipboard copy on desktop.
- Related posts: 2 cards at bottom.

Posts from Supabase `posts` table where `status = 'published'`. Slug auto-generated from title (kebab-case).

---

## SECTION 10 — RESUME

Background: `var(--bg)`. `id="resume"`. `padding: clamp(80px,10vw,120px) 20px`.

**Section label + heading** — `"08 / RESUME"` + `"My Resume"` H2.

**PDF preview:** `<iframe>` with `src` from Supabase Storage `resume` bucket. `width: 100%`, `height: clamp(400px, 60vh, 700px)`, `border-radius: 16px`, `border: 1px solid var(--border)`. Fallback `<a>` link if iframe blocked.

**Two buttons:** `"⬇ Download PDF"` (primary, onClick: programmatic download + Supabase analytics event insert) and `"👁 View Full Screen"` (outline, onClick: open PDF URL in new tab). Both full-width on mobile, auto-width on desktop.

**Download counter:** `"Downloaded X times"` — DM Sans 13px muted, centered. `X` fetched as `COUNT(*)` from `analytics` where `event_type = 'resume_download'`. Updates on each download.

**Key Highlights:** 3 cards in `1fr 1fr 1fr` row (desktop) / vertical list (mobile). Each: `background: var(--bg2)`, violet left border `4px`, `border-radius: 12px`, `padding: 16px 20px`. Icon + label (Syne 15px bold) + one-liner (DM Sans 13px muted). Data: `{icon:"⚛️", label:"React Developer", note:"3+ years building production apps"}, {icon:"🤖", label:"AI Integration Specialist", note:"OpenAI, Claude, automation workflows"}, {icon:"🔧", label:"Full Stack Engineer", note:"End-to-end product development"}`

**Condensed timeline** — last 3 entries from `experience` table, same component as Experience section.

---

## SECTION 11 — CONTACT

Background: `var(--bg2)`. `id="contact"`. `padding: clamp(80px,10vw,120px) 20px`.

**Section label + heading** — `"09 / CONTACT"` + `"Let's Connect"` H2.

**Contact form** — `max-width: 560px`, centered. Built with **React Hook Form + Zod**. Fields: Name (required), Email (required, valid email), Subject (optional), Message (required, min 10 chars). Each field: label above input. Input style: `background: var(--bg)`, `border: 1px solid var(--border)`, `border-radius: 12px`, `padding: 12px 16px`, `font-family: DM Sans`, `color: var(--text)`. Focus: `border-color: var(--violet)`, `outline: none`, `box-shadow: 0 0 0 3px rgba(108,99,255,0.1)`. Error message: `color: var(--amber)`, `font-size: 12px`, `margin-top: 4px`. Honeypot: hidden `<input name="website" tabIndex={-1} autoComplete="off">` — if filled, discard submission silently.

On valid submit: insert to Supabase `messages` table → call Supabase Edge Function `send-contact-email` → show success state (animated checkmark SVG draw + `"Message sent! I'll reply within 24h 👋"` in cyan) → reset form. Error state: `"Something went wrong. Try again."` in amber.

**Schedule a Call:** `<div>` heading + Cal.com `<iframe src="https://cal.com/manthan">` or `@calcom/embed-react` component. `width: 100%`, `height: 500px`, `border-radius: 16px`, `border: 1px solid var(--border)`.

**Find Me map:** Google Maps embed `<iframe>` for Manthan's city region (India). `width: 100%`, `height: 240px`, `border-radius: 16px`, `border: 1px solid var(--border)`, `filter: invert(90%) hue-rotate(180deg)` to match dark theme.

**Social links row:** `display: flex`, `gap: 16px`, `justify-content: center`. Each: pill button `padding: 8px 20px`, `border-radius: 100px`, `border: 1px solid var(--border)`, `background: var(--bg)`, platform name + Lucide icon. Hover: `border-color: {platform color}`, `color: {platform color}`, `background: {platform color}10`. Platforms: GitHub, LinkedIn, Instagram, X, Email.

---

## SECTION 12 — ADMIN DASHBOARD

**Route:** `/admin` — protected. On mount, check Supabase Auth session. If no session, `navigate('/admin/login')` immediately. Do not render admin content before check resolves (`isLoading` state → show spinner). Session timeout: 8 hours inactivity tracked via `lastActivity` in memory — auto sign-out after 8h.

**Login page `/admin/login`:**
- Centered card `max-width: 400px`, `.glass`, `border-radius: 20px`, `padding: 40px 32px`.
- "MP" logo (same as navbar). Heading `"Admin Access"` Syne 24px bold.
- Email + Password fields (same style as contact form). Sign In button (primary). Invalid credentials: amber error message. On success: `navigate('/admin')`.

**Admin layout:** Sidebar (desktop) / bottom tabs (mobile). Sidebar: `width: 240px`, `background: var(--bg2)`, `border-right: 1px solid var(--border)`, `padding: 24px 16px`. Logo at top. Nav links listed with Lucide icons. Active: violet background `border-radius: 10px`. Main content area: `flex: 1`, `padding: 24px`, `overflow-y: auto`.

**9 admin sections (each its own route under `/admin/*`):**

1. **Overview (`/admin`):** Stats grid: total visitors today, resume downloads today, active users count (Supabase Realtime `presence`), unread messages. Recent messages preview table (last 5). Top 3 projects by view count. Quick action buttons: `+ Add Project`, `+ New Post`.

2. **Projects Manager (`/admin/projects`):** Table with columns: Title, Category, Featured (toggle), Visible (toggle), Actions (Edit/Delete). `+ Add Project` opens form/modal: all project fields including multi-select category chips, tech stack chip builder (type + Enter to add), image upload to Supabase Storage `projects/` bucket, GitHub URL, live URL. Slug auto-generated from title but editable. Unsaved changes prompt on navigate-away.

3. **Blog Manager (`/admin/blog`):** Table with: Title, Status badge (draft=amber/published=cyan), Published date, Actions. `+ New Post` opens full-page editor with MDX editor (using `@uiw/react-md-editor` or `react-simplemde-editor` with dark theme), cover image upload, category chips, slug (auto-generated). Publish/Unpublish toggle.

4. **Media Library (`/admin/media`):** File browser for Supabase Storage. Tab buttons for buckets: projects / gallery / certificates / resume / blog-covers. Grid of thumbnails. Each file: thumbnail + filename + copy URL button + delete button. Upload button: `<input type="file" multiple>` — validates MIME type (image/*, application/pdf, video/*) and size (max 10MB per file). Shows upload progress bar.

5. **Resume Manager (`/admin/resume`):** Current resume preview (iframe). Upload new resume PDF button. Download count display. Click-to-replace flow.

6. **Contact Messages (`/admin/messages`):** Table: Name, Email, Subject, Date, Read status. Click to expand full message. Mark read/unread toggle. Delete button with confirmation. Reply button opens `mailto:` link.

7. **Skills Manager (`/admin/skills`):** Table of all skills. Add/Edit form: Name, Category (dropdown: frontend/backend/ai/tools/database/devops), Proficiency slider (0–100), Icon (emoji input). Delete with confirm.

8. **Experience Manager (`/admin/experience`):** Table with drag-to-reorder (react-beautiful-dnd or `@dnd-kit`). Add/Edit form: Title, Organization, Start date, End date, Current (checkbox), Description, Tags, Type (work/freelance/project/achievement).

9. **Site Settings (`/admin/settings`):** Form with key-value pairs from `site_settings` table:
   - `current_project`: text input → updates Home live status pill
   - Social URLs: GitHub, LinkedIn, Instagram, X, Email — each a text input
   - `ai_context`: large `<textarea>` (6 rows). Label: `"AI Assistant Dynamic Context"`. Help text: `"This text is appended to the AI chat's system prompt at runtime. Add new projects, skills, availability, or any updates here. Changes take effect immediately on next widget open."`. Save button — Supabase `upsert` on `site_settings` table.

---

## GLOBAL FLOATING COMPONENTS

### FloatingAIWidget

Always rendered globally, `position: fixed`, `bottom: 88px` on mobile (above bottom nav) / `bottom: 32px` on desktop, `right: 24px`, `z-index: 900`.

**Collapsed state:** Circular button `56px × 56px`, `border-radius: 50%`. Border: animated gradient `@keyframes gradient-shift background-position 3s ease infinite`. Background `linear-gradient(135deg, var(--violet), var(--cyan))` animating. Inner icon: `✦` or robot emoji. Pulse ring animation.

**Expanded state (mobile):** Full-screen bottom sheet — `position: fixed`, `inset: 0`, `z-index: 1500`. Background `rgba(5,5,10,0.95)`, `backdrop-filter: blur(20px)`. Chat window slides up from bottom, `border-radius: 24px 24px 0 0`, `background: var(--bg2)`, `height: 85vh`.

**Expanded state (desktop):** Floating panel `380px × 520px`, `border-radius: 20px`, `.glass`, `position: fixed`, `bottom: 96px`, `right: 24px`.

**Chat header (both):** `"Ask about Manthan"` Syne 16px bold + subtitle `"AI Assistant"` 12px muted + close `×` button.

**Messages area:** Scrollable, `flex-direction: column`, `gap: 12px`, `padding: 16px`. User messages: right-aligned, `background: rgba(108,99,255,0.2)`, `border-radius: 12px 12px 0 12px`, `padding: 10px 14px`. AI messages: left-aligned, `background: var(--surface)`, `border-radius: 12px 12px 12px 0`, same padding. Typing indicator: 3 dots bouncing (`animation: typing-dot 1.4s infinite` with `0s, 0.2s, 0.4s` stagger).

**Quick command chips:** Rendered above input on first open only. `["Who is Manthan?", "Show me his projects", "Download resume", "What skills does he have?", "What is he building now?"]`. Horizontal scroll row, same chip style. Tap = populate input + auto-send.

**Input area:** `<input>`, `<button>` (send, violet, Lucide `Send` icon). Enter key submits. `disabled` during AI response.

**AI system prompt:** Assembled at runtime:
```
HARDCODED_BASE = `
You are Manthan Patel's personal AI assistant on his portfolio website.
Speak on behalf of Manthan. Be concise, friendly, and professional.
Keep answers under 3 sentences unless detail is requested.
Never make up information not provided below.

ABOUT: Full Stack Developer & AI Builder from India.
Currently building Smart Campus AI Platform.
SKILLS: React, Tailwind, Vite, Supabase, Node.js, REST APIs, AI Integration, GSAP.
PROJECTS: Smart Campus Sustainability System (AI/Dashboard), Emergency Crowd Management (AI/WebApp), Bus Tracking System (Mobile).
CONTACT: Available via contact form on this website.
NAVIGATION: Respond with JSON {"action":"navigate","to":"/projects"} to navigate.
RESUME: Respond with {"action":"download","type":"resume"} to trigger resume download.
`

DYNAMIC = fetch from Supabase site_settings where key = 'ai_context' when widget opens.

FINAL_PROMPT = HARDCODED_BASE + "\n\n=== LATEST UPDATES ===\n" + DYNAMIC
```

AI responses parsed: if JSON with `action: "navigate"`, close widget + `navigate(to)`. If `action: "download"`, trigger resume download. Otherwise render as markdown text.

Conversation history stored in `sessionStorage` as JSON array. Max 20 turns — drop oldest 2 when exceeded.

Welcome message on first open: `"Hi! I'm Manthan's AI assistant. Ask me anything 👋"`.

### NotificationSystem

`position: fixed`, `top: 80px`, `right: 16px` (desktop) / `top: 16px`, `left: 8px`, `right: 8px` (mobile). `z-index: 1200`.

Subscribes to Supabase Realtime on `analytics` table inserts. On new row:
- `event_type = 'page_view'`: `"👀 Someone in {city} is viewing your {page}"`
- `event_type = 'resume_download'`: `"📄 Resume just downloaded"`
- Any new `messages` row: `"💬 New message from {name}"`

Toast style: `.glass`, `border-radius: 12px`, `padding: 12px 16px`, `font-size: 13px`, `max-width: 320px`. Types: info (violet left border), success (cyan left border), alert (amber left border). Framer Motion: slide in from right (`x: 100% → 0`), auto-dismiss after `4000ms` with reverse slide. Stack max 3 visible (oldest dismisses first). Manual dismiss via `×` button.

### MusicPlayer

State in Zustand `useMusicStore`. Triggered by Music toggle in Navbar.

Floating pill: `position: fixed`, `bottom: 88px` mobile / `bottom: 32px` desktop, `left: 16px`. `.glass`, `border-radius: 100px`, `padding: 10px 16px`. `display: flex`, `align-items: center`, `gap: 12px`. Mini disc icon (20px, spins when playing), track name (13px), play/pause button (Lucide), volume slider (40px wide, thin track). Appears/disappears with Framer Motion slide-up.

Page → track mood mapping (use royalty-free URLs or provide placeholder):
- `/`, splash: `"Cinematic"` mood
- `/projects`: `"Energetic"` mood
- `/blog`: `"Calm"` mood
- `/contact`: `"Soft"` mood

React Router `useLocation()` to detect current page and auto-switch track with 1.5s cross-fade (two `<audio>` elements, fade one in while fading other out).

Audio loaded on user gesture only (first play click), never on page load — respects browser autoplay policy.

---

## REUSABLE COMPONENTS

### `<FadeIn>` component
Framer Motion `motion.div` using `whileInView`, `viewport={{ once: true, margin: "50px", amount: 0 }}`. Props: `delay` (default 0), `duration` (default 0.7), `x` (default 0), `y` (default 30). Easing: `[0.25, 0.1, 0.25, 1]`. When `prefers-reduced-motion: reduce`, renders children directly without animation wrapper.

### `<AnimatedCounter>` component
Hook-based. Accepts `end`, `suffix`, `duration` (default 2000ms), `visible` boolean. When `visible` flips true: starts `requestAnimationFrame` loop from `Date.now()`, applies `easeOutCubic` curve (`1 - Math.pow(1 - progress, 3)`), sets `Math.round(eased * end)`. Renders value + suffix.

### `<Typewriter>` component
State: `displayed` string, `wordIdx`, `deleting` boolean. On mount and state change: `setTimeout` — if not deleting + incomplete: append next char every `80ms`. If complete and not deleting: pause `2000ms` then start deleting. If deleting: remove last char every `40ms`. On empty: advance `wordIdx % words.length`, set deleting false. Renders: `<span style={{color: "var(--cyan)"}}>{displayed}</span><span style={{animation: "blink 1s step-end infinite", color:"var(--violet)"}}>|</span>`.

### `<CyberGrid>` component
`position: absolute`, `inset: 0`, `pointer-events: none`, `z-index: 0`. `background-image: linear-gradient(rgba(108,99,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.05) 1px, transparent 1px)`. `background-size: 40px 40px`. Keyframe `grid-fade`: opacity oscillates `0.03 → 0.07` over 4s.

### `<Particles>` component
Props: `count` (default 30), `color` (RGB string, e.g. `"108,99,255"`). Renders `count` absolutely positioned `div`s. Each: `position: absolute`, random `left: {0–100}%`, `width/height: {1–4}px`, `border-radius: 50%`, `background: rgba({color}, 0.7)`. Animation `particleFloat {6–14}s {0–8}s linear infinite`. Keyframe: `from {transform: translateY(100vh) scale(0); opacity: 0}` → `10% opacity:1` → `90% opacity:0.5` → `to {transform: translateY(-20vh) scale(1.2); opacity:0}`. `pointer-events: none`.

### `<AnimatedText>` (About section scroll-reveal text)
Accepts `text` string. Splits into characters. Each character wrapped: outer `<span style={{position:"relative"}}>`  with invisible placeholder `<span aria-hidden style={{opacity:0}}>{char}</span>` and absolutely positioned animated `<motion.span>`. Uses `useScroll` targeting parent element with `offset: ['start 0.8', 'end 0.2']`. Each character's opacity mapped from scroll progress: `i/total * 0.3` to `i/total * 0.3 + 0.3` range → `0.2 to 1`. Spaces rendered as `&nbsp;`.

### `<Magnet>` component (for hero profile on desktop)
Mouse event listeners on wrapping div. On `mousemove` within `padding` (150px) of element bounds: calculate `deltaX = (clientX - centerX) / strength`, `deltaY = (clientY - centerY) / strength`. Apply `translate3d(${deltaX}px, ${deltaY}px, 0)` via `style.transform`. Active transition: `"transform 0.3s ease-out"`. On `mouseleave`: reset to `translate3d(0,0,0)`, transition `"transform 0.6s ease-in-out"`. `strength = 3`. `will-change: transform`.

---

## KEY ANIMATIONS (define as CSS @keyframes)

```css
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
@keyframes pulse-ring { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.08);opacity:.4} }
@keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes scanline { 0%{top:-10%} 100%{top:110%} }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes logo-morph { 0%,100%{border-radius:20px} 50%{border-radius:50%} }
@keyframes grid-fade { 0%,100%{opacity:.03} 50%{opacity:.07} }
@keyframes particleFloat { 0%{transform:translateY(100vh) scale(0);opacity:0} 10%{opacity:1} 90%{opacity:.5} 100%{transform:translateY(-20vh) scale(1.2);opacity:0} }
@keyframes card-in { from{opacity:0;transform:translateY(40px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
@keyframes counter-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
@keyframes typing-dot { 0%,80%,100%{transform:scale(.6);opacity:.3} 40%{transform:scale(1);opacity:1} }
```

---

## TECH STACK & DEPENDENCIES

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.0.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.4.1",
  "framer-motion": "^12.0.0",
  "gsap": "^3.12.0",
  "zustand": "^4.5.0",
  "react-router-dom": "^6.22.0",
  "@supabase/supabase-js": "^2.43.0",
  "react-hook-form": "^7.51.0",
  "zod": "^3.23.0",
  "@hookform/resolvers": "^3.3.4",
  "recharts": "^2.12.0",
  "fuse.js": "^7.0.0",
  "lucide-react": "^0.344.0",
  "shiki": "^1.0.0",
  "@uiw/react-md-editor": "^4.0.0",
  "lenis": "^1.1.0"
}
```

---

## RESPONSIVE BREAKPOINTS

All sections use Tailwind's default breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px) with **mobile-first approach**. Heavy use of `clamp()` for fluid typography. Design target is **375px** mobile width. Desktop enhances at **1024px+**. No horizontal overflow at any viewport width.

---

## DATABASE SCHEMA (Supabase)

```sql
-- projects
id uuid PK, slug text UNIQUE, title text, description text, category text[],
tech_stack jsonb, images text[], video_url text, github_url text, live_url text,
featured bool DEFAULT false, visible bool DEFAULT true, order_index int,
created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()

-- posts
id uuid PK, slug text UNIQUE, title text, excerpt text, content text,
cover_url text, category text[], tags text[], status text DEFAULT 'draft',
likes int DEFAULT 0, read_time int, published_at timestamptz, created_at timestamptz

-- skills
id uuid PK, name text, category text, proficiency int, icon_url text, order_index int

-- experience
id uuid PK, title text, org text, start_date date, end_date date,
current bool DEFAULT false, description text, tags text[], type text, order_index int

-- certificates
id uuid PK, title text, issuer text, date date, image_url text, credential_url text

-- gallery
id uuid PK, title text, image_url text NOT NULL, category text, order_index int

-- analytics
id uuid PK, event_type text, page text, project_id uuid REF projects(id),
session_id text, device text, country text, city text, duration int, created_at timestamptz

-- messages
id uuid PK, name text, email text, subject text, body text,
read bool DEFAULT false, created_at timestamptz

-- site_settings
key text PK, value text, updated_at timestamptz
-- Seed: {key:'current_project', value:'Smart Campus AI Platform'}, {key:'ai_context', value:''}
```

**RLS Rules:**
- `projects`: public SELECT where `visible=true`, auth all
- `posts`: public SELECT where `status='published'`, auth all
- `skills, experience, certificates, gallery, site_settings`: public SELECT, auth all
- `analytics, messages`: public INSERT only, auth all
- All tables: auth user can UPDATE, DELETE

**Edge Functions:**
- `send-contact-email`: triggered by `messages` INSERT — calls Resend API. Env: `RESEND_API_KEY`.
- `track-analytics`: POST endpoint, rate-limited (5 req/min/IP), inserts into `analytics`. Env: `SUPABASE_SERVICE_ROLE_KEY`.

**Supabase Storage buckets:** `avatars`, `projects`, `gallery`, `certificates`, `resume`, `blog-covers` — all public read.

---

## ENVIRONMENT VARIABLES

```bash
# Client-side (VITE_ prefix — safe to expose)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Edge Functions only — NEVER in frontend bundle
RESEND_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# No AI API key required — Claude built-in handles the chat widget
```

---

## ADDITIONAL BUILDER NOTES

- Use **React 18 + Vite + Tailwind CSS v3**. Do NOT use Next.js.
- Use **Framer Motion** for all scroll-reveal, page enter, and layout animations.
- Use **GSAP** exclusively for the skills orbit animation and any SVG path sequences.
- Use **Lenis** for smooth scroll on desktop only. Disabled on mobile (`window.matchMedia("(pointer:coarse)").matches`). Integrate with GSAP `ScrollTrigger` via `lenis.on('scroll', ScrollTrigger.update)`.
- Use **Zustand** for global state: `{ theme, musicEnabled, aiChatOpen, activeSection, notifications[] }`.
- Use **React Router v6**. Routes: `/`, `/about`, `/projects`, `/projects/:slug`, `/skills`, `/experience`, `/achievements`, `/gallery`, `/blog`, `/blog/:slug`, `/resume`, `/contact`, `/admin`, `/admin/login`, `/admin/*`.
- `<Suspense>` + `React.lazy()` for every route — code split each page.
- `<canvas>` Three.js element on Home hero desktop only — lazy-loaded, never blocks initial render.
- `/admin` route: check Supabase Auth session **before** rendering any admin content. Use `isLoading` state with centered spinner. On no session, `navigate('/admin/login', { replace: true })` immediately.
- **`robots.txt`:** Allow all, Disallow `/admin`. Place in `/public`.
- **Open Graph tags** on every page: `og:title`, `og:description`, `og:image` (600×315 static image). Place in `<Helmet>` or Vite `index.html` with dynamic injection per route.
- **JSON-LD** on Home page: `Person` schema with name, url, jobTitle, sameAs links.
- **Deploy:** Vercel. `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Vercel environment variables. Edge Function env vars in Supabase dashboard only.

---

## SUCCESS CRITERIA

1. First-time visitor on 375px mobile understands who Manthan is and what he does within 5 seconds of splash clearing.
2. Projects page filters work instantly. Clicking a card opens the detail view without errors or blank states.
3. Contact form submits, shows animated success checkmark, and new message appears in Admin → Messages.
4. `/admin` redirects to `/admin/login` if not authenticated. No flash of admin content.
5. Admin can add a new project and it appears on the public Projects page with zero code changes.
6. AI chat widget opens, shows welcome message, answers "Who is Manthan?" correctly, and `ai_context` edits in Site Settings are reflected after widget reopens.
7. Resume Download button downloads the PDF **and** increments the download counter on the same page.
8. Lighthouse mobile Performance ≥ 90. No CLS on load. Smooth 60fps animations on mid-range Android.
9. All 12 pages render correctly at 375px with zero horizontal overflow.
10. Theme toggle (dark/light) works on every page, persists via localStorage, all text readable in both modes.

---

*Paste this entire document as your first and only message before building.*
*PRD Version: 2.0 | Project: Manthan Patel Portfolio | Format: Jack 3D Creator spec depth*
