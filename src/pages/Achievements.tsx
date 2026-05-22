import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import { DEMO_CERTIFICATES } from '../lib/data';
import { IconChevronLeft, IconChevronRight } from '../components/ui/Icons';

const BADGES = [
  { icon: '🥇', title: 'Hackathon Winner', desc: 'Won first place at campus hackathon with Smart Campus project.' },
  { icon: '🚀', title: 'Shipped 10+ Apps', desc: 'Delivered over 10 production applications across web and mobile.' },
  { icon: '🤖', title: 'AI Integrator', desc: 'Connected 5+ AI APIs to production applications including Claude and OpenAI.' },
  { icon: '📦', title: 'Open Source Contributor', desc: 'Contributed to multiple open source projects and shared personal tools.' },
];

// GitHub heatmap mock data
const generateHeatmapData = () => {
  const data: number[][] = [];
  for (let w = 0; w < 52; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(Math.random() > 0.4 ? Math.floor(Math.random() * 4) : 0);
    }
    data.push(week);
  }
  return data;
};

const HEATMAP_COLORS = ['rgba(108,99,255,0.05)', 'rgba(108,99,255,0.2)', 'rgba(108,99,255,0.4)', 'rgba(108,99,255,0.6)', 'rgba(108,99,255,0.85)'];

export default function Achievements() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [heatmapData] = useState(generateHeatmapData);
  const totalContributions = heatmapData.flat().reduce((a, b) => a + b, 0);

  const scroll = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div className="section-container" style={{ paddingTop: 100 }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h1 className="font-hero" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 12 }}>
            <span className="neon-text">Achievements</span>
          </h1>
          <p className="font-heading" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Certifications, milestones, and activity
          </p>
        </div>
      </ScrollReveal>

      {/* Certificates Carousel */}
      <ScrollReveal>
        <h2 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>Certificates</h2>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => scroll('left')}
            className="hidden lg:flex"
            style={{
              position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 5,
              width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border-color)',
              background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)',
            }}
          >
            <IconChevronLeft size={18} />
          </button>
          <div
            ref={carouselRef}
            style={{
              display: 'flex', gap: 16, overflowX: 'auto', scrollSnapType: 'x mandatory',
              paddingBottom: 12, scrollbarWidth: 'none',
            }}
          >
            {DEMO_CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="glass-card"
                style={{
                  minWidth: 280, maxWidth: 320, flexShrink: 0, scrollSnapAlign: 'start', overflow: 'hidden',
                }}
              >
                <img src={cert.image_url} alt={cert.title} loading="lazy" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                <div style={{ padding: 16 }}>
                  <h3 className="font-heading" style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 4 }}>{cert.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{cert.issuer} · {cert.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll('right')}
            className="hidden lg:flex"
            style={{
              position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 5,
              width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border-color)',
              background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)',
            }}
          >
            <IconChevronRight size={18} />
          </button>
        </div>
      </ScrollReveal>

      {/* GitHub Heatmap */}
      <ScrollReveal>
        <div style={{ marginTop: 60 }}>
          <h2 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>GitHub Activity</h2>
          <div className="glass-card" style={{ padding: 24, overflowX: 'auto' }}>
            <div style={{ display: 'flex', gap: 3, minWidth: 700 }}>
              {heatmapData.map((week, wi) => (
                <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {week.map((level, di) => (
                    <motion.div
                      key={`${wi}-${di}`}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: wi * 0.01, duration: 0.2 }}
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: 2,
                        background: HEATMAP_COLORS[level],
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <p className="font-heading" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 16 }}>
              {totalContributions * 3} contributions in the last year
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Badges */}
      <ScrollReveal>
        <div style={{ marginTop: 60 }}>
          <h2 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>Badges & Milestones</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
            {BADGES.map((badge) => (
              <motion.div
                key={badge.title}
                whileHover={{ scale: 1.04, y: -4 }}
                className="glass-card"
                style={{ padding: 24, textAlign: 'center', cursor: 'default' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{badge.icon}</div>
                <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>{badge.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
