import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import { api } from '../lib/api';
import type { Experience as ExperienceType } from '../lib/supabase';
import { useSettingsStore } from '../stores/useSettingsStore';

export default function Experience() {
  const [experience, setExperience] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  const settings = useSettingsStore(s => s.settings);
  
  const achievements = (() => {
    try {
      return JSON.parse(settings.achievements || '[]');
    } catch(e) {
      return [];
    }
  })();

  useEffect(() => {
    const fetchExp = async () => {
      try {
        const data = await api.experience.getAll();
        setExperience(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExp();
  }, []);
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
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            left: 30,
            top: 0,
            width: 4,
            background: 'linear-gradient(to bottom, var(--accent-violet), var(--accent-cyan))',
            borderRadius: 4,
            zIndex: 0,
            boxShadow: '0 0 15px rgba(108, 99, 255, 0.5)'
          }}
        />
        
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading experience...</p>
        ) : (
          experience.filter(e => e.type !== 'achievement').map((exp, i) => (
            <div key={exp.id} style={{ position: 'relative', paddingBottom: 80, width: '100%' }} className="exp-timeline-item">
              <motion.div 
                className="timeline-dot-anim"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{ 
                  position: 'absolute', 
                  left: 22, 
                  top: 32, 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  background: 'var(--bg-primary)', 
                  border: '4px solid var(--accent-violet)',
                  boxShadow: '0 0 20px rgba(108, 99, 255, 0.8)',
                  zIndex: 2 
                }} 
              />
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card exp-card"
                style={{ 
                  position: 'relative'
                }}
              >
                {/* Subtle gradient blob inside card */}
                <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'radial-gradient(circle, rgba(0, 245, 212, 0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }} className="exp-card-header">
                  <span className="font-accent" style={{ fontSize: '0.8rem', color: 'var(--accent-violet)', letterSpacing: '1px', fontWeight: 600, background: 'rgba(108, 99, 255, 0.1)', padding: '6px 14px', borderRadius: 20 }}>
                    {exp.start_date} — {exp.end_date || 'Present'}
                  </span>
                  {!exp.end_date && (
                    <motion.span 
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ fontSize: '0.75rem', background: 'rgba(0, 245, 212, 0.15)', color: 'var(--accent-cyan)', padding: '6px 12px', borderRadius: 20, fontFamily: 'var(--font-accent)', fontWeight: 700, border: '1px solid rgba(0, 245, 212, 0.3)' }}
                    >
                      CURRENT
                    </motion.span>
                  )}
                </div>
                
                <h3 className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 6 }}>
                  {exp.title} <span style={{ color: 'var(--accent-cyan)' }}>@ {exp.org}</span>
                </h3>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20 }}>
                  {exp.description}
                </p>

                {exp.tags && exp.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} className="exp-card-tags">
                    {exp.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-primary)', padding: '4px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', fontWeight: 500 }}>
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
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 className="font-hero" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800 }}>
            Achievement <span className="neon-text-cyan">Unlocks</span>
          </h2>
        </div>
      </ScrollReveal>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24,
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        {achievements.map((achievement: any, i: number) => (
          <ScrollReveal key={i} delay={i * 0.1}>
            <motion.div
              whileHover={{ scale: 1.05, translateY: -10 }}
              className="glass-card achievement-card"
              style={{ 
                padding: 32, 
                textAlign: 'center', 
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
                borderTop: '2px solid rgba(0, 245, 212, 0.3)',
                height: '100%'
              }}
            >
              {/* Inner glow */}
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: 100, background: 'radial-gradient(circle, rgba(0, 245, 212, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: i * 0.15 + 0.2 }}
                whileHover={{ rotate: [0, -15, 15, -15, 0], transition: { duration: 0.5 } }}
                style={{ fontSize: '3.5rem', marginBottom: 20, display: 'inline-block', filter: 'drop-shadow(0 0 10px rgba(0, 245, 212, 0.5))' }}
              >
                {achievement.icon || '🏆'}
              </motion.div>
              <h3 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>
                {achievement.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {achievement.description}
              </p>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .timeline-line-anim { left: 50% !important; transform: translateX(-50%); }
          
          .exp-timeline-item:nth-child(even) .exp-card { 
            margin-left: calc(50% + 40px) !important; 
            width: calc(50% - 40px) !important;
          }
          
          .exp-timeline-item:nth-child(odd) .exp-card { 
            margin-left: 0 !important;
            margin-right: calc(50% + 40px) !important; 
            width: calc(50% - 40px) !important;
            text-align: right; 
          }
          
          .exp-timeline-item:nth-child(odd) .exp-card-header { justify-content: flex-end; }
          .exp-timeline-item:nth-child(odd) .exp-card-tags { justify-content: flex-end; }
          
          .exp-timeline-item:nth-child(even) .timeline-dot-anim { left: calc(50% - 10px) !important; }
          .exp-timeline-item:nth-child(odd) .timeline-dot-anim { left: calc(50% - 10px) !important; }
          
          .achievement-card:hover {
             box-shadow: 0 10px 40px rgba(0, 245, 212, 0.15);
          }
        }
        
        /* Mobile defaults */
        .exp-card {
          margin-left: 60px;
          padding: 24px;
          width: calc(100% - 60px);
          border-top: 2px solid rgba(108, 99, 255, 0.3);
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .exp-card {
            margin-left: 50px;
            padding: 20px;
            width: calc(100% - 50px);
          }
          .timeline-line-anim { left: 24px !important; }
          .timeline-dot-anim { left: 16px !important; }
        }
        
        @media (min-width: 1024px) {
          .exp-card {
            padding: 32px;
          }
        }
      `}</style>
    </div>
  );
}
