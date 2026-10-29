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
    settings.hero_portrait_dark ||
    settings.profile_image_url ||
    '';

  // Stats
  const statCards = [
    { label: 'Projects', value: projects.length || 12, suffix: '' },
    { label: 'Technologies', value: skills.length || 16, suffix: '+' },
    { label: 'Years Building', value: careerYears, suffix: '+' },
    { label: 'Articles', value: posts.length || 4, suffix: '' },
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
      <section id="home" className="hero2 pt-16">
        {/* Cinematic ambient lights & slow beams */}
        <div className="hfx" aria-hidden="true">
          <div className="hg1" />
          <div className="hg2" />
          <div className="hb b1" />
          <div className="hb b2" />
        </div>

        <div className="h2in">
          {/* Top Thin Bar */}
          <div className="htop">
            <span>Portfolio · 2026</span>
            <span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#34d399]" />
              {availabilityText}
            </span>
            <span className="font-mono">
              Hubballi · {istTime || '10:30 AM'} IST
            </span>
          </div>

          {/* Hero Main: Left Copy + Right Cinematic Portrait */}
          <div className="hmain">
            {/* Left Content */}
            <div className="hcopy">
              <div className="hk">Hi, I'm</div>

              <h1>
                <span className="l">MANTHAN</span>
                <span className="l">
                  <em>PATEL</em>
                </span>
              </h1>

              <div className="hsub">
                {settings.hero_tagline ||
                  'Full-stack engineer and AI systems architect building resilient production digital platforms.'}
              </div>

              <p className="hlead">
                {settings.about_text ||
                  'Specializing in React, TypeScript, cloud databases, and AI agent integrations. I turn complex operational workflows into fast, elegant systems that teams trust.'}
              </p>

              <div className="hcta">
                <a href="#projects" className="hbtn p">
                  View projects
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>

                {settings.show_resume_section !== 'false' && (
                  <a href="#resume" className="hbtn">
                    Resume (PDF)
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 3v12M7 11l5 5 5-5M5 20h14" />
                    </svg>
                  </a>
                )}

                {settings.social_github && (
                  <a
                    href={settings.social_github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hbtn"
                  >
                    GitHub
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                )}
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
                  <span className="font-heading text-8xl text-indigo-400 font-black opacity-40">
                    MP
                  </span>
                </div>
              )}
              <div className="hcap">Manthan Patel · Portfolio</div>
            </div>
          </div>

          {/* 4 Stat Cards Below Hero */}
          <div className="stats pb-12">
            {statCards.map((stat) => (
              <div key={stat.label} className="card stat">
                <b>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </b>
                <span>{stat.label}</span>
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
