import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import { api } from '../lib/api';
import type { Skill } from '../lib/supabase';
import { IconCode, IconFolder, IconImage, IconPen } from '../components/ui/Icons';

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await api.skills.getAll();
        setSkills(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories = Array.from(new Set(skills.map(s => s.category)));

  // Helper to get an icon based on category name
  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('frontend') || lower.includes('code') || lower.includes('development')) return <IconCode size={20} />;
    if (lower.includes('design') || lower.includes('ui') || lower.includes('graphics')) return <IconPen size={20} />;
    if (lower.includes('video') || lower.includes('media') || lower.includes('photo')) return <IconImage size={20} />;
    return <IconFolder size={20} />;
  };

  return (
    <div className="section-container" style={{ paddingTop: 100, paddingBottom: 100 }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ height: 1, width: 40, background: 'var(--accent-violet)' }} />
            <h2 className="font-accent" style={{ color: 'var(--accent-violet)', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Skills
            </h2>
            <div style={{ height: 1, width: 40, background: 'var(--accent-violet)' }} />
          </div>
          
          <h1 className="font-hero" style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800 }}>
            Tools & Technologies I <span style={{ color: 'var(--accent-violet)' }}>Master</span>
          </h1>
        </div>
      </ScrollReveal>

      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading skills...</p>
        ) : (
          <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {categories.map((cat, i) => (
              <ScrollReveal key={cat} delay={i * 0.1}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="glass-card"
                  style={{ 
                    borderRadius: 16, 
                    padding: 32,
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderTop: '2px solid rgba(108, 99, 255, 0.3)'
                  }}>
                  
                  {/* Subtle inner glow */}
                  <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'radial-gradient(circle, rgba(108, 99, 255, 0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                  {/* Category Icon */}
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    style={{ 
                      width: 56, 
                      height: 56, 
                      borderRadius: 16, 
                      background: 'rgba(108, 99, 255, 0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--accent-violet)',
                      marginBottom: 24,
                      boxShadow: '0 0 15px rgba(108, 99, 255, 0.2)'
                    }}>
                    {getCategoryIcon(cat)}
                  </motion.div>

                  {/* Category Title */}
                  <h3 className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)' }}>
                    {cat}
                  </h3>

                  {/* Skills Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {skills.filter(s => s.category === cat).map(skill => (
                      <motion.div 
                        key={skill.id}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 245, 212, 0.15)', borderColor: 'rgba(0, 245, 212, 0.5)', color: 'var(--accent-cyan)' }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          padding: '8px 16px',
                          borderRadius: 20,
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          color: 'var(--text-secondary)',
                          cursor: 'default',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {skill.name}
                      </motion.div>
                    ))}
                  </div>

                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
