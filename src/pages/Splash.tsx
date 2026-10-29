import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../stores/useAppStore';
import { useDataStore } from '../stores/useDataStore';
import { preloadSite, type PreloadProgress } from '../lib/preload';

export default function Splash() {
  const { setSplashDone } = useAppStore();
  const visitorCount = useDataStore((s) => s.visitorCount);

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing portfolio...');
  const [showSkip, setShowSkip] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Auto-fit name states
  const [fontSize, setFontSize] = useState(48);
  const [isTwoLines, setIsTwoLines] = useState(false);

  const nameContainerRef = useRef<HTMLDivElement>(null);
  const sweepAngleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getGreeting = () => {
    const hours = new Date().getHours();
    let text = 'Good evening';
    if (hours >= 5 && hours < 12) text = 'Good morning';
    else if (hours >= 12 && hours < 18) text = 'Good afternoon';

    if (visitorCount && visitorCount > 0) {
      return `${text} — you are visitor #${visitorCount.toLocaleString()}`;
    }
    return text;
  };

  const handleExit = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setSplashDone(true);
    }, 500);
  }, [setSplashDone]);

  const runPreload = useCallback(() => {
    setHasError(false);
    const startTime = Date.now();

    // 8s hard safety timeout
    const hardTimeout = setTimeout(() => {
      setProgress(100);
      setStatusText('Ready');
      setTimeout(handleExit, 200);
    }, 8000);

    preloadSite(({ statusText: text, progress: p }: PreloadProgress) => {
      setProgress(p);
      setStatusText(text);
    })
      .then((res) => {
        clearTimeout(hardTimeout);
        if (!res.success) {
          setHasError(true);
          return;
        }

        // Enforce minimum 600ms display time
        const elapsed = Date.now() - startTime;
        const delayRemaining = Math.max(0, 600 - elapsed);

        setTimeout(() => {
          setProgress(100);
          setStatusText('Ready');
          setTimeout(handleExit, 300);
        }, delayRemaining);
      })
      .catch(() => {
        clearTimeout(hardTimeout);
        setHasError(true);
      });
  }, [handleExit]);

  useEffect(() => {
    runPreload();
    const skipTimer = setTimeout(() => setShowSkip(true), 1200);
    return () => clearTimeout(skipTimer);
  }, [runPreload]);

  // Auto-fit name sizing logic in Big Shoulders Display 900
  const fitName = useCallback(() => {
    if (typeof window === 'undefined') return;
    const viewportWidth = window.innerWidth;
    const maxWidth = viewportWidth * 0.88;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = '900 100px "Big Shoulders Display", sans-serif';
    const singleLineWidth = ctx.measureText('MANTHAN PATEL').width;
    const scale = maxWidth / singleLineWidth;
    let computedSize = Math.floor(100 * scale);

    if (computedSize > 64) {
      computedSize = 64;
    }

    if (computedSize < 34) {
      setIsTwoLines(true);
      ctx.font = '900 100px "Big Shoulders Display", sans-serif';
      const line1Width = ctx.measureText('MANTHAN').width;
      const line2Width = ctx.measureText('PATEL').width;
      const longest = Math.max(line1Width, line2Width);
      const twoLineScale = maxWidth / longest;
      let twoLineSize = Math.floor(100 * twoLineScale);
      if (twoLineSize > 56) twoLineSize = 56;
      setFontSize(Math.max(28, twoLineSize));
    } else {
      setIsTwoLines(false);
      setFontSize(computedSize);
    }
  }, []);

  useEffect(() => {
    fitName();
    if (document.fonts) {
      document.fonts.ready.then(fitName).catch(() => {});
    }
    window.addEventListener('resize', fitName);
    return () => window.removeEventListener('resize', fitName);
  }, [fitName]);

  // Automatic flashlight sweep loop across name
  useEffect(() => {
    if (prefersReducedMotion) return;

    const render = () => {
      sweepAngleRef.current += 0.03;
      const sweepX = (Math.sin(sweepAngleRef.current) * 0.5 + 0.5) * 100;
      const sweepY = (Math.cos(sweepAngleRef.current * 0.7) * 0.2 + 0.5) * 100;

      if (nameContainerRef.current) {
        nameContainerRef.current.style.setProperty('--flash-x', `${sweepX.toFixed(2)}%`);
        nameContainerRef.current.style.setProperty('--flash-y', `${sweepY.toFixed(2)}%`);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between p-6 select-none"
          style={{
            backgroundColor: '#030409',
            color: '#ffffff',
            cursor: 'auto',
          }}
        >
          {/* Subtle cobalt rim light at top */}
          <div
            className="absolute -top-32 w-full max-w-2xl h-80 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(44, 52, 128, 0.4) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Top: Local Greeting */}
          <div className="w-full max-w-4xl flex items-center justify-between pt-4">
            <span
              className="text-xs font-mono tracking-widest uppercase opacity-70"
              style={{ color: '#a6abc8' }}
            >
              {getGreeting()}
            </span>
            <span
              className="text-xs font-mono tracking-widest uppercase opacity-50"
              style={{ color: '#a6abc8' }}
            >
              PORTFOLIO · 2026
            </span>
          </div>

          {/* Center: Flashlight Beam Sweeping Across MANTHAN PATEL */}
          <div
            ref={nameContainerRef}
            className="flex flex-col items-center justify-center my-auto w-full relative"
            style={
              {
                '--flash-x': '50%',
                '--flash-y': '50%',
              } as React.CSSProperties
            }
          >
            <div
              className="relative text-center tracking-tight font-black leading-none uppercase"
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: `${fontSize}px`,
                letterSpacing: '0.04em',
              }}
            >
              {/* Dim Base Layer */}
              <div
                className="select-none"
                style={{
                  color: 'rgba(255, 255, 255, 0.18)',
                  textShadow: '0 0 2px rgba(255,255,255,0.05)',
                }}
              >
                {isTwoLines ? (
                  <>
                    <div>MANTHAN</div>
                    <div>PATEL</div>
                  </>
                ) : (
                  'MANTHAN PATEL'
                )}
              </div>

              {/* Lit Flashlight Layer */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none select-none transition-none"
                style={{
                  color: '#ffffff',
                  textShadow: '0 0 25px rgba(118, 134, 240, 0.8), 0 0 50px rgba(44, 52, 128, 0.9)',
                  WebkitMaskImage:
                    'radial-gradient(circle 180px at var(--flash-x) var(--flash-y), black 20%, transparent 80%)',
                  maskImage:
                    'radial-gradient(circle 180px at var(--flash-x) var(--flash-y), black 20%, transparent 80%)',
                }}
              >
                {isTwoLines ? (
                  <>
                    <div>MANTHAN</div>
                    <div style={{ color: '#7686f0' }}>PATEL</div>
                  </>
                ) : (
                  <>
                    <span>MANTHAN </span>
                    <span style={{ color: '#7686f0' }}>PATEL</span>
                  </>
                )}
              </div>
            </div>

            <div
              className="mt-4 text-xs font-mono tracking-widest uppercase opacity-60"
              style={{ color: '#a6abc8' }}
            >
              FULL STACK & AI SYSTEMS ARCHITECT
            </div>
          </div>

          {/* Bottom: Progress Bar, Status & Skip/Retry */}
          <div className="w-full max-w-sm flex flex-col gap-3 pb-8 z-10">
            <div className="flex items-center justify-between text-xs font-mono">
              <span style={{ color: '#a6abc8' }}>{statusText}</span>
              <span style={{ color: '#7686f0', fontWeight: 600 }}>{Math.round(progress)}%</span>
            </div>

            {/* Glowing progress line */}
            <div
              className="w-full h-[2px] rounded-full overflow-hidden"
              style={{ background: 'rgba(118, 134, 240, 0.2)' }}
            >
              <div
                className="h-full transition-all duration-200"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #2C3480, #7686f0, #c3caff)',
                  boxShadow: '0 0 10px rgba(118, 134, 240, 0.8)',
                }}
              />
            </div>

            {/* Error or Skip Controls */}
            <div className="flex items-center justify-center min-h-[28px] mt-1">
              {hasError ? (
                <button
                  onClick={runPreload}
                  className="px-4 py-1.5 rounded text-xs font-mono tracking-wider uppercase border transition-colors cursor-pointer"
                  style={{
                    borderColor: '#ff8a8a',
                    color: '#ff8a8a',
                    background: 'rgba(255, 138, 138, 0.1)',
                  }}
                >
                  Retry Connection
                </button>
              ) : (
                showSkip && (
                  <button
                    onClick={handleExit}
                    className="text-xs font-mono tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ color: '#a6abc8' }}
                  >
                    Skip Intro →
                  </button>
                )
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
