import { useState, useMemo, useEffect, useRef } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useDataStore } from '../stores/useDataStore';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { safeJsonParse } from '../lib/safeJson';
import {
  DEFAULT_ABOUT_STATS,
  type DriveCardItem,
  type StatItem,
} from '../lib/constants';

const DEFAULT_VALUES = [
  {
    n: 'Problem Solving',
    t: 'Start from first principles. Break hard requirements down to inputs, transforms, and verified outputs before writing code.',
    pf: 'InstitutePulse',
    proof_type: 'project',
    proof_id: 'institutepulse',
    ic: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
  },
  {
    n: 'Creativity',
    t: 'Interfaces should feel physical and clear. Every micro-motion must serve comprehension, not decoration.',
    pf: 'GCL Auction UI',
    proof_type: 'project',
    proof_id: 'gcl-gen-code-league',
    ic: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  },
  {
    n: 'Innovation',
    t: 'Use AI only where it removes real work. Clean pipelines, strict schema enforcement, deterministic contracts.',
    pf: 'Suraksha.pro',
    proof_type: 'project',
    proof_id: 'suraksha-pro',
    ic: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    n: 'Leadership',
    t: 'Decisive ownership in high-stakes environments. Lead from the front, unblock the team, document the why.',
    pf: 'Lead Organizer',
    proof_type: 'experience',
    proof_id: 'lead-organizer',
    ic: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  },
];

export default function About() {
  const settings = useSettingsStore((s) => s.settings);
  const projects = useDataStore((s) => s.projects);
  const setSelectedProjectId = useDataStore((s) => s.setSelectedProjectId);

  // Dynamic values parsed safely from settings with fallback
  const driveCards = useMemo(() => {
    const raw = safeJsonParse<DriveCardItem[]>(settings.drive_cards, []);
    if (raw && raw.length >= 3) {
      return raw.map((item, i) => ({
        n: item.title,
        t: item.statement,
        proof_type: item.proof_type || (item.title?.toLowerCase().includes('lead') ? 'experience' : 'project'),
        proof_id: item.proof_id || item.project_slug || '',
        pf: item.proof_label || 'View Work',
        ic: DEFAULT_VALUES[i % DEFAULT_VALUES.length].ic,
      }));
    }
    return DEFAULT_VALUES;
  }, [settings.drive_cards]);

  // Stacked cards state
  const [sFront, setSFront] = useState(0);
  const [sHover, setSHover] = useState(false);
  const [sp2, setSp2] = useState(0);
  const stackRef = useRef<HTMLDivElement>(null);

  // 3D Tilt on Stack
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const el = stackRef.current;
    if (!el) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({
        rx: Number((x * 12).toFixed(2)),
        ry: Number((-y * 12).toFixed(2)),
      });
    };

    const handlePointerLeave = () => setTilt({ rx: 0, ry: 0 });

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  // Auto-cycle stacked window cards (~5.5s)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let rafId: number;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;

      if (!sHover && driveCards.length > 1) {
        setSp2((prev) => {
          const next = prev + (dt / 5500) * 100;
          if (next >= 100) {
            setSFront((curr) => (curr + 1) % driveCards.length);
            return 0;
          }
          return next;
        });
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [sHover, driveCards.length]);

  const selectCard = (index: number) => {
    setSFront(index);
    setSp2(0);
  };

  const handleProofClick = (proofType: string, proofId: string) => {
    if (proofType === 'experience') {
      const expEl = document.getElementById('experience');
      if (expEl) {
        expEl.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const item = document.querySelector(`[data-exp-id="${proofId}"]`);
          if (item) {
            item.classList.add('glow-highlight');
            setTimeout(() => item.classList.remove('glow-highlight'), 2500);
          }
        }, 600);
        return;
      }
    }

    if (proofType === 'project') {
      const projEl = document.getElementById('projects');
      if (projEl) {
        setSelectedProjectId(proofId);
        window.history.pushState(null, '', `#project=${proofId}`);
        projEl.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const el = document.getElementById(proofId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Safe parse About stats
  const stats = useMemo<StatItem[]>(() => {
    let raw: StatItem[] = [];
    if (settings.about_stats) {
      raw = safeJsonParse<StatItem[]>(settings.about_stats, []);
    }
    if (!raw || raw.length === 0) {
      raw = DEFAULT_ABOUT_STATS;
    }
    return raw
      .map((item) => {
        if (item.label.toLowerCase().includes('project') && projects.length > 0) {
          return { ...item, value: projects.length };
        }
        return item;
      })
      .filter((st) => {
        const lbl = (st.label || '').trim().toLowerCase();
        if (!lbl || lbl.includes('new stat') || lbl.includes('new_stat')) return false;
        const val = String(st.value ?? '').trim();
        if (!val || val === '0') return false;
        return true;
      });
  }, [settings.about_stats, projects.length]);

  return (
    <div className="section-container sec py-16 sm:py-24">
      {/* ─── About Story & Philosophy ─── */}
      <ScrollReveal>
        <div className="sh mb-8">
          <span className="eyebrow">About</span>
          <h2>DESIGNING SYSTEMS WITH INTENT</h2>
        </div>

        <div className="about">
          {/* Bio paragraph with generous bottom margin */}
          <div className="bio mb-12 sm:mb-16">
            <p className="vs font-body text-base sm:text-lg leading-relaxed text-[var(--ink2)] max-w-4xl">
              {settings.about_text ||
                "I'm an engineer who cares deeply about the intersection of human workflows and deterministic architecture. From building live sports auction consoles to campus operations platforms and AI assistants, I build systems that are responsive, accessible, and resilient under real-world pressure."}
            </p>
          </div>

          {/* Mini Stats: Generous gap above 1200+ and all 4 in ONE line */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-14 sm:mt-18 mb-20 sm:mb-28 w-full">
            {stats.slice(0, 4).map((st) => (
              <div
                key={st.label}
                className="card p-6 sm:p-7 flex flex-col items-center justify-center text-center rounded-2xl border border-[var(--hair)] transition-all duration-300 hover:border-[#7686f0] hover:shadow-[0_10px_30px_rgba(44,52,128,0.3)]"
              >
                <b className="font-display text-4xl sm:text-5xl font-black text-[var(--amber)] leading-none">
                  <AnimatedCounter target={st.value} suffix={st.suffix || ''} />
                </b>
                <span className="text-xs font-mono tracking-widest uppercase text-[var(--ink2)] mt-2.5 block">
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* ─── What Drives Me: Original 2-Column with Centered 3D Card Stack ─── */}
      <ScrollReveal delay={0.1}>
        <div className="vals mt-16 sm:mt-24 mb-16 sm:mb-20">
          {/* Left Values List (Preserved original 2-column) */}
          <div className="vleft">
            <div className="sh mb-6">
              <span className="eyebrow">Values</span>
              <h2>WHAT DRIVES ME</h2>
              <p className="vs text-sm sm:text-base text-[var(--ink2)]" style={{ maxWidth: '40ch' }}>
                Four things I hold myself to on every project. Pick one to see where it shows up in my work.
              </p>
            </div>

            <div className="vlist">
              {driveCards.map((v, i) => (
                <button
                  key={v.n}
                  type="button"
                  onClick={() => selectCard(i)}
                  className={`vl ${i === sFront ? 'on' : ''}`}
                >
                  <span>{v.n}</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Right Stacked Window Cards with 3D Tilt - Centered inside column */}
          <div className="stackwrap">
            <div
              ref={stackRef}
              id="stack"
              className="stack"
              onPointerEnter={() => setSHover(true)}
              onPointerLeave={() => setSHover(false)}
              style={
                {
                  '--rx': `${tilt.rx}deg`,
                  '--ry': `${tilt.ry}deg`,
                } as React.CSSProperties
              }
            >
              {driveCards.map((v, i) => {
                const pos = (i - sFront + driveCards.length) % driveCards.length;
                const posStr = pos > 2 ? 'h' : String(pos);
                const isFront = pos === 0;

                return (
                  <div
                    key={v.n}
                    className="card scr"
                    data-pos={posStr}
                    data-prog-controlled="true"
                    role="button"
                    tabIndex={pos > 2 ? -1 : 0}
                    aria-label={`Show ${v.n}`}
                    onClick={() => selectCard(i)}
                    style={
                      {
                        '--c1': '#7686f0',
                        '--prog': isFront ? sp2.toFixed(1) : posStr === 'h' ? '0' : '100',
                      } as React.CSSProperties
                    }
                  >
                    <div className="in">
                      <div className="tb">
                        <i />
                        <i />
                        <i />
                        <span>what drives me · 0{i + 1}</span>
                      </div>

                      <div className="vc">
                        <div className="vi">
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d={v.ic} />
                          </svg>
                        </div>

                        <div className="vt">{v.n}</div>
                        <p className="vs">{v.t}</p>

                        <div className="vp">
                          <span className="text-xs font-mono tracking-wider uppercase text-muted">
                            Proof
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProofClick(v.proof_type || 'project', v.proof_id || 'projects');
                            }}
                            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 underline tracking-wide uppercase transition-colors cursor-pointer"
                          >
                            {v.pf} →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Value Proof Caption Under Stack */}
            <div className="note mt-3 font-mono text-xs text-[var(--ink2)] text-center">
              VALUE {driveCards[sFront]?.n} · Proof: {driveCards[sFront]?.pf}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
