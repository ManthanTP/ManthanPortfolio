import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import { useThemeStore } from '../../stores/useThemeStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useAppStore } from '../../stores/useAppStore';
import { useDataStore } from '../../stores/useDataStore';

// Safe fallback video URLs
const DEFAULT_DARK_VIDEO = 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
const DEFAULT_LIGHT_VIDEO = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

export default function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const theme = useThemeStore((s) => s.theme);
  const settings = useSettingsStore((s) => s.settings);
  const splashDone = useAppStore((s) => s.splashDone);
  const visitorCount = useDataStore((s) => s.visitorCount);

  // Check desktop and data saver status
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const checkViewport = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', checkViewport);

    // Check navigator.connection.saveData
    const conn = (navigator as any).connection;
    if (conn && conn.saveData) {
      setSaveData(true);
    }

    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  if (isAdmin) {
    return <Outlet />;
  }

  // Video conditions: only after splash ends, >=1024px, no saveData, and settings.bg_video_enabled !== 'false'
  const videoEnabled =
    splashDone &&
    isDesktop &&
    !saveData &&
    settings.bg_video_enabled !== 'false';

  const darkVideoUrl = settings.bg_video_dark || DEFAULT_DARK_VIDEO;
  const lightVideoUrl = settings.bg_video_light || DEFAULT_LIGHT_VIDEO;
  const currentVideo = theme === 'dark' ? darkVideoUrl : lightVideoUrl;

  const gradientPoster =
    theme === 'dark'
      ? 'radial-gradient(circle at 50% 15%, rgba(108, 99, 255, 0.08) 0%, transparent 60%), radial-gradient(circle at 85% 85%, rgba(0, 245, 212, 0.04) 0%, transparent 50%), var(--bg-primary)'
      : 'radial-gradient(circle at 50% 15%, rgba(108, 99, 255, 0.05) 0%, transparent 60%), var(--bg-primary)';

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background Layer: Gradient poster by default, video mounts only when allowed */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -2,
          background: gradientPoster,
          transition: 'background 0.5s ease',
        }}
      >
        {videoEnabled && (
          <AnimatePresence>
            <motion.video
              key={currentVideo}
              autoPlay
              loop
              muted
              playsInline
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                inset: 0,
              }}
            >
              <source src={currentVideo} type="video/mp4" />
            </motion.video>
          </AnimatePresence>
        )}
      </div>

      {/* Opacity Overlay for readability */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          background: 'var(--video-overlay)',
          transition: 'background 0.5s ease',
        }}
      />

      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {/* Global Footer */}
      <footer
        style={{
          padding: '40px 0 100px 0',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
              boxShadow: '0 0 10px var(--accent-cyan)',
            }}
          />
          Total Visitors:{' '}
          <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {visitorCount !== null && visitorCount > 0
              ? visitorCount.toLocaleString()
              : '...'}
          </strong>
        </div>
      </footer>

      <MobileNav />
      {/* Mobile nav spacer */}
      <div className="lg:hidden" style={{ height: 72 }} />
    </div>
  );
}
