import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../stores/useAppStore';
import ParticleBackground from '../components/ui/ParticleBackground';

const LOADING_TEXTS = [
  'Initializing Portfolio...',
  'Loading Experience...',
  'Preparing Projects...',
  'Almost Ready...',
  'Welcome to Manthan\'s Universe',
];

export default function Splash() {
  const { setSplashDone } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handleExit = useCallback(() => {
    setExiting(true);
    setTimeout(() => setSplashDone(true), 800);
  }, [setSplashDone]);

  useEffect(() => {
    const skipTimer = setTimeout(() => setShowSkip(true), 1500);
    return () => clearTimeout(skipTimer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 3 + 1;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(handleExit, 600);
          return 100;
        }
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [handleExit]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev < LOADING_TEXTS.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          exit={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: '#05050a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <ParticleBackground count={40} color="rgba(108,99,255,0.4)" />

          {/* Cyber grid background for desktop */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(108,99,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(108,99,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              opacity: 0.5,
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              marginBottom: 48,
            }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 30px rgba(108,99,255,0.3), 0 0 60px rgba(108,99,255,0.1)',
                  '0 0 50px rgba(108,99,255,0.5), 0 0 100px rgba(108,99,255,0.2)',
                  '0 0 30px rgba(108,99,255,0.3), 0 0 60px rgba(108,99,255,0.1)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0d0d1a, #12122a)',
                border: '2px solid rgba(108,99,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                className="font-accent"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#6c63ff',
                  textShadow: '0 0 20px rgba(108,99,255,0.6)',
                  letterSpacing: '4px',
                }}
              >
                MP
              </span>
            </motion.div>
          </motion.div>

          {/* Loading Text */}
          <motion.div
            key={textIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-heading"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              marginBottom: 32,
              letterSpacing: '1px',
            }}
          >
            {LOADING_TEXTS[textIndex]}
          </motion.div>

          {/* Progress Bar */}
          <div
            style={{
              width: 240,
              height: 3,
              borderRadius: 2,
              background: 'rgba(108,99,255,0.15)',
              overflow: 'hidden',
              marginBottom: 40,
            }}
          >
            <motion.div
              style={{
                height: '100%',
                borderRadius: 2,
                background: 'linear-gradient(90deg, #6c63ff, #00f5d4)',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Skip Button */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={handleExit}
                className="font-heading"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(108,99,255,0.3)',
                  borderRadius: 8,
                  padding: '8px 24px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'var(--accent-violet)';
                  (e.target as HTMLElement).style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'rgba(108,99,255,0.3)';
                  (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                }}
              >
                Skip →
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
