import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useEffect } from 'react';
import { api } from '../lib/api';
import type { Project } from '../lib/supabase';
// Removed unused IconExternalLink import

const CATEGORIES = ['All', 'AI', 'Web Apps', 'Dashboards', 'Mobile'];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.projects.getVisible();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((p) => p.category.includes(activeFilter));
  }, [activeFilter, projects]);

  return (
    <div className="section-container" style={{ paddingTop: 100 }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 className="font-hero" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 12 }}>
            My <span className="neon-text">Projects</span>
          </h1>
          <p className="font-heading" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Things I've built and shipped
          </p>
        </div>
      </ScrollReveal>

      {/* Filter Chips */}
      <ScrollReveal>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`chip ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Project Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <p className="font-heading" style={{ fontSize: '1.1rem' }}>Loading projects...</p>
        </div>
      ) : (
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
            maxWidth: 1200,
            margin: '0 auto',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
                whileHover={{ y: -8, scale: 1.02, boxShadow: '0 15px 40px rgba(108, 99, 255, 0.2)' }}
                style={{ borderRadius: 16 }}
              >
                <Link to={`/project/${project.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                  <div
                    className="glass-card"
                    style={{
                      overflow: 'hidden',
                      cursor: 'pointer',
                      height: '100%',
                      position: 'relative',
                      borderTop: '2px solid rgba(108, 99, 255, 0.3)'
                    }}
                  >
                    {/* Inner glowing blob */}
                    <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'radial-gradient(circle, rgba(108, 99, 255, 0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

                    {/* Cover Image */}
                    <div style={{ position: 'relative', overflow: 'hidden', height: project.featured ? 220 : 180, zIndex: 1 }}>
                      <motion.img
                        src={project.images && project.images.length > 0 ? project.images[0] : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
                        alt={project.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.8), transparent)', pointerEvents: 'none' }} />
                      
                      {project.featured && (
                        <div
                          className="font-accent"
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'linear-gradient(135deg, rgba(108,99,255,0.9), rgba(0,245,212,0.9))',
                            color: '#fff',
                            padding: '4px 12px',
                            borderRadius: 6,
                            fontSize: '0.65rem',
                            letterSpacing: '1px',
                            fontWeight: 700,
                            boxShadow: '0 0 10px rgba(0,245,212,0.5)'
                          }}
                        >
                          FEATURED
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: 24, position: 'relative', zIndex: 1 }}>
                      <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
                        {project.title}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {project.description}
                      </p>

                      {/* Tech Stack Chips */}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                        {(project.tech_stack || []).slice(0, 4).map((tech) => (
                          <span
                            key={tech.name}
                            className="font-mono"
                            style={{
                              fontSize: '0.75rem',
                              padding: '4px 12px',
                              borderRadius: 6,
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: 'var(--text-primary)',
                            }}
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span className="font-accent" style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', letterSpacing: '1px' }}>
                          VIEW PROJECT
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
