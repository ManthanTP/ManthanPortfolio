import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
    n: 'Problem solving',
    t: 'Take a messy real-world workflow, find the one decision that unblocks it, and turn that into a system people trust.',
    proof_type: 'project',
    proof_id: 'institutepulse',
    pf: 'InstitutePulse',
    ic: 'M3 19a2 2 0 104 0 2 2 0 10-4 0M17 5a2 2 0 104 0 2 2 0 10-4 0M7 19c6 0 4-10 10-14',
  },
  {
    n: 'Creativity',
    t: 'Interfaces that feel designed, not assembled. Balancing fluid motion with crisp predictability.',
    proof_type: 'project',
    proof_id: 'pocket-ledger',
    pf: 'Pocket Ledger',
    ic: 'M12 3l7 7-7 11-7-11 7-7zM12 3v9',
  },
  {
    n: 'Innovation',
    t: 'Use AI only where it removes real work. Connecting LLM tool-calling to verifiable operational bottlenecks.',
    proof_type: 'project',
    proof_id: 'meditrip',
    pf: 'Meditrip',
    ic: 'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z',
  },
  {
    n: 'Leadership',
    t: 'Own the technical delivery when teammates and live production events rely on it under zero-tolerance latency.',
    proof_type: 'experience',
    proof_id: 'gcl',
    pf: 'GCL live auction',
    ic: 'M5 21V4M5 4h11l-2 4 2 4H5',
  },
];

export default function About() {
  const navigate = useNavigate();
  const settings = useSettingsStore((s) => s.settings);
  const projects = useDataStore((s) => s.projects);
  const openProject = useDataStore((s) => s.openProject);

  // Safe parse What Drives Me cards or fallback
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
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      setTilt({ rx: parseFloat((dx * 16).toFixed(1)), ry: parseFloat((-dy * 16).toFixed(1)) });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Timer loop for auto-advance (~6s)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let rafId: number;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;

      if (!sHover) {
        setSp2((prev) => {
          const next = prev + (dt / 6000) * 100;
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
      const el = document.getElementById('experience');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      // Glow pulse animation on matching experience item
      setTimeout(() => {
        const item = document.querySelector(`[data-exp-id="${proofId}"]`) || document.querySelector('#experience article');
        if (item) {
          item.classList.add('glow-highlight');
          setTimeout(() => item.classList.remove('glow-highlight'), 1600);
        }
      }, 350);
      return;
    }

    if (proofType === 'project') {
      openProject(proofId, navigate);
      return;
    }

    // Fallback: scroll to element by ID
    const el = document.getElementById(proofId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Safe parse About stats (filtering out empty, zero, or "New Stat" defaults)
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
        if (item.label.toLowerCase().includes('project')) {
          return { ...item, value: projects.length > 0 ? projects.length : item.value };
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
    <div className="section-container sec">
      {/* ─── About Story & Philosophy ─── */}
      <ScrollReveal>
        <div className="sh">
          <span className="eyebrow">About</span>
          <h2>DESIGNING SYSTEMS WITH INTENT</h2>
        </div>

        <div className="about">
          <div className="bio">
            <p className="vs font-body text-base sm:text-lg leading-relaxed text-[var(--ink2)]">
              {settings.about_text ||
                "I'm an engineer who cares deeply about the intersection of human workflows and deterministic architecture. From building live sports auction consoles to campus operations platforms and AI assistants, I build systems that are responsive, accessible, and resilient under real-world pressure."}
            </p>
          </div>

          {/* Mini Stats: All boxes in ONE row with generous padding and centered text */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-10 mb-8 w-full">
            {stats.slice(0, 4).map((st) => (
              <div
                key={st.label}
                className="card p-6 sm:p-7 flex flex-col items-center justify-center text-center rounded-[16px] border border-[var(--hair)] transition-all duration-300 hover:border-[var(--amber)] hover:shadow-[0_10px_30px_rgba(44,52,128,0.25)]"
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

      {/* ─── What Drives Me: Stack of Value Screens with generous top & bottom margins ─── */}
      <ScrollReveal delay={0.1}>
        <div className="vals mt-16 sm:mt-24 mb-16 sm:mb-20">
          {/* Left Values List */}
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

          {/* Right Stacked Window Cards with 3D Tilt */}
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
                            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 underline tracking-wide uppercase transition-colors"
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
            <div className="note mt-3 font-mono text-xs text-[var(--ink2)] text-center sm:text-left">
              VALUE {driveCards[sFront]?.n} · Proof: {driveCards[sFront]?.pf}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
