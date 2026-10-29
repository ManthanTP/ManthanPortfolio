import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useDataStore } from '../stores/useDataStore';
import { calculateCareerYears } from '../lib/constants';
import { useThemeStore } from '../stores/useThemeStore';

import About from './About';
import Projects from './Projects';
import Skills from './Skills';
import Experience from './Experience';
import Gallery from './Gallery';
import Blog from './Blog';
import Resume from './Resume';
import Contact from './Contact';

export default function Home() {
  const location = useLocation();
  const settings = useSettingsStore((s) => s.settings);
  const theme = useThemeStore((s) => s.theme);

  // Cached data
  const projects = useDataStore((s) => s.projects);
  const posts = useDataStore((s) => s.posts);
  const skills = useDataStore((s) => s.skills);
  const experience = useDataStore((s) => s.experience);

  // Live IST Clock
  const [istTime, setIstTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        setIstTime(formatted);
      } catch {
        setIstTime(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Parallax tracking on hero portrait
  const [mouseOffset, setMouseOffset] = useState({ px: 0, py: 0 });
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const handlePointerMove = (e: PointerEvent) => {
      const px = ((e.clientX / window.innerWidth - 0.5) * -14).toFixed(1);
      const py = ((e.clientY / window.innerHeight - 0.5) * -8).toFixed(1);
      setMouseOffset({ px: Number(px), py: Number(py) });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Career years calculation
  const careerYears = calculateCareerYears(settings.career_start_date, experience);

  // Choose appropriate hero portrait based on theme
  const heroPortrait =
    (theme === 'light' ? settings.hero_portrait_light : settings.hero_portrait_dark) ||
    (theme === 'light' ? '/hero/hero-portrait-light.webp' : '/hero/hero-portrait-dark.webp');

  // Stats matching reference & user exact request
  const statCards = [
    { label: 'Projects', value: projects.length >= 12 ? projects.length : 12, suffix: '' },
    { label: 'Technologies', value: skills.length >= 16 ? skills.length : 16, suffix: '+' },
    { label: 'Years Building', value: careerYears && careerYears >= 3 ? careerYears : 3, suffix: '+' },
    { label: 'Articles', value: posts.length >= 4 ? posts.length : 4, suffix: '' },
  ];

  // Auto-scroll to hash when navigating
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  const minBlogPosts = parseInt(settings.blog_min_posts || '1', 10);
  const showBlogSection = isNaN(minBlogPosts) || minBlogPosts === 0 || posts.length >= minBlogPosts;

  const availabilityText =
    settings.availability_text ||
    (settings.availability_status === 'open'
      ? 'Available for new roles'
      : 'Open to internships & freelance');

  return (
    <div className="relative overflow-x-hidden">
      {/* ─── Hero Section ─── */}
      <section id="home" className="hero2 pt-4 sm:pt-8">
        {/* Cinematic ambient lights & slow beams */}
        <div className="hfx" aria-hidden="true">
          <div className="hg1" />
          <div className="hg2" />
          <div className="hb b1" />
          <div className="hb b2" />
        </div>

        <div className="h2in">
          {/* Top Thin Bar */}
          <div className="htop flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
            <span>Portfolio · 2026</span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#34d399]" />
              {availabilityText}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 font-mono">
              {istTime || '10:30 AM'} IST · Hubballi
            </span>
          </div>

          {/* Hero Main: Left Copy + Right Cinematic Portrait */}
          <div className="hmain">
            {/* Left Content */}
            <div className="hcopy">
              <div className="hk">Hi, I'm</div>

              <h1>
                <span className="block">MANTHAN</span>
                <span className="block text-[var(--amber)]">PATEL</span>
              </h1>

              <div className="hsub font-body font-semibold">
                {settings.hero_tagline ||
                  'Full-stack engineer and AI systems architect building resilient production digital platforms.'}
              </div>

              <p className="hlead font-body">
                {settings.about_text ||
                  'Specializing in React, TypeScript, cloud databases, and AI agent integrations. I turn complex operational workflows into fast, elegant systems that teams trust.'}
              </p>

              <div className="hcta">
                <a href="#projects" className="btn primary">
                  View projects
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>

                {settings.show_resume_section !== 'false' && (
                  <a href="#resume" className="btn">
                    Resume (PDF)
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 3v12M7 11l5 5 5-5M5 20h14" />
                    </svg>
                  </a>
                )}

                <a
                  href={settings.social_github || 'https://github.com/ManthanTP'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  GitHub
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Portrait with Cobalt Rim-light and Beams */}
            <div
              className="hport"
              id="portrait"
              style={
                {
                  '--px': `${mouseOffset.px}px`,
                  '--py': `${mouseOffset.py}px`,
                } as React.CSSProperties
              }
            >
              {heroPortrait ? (
                <div
                  className="hp-img"
                  style={{ backgroundImage: `url("${heroPortrait}")` }}
                  role="img"
                  aria-label="Portrait of Manthan Patel"
                />
              ) : (
                <div className="hp-img flex items-center justify-center">
                  <span className="font-display text-8xl text-indigo-400 font-black opacity-40">
                    MP
                  </span>
                </div>
              )}
              <div className="hcap">Manthan Patel · Portfolio</div>
            </div>
          </div>

          {/* 4 Stat Cards Below Hero */}
          <div className="stats my-8 pb-4">
            {statCards.map((stat) => (
              <div key={stat.label} className="card stat">
                <b className="stat-num">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </b>
                <span className="stat-lbl">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Preserved Section IDs ─── */}
      <div id="about"><About /></div>
      <div id="projects"><Projects /></div>
      <div id="skills"><Skills /></div>
      <div id="experience"><Experience /></div>
      <div id="gallery"><Gallery /></div>
      {showBlogSection && <div id="blog"><Blog /></div>}
      {settings.show_resume_section !== 'false' && <div id="resume"><Resume /></div>}
      <div id="contact"><Contact /></div>
    </div>
  );
}
