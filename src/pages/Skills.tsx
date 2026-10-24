import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useDataStore } from '../stores/useDataStore';
import { api } from '../lib/api';
import {
  Code2,
  Server,
  Sparkles,
  Palette,
  Cloud,
  Terminal,
  Layers,
  type LucideIcon,
} from 'lucide-react';

export default function Skills() {
  const storeSkills = useDataStore((s) => s.skills);
  const setSkills = useDataStore((s) => s.setSkills);
  const [loading, setLoading] = useState(storeSkills.length === 0);

  useEffect(() => {
    if (storeSkills.length === 0) {
      api.skills
        .getAll()
        .then((data) => setSkills(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [storeSkills.length, setSkills]);

  const categories = useMemo(() => {
    return Array.from(new Set(storeSkills.map((s) => s.category).filter(Boolean)));
  }, [storeSkills]);

  // Distinct lucide icon per skill category
  const getCategoryIcon = (category: string): LucideIcon => {
    const lower = category.toLowerCase();
    if (lower.includes('frontend') || lower.includes('client') || lower.includes('web')) return Code2;
    if (lower.includes('backend') || lower.includes('server') || lower.includes('api') || lower.includes('data')) return Server;
    if (lower.includes('ai') || lower.includes('machine') || lower.includes('ml')) return Sparkles;
    if (lower.includes('design') || lower.includes('ui') || lower.includes('creative')) return Palette;
    if (lower.includes('cloud') || lower.includes('devops') || lower.includes('infra')) return Cloud;
    if (lower.includes('tools') || lower.includes('git') || lower.includes('cli')) return Terminal;
    return Layers;
  };

  return (
    <div className="section-container" style={{ paddingTop: 100, paddingBottom: 100 }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 54 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{ height: 1, width: 36, background: 'var(--accent-violet)' }} />
            <span
              className="font-mono"
              style={{
                color: 'var(--accent-violet)',
                fontSize: '0.8rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Capabilities
            </span>
            <div style={{ height: 1, width: 36, background: 'var(--accent-violet)' }} />
          </div>

          <h2
            className="font-hero"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em' }}
          >
            Technologies I <span className="neon-text">Work With</span>
          </h2>
          <p
            className="font-heading"
            style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 480, margin: '10px auto 0' }}
          >
            A curated stack focused on performance, developer velocity, and robust user experience.
          </p>
        </div>
      </ScrollReveal>

      <div style={{ width: '100%', maxWidth: 1160, margin: '0 auto' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading skills...</p>
        ) : (
          <div
            className="skills-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {categories.map((cat, i) => {
              const Icon = getCategoryIcon(cat);
              const catSkills = storeSkills.filter((s) => s.category === cat);

              return (
                <ScrollReveal key={cat} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="glass-card"
                    style={{
                      borderRadius: 16,
                      padding: 28,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderTop: '2px solid rgba(108, 99, 255, 0.3)',
                    }}
                  >
                    {/* Header with Distinct Category Icon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: 'rgba(108, 99, 255, 0.1)',
                          border: '1px solid rgba(108, 99, 255, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-violet)',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <h3
                        className="font-heading"
                        style={{
                          fontSize: '1.18rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          margin: 0,
                        }}
                      >
                        {cat}
                      </h3>
                    </div>

                    {/* Skill Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto' }}>
                      {catSkills.map((skill) => (
                        <motion.div
                          key={skill.id}
                          whileHover={{
                            scale: 1.04,
                            backgroundColor: 'rgba(108, 99, 255, 0.15)',
                            borderColor: 'var(--accent-violet)',
                            color: '#ffffff',
                          }}
                          transition={{ duration: 0.15 }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            padding: '6px 14px',
                            borderRadius: 100,
                            fontSize: '0.82rem',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 500,
                            color: 'var(--text-secondary)',
                            cursor: 'default',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span>{skill.name}</span>
                          {skill.proficiency && (
                            <span
                              className="font-mono"
                              style={{
                                fontSize: '0.7rem',
                                color: 'var(--accent-cyan)',
                                opacity: 0.8,
                              }}
                            >
                              {skill.proficiency}%
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
