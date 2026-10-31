import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useDataStore } from '../stores/useDataStore';
import { api } from '../lib/api';
import type { Project } from '../lib/supabase';
import { DEMO_PROJECTS } from '../lib/data';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const storeProjects = useDataStore((s) => s.projects);
  const setProjects = useDataStore((s) => s.setProjects);

  useEffect(() => {
    if (storeProjects.length === 0) {
      api.projects
        .getVisible()
        .then((data) => {
          setProjects(data && data.length > 0 ? data : DEMO_PROJECTS);
        })
        .catch(() => setProjects(DEMO_PROJECTS));
    }
  }, [storeProjects.length, setProjects]);

  const allProjects = storeProjects.length > 0 ? storeProjects : DEMO_PROJECTS;

  // Build dynamic categories from real projects with user preferred defaults
  const categories = useMemo(() => {
    const defaults = ['All', 'AI', 'Full Stack', 'Web'];
    allProjects.forEach((p) => {
      if (Array.isArray(p.category)) {
        p.category.forEach((c) => {
          const t = c.trim();
          if (t && !defaults.some((d) => d.toLowerCase() === t.toLowerCase())) {
            defaults.push(t);
          }
        });
      }
    });
    return defaults;
  }, [allProjects]);

  // Filter projects by category with intelligent matching so it NEVER breaks
  const filtered = useMemo(() => {
    if (activeFilter.toLowerCase() === 'all') return allProjects;
    const fLower = activeFilter.toLowerCase();
    const res = allProjects.filter((p) => {
      const cats = Array.isArray(p.category) ? p.category.map((c) => c.toLowerCase()) : [];
      const techs = Array.isArray(p.tech_stack) ? p.tech_stack.map((t) => t.name.toLowerCase()) : [];

      if (fLower === 'full stack') {
        return (
          cats.some((c) => c.includes('full') || c.includes('web') || c.includes('dash')) ||
          techs.some((t) => ['react', 'node', 'supabase', 'postgresql'].includes(t))
        );
      }
      if (fLower === 'web') {
        return cats.some((c) => c.includes('web')) || techs.some((t) => ['react', 'html', 'css', 'vite'].includes(t));
      }
      if (fLower === 'ai') {
        return cats.some((c) => c.includes('ai')) || techs.some((t) => t.includes('ai') || t.includes('claude'));
      }
      return (
        cats.some((c) => c.includes(fLower) || fLower.includes(c)) ||
        techs.some((t) => t.includes(fLower))
      );
    });
    return res.length > 0 ? res : allProjects;
  }, [activeFilter, allProjects]);

  // Reel active index and progress timer
  const [rcur, setRcur] = useState(0);
  const [rp, setRp] = useState(0);
  const [rHover, setRHover] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // Keep index in bounds when filter changes
  useEffect(() => {
    setRcur(0);
    setRp(0);
  }, [activeFilter]);

  const activeProject = filtered[rcur] || filtered[0] || ({} as Project);

  // Auto-advance loop (~6.5s)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let rafId: number;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;

      if (!rHover && filtered.length > 1) {
        setRp((prev) => {
          const next = prev + (dt / 6500) * 100;
          if (next >= 100) {
            handleSelectProject((rcur + 1) % filtered.length);
            return 0;
          }
          return next;
        });
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [rHover, rcur, filtered.length]);

  const selectedProjectId = useDataStore((s) => s.selectedProjectId);
  const setSelectedProjectId = useDataStore((s) => s.setSelectedProjectId);

  // Deep linking and external selection support (#project= or openProject helper)
  useEffect(() => {
    if (!selectedProjectId || filtered.length === 0) return;
    const targetIdx = filtered.findIndex(
      (p) =>
        p.id === selectedProjectId ||
        p.slug === selectedProjectId ||
        p.title?.toLowerCase().includes(selectedProjectId.toLowerCase())
    );
    if (targetIdx !== -1) {
      handleSelectProject(targetIdx);
      setSelectedProjectId(null);
    }
  }, [selectedProjectId, filtered]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#project=')) {
      const slug = hash.replace('#project=', '').toLowerCase();
      const targetIdx = filtered.findIndex(
        (p) =>
          p.id?.toLowerCase() === slug ||
          p.slug?.toLowerCase() === slug ||
          p.title?.toLowerCase().includes(slug)
      );
      if (targetIdx !== -1) {
        handleSelectProject(targetIdx);
      }
    }
  }, [filtered]);

  const handleSelectProject = (index: number) => {
    if (index === rcur) return;
    setIsSwapping(true);
    setRp(0);
    setTimeout(() => {
      setRcur(index);
      setIsSwapping(false);
    }, 150);
  };

  const coverImage = activeProject.images?.[0] || '';
  const primaryCategory = activeProject.category?.[0] || 'Production Application';
  const displayTitle = (activeProject.title || '')
    .replace(/\bINSTITUTEPLUSE\b/gi, 'InstitutePulse')
    .replace(/\bInstitute\s+Pulse\b/gi, 'InstitutePulse')
    .replace(/\bSuraksha\s+\.pro\b/gi, 'Suraksha.pro');

  const projectMetrics: Array<{ label: string; value: string }> =
    (activeProject as any).metrics && Array.isArray((activeProject as any).metrics) && (activeProject as any).metrics.length > 0
      ? (activeProject as any).metrics
      : [
          { label: 'Release Status', value: activeProject.featured ? 'Featured' : 'Shipped' },
          { label: 'Core Technologies', value: `${activeProject.tech_stack?.length || 4}+` },
          { label: 'Engineering Quality', value: 'Production' },
        ];

  return (
    <div className="section-container sec pt-10 sm:pt-16 pb-16 sm:pb-24">
      <ScrollReveal>
        <div className="sh flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2>PROJECTS</h2>
          </div>

          {/* Category Chips right-aligned on baseline matching nav button style */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeFilter.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className="px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer"
                  style={{
                    color: isActive ? '#ffffff' : 'var(--ink2)',
                    background: isActive ? 'rgba(44, 52, 128, 0.7)' : 'rgba(255, 255, 255, 0.04)',
                    border: isActive ? '1px solid rgba(118, 134, 240, 0.4)' : '1px solid var(--hair)',
                    boxShadow: isActive ? '0 2px 10px rgba(44, 52, 128, 0.4)' : 'none',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Projects Reel Layout */}
      <ScrollReveal delay={0.08}>
        <div
          className="reel"
          onPointerEnter={() => setRHover(true)}
          onPointerLeave={() => setRHover(false)}
        >
          {/* Left: Project List with uniform 72px items and 14px radius */}
          <div className="rlist" id="rlist">
            {filtered.map((proj, i) => {
              const isActive = i === rcur;
              const pTitle = (proj.title || '')
                .replace(/\bINSTITUTEPLUSE\b/gi, 'InstitutePulse')
                .replace(/\bInstitute\s+Pulse\b/gi, 'InstitutePulse')
                .replace(/\bSuraksha\s+\.pro\b/gi, 'Suraksha.pro');

              return (
                <button
                  key={proj.id || proj.slug || i}
                  type="button"
                  data-prog-controlled="true"
                  onClick={() => handleSelectProject(i)}
                  className={`ritem card h-[72px] min-h-[72px] rounded-[14px] px-4 py-2.5 text-left flex flex-col justify-center gap-0.5 cursor-pointer ${isActive ? 'active' : ''}`}
                  style={
                    {
                      '--prog': isActive ? rp.toFixed(1) : '0',
                    } as React.CSSProperties
                  }
                >
                  <div className="n text-base sm:text-lg font-display font-black uppercase text-[var(--ink)] truncate">{pTitle}</div>
                  <div className="c text-xs font-mono text-[var(--ink2)] truncate">{proj.category?.[0] || 'Full Stack Application'}</div>
                </button>
              );
            })}
          </div>

          {/* Right: Big Project Panel Preview */}
          <div className="card rpanel" id="rpanel" data-reel-panel="true">
            <div className={`pane ${isSwapping ? 'swap' : ''}`}>
              {/* Media Container: 16/10 aspect ratio without outlined white text */}
              <div className="art relative aspect-[16/10] overflow-hidden rounded-[10px]">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={displayTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--bg2)]">
                    <span className="font-heading text-6xl text-[var(--amber)] opacity-30 font-black">
                      {displayTitle.charAt(0) || 'P'}
                    </span>
                  </div>
                )}
                {/* Bottom-left glass chip with cobalt tint */}
                <div
                  className="absolute left-3.5 bottom-3.5 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.2)] text-[13px] font-body font-medium text-white z-10"
                  style={{
                    background: 'rgba(44, 52, 128, 0.75)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  {primaryCategory}
                </div>
              </div>

              {/* Project Body */}
              <div className="pbody">
                <div className="ttl font-display text-2xl sm:text-4xl font-black uppercase tracking-wide text-[var(--ink)]">
                  {displayTitle}
                </div>

                <p className="vs font-body text-base leading-relaxed text-[var(--ink2)]">
                  {activeProject.description ||
                    'Comprehensive full-stack architecture engineered for performance, security, and exceptional user delight.'}
                </p>

                {/* Tech Chips */}
                {activeProject.tech_stack && activeProject.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeProject.tech_stack.map((tech) => (
                      <span
                        key={tech.name}
                        className="px-2.5 py-1 rounded text-xs font-mono border border-[var(--hair)] text-[var(--ink2)]"
                        style={{ background: 'rgba(var(--glow-rgb), 0.06)' }}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Metric Facts Bento */}
                <div className="facts">
                  {projectMetrics.map((met, idx) => (
                    <div key={idx} className="fact">
                      <b>{met.value}</b>
                      <span>{met.label}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons: 46px height, nowrap, 16px SVG */}
                <div className="pb-actions pt-2 flex flex-wrap gap-3">
                  <Link
                    to={`/project/${activeProject.slug}`}
                    className="btn primary h-[46px] px-6 whitespace-nowrap"
                  >
                    View Project Details
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  {activeProject.live_url && (
                    <a
                      href={activeProject.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn h-[46px] px-6 whitespace-nowrap"
                    >
                      Live Demo
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                    </a>
                  )}

                  {activeProject.github_url && (
                    <a
                      href={activeProject.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn h-[46px] px-6 whitespace-nowrap"
                    >
                      Source Code
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
