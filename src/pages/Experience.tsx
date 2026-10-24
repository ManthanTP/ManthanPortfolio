import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useDataStore } from '../stores/useDataStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { safeJsonParse } from '../lib/safeJson';
import { DEFAULT_ACHIEVEMENTS } from '../lib/constants';

export default function Experience() {
  const experience = useDataStore((s) => s.experience);
  const status = useDataStore((s) => s.status.experience);
  const settings = useSettingsStore((s) => s.settings);

  const achievements = safeJsonParse(settings.achievements, DEFAULT_ACHIEVEMENTS);
  const workExp = experience.filter((e) => e.type !== 'achievement');

  return (
    <div className="section-container" style={{ paddingTop: 100, paddingBottom: 100 }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <h1 className="font-hero" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, marginBottom: 16 }}>
            My <span className="neon-text">Journey</span>
          </h1>
          <p className="font-heading" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            A timeline of my professional growth, roles, and major milestones.
          </p>
        </div>
      </ScrollReveal>

      {/* Timeline */}
      <div style={{ position: 'relative', maxWidth: 1000, margin: '0 auto 120px' }} className="exp-timeline">
        <motion.div
          className="timeline-line-anim"
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: 30,
            top: 0,
            width: 3,
            background: 'linear-gradient(to bottom, var(--accent-violet), var(--accent-cyan))',
            borderRadius: 4,
            zIndex: 0,
            boxShadow: '0 0 15px rgba(108, 99, 255, 0.4)',
          }}
        />

        {status === 'loading' && workExp.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading experience...</p>
        ) : (
          workExp.map((exp, i) => (
            <div key={exp.id} style={{ position: 'relative', paddingBottom: 60, width: '100%' }} className="exp-timeline-item">
              <motion.div
                className="timeline-dot-anim"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.3, delay: 0.1 }}
                style={{
                  position: 'absolute',
                  left: 23,
                  top: 28,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  border: '3px solid var(--accent-violet)',
                  boxShadow: '0 0 16px rgba(108, 99, 255, 0.7)',
                  zIndex: 2,
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass-card exp-card"
                style={{
                  position: 'relative',
                  borderTop: '2px solid rgba(108, 99, 255, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }} className="exp-card-header">
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--accent-violet)',
                      letterSpacing: '0.5px',
                      fontWeight: 600,
                      background: 'rgba(108, 99, 255, 0.1)',
                      padding: '5px 12px',
                      borderRadius: 16,
                      border: '1px solid rgba(108, 99, 255, 0.2)',
                    }}
                  >
                    {exp.start_date} — {exp.end_date || 'Present'}
                  </span>
                  {(!exp.end_date || exp.current) && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        background: 'rgba(0, 245, 212, 0.15)',
                        color: 'var(--accent-cyan)',
                        padding: '4px 10px',
                        borderRadius: 16,
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        border: '1px solid rgba(0, 245, 212, 0.3)',
                      }}
                    >
                      CURRENT
                    </span>
                  )}
                </div>

                <h3 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 6 }}>
                  {exp.title} <span style={{ color: 'var(--accent-cyan)' }}>@ {exp.org}</span>
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: 16 }}>
                  {exp.description}
                </p>

                {exp.tags && exp.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }} className="exp-card-tags">
                    {exp.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        style={{
                          fontSize: '0.72rem',
                          background: 'rgba(255, 255, 255, 0.04)',
                          color: 'var(--text-secondary)',
                          padding: '3px 10px',
                          borderRadius: 6,
                          border: '1px solid var(--border-color)',
                          fontWeight: 500,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          ))
        )}
      </div>

      {/* Achievement Unlocks */}
      {achievements.length > 0 && (
        <>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 50 }}>
              <h2 className="font-hero" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800 }}>
                Achievement <span className="neon-text-cyan">Unlocks</span>
              </h2>
            </div>
          </ScrollReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
              maxWidth: 1100,
              margin: '0 auto',
            }}
          >
            {achievements.map((achievement: any, i: number) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="glass-card achievement-card"
                  style={{
                    padding: 28,
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    borderTop: '2px solid rgba(0, 245, 212, 0.3)',
                    height: '100%',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>
                    {achievement.icon || '🏆'}
                  </div>
                  <h3 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
                    {achievement.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55 }}>
                    {achievement.description}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .timeline-line-anim { left: 50% !important; transform: translateX(-50%); }
          
          .exp-timeline-item:nth-child(even) .exp-card { 
            margin-left: calc(50% + 36px) !important; 
            width: calc(50% - 36px) !important;
          }
          
          .exp-timeline-item:nth-child(odd) .exp-card { 
            margin-left: 0 !important;
            margin-right: calc(50% + 36px) !important; 
            width: calc(50% - 36px) !important;
            text-align: left; 
          }
          
          .exp-timeline-item:nth-child(even) .timeline-dot-anim { left: calc(50% - 9px) !important; }
          .exp-timeline-item:nth-child(odd) .timeline-dot-anim { left: calc(50% - 9px) !important; }
        }
        
        .exp-card {
          margin-left: 56px;
          padding: 24px;
          width: calc(100% - 56px);
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .exp-card {
            margin-left: 48px;
            padding: 18px;
            width: calc(100% - 48px);
          }
          .timeline-line-anim { left: 20px !important; }
          .timeline-dot-anim { left: 12px !important; }
        }
      `}</style>
    </div>
  );
}
