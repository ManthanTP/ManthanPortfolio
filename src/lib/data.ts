import type { Project, Skill, Experience, Certificate, Post, GalleryItem } from './supabase';

export const DEMO_PROJECTS: Project[] = [
  {
    id: '1',
    slug: 'smart-campus-sustainability',
    title: 'Smart Campus Sustainability System',
    description: 'An AI-powered campus management platform featuring QR-based attendance tracking, real-time carbon footprint monitoring, and an intelligent analytics dashboard built with Claude AI integration.',
    category: ['AI', 'Dashboards'],
    tech_stack: [
      { name: 'React' }, { name: 'Supabase' }, { name: 'Claude AI' },
      { name: 'Tailwind CSS' }, { name: 'Recharts' }, { name: 'QR Code' },
    ],
    images: ['https://picsum.photos/seed/campus1/800/500', 'https://picsum.photos/seed/campus2/800/500', 'https://picsum.photos/seed/campus3/800/500'],
    video_url: undefined,
    github_url: 'https://github.com/manthanpatel',
    live_url: 'https://smartcampus.demo',
    featured: true,
    visible: true,
    order_index: 0,
    created_at: '2024-10-15',
    updated_at: '2024-12-01',
  },
  {
    id: '2',
    slug: 'emergency-crowd-management',
    title: 'Emergency Crowd Management System',
    description: 'Real-time emergency response platform with SOS alerts, integrated walkie-talkie communication, live crowd analytics, and predictive density mapping for large events.',
    category: ['AI', 'Web Apps'],
    tech_stack: [
      { name: 'React' }, { name: 'Node.js' }, { name: 'WebSocket' },
      { name: 'Maps API' }, { name: 'Supabase' }, { name: 'AI' },
    ],
    images: ['https://picsum.photos/seed/crowd1/800/500', 'https://picsum.photos/seed/crowd2/800/500'],
    featured: true,
    visible: true,
    order_index: 1,
    created_at: '2024-08-20',
    updated_at: '2024-11-15',
  },
  {
    id: '3',
    slug: 'bus-tracking-system',
    title: 'Bus Tracking System',
    description: 'GPS-powered transit tracking application with real-time bus location updates, ETA prediction algorithms, and push notification alerts for commuters.',
    category: ['Mobile', 'Web Apps'],
    tech_stack: [
      { name: 'React Native' }, { name: 'Node.js' }, { name: 'GPS API' },
      { name: 'Firebase' }, { name: 'Google Maps' },
    ],
    images: ['https://picsum.photos/seed/bus1/800/500', 'https://picsum.photos/seed/bus2/800/500'],
    featured: false,
    visible: true,
    order_index: 2,
    created_at: '2024-06-10',
    updated_at: '2024-09-01',
  },
  {
    id: '4',
    slug: 'ai-code-reviewer',
    title: 'AI Code Review Assistant',
    description: 'An intelligent code review tool that uses AI to analyze pull requests, detect bugs, suggest improvements, and enforce coding standards automatically.',
    category: ['AI', 'Web Apps'],
    tech_stack: [
      { name: 'Python' }, { name: 'FastAPI' }, { name: 'React' },
      { name: 'OpenAI' }, { name: 'GitHub API' },
    ],
    images: ['https://picsum.photos/seed/code1/800/500'],
    featured: false,
    visible: true,
    order_index: 3,
    created_at: '2024-04-05',
    updated_at: '2024-07-20',
  },
  {
    id: '5',
    slug: 'portfolio-dashboard',
    title: 'Real-time Analytics Dashboard',
    description: 'A comprehensive data visualization dashboard with live-updating charts, custom widgets, and dark mode — built for monitoring KPIs and metrics at scale.',
    category: ['Dashboards', 'Web Apps'],
    tech_stack: [
      { name: 'React' }, { name: 'D3.js' }, { name: 'Supabase' },
      { name: 'Recharts' }, { name: 'Tailwind CSS' },
    ],
    images: ['https://picsum.photos/seed/dash1/800/500'],
    featured: false,
    visible: true,
    order_index: 4,
    created_at: '2024-02-15',
    updated_at: '2024-05-10',
  },
  {
    id: '6',
    slug: 'weather-ai-app',
    title: 'Weather AI Forecaster',
    description: 'An AI-driven weather forecasting app that combines multiple data sources with machine learning to provide hyperlocal weather predictions and alerts.',
    category: ['AI', 'Mobile'],
    tech_stack: [
      { name: 'React' }, { name: 'TensorFlow.js' }, { name: 'Weather API' },
      { name: 'Charts' }, { name: 'PWA' },
    ],
    images: ['https://picsum.photos/seed/weather1/800/500'],
    featured: false,
    visible: true,
    order_index: 5,
    created_at: '2024-01-10',
    updated_at: '2024-03-25',
  },
];

export const DEMO_SKILLS: Skill[] = [
  { id: '1', name: 'React', category: 'Frontend', proficiency: 85, order_index: 0 },
  { id: '2', name: 'Tailwind CSS', category: 'Frontend', proficiency: 90, order_index: 1 },
  { id: '3', name: 'Vite', category: 'Frontend', proficiency: 80, order_index: 2 },
  { id: '4', name: 'TypeScript', category: 'Frontend', proficiency: 78, order_index: 3 },
  { id: '5', name: 'Supabase', category: 'Backend', proficiency: 82, order_index: 4 },
  { id: '6', name: 'Node.js', category: 'Backend', proficiency: 70, order_index: 5 },
  { id: '7', name: 'REST APIs', category: 'Backend', proficiency: 88, order_index: 6 },
  { id: '8', name: 'PostgreSQL', category: 'Backend', proficiency: 75, order_index: 7 },
  { id: '9', name: 'AI Integration', category: 'AI & Tools', proficiency: 78, order_index: 8 },
  { id: '10', name: 'GSAP', category: 'AI & Tools', proficiency: 75, order_index: 9 },
  { id: '11', name: 'Git', category: 'AI & Tools', proficiency: 92, order_index: 10 },
  { id: '12', name: 'Framer Motion', category: 'AI & Tools', proficiency: 80, order_index: 11 },
];

export const DEMO_EXPERIENCE: Experience[] = [
  {
    id: '1', title: 'Full Stack Developer', org: 'Freelance & Personal Projects',
    start_date: '2024-01', current: true, description: 'Building production-grade web applications with React, Supabase, and AI integrations. Delivered 6+ client projects ranging from dashboards to mobile apps.',
    tags: ['React', 'Supabase', 'AI', 'Full Stack'], type: 'work', order_index: 0,
  },
  {
    id: '2', title: 'AI Application Builder', org: 'Self-directed',
    start_date: '2023-06', end_date: '2024-01', current: false, description: 'Integrated Claude AI, OpenAI, and custom ML models into web applications. Built intelligent chat interfaces, code review tools, and predictive analytics systems.',
    tags: ['AI', 'Claude', 'OpenAI', 'Python'], type: 'project', order_index: 1,
  },
  {
    id: '3', title: 'Frontend Developer', org: 'Campus Tech Club',
    start_date: '2022-08', end_date: '2023-06', current: false, description: 'Led the frontend team for campus-wide applications. Introduced modern React patterns, implemented design systems, and mentored junior developers.',
    tags: ['React', 'Leadership', 'Mentoring'], type: 'work', order_index: 2,
  },
  {
    id: '4', title: 'Started Coding Journey', org: 'Self-taught',
    start_date: '2020-06', end_date: '2022-08', current: false, description: 'Began learning HTML, CSS, and JavaScript. Built first static websites and gradually moved to dynamic applications with React and Node.js.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Learning'], type: 'project', order_index: 3,
  },
];

export const DEMO_CERTIFICATES: Certificate[] = [
  { id: '1', title: 'React Developer Certification', issuer: 'Meta', date: '2024-06', image_url: 'https://picsum.photos/seed/cert1/400/280' },
  { id: '2', title: 'AI Fundamentals', issuer: 'Google', date: '2024-03', image_url: 'https://picsum.photos/seed/cert2/400/280' },
  { id: '3', title: 'Full Stack Web Development', issuer: 'Udemy', date: '2023-11', image_url: 'https://picsum.photos/seed/cert3/400/280' },
  { id: '4', title: 'JavaScript Algorithms', issuer: 'freeCodeCamp', date: '2023-08', image_url: 'https://picsum.photos/seed/cert4/400/280' },
  { id: '5', title: 'Cloud Computing Basics', issuer: 'AWS', date: '2023-05', image_url: 'https://picsum.photos/seed/cert5/400/280' },
];

export const DEMO_POSTS: Post[] = [
  {
    id: '1', slug: 'building-ai-powered-campus', title: 'Building an AI-Powered Campus System from Scratch',
    excerpt: 'How I designed and built an end-to-end smart campus platform with QR attendance, carbon tracking, and AI-driven insights.',
    content: '# Building an AI-Powered Campus System\n\nWhen I first envisioned the Smart Campus Sustainability System, I knew it had to be more than just another dashboard...\n\n## The Challenge\n\nModern campuses generate massive amounts of data — attendance records, energy consumption, carbon emissions, transportation patterns. The challenge was turning this chaos into actionable insights.\n\n## Architecture Decisions\n\nI chose **React + Supabase** for the frontend and backend respectively. Supabase gave me real-time subscriptions out of the box, which was crucial for the live dashboard.\n\n```typescript\nconst subscription = supabase\n  .channel("attendance")\n  .on("postgres_changes", { event: "INSERT", schema: "public" }, handleNew)\n  .subscribe();\n```\n\n## AI Integration\n\nThe most exciting part was integrating **Claude AI** for natural language queries against the campus data. Users can ask questions like "What was the carbon reduction this month?" and get instant, accurate answers.\n\n## Results\n\n- **40% reduction** in manual attendance tracking time\n- **Real-time** carbon footprint monitoring\n- **15+ departments** adopted the system\n\n## Lessons Learned\n\n1. Always design for mobile-first\n2. Real-time features need careful optimization\n3. AI integration is the future of data dashboards',
    cover_url: 'https://picsum.photos/seed/blog1/800/400', category: ['AI', 'Campus Innovation'],
    tags: ['AI', 'React', 'Supabase'], status: 'published', likes: 24, read_time: 5,
    published_at: '2024-11-10', created_at: '2024-11-10',
  },
  {
    id: '2', slug: 'mastering-framer-motion', title: 'Mastering Framer Motion: Beyond Basic Animations',
    excerpt: 'A deep dive into advanced Framer Motion patterns — layout animations, shared layouts, gesture handling, and performance optimization.',
    content: '# Mastering Framer Motion\n\nFramer Motion is more than fade-in animations...\n\n## Layout Animations\n\nThe `layout` prop is incredibly powerful for animating between different CSS layouts.\n\n## Gesture Handling\n\nCombining drag, tap, and hover gestures creates delightful micro-interactions.\n\n## Performance Tips\n\n- Use `willChange` for GPU acceleration\n- Prefer `transform` and `opacity` for animations\n- Use `useReducedMotion` hook for accessibility',
    cover_url: 'https://picsum.photos/seed/blog2/800/400', category: ['Development', 'UI Design'],
    tags: ['Animation', 'React', 'Framer Motion'], status: 'published', likes: 18, read_time: 4,
    published_at: '2024-10-05', created_at: '2024-10-05',
  },
  {
    id: '3', slug: 'why-supabase-over-firebase', title: 'Why I Chose Supabase Over Firebase for Every Project',
    excerpt: 'A comparison of Supabase vs Firebase from a developer who has shipped production apps with both — and why Supabase wins every time.',
    content: '# Why Supabase Wins\n\nAfter building 5+ apps with Firebase and 8+ with Supabase, here is my honest take...\n\n## SQL > NoSQL for Most Apps\n\nRelational data modeling is simply more natural for most web applications.\n\n## Row Level Security\n\nSupabase RLS policies are more powerful and transparent than Firestore security rules.\n\n## Real PostgreSQL\n\nFull PostgreSQL means full-text search, JSON operators, CTEs, and window functions — for free.',
    cover_url: 'https://picsum.photos/seed/blog3/800/400', category: ['Development'],
    tags: ['Supabase', 'Firebase', 'Backend'], status: 'published', likes: 31, read_time: 6,
    published_at: '2024-09-20', created_at: '2024-09-20',
  },
];

export const DEMO_GALLERY: GalleryItem[] = [
  { id: '1', title: 'Dashboard UI Design', image_url: 'https://picsum.photos/seed/gal1/600/400', category: 'UI Designs', order_index: 0 },
  { id: '2', title: 'Campus App Screenshots', image_url: 'https://picsum.photos/seed/gal2/600/800', category: 'Project Screenshots', order_index: 1 },
  { id: '3', title: 'Hackathon Event', image_url: 'https://picsum.photos/seed/gal3/600/450', category: 'Events', order_index: 2 },
  { id: '4', title: 'Mobile App Mockup', image_url: 'https://picsum.photos/seed/gal4/600/700', category: 'UI Designs', order_index: 3 },
  { id: '5', title: 'Analytics Dashboard', image_url: 'https://picsum.photos/seed/gal5/600/400', category: 'Project Screenshots', order_index: 4 },
  { id: '6', title: 'Tech Meetup', image_url: 'https://picsum.photos/seed/gal6/600/500', category: 'Events', order_index: 5 },
  { id: '7', title: 'Login Page Design', image_url: 'https://picsum.photos/seed/gal7/600/600', category: 'UI Designs', order_index: 6 },
  { id: '8', title: 'API Monitor Screenshot', image_url: 'https://picsum.photos/seed/gal8/600/350', category: 'Project Screenshots', order_index: 7 },
  { id: '9', title: 'Workshop Presentation', image_url: 'https://picsum.photos/seed/gal9/600/450', category: 'Events', order_index: 8 },
];

export const TIMELINE_ITEMS = [
  { year: '2020', title: 'Started Coding', desc: 'Wrote my first line of HTML & fell in love with building things for the web.' },
  { year: '2021', title: 'First Website', desc: 'Built and deployed my first complete website — a portfolio for a local business.' },
  { year: '2022', title: 'Built AI Apps', desc: 'Integrated machine learning APIs into web apps. Built chatbots and prediction tools.' },
  { year: '2024', title: 'Full Stack Developer', desc: 'Shipping production apps with React, Supabase, and AI. Building the future.' },
];

export const PERSONALITY_CARDS = [
  { emoji: '🎨', title: 'Creativity', desc: 'I see design as a problem-solving tool. Every pixel has a purpose, every animation tells a story.' },
  { emoji: '🚀', title: 'Innovation', desc: "I don't build what already exists. I find gaps, challenge assumptions, and ship new ideas." },
  { emoji: '👥', title: 'Leadership', desc: "I've led teams, mentored juniors, and driven projects from idea to deployment." },
  { emoji: '🧩', title: 'Problem Solving', desc: 'Complex bugs excite me. I break problems into pieces and solve them systematically.' },
];

export const ACHIEVEMENTS = [
  { icon: '🏆', title: 'Built First Full Stack App', desc: 'Shipped a complete web application with frontend, backend, and database — from scratch.' },
  { icon: '🤖', title: 'Integrated AI APIs', desc: 'Connected Claude, OpenAI, and custom ML models to production applications.' },
  { icon: '📊', title: 'Built Real-time Dashboard', desc: 'Created live-updating analytics dashboards with WebSocket and Supabase Realtime.' },
  { icon: '🥇', title: 'Hackathon Winner', desc: 'Won a campus-wide hackathon with the Smart Campus Sustainability System.' },
  { icon: '🚀', title: 'Shipped 10+ Apps', desc: 'Delivered over 10 production-ready applications for clients and personal projects.' },
  { icon: '📦', title: 'Open Source Contributor', desc: 'Contributed to popular open source projects and shared my own tools with the community.' },
];

export const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/manthanpatel', icon: 'github', color: '#fff' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/manthanpatel', icon: 'linkedin', color: '#0a66c2' },
  { name: 'Instagram', url: 'https://instagram.com/manthanpatel', icon: 'instagram', color: '#e4405f' },
  { name: 'X', url: 'https://x.com/manthanpatel', icon: 'x', color: '#fff' },
  { name: 'Email', url: 'mailto:manthan@example.com', icon: 'email', color: '#6c63ff' },
];

export const ORBIT_SKILLS = [
  'React', 'TypeScript', 'Tailwind', 'Node.js', 'Supabase',
  'Python', 'Git', 'Vite', 'AI', 'PostgreSQL', 'GSAP', 'Figma',
];
