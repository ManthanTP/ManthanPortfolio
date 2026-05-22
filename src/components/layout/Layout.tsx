import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import { useThemeStore } from '../../stores/useThemeStore';
import { useSettingsStore } from '../../stores/useSettingsStore';

// Safe fallback video URLs that don't block hotlinking
const DEFAULT_DARK_VIDEO = 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'; 
const DEFAULT_LIGHT_VIDEO = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'; 

export default function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const theme = useThemeStore(s => s.theme);
  const settings = useSettingsStore(s => s.settings);

  // Use custom videos if set in admin, otherwise defaults
  const darkVideoUrl = settings.bg_video_dark || DEFAULT_DARK_VIDEO;
  const lightVideoUrl = settings.bg_video_light || DEFAULT_LIGHT_VIDEO;

  const currentVideo = theme === 'dark' ? darkVideoUrl : lightVideoUrl;

  if (isAdmin) {
    return <Outlet />;
  }

  const [visits, setVisits] = useState(0);
  useEffect(() => {
    import('../../lib/api').then(({ api }) => {
      api.analytics.getVisitCount().then(setVisits).catch(() => {});
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background Video Layer */}
      <div 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: -2, 
          background: 'var(--bg-primary)',
          transition: 'background 0.5s ease'
        }}
      >
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
              inset: 0
            }}
          >
            <source src={currentVideo} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
      </div>

      {/* Opacity Overlay for readability */}
      <div 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: -1, 
          background: 'var(--video-overlay)',
          transition: 'background 0.5s ease'
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
      <footer style={{ padding: '40px 0 100px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
         <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }} />
            Total Visitors: <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{visits > 0 ? visits.toLocaleString() : '...'}</strong>
         </div>
      </footer>
      
      <MobileNav />
      {/* Mobile nav spacer */}
      <div className="lg:hidden" style={{ height: 72 }} />
    </div>
  );
}
