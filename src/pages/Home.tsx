import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import TypewriterText from '../components/ui/TypewriterText';
import ParticleBackground from '../components/ui/ParticleBackground';
import { IconGithub, IconLinkedin, IconInstagram, IconX, IconEmail, IconDownload, IconExternalLink } from '../components/ui/Icons';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../lib/api';

import { useSettingsStore } from '../stores/useSettingsStore';
import About from './About';
import Projects from './Projects';
import Skills from './Skills';
import Experience from './Experience';
import Gallery from './Gallery';
import Blog from './Blog';
import Resume from './Resume';
import Contact from './Contact';

const SUBTITLES = ['Full Stack Developer', 'AI Builder', 'Innovator', 'React Engineer'];

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Home() {
  const [stats, setStats] = useState([
    { label: 'Hours Coded', value: 1200, suffix: '+' },
    { label: 'Projects Built', value: 12, suffix: '' },
    { label: 'Bugs Squashed', value: 300, suffix: '+' },
    { label: 'APIs Integrated', value: 25, suffix: '+' },
  ]);
  const location = useLocation();
  const settings = useSettingsStore(s => s.settings);

  const dynamicSocialLinks = [
    { name: 'GitHub', url: settings.social_github, icon: 'github', color: '#fff' },
    { name: 'LinkedIn', url: settings.social_linkedin, icon: 'linkedin', color: '#0A66C2' },
    { name: 'X / Twitter', url: settings.social_x, icon: 'x', color: '#fff' },
    { name: 'Instagram', url: settings.social_instagram, icon: 'instagram', color: '#E4405F' },
    { name: 'Email', url: `mailto:${settings.social_email}`, icon: 'email', color: '#EA4335' },
  ].filter(link => !!link.url);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, posts, skills, exp] = await Promise.all([
          api.projects.getVisible(),
          api.posts.getPublished(),
          api.skills.getAll(),
          api.experience.getAll()
        ]);
        
        setStats([
          { label: 'Projects', value: projects.length, suffix: '' },
          { label: 'Posts', value: posts.length, suffix: '' },
          { label: 'Skills', value: skills.length, suffix: '+' },
          { label: 'Experience', value: exp.length, suffix: 'yrs' }, // naive yrs but whatever
        ]);

      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Auto-scroll to hash when navigating to the page from another route
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100); // small delay to ensure rendering is complete
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      <div id="home" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <ParticleBackground count={300} color="rgba(108,99,255,0.3)" />

      {/* Gradient mesh background */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,245,212,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />



      <div className="section-container" style={{ paddingTop: 180, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          {/* Desktop: side by side layout */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 40,
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
                gap: 20,
                textAlign: 'center',
                maxWidth: 700,
              }}
              className="home-text-content"
            >
              {/* Profile Image */}
              <motion.div variants={fadeUp}>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6c63ff, #00f5d4)',
                    padding: 3,
                    position: 'relative',
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
                      <img src={settings.profile_image_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="font-accent" style={{ fontSize: '2.8rem', color: 'var(--accent-violet)' }}>
                        M
                      </span>
                    )}
                  </div>
                  {/* Glow ring */}
                  <div
                    className="animate-glow"
                    style={{
                      position: 'absolute',
                      inset: -6,
                      borderRadius: '50%',
                      border: '2px solid rgba(108,99,255,0.3)',
                      pointerEvents: 'none',
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Name */}
              <motion.h1
                variants={fadeUp}
                className="font-hero"
                style={{
                  fontSize: 'clamp(2rem, 6vw, 3.8rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-violet) 50%, var(--accent-cyan) 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradient-shift 6s ease infinite',
                }}
              >
                Manthan Patel
              </motion.h1>

              {/* Typewriter subtitle */}
              <motion.div variants={fadeUp} style={{ height: 32, display: 'flex', alignItems: 'center' }}>
                <TypewriterText
                  texts={SUBTITLES}
                  className="font-heading"
                  speed={50}
                  deleteSpeed={25}
                  pauseDuration={2500}
                />
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={fadeUp} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="#projects" className="btn-primary" style={{ textDecoration: 'none' }}>
                  <IconExternalLink size={16} /> View Projects
                </a>
                {settings.show_resume_section !== 'false' && (
                  <a href="#resume" className="btn-secondary" style={{ textDecoration: 'none' }}>
                    <IconDownload size={16} /> Download Resume
                  </a>
                )}
              </motion.div>

              {/* Status Pill */}
              <motion.div variants={fadeUp}>
                <div className="status-pill">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00f5d4', display: 'inline-block', animation: 'glow-pulse 2s ease-in-out infinite' }} />
                  Currently Building: Smart Campus AI Platform
                </div>
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
                maxWidth: 600,
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
                  <div className="font-accent" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-violet)' }}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="font-heading" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Social Icons */}
          <ScrollReveal delay={0.2}>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              {dynamicSocialLinks.map((link) => {
                const Icon = socialIconMap[link.icon];
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = link.color;
                      (e.currentTarget as HTMLElement).style.color = link.color;
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${link.color}33`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                    aria-label={link.name}
                  >
                    {Icon && <Icon size={20} />}
                  </a>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>

    <div id="about"><About /></div>
      <div id="projects"><Projects /></div>
      <div id="skills"><Skills /></div>
      <div id="experience"><Experience /></div>
      <div id="gallery"><Gallery /></div>
      <div id="blog"><Blog /></div>
      {settings.show_resume_section !== 'false' && <div id="resume"><Resume /></div>}
      <div id="contact"><Contact /></div>

      <style>{`
        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            max-width: 800px !important;
          }
        }
      `}</style>
    </div>
  );
}
