import { useEffect, useState, useRef, useCallback } from 'react';

interface AnimatedCounterProps {
  target: number | string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2000, className = '' }: AnimatedCounterProps) {
  // Parse numeric part and extra suffix from target if string (e.g. "1200+" -> numeric: 1200, extraSuffix: "+")
  const { numericTarget, targetSuffix } = (() => {
    if (typeof target === 'number') {
      return { numericTarget: target, targetSuffix: '' };
    }
    const str = String(target || '').trim();
    const match = str.match(/^([\d,.]+)(.*)$/);
    if (match) {
      const num = parseFloat(match[1].replace(/,/g, '')) || 0;
      return { numericTarget: num, targetSuffix: match[2] || '' };
    }
    const parsed = parseFloat(str) || 0;
    return { numericTarget: parsed, targetSuffix: '' };
  })();

  const effectiveSuffix = (targetSuffix || suffix || '');
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  const startCounting = useCallback(() => {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericTarget));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [numericTarget, duration]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) startCounting();
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startCounting]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{effectiveSuffix}
    </span>
  );
}
