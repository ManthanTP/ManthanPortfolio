import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../stores/useAppStore';
import { useDataStore } from '../stores/useDataStore';
import { preloadSite, type PreloadProgress } from '../lib/preload';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  decay: number;
}

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

  // Ref to canvas and sparks
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const sweepAngleRef = useRef(0);
  const nameContainerRef = useRef<HTMLDivElement>(null);

  // Reduced motion query
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Local greeting calculation
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

  // Exit trigger with center burst
  const handleExit = useCallback(() => {
    setExiting(true);
    // Center burst if canvas available
    if (!prefersReducedMotion && canvasRef.current) {
      const cx = canvasRef.current.offsetWidth / 2;
      const cy = canvasRef.current.offsetHeight / 2;
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        sparksRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() > 0.5 ? '#8f89ff' : '#00f5d4',
          alpha: 1,
          size: Math.random() * 3 + 1.5,
          decay: Math.random() * 0.02 + 0.015,
        });
      }
    }
    setTimeout(() => {
      setSplashDone(true);
    }, 700);
  }, [setSplashDone, prefersReducedMotion]);

  // Execute Preloader
  const runPreload = useCallback(() => {
    setHasError(false);
    const startTime = Date.now();

    // 8s hard safety timeout: continue even if hanging
    const hardTimeout = setTimeout(() => {
      setProgress(100);
      setStatusText('Ready');
      setTimeout(handleExit, 300);
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

        // Enforce minimum 900ms display time
        const elapsed = Date.now() - startTime;
        const delayRemaining = Math.max(0, 900 - elapsed);

        setTimeout(() => {
          setProgress(100);
          setStatusText('Ready');
          setTimeout(handleExit, 400);
        }, delayRemaining);
      })
      .catch(() => {
        clearTimeout(hardTimeout);
        setHasError(true);
      });
  }, [handleExit]);

  // Start preload on mount
  useEffect(() => {
    runPreload();
    const skipTimer = setTimeout(() => setShowSkip(true), 1500);
    return () => clearTimeout(skipTimer);
  }, [runPreload]);

  // Auto-fit name sizing logic
  const fitName = useCallback(() => {
    if (typeof window === 'undefined') return;
    const viewportWidth = window.innerWidth;
    const maxWidth = viewportWidth * 0.86;

    // Canvas measure helper
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Test single line at 100px
    ctx.font = '800 100px Syne, sans-serif';
    const singleLineWidth = ctx.measureText('MANTHAN PATEL').width;
    const scale = maxWidth / singleLineWidth;
    let computedSize = Math.floor(100 * scale);

    if (computedSize > 56) {
      computedSize = 56;
    }

    if (computedSize < 34) {
      // Switch to 2 lines and re-measure longest line 'MANTHAN'
      setIsTwoLines(true);
      ctx.font = '800 100px Syne, sans-serif';
      const line1Width = ctx.measureText('MANTHAN').width;
      const line2Width = ctx.measureText('PATEL').width;
      const longest = Math.max(line1Width, line2Width);
      const twoLineScale = maxWidth / longest;
      let twoLineSize = Math.floor(100 * twoLineScale);
      if (twoLineSize > 52) twoLineSize = 52;
      setFontSize(Math.max(26, twoLineSize));
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

  // Canvas animation loop: flashlight sine wave + spark physics
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Advance flashlight sine sweep
      sweepAngleRef.current += 0.025;
      const sweepX = (Math.sin(sweepAngleRef.current) * 0.5 + 0.5) * 100;
      const sweepY = (Math.cos(sweepAngleRef.current * 0.7) * 0.2 + 0.5) * 100;

      // Update flashlight CSS variable for text mask
      if (nameContainerRef.current) {
        nameContainerRef.current.style.setProperty('--flash-x', `${sweepX.toFixed(2)}%`);
        nameContainerRef.current.style.setProperty('--flash-y', `${sweepY.toFixed(2)}%`);
      }

      // Update and draw sparks
      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.08; // gravity
        s.vx *= 0.98;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    animFrameRef.current = animId;

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReducedMotion]);

  // Spark emitters on mouse/touch interaction
  const spawnSparks = (x: number, y: number, count = 4) => {
    if (prefersReducedMotion) return;
    if (sparksRef.current.length > 300) return; // Cap at 300

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      sparksRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        color: Math.random() > 0.5 ? '#8f89ff' : '#00f5d4',
        alpha: 1,
        size: Math.random() * 2.5 + 1,
        decay: Math.random() * 0.03 + 0.02,
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spawnSparks(e.clientX - rect.left, e.clientY - rect.top, 3);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spawnSparks(e.clientX - rect.left, e.clientY - rect.top, 25); // Burst on click
  };

  // Base text color interpolation: moves from #1e1e3a to #8f89ff as progress rises
  const baseTextColor = `color-mix(in srgb, #8f89ff ${progress}%, #1e1e3a)`;
  const lightRadius = Math.round(70 + (progress / 100) * 160); // 70px to 230px

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          exit={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 1.06,
            filter: prefersReducedMotion ? 'none' : 'blur(12px)',
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onPointerMove={handlePointerMove}
          onClick={handleClick}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#05050a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          {/* Spark canvas overlay */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* Center container */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: 720,
              padding: '0 24px',
              textAlign: 'center',
            }}
          >
            {/* Monospace Greeting by local time */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.82rem',
                color: 'rgba(255, 255, 255, 0.65)',
                letterSpacing: '0.08em',
                marginBottom: 20,
                textTransform: 'uppercase',
              }}
            >
              {getGreeting()}
            </motion.div>

            {/* Name Container with dual layer flashlight reveal */}
            <div
              ref={nameContainerRef}
              style={
                {
                  position: 'relative',
                  display: 'inline-block',
                  lineHeight: 1.15,
                  letterSpacing: '0.06em',
                  fontFamily: 'var(--font-hero, "Syne", sans-serif)',
                  fontWeight: 800,
                  fontSize: `${fontSize}px`,
                  marginBottom: 36,
                  '--flash-x': '50%',
                  '--flash-y': '50%',
                } as React.CSSProperties
              }
            >
              {/* Layer 1: Dim base layer (shifts from #1e1e3a toward #8f89ff) */}
              <div
                style={{
                  color: baseTextColor,
                  transition: 'color 0.2s ease',
                  whiteSpace: isTwoLines ? 'pre-line' : 'nowrap',
                }}
              >
                {isTwoLines ? 'MANTHAN\nPATEL' : 'MANTHAN PATEL'}
              </div>

              {/* Layer 2: Bright white layer with continuous radial flashlight mask */}
              {!prefersReducedMotion ? (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    color: '#ffffff',
                    whiteSpace: isTwoLines ? 'pre-line' : 'nowrap',
                    textShadow: '0 0 24px rgba(255, 255, 255, 0.8), 0 0 48px rgba(143, 137, 255, 0.5)',
                    maskImage: `radial-gradient(circle ${lightRadius}px at var(--flash-x) var(--flash-y), black 20%, transparent 100%)`,
                    WebkitMaskImage: `radial-gradient(circle ${lightRadius}px at var(--flash-x) var(--flash-y), black 20%, transparent 100%)`,
                    pointerEvents: 'none',
                  }}
                >
                  {isTwoLines ? 'MANTHAN\nPATEL' : 'MANTHAN PATEL'}
                </div>
              ) : null}
            </div>

            {/* Progress Bar Container */}
            <div
              style={{
                width: '100%',
                maxWidth: 280,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: 3,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #8f89ff 0%, #00f5d4 100%)',
                    borderRadius: 2,
                    boxShadow: '0 0 10px rgba(0, 245, 212, 0.5)',
                    transition: 'width 0.25s ease-out',
                  }}
                />
              </div>
            </div>

            {/* Status Text & Live Percent */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary, #8585a8)',
              }}
            >
              <span>{statusText}</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.8rem',
                  color: 'var(--accent-violet, #8f89ff)',
                  minWidth: 36,
                  textAlign: 'right',
                }}
              >
                {Math.round(progress)}%
              </span>
            </div>

            {/* Error & Retry State */}
            {hasError && (
              <div style={{ marginTop: 20 }}>
                <p style={{ color: '#ff5555', fontSize: '0.85rem', marginBottom: 10 }}>
                  Connection slow or interrupted.
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    runPreload();
                  }}
                  className="btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Skip Button */}
            {showSkip && !hasError && (
              <div style={{ marginTop: 28 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExit();
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 8,
                    padding: '6px 18px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: 'var(--font-heading, sans-serif)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(143, 137, 255, 0.6)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                  }}
                >
                  Skip →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
