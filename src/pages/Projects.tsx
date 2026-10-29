import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useDataStore } from '../stores/useDataStore';
import { api } from '../lib/api';
import type { Project } from '../lib/supabase';
import { DEMO_PROJECTS } from '../lib/data';

const CATEGORIES = ['All', 'AI', 'Full Stack', 'Web'];

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

  // Filter projects by category
  const filtered = useMemo(() => {
    if (activeFilter === 'All') return allProjects;
    return allProjects.filter((p) =>
      p.category
        ? p.category.some((c) => c.toLowerCase().includes(activeFilter.toLowerCase()))
        : false
    );
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

  return (
    <div className="section-container pt-20">
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="hk">Selected Work</span>
            <h2 className="big text-4xl sm:text-5xl mt-2">
              Engineering <em>Reel</em>
            </h2>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-200 ${
                  activeFilter === cat
                    ? 'bg-[#2C3480] text-white border border-[#7686f0]'
                    : 'border border-[var(--hair)] text-[var(--ink2)] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
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
          {/* Left: Project List with timed border */}
          <div className="rlist" id="rlist">
            {filtered.map((proj, i) => {
              const isActive = i === rcur;
              return (
                <button
                  key={proj.id || proj.slug || i}
                  type="button"
                  data-prog-controlled="true"
                  onClick={() => handleSelectProject(i)}
                  className={`ritem card ${isActive ? 'active' : ''}`}
                  style={
                    {
                      '--prog': isActive ? rp.toFixed(1) : '0',
                    } as React.CSSProperties
                  }
                >
                  <div className="n">{proj.title}</div>
                  <div className="c">{proj.category?.[0] || 'Full Stack Application'}</div>
                </button>
              );
            })}
          </div>

          {/* Right: Big Project Panel Preview */}
          <div className="card rpanel" id="rpanel" data-reel-panel="true">
            <div className={`pane ${isSwapping ? 'swap' : ''}`}>
              {/* Media Container */}
              <div className="art">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={activeProject.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--bg2)]">
                    <span className="font-heading text-6xl text-[var(--amber)] opacity-30 font-black">
                      {activeProject.title?.charAt(0) || 'P'}
                    </span>
                  </div>
                )}
                <span className="cat">{primaryCategory}</span>
                <div className="big-n">{activeProject.title}</div>
              </div>

              {/* Project Body */}
              <div className="pbody">
                <div className="ttl">{activeProject.title}</div>

                <p className="vs text-base leading-relaxed">
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
                  <div className="fact">
                    <b>{activeProject.featured ? 'Featured' : 'Shipped'}</b>
                    <span>Release Status</span>
                  </div>
                  <div className="fact">
                    <b>{activeProject.tech_stack?.length || 4}+</b>
                    <span>Core Technologies</span>
                  </div>
                  <div className="fact">
                    <b>100%</b>
                    <span>Responsive & Safe</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pb-actions pt-2">
                  <Link
                    to={`/project/${activeProject.slug}`}
                    className="hbtn p"
                  >
                    View Project Details
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>

                  {activeProject.live_url && (
                    <a
                      href={activeProject.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hbtn"
                    >
                      Live Demo
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                    </a>
                  )}

                  {activeProject.github_url && (
                    <a
                      href={activeProject.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hbtn"
                    >
                      Source Code
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
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
