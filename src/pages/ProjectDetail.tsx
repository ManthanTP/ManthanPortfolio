import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Project } from '../lib/supabase';
import { IconArrowLeft, IconGithub, IconExternalLink } from '../components/ui/Icons';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchProject = async () => {
      try {
        const data = await api.projects.getBySlug(slug);
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="section-container" style={{ paddingTop: 120, textAlign: 'center' }}>
        <p className="font-heading" style={{ color: 'var(--text-secondary)' }}>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="section-container" style={{ paddingTop: 120, textAlign: 'center' }}>
        <h1 className="font-hero" style={{ fontSize: '2rem' }}>Project not found</h1>
        <Link to="/#projects" className="btn-primary" style={{ marginTop: 24, textDecoration: 'none' }}>
          <IconArrowLeft size={16} /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container" style={{ paddingTop: 100, maxWidth: 900, margin: '0 auto' }}>
      {/* Back Button */}
      <Link to="/#projects" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.9rem', transition: 'color 0.2s' }} className="font-heading">
        <IconArrowLeft size={16} /> Back to Projects
      </Link>

      {/* Hero Image */}
      <ScrollReveal>
        <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 40, position: 'relative' }}>
          <motion.img
            src={project.images && project.images.length > 0 ? project.images[0] : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
            alt={project.title}
            style={{ width: '100%', height: 'auto', maxHeight: 400, objectFit: 'cover', display: 'block' }}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
          {project.featured && (
            <div className="font-accent" style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(108,99,255,0.9)', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: '0.7rem', letterSpacing: '1px' }}>
              FEATURED
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Title & Category */}
      <ScrollReveal>
        <div style={{ marginBottom: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(project.category || []).map((cat) => (
            <span key={cat} className="font-accent" style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', letterSpacing: '2px' }}>
              {cat}
            </span>
          ))}
        </div>
        <h1 className="font-hero" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 20 }}>
          {project.title}
        </h1>
      </ScrollReveal>

      {/* Description */}
      <ScrollReveal>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 32 }}>
          {project.description}
        </p>
      </ScrollReveal>

      {/* Tech Stack */}
      <ScrollReveal>
        <h2 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16 }}>Tech Stack</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
          {(project.tech_stack || []).map((tech) => (
            <span
              key={tech.name}
              className="font-mono"
              style={{
                fontSize: '0.8rem',
                padding: '6px 16px',
                borderRadius: 8,
                background: 'rgba(108,99,255,0.08)',
                border: '1px solid rgba(108,99,255,0.2)',
                color: 'var(--text-primary)',
              }}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </ScrollReveal>

      {/* Features */}
      {((project.features && project.features.length > 0) || true) && (
        <ScrollReveal>
          <h2 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16 }}>Key Features & Details</h2>
          <div className="glass-card" style={{ padding: 32, marginBottom: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(project.features && project.features.length > 0 ? project.features : [
                'Real-time data processing and visualization', 
                'AI-powered analytics and predictions', 
                'Mobile-responsive dashboard interface', 
                'Secure authentication and role-based access', 
                'REST API integration with third-party services'
              ]).map((line, i) => {
                const text = line.trim();
                
                // Handle Headings (e.g., # Heading or ## Heading)
                if (text.startsWith('#')) {
                  const headingText = text.replace(/^#+\s*/, '');
                  const isMainHeading = text.startsWith('# ');
                  return (
                    <div key={i} style={{ marginTop: i > 0 ? 24 : 0, marginBottom: 8 }}>
                      <h3 className="font-heading" style={{ 
                        fontSize: isMainHeading ? '1.4rem' : '1.1rem', 
                        fontWeight: 700, 
                        color: isMainHeading ? 'var(--accent-violet)' : 'var(--text-primary)',
                        letterSpacing: '0.5px'
                      }}>
                        {headingText}
                      </h3>
                      {isMainHeading && <div style={{ width: 40, height: 3, background: 'var(--accent-cyan)', marginTop: 8, borderRadius: 2 }} />}
                    </div>
                  );
                }
                
                // Handle Horizontal Rule
                if (text === '---') {
                  return <div key={i} style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 50%, transparent)', margin: '16px 0' }} />;
                }
                
                // Handle Bullet Points
                const isBullet = text.startsWith('-');
                const itemText = isBullet ? text.replace(/^-\s*/, '') : text;
                
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: 'var(--text-secondary)', fontSize: '0.95rem', paddingLeft: isBullet ? 16 : 0, lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem', flexShrink: 0, marginTop: -2 }}>→</span>
                    <span>{itemText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Image Gallery */}
      {project.images && project.images.length > 1 && (
        <ScrollReveal>
          <h2 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16 }}>Gallery</h2>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12, marginBottom: 40 }}>
            {(project.images || []).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${project.title} screenshot ${i + 1}`}
                loading="lazy"
                style={{
                  height: 200,
                  borderRadius: 12,
                  flexShrink: 0,
                  objectFit: 'cover',
                  border: '1px solid var(--glass-border)',
                }}
              />
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Links */}
      <ScrollReveal>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none' }}>
              <IconGithub size={16} /> View on GitHub
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
              <IconExternalLink size={16} /> Live Demo
            </a>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
