import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { PERSONALITY_CARDS } from '../lib/data';
import { api } from '../lib/api';
import { useSettingsStore } from '../stores/useSettingsStore';

export default function About() {
  const settings = useSettingsStore(s => s.settings);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [aboutText, setAboutText] = useState("I'm a full-stack developer passionate about building scalable AI applications and interactive web experiences. With expertise in React, Node.js, and modern cloud architecture, I love turning complex problems into elegant solutions.");
  const [stats, setStats] = useState([
    { label: 'Hours Coded', value: 1200, suffix: '+' },
    { label: 'Projects Built', value: 12, suffix: '' },
    { label: 'Bugs Squashed', value: 300, suffix: '+' },
    { label: 'APIs Integrated', value: 25, suffix: '+' },
  ]);

  useEffect(() => {
    api.settings.getAll().then(data => {
      const statsSetting = data.find(s => s.key === 'about_stats');
      if (statsSetting) {
        try {
          setStats(JSON.parse(statsSetting.value));
        } catch(e) { console.error('Failed to parse about stats'); }
      }
      
      const textSetting = data.find(s => s.key === 'about_text');
      if (textSetting) {
        setAboutText(textSetting.value);
      }
    });
  }, []);

  return (
    <div className="section-container" style={{ paddingTop: 100 }}>
      {/* Section Header */}
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h1 className="font-hero" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 12 }}>
            About <span className="neon-text">Me</span>
          </h1>
          <p className="font-heading" style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
            The story behind the code
          </p>
        </div>
      </ScrollReveal>

      {/* Profile Card + Story */}
      <ScrollReveal>
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card" 
          style={{ padding: '40px 32px', maxWidth: 800, margin: '0 auto 60px', position: 'relative', overflow: 'hidden', borderTop: '2px solid rgba(108, 99, 255, 0.3)' }}
        >
          {/* Subtle gradient blob inside card */}
          <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(108, 99, 255, 0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>
            {/* Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center', position: 'relative' }}>
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6c63ff, #00f5d4)',
                  padding: 3,
                  position: 'relative',
                }}
              >
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {settings.profile_image_url ? (
                    <img src={settings.profile_image_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="font-accent" style={{ fontSize: '2.2rem', color: 'var(--accent-violet)' }}>M</span>
                  )}
                </div>
                {/* Glow ring */}
                <div
                  className="animate-glow"
                  style={{
                    position: 'absolute',
                    inset: -6,
                    borderRadius: '50%',
                    border: '2px solid rgba(108,99,255,0.4)',
                  }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h2 className="font-heading" style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Manthan Patel</h2>
                <p style={{ color: 'var(--accent-cyan)', fontStyle: 'italic', fontSize: '1rem', background: 'rgba(0,245,212,0.1)', padding: '6px 16px', borderRadius: 20 }}>
                  "Building things that make a difference — one line of code at a time."
                </p>
              </div>
            </div>

            {/* Story */}
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
              {aboutText}
            </div>
          </div>
        </motion.div>
      </ScrollReveal>



      {/* Personality Cards */}
      <ScrollReveal>
        <h2 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>
          What Drives Me
        </h2>
      </ScrollReveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 600, margin: '0 auto 60px' }}>
        {PERSONALITY_CARDS.map((card, i) => (
          <ScrollReveal key={card.title} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -8, scale: 1.02, boxShadow: '0 10px 30px rgba(0, 245, 212, 0.15)' }}
              className="glass-card"
              style={{
                padding: 24,
                textAlign: 'center',
                cursor: 'pointer',
                minHeight: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                perspective: 1000,
                borderTop: '2px solid rgba(0, 245, 212, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => setFlippedCard(flippedCard === i ? null : i)}
            >
              <motion.div
                animate={{ rotateY: flippedCard === i ? 180 : 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'relative', width: '100%' }}
              >
                {flippedCard !== i ? (
                  <div>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{card.emoji}</div>
                    <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 600 }}>{card.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: 8 }}>Tap to reveal</p>
                  </div>
                ) : (
                  <div style={{ transform: 'rotateY(180deg)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>{card.desc}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>

      {/* By The Numbers */}
      <ScrollReveal>
        <h2 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>
          By The Numbers
        </h2>
      </ScrollReveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 600, margin: '0 auto' }} className="about-stats-grid">
        {stats.map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 0.1}>
            <motion.div 
              whileHover={{ y: -5, scale: 1.05 }}
              className="glass-card" 
              style={{ padding: 32, textAlign: 'center', borderTop: '2px solid rgba(108, 99, 255, 0.3)', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: 60, background: 'radial-gradient(circle, rgba(108, 99, 255, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div className="font-accent" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-violet)', textShadow: '0 0 15px rgba(108, 99, 255, 0.4)' }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-heading" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 8, letterSpacing: '1px', textTransform: 'uppercase' }}>
                {stat.label}
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .about-stats-grid { grid-template-columns: repeat(4, 1fr) !important; max-width: 900px !important; }
        }
      `}</style>
    </div>
  );
}
