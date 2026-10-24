import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ui/ScrollReveal';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useDataStore } from '../stores/useDataStore';
import { safeJsonParse } from '../lib/safeJson';
import {
  DEFAULT_ABOUT_STATS,
  DEFAULT_DRIVE_CARDS,
  type DriveCardItem,
  type StatItem,
} from '../lib/constants';
import {
  Palette,
  Cpu,
  Users,
  Layers,
  Sparkles,
  Rocket,
  Code2,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Cpu,
  Users,
  Layers,
  Sparkles,
  Rocket,
  Code: Code2,
  Code2,
  Shield: ShieldCheck,
  ShieldCheck,
  Compass,
};

export default function About() {
  const settings = useSettingsStore((s) => s.settings);
  const projects = useDataStore((s) => s.projects);

  // Safe parse What Drives Me bento cards
  const driveCards = useMemo(() => {
    return safeJsonParse<DriveCardItem[]>(settings.drive_cards, DEFAULT_DRIVE_CARDS);
  }, [settings.drive_cards]);

  // Safe parse About stats or default to live visible-projects count
  const stats = useMemo<StatItem[]>(() => {
    if (settings.about_stats) {
      const parsed = safeJsonParse<StatItem[]>(settings.about_stats, []);
      if (parsed.length > 0) return parsed;
    }
    // Default fallback with live visible projects count
    return DEFAULT_ABOUT_STATS.map((item) => {
      if (item.label.toLowerCase().includes('project')) {
        return { ...item, value: projects.length > 0 ? projects.length : item.value };
      }
      return item;
    });
  }, [settings.about_stats, projects.length]);

  const aboutText =
    settings.about_text ||
    "I'm a full-stack engineer and AI builder dedicated to shipping fast, reliable, and accessible applications. I specialize in React, Node.js, modern cloud architectures, and production AI integrations that solve tangible user problems.";

  // Mouse spotlight border tracking
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0, activeIndex: -1 });

  return (
    <div className="section-container" style={{ paddingTop: 100 }}>
      {/* Section Header */}
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 54 }}>
          <h2
            className="font-hero"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}
          >
            About <span className="neon-text">Me</span>
          </h2>
          <p
            className="font-heading"
            style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}
          >
            Philosophy, driving principles, and empirical track record.
          </p>
        </div>
      </ScrollReveal>

      {/* Profile Card & Bio Story */}
      <ScrollReveal>
        <div
          className="glass-card"
          style={{
            padding: '36px 32px',
            maxWidth: 820,
            margin: '0 auto 64px',
            position: 'relative',
            overflow: 'hidden',
            borderTop: '2px solid rgba(108, 99, 255, 0.3)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
                  padding: 2.5,
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
                    <img
                      src={settings.profile_image_url}
                      alt="Manthan Patel"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span className="font-accent" style={{ fontSize: '2rem', color: 'var(--accent-violet)' }}>
                      M
                    </span>
                  )}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <h3
                  className="font-heading"
                  style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}
                >
                  Manthan Patel
                </h3>
                <p
                  style={{
                    color: 'var(--accent-cyan)',
                    fontSize: '0.85rem',
                    background: 'rgba(0, 245, 212, 0.08)',
                    padding: '4px 14px',
                    borderRadius: 20,
                    fontFamily: 'var(--font-heading)',
                    display: 'inline-block',
                  }}
                >
                  "Building things that make a difference — one line of code at a time."
                </p>
              </div>
            </div>

            {/* Story Bio */}
            <div
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                fontSize: '0.98rem',
                whiteSpace: 'pre-line',
                maxWidth: 720,
              }}
            >
              {aboutText}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* "What Drives Me" Bento Grid */}
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h3 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
            What Drives Me
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Core principles backed by delivered production work.
          </p>
        </div>
      </ScrollReveal>

      <div
        className="bento-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: 16,
          maxWidth: 960,
          margin: '0 auto 64px',
        }}
      >
        {driveCards.map((card, i) => {
          const IconComponent = iconMap[card.icon] || Sparkles;
          const isLarge = i === 0;

          return (
            <ScrollReveal key={card.title + i} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setSpotlightPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, activeIndex: i });
                }}
                onMouseLeave={() => setSpotlightPos((p) => ({ ...p, activeIndex: -1 }))}
                className={`glass-card bento-card ${isLarge ? 'bento-large' : ''}`}
                style={{
                  padding: isLarge ? '32px' : '26px',
                  borderRadius: 16,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  outline: 'none',
                  border: '1px solid var(--border-color)',
                  background:
                    spotlightPos.activeIndex === i
                      ? `radial-gradient(circle 180px at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(108, 99, 255, 0.12), var(--glass-bg))`
                      : 'var(--glass-bg)',
                  transition: 'border-color 0.2s ease, background 0.2s ease',
                }}
                tabIndex={0}
              >
                <div>
                  {/* Icon & Category Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: 'rgba(108, 99, 255, 0.12)',
                        border: '1px solid rgba(108, 99, 255, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-violet)',
                      }}
                    >
                      <IconComponent size={22} />
                    </div>
                    {isLarge && (
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '0.7rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--accent-cyan)',
                          background: 'rgba(0, 245, 212, 0.08)',
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}
                      >
                        Core Focus
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h4
                    className="font-heading"
                    style={{
                      fontSize: isLarge ? '1.35rem' : '1.15rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: 8,
                    }}
                  >
                    {card.title}
                  </h4>

                  {/* One-line statement */}
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: isLarge ? '0.96rem' : '0.88rem',
                      lineHeight: 1.6,
                      marginBottom: 20,
                    }}
                  >
                    {card.statement}
                  </p>
                </div>

                {/* Proof Link pointing to project */}
                {card.project_slug && (
                  <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <Link
                      to={`/project/${card.project_slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        textDecoration: 'none',
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 600,
                        color: 'var(--accent-cyan)',
                        transition: 'gap 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--accent-cyan)';
                      }}
                    >
                      <span>Proof: {card.proof_label || 'View Case Study'}</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                )}
              </motion.div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* "By The Numbers" Stats Grid */}
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h3 className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 6 }}>
            By The Numbers
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Tangible benchmarks of production output.
          </p>
        </div>
      </ScrollReveal>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
          maxWidth: 640,
          margin: '0 auto',
        }}
        className="about-stats-grid"
      >
        {stats.map((stat, i) => (
          <ScrollReveal key={stat.label + i} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -3 }}
              className="glass-card"
              style={{
                padding: '24px 20px',
                textAlign: 'center',
                borderTop: '2px solid rgba(108, 99, 255, 0.3)',
              }}
            >
              <div
                className="font-accent"
                style={{
                  fontSize: '2.2rem',
                  fontWeight: 700,
                  color: 'var(--accent-violet)',
                  letterSpacing: '0.02em',
                }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div
                className="font-heading"
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  marginTop: 6,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .bento-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .bento-large {
            grid-column: span 3 !important;
          }
        }
        @media (min-width: 1024px) {
          .bento-grid {
            grid-template-columns: 1.2fr 1fr 1fr !important;
            grid-template-rows: auto auto !important;
          }
          .bento-large {
            grid-column: 1 !important;
            grid-row: span 2 !important;
          }
          .about-stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            max-width: 860px !important;
          }
        }
        .bento-card:focus-visible {
          border-color: var(--accent-violet) !important;
          box-shadow: 0 0 0 2px var(--accent-violet) !important;
        }
      `}</style>
    </div>
  );
}
