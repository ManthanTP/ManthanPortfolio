import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Project } from '../lib/supabase';
import { IconArrowLeft, IconGithub, IconExternalLink } from '../components/ui/Icons';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { Sparkles, Briefcase, AlertCircle } from 'lucide-react';

interface ExtendedProject extends Project {
  tagline?: string;
  role?: string;
  problem?: string;
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<ExtendedProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchProject = async () => {
      try {
        const data = await api.projects.getBySlug(slug);
        setProject(data as ExtendedProject);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  // Dynamic route SEO metadata
  useDocumentMeta({
    title: project ? project.title : 'Project Details',
    description: project?.description,
    ogTitle: project ? `${project.title} — Case Study` : undefined,
    ogDescription: project?.description,
    ogImage: project?.images?.[0],
  });

  if (loading) {
    return (
      <div className="section-container" style={{ paddingTop: 140, textAlign: 'center' }}>
        <p className="font-heading" style={{ color: 'var(--text-secondary)' }}>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="section-container" style={{ paddingTop: 140, textAlign: 'center' }}>
        <h1 className="font-hero" style={{ fontSize: '2rem' }}>Project not found</h1>
        <Link to="/#projects" className="btn-primary" style={{ marginTop: 24, textDecoration: 'none' }}>
          <IconArrowLeft size={16} /> Back to Projects
        </Link>
      </div>
    );
  }

  const coverImage =
    project.images && project.images.length > 0
      ? project.images[0]
      : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="section-container" style={{ paddingTop: 110, maxWidth: 880, margin: '0 auto' }}>
      {/* Back Button */}
      <Link
        to="/#projects"
        style={{
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--text-secondary)',
          marginBottom: 32,
          fontSize: '0.9rem',
          transition: 'color 0.2s',
        }}
        className="font-heading"
      >
        <IconArrowLeft size={16} /> Back to Projects
      </Link>

      {/* Hero Cover Image */}
      <ScrollReveal>
        <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 36, position: 'relative' }}>
          <motion.img
            src={coverImage}
            alt={`${project.title} cover`}
            style={{ width: '100%', height: 'auto', maxHeight: 420, objectFit: 'cover', display: 'block' }}
            initial={{ scale: 1.03 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          {project.featured && (
            <div
              className="font-accent"
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(108,99,255,0.92)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: '0.7rem',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Sparkles size={12} /> FEATURED
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Category Tags */}
      <ScrollReveal>
        <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(project.category || []).map((cat) => (
            <span
              key={cat}
              className="font-mono"
              style={{
                fontSize: '0.72rem',
                color: 'var(--accent-cyan)',
                background: 'rgba(0, 245, 212, 0.08)',
                padding: '3px 10px',
                borderRadius: 4,
                letterSpacing: '1px',
              }}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Project Title */}
        <h1
          className="font-hero"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 12,
            letterSpacing: '-0.02em',
          }}
        >
          {project.title}
        </h1>

        {/* Optional Tagline */}
        {project.tagline && (
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--accent-violet)',
              fontWeight: 500,
              marginBottom: 20,
            }}
          >
            {project.tagline}
          </p>
        )}
      </ScrollReveal>

      {/* Key Meta Details (Role & Problem) */}
      {(project.role || project.problem) && (
        <ScrollReveal>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: project.role && project.problem ? '1fr 1fr' : '1fr',
              gap: 16,
              margin: '24px 0 32px',
            }}
            className="project-meta-grid"
          >
            {project.role && (
              <div
                className="glass-card"
                style={{ padding: 20, borderLeft: '3px solid var(--accent-violet)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, color: 'var(--accent-violet)' }}>
                  <Briefcase size={16} />
                  <span className="font-heading" style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    My Role
                  </span>
                </div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>{project.role}</p>
              </div>
            )}

            {project.problem && (
              <div
                className="glass-card"
                style={{ padding: 20, borderLeft: '3px solid var(--accent-cyan)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, color: 'var(--accent-cyan)' }}>
                  <AlertCircle size={16} />
                  <span className="font-heading" style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Problem Solved
                  </span>
                </div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>{project.problem}</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      )}

      {/* Description */}
      <ScrollReveal>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 36 }}>
          {project.description}
        </p>
      </ScrollReveal>

      {/* Tech Stack */}
      <ScrollReveal>
        <h2 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 14 }}>
          Tech Stack
        </h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
          {(project.tech_stack || []).map((tech) => (
            <span
              key={tech.name}
              className="font-mono"
              style={{
                fontSize: '0.82rem',
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

      {/* Key Features */}
      {project.features && project.features.length > 0 && (
        <ScrollReveal>
          <h2 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 14 }}>
            Key Features & Engineering Highlights
          </h2>
          <div className="glass-card" style={{ padding: 28, marginBottom: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {project.features.map((line, i) => {
                const text = line.trim();
                if (!text) return null;

                if (text.startsWith('#')) {
                  const headingText = text.replace(/^#+\s*/, '');
                  return (
                    <h3
                      key={i}
                      className="font-heading"
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: 'var(--accent-violet)',
                        marginTop: i > 0 ? 16 : 0,
                      }}
                    >
                      {headingText}
                    </h3>
                  );
                }

                if (text === '---') {
                  return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />;
                }

                const itemText = text.replace(/^-\s*/, '');
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                    <span style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: 1 }}>→</span>
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
          <h2 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 14 }}>
            Visual Showcase
          </h2>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 14, marginBottom: 40 }}>
            {project.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${project.title} screenshot ${i + 1}`}
                loading="lazy"
                style={{
                  height: 220,
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

      {/* Action Links */}
      <ScrollReveal>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 60 }}>
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: 'none' }}
            >
              <IconExternalLink size={16} /> Live Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              <IconGithub size={16} /> View on GitHub
            </a>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
