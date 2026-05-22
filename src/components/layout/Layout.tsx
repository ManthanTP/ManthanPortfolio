import { Outlet, useLocation } from 'react-router-dom';
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
      
      <MobileNav />
      {/* Mobile nav spacer */}
      <div className="lg:hidden" style={{ height: 72 }} />
    </div>
  );
}
