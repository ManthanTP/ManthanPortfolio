import { useEffect } from 'react';

/**
 * Shared requestAnimationFrame loop driving proximity glow (--prox, --mx, --my)
 * and progress borders (--prog) across all .card elements, matching DESIGN_REFERENCE.html
 */
export function useGlobalCardGlow() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let px = window.innerWidth * 0.5;
    let py = window.innerHeight * 0.3;
    let hasPtr = false;

    const onPointerMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      hasPtr = true;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') hasPtr = false;
    };

    const onPointerLeave = () => {
      hasPtr = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    root.addEventListener('pointerleave', onPointerLeave);

    let rafId: number;

    function clamp(val: number, min: number, max: number) {
      return Math.max(min, Math.min(max, val));
    }

    // State cache to avoid redundant DOM writes
    const cardCache = new WeakMap<
      Element,
      { pg: number; pr: number; lp: number; lx: number }
    >();

    function loop() {
      const vh = window.innerHeight;

      const cardEls = document.querySelectorAll<HTMLElement>('.card');
      const cardsCount = cardEls.length;

      for (let i = 0; i < cardsCount; i++) {
        const el = cardEls[i];
        if (el.hidden || el.offsetParent === null) continue;

        const r = el.getBoundingClientRect();
        if (r.bottom < -150 || r.top > vh + 150) continue;

        let state = cardCache.get(el);
        if (!state) {
          state = { pg: reduce ? 100 : 0, pr: 0, lp: -1, lx: -1 };
          cardCache.set(el, state);
        }

        const isCustomProg = el.hasAttribute('data-prog-controlled');
        if (!isCustomProg) {
          // Scroll-driven progress
          const tp = clamp((vh * 0.96 - r.top) / (vh * 0.5), 0, 1) * 100;
          state.pg = reduce ? tp : state.pg + (tp - state.pg) * 0.14;
          if (Math.abs(state.pg - state.lp) > 0.2) {
            el.style.setProperty('--prog', state.pg.toFixed(1));
            state.lp = state.pg;
          }
        }

        // Proximity calculation
        let pt = 0;
        if (hasPtr) {
          const dx = Math.max(r.left - px, 0, px - r.right);
          const dy = Math.max(r.top - py, 0, py - r.bottom);
          const d = Math.sqrt(dx * dx + dy * dy);
          pt = clamp(1 - d / 280, 0, 1);
          pt = pt * pt * (3 - 2 * pt);
          el.style.setProperty('--mx', (px - r.left).toFixed(0) + 'px');
          el.style.setProperty('--my', (py - r.top).toFixed(0) + 'px');
        }

        state.pr += (pt - state.pr) * (reduce ? 1 : 0.14);
        if (Math.abs(state.pr - state.lx) > 0.005) {
          el.style.setProperty('--prox', state.pr.toFixed(3));
          state.lx = state.pr;
        }
      }

      // Timeline tracker if present
      const tl = document.getElementById('tl');
      if (tl) {
        const tr = tl.getBoundingClientRect();
        const p = clamp((vh * 0.62 - tr.top) / tr.height, 0, 1);
        tl.style.setProperty('--tl', p.toFixed(3));
        const y = tr.top + 8 + p * (tr.height - 16);
        const dots = tl.querySelectorAll<HTMLElement>('.dot');
        dots.forEach((d) => {
          const dr = d.getBoundingClientRect();
          d.classList.toggle('on', dr.top + 7 <= y);
        });
      }

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      root.removeEventListener('pointerleave', onPointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);
}
