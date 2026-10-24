import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import TypewriterText from '../components/ui/TypewriterText';
import ParticleBackground from '../components/ui/ParticleBackground';
import {
  IconGithub,
  IconLinkedin,
  IconInstagram,
  IconX,
  IconEmail,
  IconDownload,
  IconExternalLink,
} from '../components/ui/Icons';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useDataStore } from '../stores/useDataStore';
import { calculateCareerYears } from '../lib/constants';

import About from './About';
import Projects from './Projects';
import Skills from './Skills';
import Experience from './Experience';
import Gallery from './Gallery';
import Blog from './Blog';
import Resume from './Resume';
import Contact from './Contact';

const SUBTITLES = ['Full Stack Developer', 'AI Builder', 'React Engineer', 'Systems Thinker'];

const socialIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  github: IconGithub,
  linkedin: IconLinkedin,
  instagram: IconInstagram,
  x: IconX,
  email: IconEmail,
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Home() {
  const location = useLocation();
  const settings = useSettingsStore((s) => s.settings);

  // Read data directly from cached data store (no redundant fetching)
  const projects = useDataStore((s) => s.projects);
  const posts = useDataStore((s) => s.posts);
  const skills = useDataStore((s) => s.skills);
  const experience = useDataStore((s) => s.experience);

  // Responsive particle count (120 on desktop, 60 on mobile)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute real career years from settings.career_start_date or experience records
  const careerYears = calculateCareerYears(settings.career_start_date, experience);

  const stats = [
    { label: 'Projects', value: projects.length || 12, suffix: '' },
    { label: 'Articles', value: posts.length || 3, suffix: '' },
    { label: 'Skills', value: skills.length || 12, suffix: '+' },
    { label: 'Years', value: careerYears, suffix: '+' },
  ];

  const dynamicSocialLinks = [
    { name: 'GitHub', url: settings.social_github, icon: 'github', color: '#fff' },
    { name: 'LinkedIn', url: settings.social_linkedin, icon: 'linkedin', color: '#0A66C2' },
    { name: 'X / Twitter', url: settings.social_x, icon: 'x', color: '#fff' },
    { name: 'Instagram', url: settings.social_instagram, icon: 'instagram', color: '#E4405F' },
    { name: 'Email', url: `mailto:${settings.social_email}`, icon: 'email', color: '#EA4335' },
  ].filter((link) => Boolean(link.url));

  // Auto-scroll to hash when navigating to the page from another route
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

  // Check blog visibility threshold
  const minBlogPosts = parseInt(settings.blog_min_posts || '1', 10);
  const showBlogSection = isNaN(minBlogPosts) || minBlogPosts === 0 || posts.length >= minBlogPosts;

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      <div id="home" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Soft particle background: 120 desktop, 60 mobile */}
        <ParticleBackground count={isMobile ? 60 : 120} color="rgba(108,99,255,0.22)" />

        {/* Ambient subtle glow mesh */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            right: -160,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,245,212,0.04) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div className="section-container" style={{ paddingTop: 160, paddingBottom: 80, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 36,
                width: '100%',
              }}
              className="home-hero-grid"
            >
              {/* Text Content */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 18,
                  textAlign: 'center',
                  maxWidth: 680,
                }}
              >
                {/* Profile Avatar */}
                <motion.div variants={fadeUp}>
                  <div
                    style={{
                      width: 124,
                      height: 124,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
                      padding: 2.5,
                      position: 'relative',
                      boxShadow: '0 8px 32px rgba(108, 99, 255, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: 'var(--bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      {settings.profile_image_url ? (
                        <img
                          src={settings.profile_image_url}
                          alt="Manthan Patel"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span className="font-accent" style={{ fontSize: '2.4rem', color: 'var(--accent-violet)' }}>
                          M
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Name */}
                <motion.h1
                  variants={fadeUp}
                  className="font-hero"
                  style={{
                    fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                  }}
                >
                  Manthan Patel
                </motion.h1>

                {/* Subtitle / Typewriter */}
                <motion.div variants={fadeUp} style={{ height: 28, display: 'flex', alignItems: 'center' }}>
                  <TypewriterText
                    texts={SUBTITLES}
                    className="font-heading"
                    speed={45}
                    deleteSpeed={25}
                    pauseDuration={2600}
                  />
                </motion.div>

                {/* Pitch Tagline from settings */}
                <motion.p
                  variants={fadeUp}
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.05rem',
                    lineHeight: 1.6,
                    maxWidth: 540,
                    margin: '0 auto',
                  }}
                >
                  {settings.hero_tagline || 'Full-stack developer building AI-powered web applications and high-performance digital products.'}
                </motion.p>

                {/* Availability & Status Badges */}
                <motion.div
                  variants={fadeUp}
                  style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}
                >
                  <div className="status-pill" style={{ fontSize: '0.78rem' }}>
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: '#00f5d4',
                        display: 'inline-block',
                        boxShadow: '0 0 8px #00f5d4',
                      }}
                    />
                    {settings.availability_text || (settings.availability_status === 'open' ? 'Available for new roles' : 'Focused on ongoing work')}
                  </div>

                  {settings.building_status && (
                    <div
                      style={{
                        padding: '6px 14px',
                        borderRadius: 100,
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-heading)',
                        background: 'rgba(108,99,255,0.08)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Building: <strong style={{ color: 'var(--text-primary)' }}>{settings.building_status}</strong>
                    </div>
                  )}
                </motion.div>

                {/* CTA Buttons: View Projects, Resume, GitHub */}
                <motion.div
                  variants={fadeUp}
                  style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}
                >
                  <a href="#projects" className="btn-primary" style={{ textDecoration: 'none' }}>
                    <IconExternalLink size={16} /> View Projects
                  </a>

                  {settings.show_resume_section !== 'false' && (
                    <a href="#resume" className="btn-secondary" style={{ textDecoration: 'none' }}>
                      <IconDownload size={16} /> Resume
                    </a>
                  )}

                  {settings.social_github && (
                    <a
                      href={settings.social_github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ textDecoration: 'none' }}
                    >
                      <IconGithub size={16} /> GitHub
                    </a>
                  )}
                </motion.div>
              </motion.div>
            </div>

            {/* Stats Grid */}
            <ScrollReveal>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 16,
                  width: '100%',
                  maxWidth: 640,
                  marginTop: 12,
                }}
                className="stats-grid"
              >
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="glass-card"
                    style={{
                      padding: '20px 16px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      className="font-accent"
                      style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-violet)' }}
                    >
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div
                      className="font-heading"
                      style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Social Icons */}
            <ScrollReveal delay={0.15}>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                {dynamicSocialLinks.map((link) => {
                  const Icon = socialIconMap[link.icon];
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        transition: 'all 0.25s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent-violet)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      aria-label={link.name}
                    >
                      {Icon && <Icon size={18} />}
                    </a>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Sections with preserved IDs */}
      <div id="about"><About /></div>
      <div id="projects"><Projects /></div>
      <div id="skills"><Skills /></div>
      <div id="experience"><Experience /></div>
      <div id="gallery"><Gallery /></div>
      {showBlogSection && <div id="blog"><Blog /></div>}
      {settings.show_resume_section !== 'false' && <div id="resume"><Resume /></div>}
      <div id="contact"><Contact /></div>

      <style>{`
        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            max-width: 780px !important;
          }
        }
      `}</style>
    </div>
  );
}
