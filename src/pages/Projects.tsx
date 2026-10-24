import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useDataStore } from '../stores/useDataStore';
import { api } from '../lib/api';
import type { Project } from '../lib/supabase';
import { IconGithub, IconExternalLink } from '../components/ui/Icons';
import { Sparkles, Layers } from 'lucide-react';

const CATEGORIES = ['All', 'AI', 'Web Apps', 'Dashboards', 'Mobile'];

interface ExtendedProject extends Project {
  tagline?: string;
  role?: string;
  problem?: string;
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Read from cached data store
  const storeProjects = useDataStore((s) => s.projects);
  const setProjects = useDataStore((s) => s.setProjects);
  const [localLoading, setLocalLoading] = useState(storeProjects.length === 0);

  useEffect(() => {
    if (storeProjects.length === 0) {
      api.projects
        .getVisible()
        .then((data) => {
          setProjects(data);
        })
        .catch(console.error)
        .finally(() => setLocalLoading(false));
    } else {
      setLocalLoading(false);
    }
  }, [storeProjects.length, setProjects]);

  // Order with featured projects first
  const sortedProjects = useMemo(() => {
    const list = [...(storeProjects as ExtendedProject[])];
    return list.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (a.order_index ?? 0) - (b.order_index ?? 0);
    });
  }, [storeProjects]);

  // Filter logic
  const filtered = useMemo(() => {
    let result = sortedProjects;
    if (activeFilter !== 'All') {
      result = result.filter((p) => p.category?.includes(activeFilter));
    }
    // If not in showAll mode and activeFilter is 'All', limit to 4 featured/top projects
    if (!showAll && activeFilter === 'All' && result.length > 4) {
      return result.slice(0, 4);
    }
    return result;
  }, [activeFilter, sortedProjects, showAll]);

  const hasMoreThanFour = sortedProjects.length > 4 && activeFilter === 'All';

  return (
    <div className="section-container" style={{ paddingTop: 100 }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2
            className="font-hero"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}
          >
            Featured <span className="neon-text">Projects</span>
          </h2>
          <p className="font-heading" style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 520, margin: '0 auto' }}>
            Production-grade systems, AI workflows, and digital experiences shipped with precision.
          </p>
        </div>
      </ScrollReveal>

      {/* Filter Chips */}
      <ScrollReveal>
        <div
          style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            paddingBottom: 8,
            marginBottom: 36,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`chip ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => {
                setActiveFilter(cat);
                setShowAll(true);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Project Cards Grid */}
      {localLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <p className="font-heading" style={{ fontSize: '1rem' }}>Loading projects...</p>
        </div>
      ) : (
        <>
          <motion.div
            layout
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 24,
              maxWidth: 1200,
              margin: '0 auto',
              justifyContent: 'center', // Centers orphan last row
            }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => {
                const isImgLoaded = loadedImages[project.id];
                const coverImage =
                  project.images && project.images.length > 0
                    ? project.images[0]
                    : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800';

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] as const }}
                    whileHover={{ y: -6 }}
                    className="project-card-wrapper"
                    style={{
                      borderRadius: 16,
                      flex: '1 1 340px',
                      maxWidth: '560px',
                      minWidth: '300px',
                    }}
                  >
                    <div
                      className="glass-card"
                      style={{
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        borderTop: project.featured
                          ? '2px solid var(--accent-violet)'
                          : '1px solid var(--border-color)',
                      }}
                    >
                      {/* 16:10 Uniform Thumbnail */}
                      <Link
                        to={`/project/${project.slug}`}
                        style={{
                          textDecoration: 'none',
                          color: 'inherit',
                          display: 'block',
                          position: 'relative',
                          overflow: 'hidden',
                          aspectRatio: '16/10',
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.03)',
                        }}
                      >
                        {/* Skeleton placeholder */}
                        {!isImgLoaded && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 75%)',
                              backgroundSize: '200% 100%',
                              animation: 'shimmer 1.8s infinite',
                            }}
                          />
                        )}

                        <motion.img
                          src={coverImage}
                          alt={project.title}
                          loading="lazy"
                          onLoad={() => setLoadedImages((prev) => ({ ...prev, [project.id]: true }))}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            opacity: isImgLoaded ? 1 : 0,
                            transition: 'opacity 0.3s ease, transform 0.5s ease',
                          }}
                          whileHover={{ scale: 1.05 }}
                        />

                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(5,5,10,0.85) 0%, transparent 60%)',
                            pointerEvents: 'none',
                          }}
                        />

                        {/* Featured Badge: Shown ONLY when project.featured is true */}
                        {project.featured && (
                          <div
                            className="font-accent"
                            style={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              background: 'rgba(108, 99, 255, 0.92)',
                              backdropFilter: 'blur(8px)',
                              color: '#fff',
                              padding: '4px 10px',
                              borderRadius: 6,
                              fontSize: '0.65rem',
                              letterSpacing: '1px',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <Sparkles size={11} />
                            FEATURED
                          </div>
                        )}
                      </Link>

                      {/* Content Area */}
                      <div
                        style={{
                          padding: '24px',
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1,
                        }}
                      >
                        {/* Categories */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                          {(project.category || []).map((cat) => (
                            <span
                              key={cat}
                              className="font-mono"
                              style={{
                                fontSize: '0.7rem',
                                color: 'var(--accent-cyan)',
                                background: 'rgba(0, 245, 212, 0.08)',
                                padding: '2px 8px',
                                borderRadius: 4,
                              }}
                            >
                              {cat}
                            </span>
                          ))}
                        </div>

                        {/* Title linking to details */}
                        <Link to={`/project/${project.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <h3
                            className="font-heading"
                            style={{
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              marginBottom: 6,
                              color: 'var(--text-primary)',
                              lineHeight: 1.3,
                            }}
                          >
                            {project.title}
                          </h3>
                        </Link>

                        {/* Optional Tagline (Phase 7 field) */}
                        {project.tagline && (
                          <p
                            style={{
                              color: 'var(--accent-violet)',
                              fontSize: '0.85rem',
                              fontWeight: 500,
                              marginBottom: 8,
                            }}
                          >
                            {project.tagline}
                          </p>
                        )}

                        {/* Description */}
                        <p
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.88rem',
                            lineHeight: 1.6,
                            marginBottom: 16,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {project.description}
                        </p>

                        {/* Optional Role or Problem snippets */}
                        {project.role && (
                          <div
                            style={{
                              fontSize: '0.78rem',
                              color: 'var(--text-secondary)',
                              marginBottom: 10,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Role:</span>
                            <span>{project.role}</span>
                          </div>
                        )}

                        {/* Tech Stack Tags */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                          {(project.tech_stack || []).slice(0, 4).map((tech) => (
                            <span
                              key={tech.name}
                              className="font-mono"
                              style={{
                                fontSize: '0.72rem',
                                padding: '3px 9px',
                                borderRadius: 6,
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {tech.name}
                            </span>
                          ))}
                        </div>

                        {/* Card Actions: Details, Live, GitHub */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 'auto',
                            paddingTop: 14,
                            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                          }}
                        >
                          <Link
                            to={`/project/${project.slug}`}
                            className="font-heading"
                            style={{
                              textDecoration: 'none',
                              color: 'var(--accent-violet)',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            Case Study →
                          </Link>

                          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: 'var(--text-secondary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                                title="View on GitHub"
                                aria-label={`${project.title} GitHub repository`}
                              >
                                <IconGithub size={18} />
                              </a>
                            )}
                            {project.live_url && (
                              <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: 'var(--text-secondary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                                title="Live Demo"
                                aria-label={`${project.title} live demo`}
                              >
                                <IconExternalLink size={18} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* "View All Projects" toggle on Home */}
          {hasMoreThanFour && !showAll && (
            <div style={{ textAlign: 'center', marginTop: 36 }}>
              <button
                onClick={() => setShowAll(true)}
                className="btn-secondary"
                style={{ padding: '10px 24px', fontSize: '0.9rem' }}
              >
                <Layers size={16} /> View All Projects ({sortedProjects.length})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
