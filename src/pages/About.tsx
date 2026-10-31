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
    if (reduce || sHover || driveCards.length <= 1) return;

    const interval = setInterval(() => {
      setSFront((curr) => (curr + 1) % driveCards.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [sHover, driveCards.length]);

  const selectCard = (index: number) => {
    setSFront(index);
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

      {/* ─── What Drives Me: Stack of Value Screens Centered in the middle ─── */}
      <ScrollReveal delay={0.1}>
        <div className="mt-16 sm:mt-24 mb-16 sm:mb-20 flex flex-col items-center text-center">
          {/* Centered Heading */}
          <div className="sh text-center flex flex-col items-center mb-8">
            <span className="eyebrow">Values</span>
            <h2 className="text-center">WHAT DRIVES ME</h2>
            <p className="vs text-center max-w-xl text-sm sm:text-base text-[var(--ink2)] mt-2">
              Four things I hold myself to on every project. Select any value to explore where it shows up.
            </p>
          </div>

          {/* Centered Value Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 w-full max-w-3xl">
            {driveCards.map((v, i) => (
              <button
                key={v.n}
                type="button"
                onClick={() => selectCard(i)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  i === sFront
                    ? 'bg-[#2C3480] text-white font-bold border border-[#7686f0]/60 shadow-[0_4px_16px_rgba(44,52,128,0.5)] scale-105'
                    : 'bg-white/5 text-[var(--ink2)] hover:text-white hover:bg-white/10 border border-[var(--hair)]'
                }`}
              >
                <span>{v.n}</span>
                <span className="opacity-60 text-[10px]">0{i + 1}</span>
              </button>
            ))}
          </div>

          {/* Centered Card Stage */}
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
            <div
              ref={stackRef}
              id="stack"
              className="relative w-full h-[320px] sm:h-[340px]"
              onPointerEnter={() => setSHover(true)}
              onPointerLeave={() => setSHover(false)}
              style={
                {
                  '--rx': `${tilt.rx}deg`,
                  '--ry': `${tilt.ry}deg`,
                  perspective: '1000px',
                } as React.CSSProperties
              }
            >
              {driveCards.map((v, i) => {
                const pos = (i - sFront + driveCards.length) % driveCards.length;

                const translateY = pos === 0 ? 0 : pos === 1 ? 14 : pos === 2 ? 28 : 50;
                const scale = pos === 0 ? 1 : pos === 1 ? 0.96 : pos === 2 ? 0.92 : 0.85;
                const opacity = pos === 0 ? 1 : pos === 1 ? 0.65 : pos === 2 ? 0.35 : 0;
                const zIndex = pos === 0 ? 10 : pos === 1 ? 5 : pos === 2 ? 2 : 0;

                return (
                  <div
                    key={v.n}
                    className="card absolute inset-x-0 mx-auto w-full max-w-xl rounded-2xl border border-[var(--hair)] p-6 sm:p-8 cursor-pointer transition-all duration-500 ease-out shadow-2xl"
                    onClick={() => selectCard(i)}
                    style={{
                      transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                      opacity,
                      zIndex,
                      background: 'var(--bg2)',
                    }}
                  >
                    <div className="flex items-center justify-between border-b border-[var(--hair)] pb-3 mb-5 text-xs font-mono uppercase tracking-widest text-[var(--ink2)]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      </div>
                      <span>WHAT DRIVES ME · 0{i + 1}</span>
                    </div>

                    <div className="flex items-start gap-4 text-left">
                      <div className="w-12 h-12 rounded-xl bg-[#2C3480]/20 border border-[#7686f0]/40 flex items-center justify-center text-[#7686f0] flex-shrink-0">
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d={v.ic} />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <h4 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wide text-white leading-tight">
                          {v.n}
                        </h4>
                        <p className="font-body text-sm sm:text-base text-[var(--ink2)] mt-2 leading-relaxed">
                          {v.t}
                        </p>

                        <div className="mt-5 pt-4 border-t border-[var(--hair)] flex items-center justify-between">
                          <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                            Verified Proof
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProofClick(v.proof_type || 'project', v.proof_id || 'projects');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2C3480]/40 hover:bg-[#2C3480] text-white text-xs font-mono uppercase tracking-wider border border-[#7686f0]/40 transition-colors cursor-pointer"
                          >
                            <span>{v.pf}</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note & navigation under card */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs font-mono text-[var(--ink2)]">
              <span>VALUE {driveCards[sFront]?.n}</span>
              <span>·</span>
              <span className="text-[#7686f0]">CLICK ANY CARD OR TAB TO SWITCH</span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
