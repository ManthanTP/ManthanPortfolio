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
      <footer className="py-12 pb-24 text-center text-[var(--ink2)] text-xs font-mono max-w-[1120px] mx-auto px-4 border-t border-[var(--hair)] mt-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span>MANTHAN PATEL · HUBBALLI, KARNATAKA</span>
          </div>

          {/* Social Links Row: 44px glass buttons */}
          <div className="flex items-center gap-2">
            {settings.social_github && (
              <a
                href={settings.social_github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:border-[var(--amber)] transition-colors"
                style={{ background: 'rgba(var(--glow-rgb), 0.08)' }}
                aria-label="GitHub profile"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
            )}
            {settings.social_linkedin && (
              <a
                href={settings.social_linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:border-[var(--amber)] transition-colors"
                style={{ background: 'rgba(var(--glow-rgb), 0.08)' }}
                aria-label="LinkedIn profile"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
            <a
              href={settings.social_instagram || 'https://instagram.com/manthan_tp'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:border-[var(--amber)] transition-colors"
              style={{ background: 'rgba(var(--glow-rgb), 0.08)' }}
              aria-label="Instagram profile"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a
              href={settings.social_x || 'https://x.com/manthanpatel'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:border-[var(--amber)] transition-colors"
              style={{ background: 'rgba(var(--glow-rgb), 0.08)' }}
              aria-label="X (Twitter) profile"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>

          {/* Total Visitors Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--hair)] bg-[rgba(var(--glow-rgb),0.06)] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_#34d399]" />
            Visitors: <strong className="text-[var(--ink)]">{visitorCount !== null && visitorCount > 0 ? visitorCount.toLocaleString() : '...'}</strong>
          </div>
        </div>
      </footer>

      <MobileNav />
      {/* Mobile nav spacer */}
      <div className="lg:hidden" style={{ height: 72 }} />
    </div>
  );
}
