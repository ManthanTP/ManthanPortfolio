import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconHome, IconFolder, IconCode, IconImage, IconPen, IconFile, IconSend } from '../ui/Icons';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useSettingsStore } from '../../stores/useSettingsStore';

const NAV_ITEMS = [
  { path: '#home', label: 'Home', Icon: IconHome },
  { path: '#projects', label: 'Projects', Icon: IconFolder },
  { path: '#skills', label: 'Skills', Icon: IconCode },
  { path: '#gallery', label: 'Gallery', Icon: IconImage },
  { path: '#blog', label: 'Blog', Icon: IconPen },
  { path: '#resume', label: 'Resume', Icon: IconFile },
  { path: '#contact', label: 'Contact', Icon: IconSend },
];

export default function MobileNav() {
  const location = useLocation();
  const settings = useSettingsStore(s => s.settings);

  const visibleItems = NAV_ITEMS.filter(item => 
    item.path !== '#resume' || settings.show_resume_section !== 'false'
  );

  const activeSection = useActiveSection(visibleItems.map(link => link.path.substring(1)));

  return (
    <nav
      className="lg:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid var(--glass-border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 64,
          maxWidth: 500,
          margin: '0 auto',
          padding: '0 4px',
        }}
      >
        {visibleItems.map(({ path, label, Icon }) => {
          const isActive = location.pathname === '/' ? activeSection === path.substring(1) : location.pathname === path;
          return (
            <a
              key={path}
              href={location.pathname === '/' ? path : `/${path}`}
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.history.pushState(null, '', path);
                  const el = document.getElementById(path.substring(1));
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                textDecoration: 'none',
                padding: '6px 8px',
                borderRadius: 12,
                position: 'relative',
                minWidth: 44,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(108,99,255,0.12)',
                    borderRadius: 12,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div style={{ color: isActive ? 'var(--accent-violet)' : 'var(--text-secondary)', transition: 'color 0.2s', display: 'flex' }}>
                <Icon size={20} />
              </div>
              <span
                className="font-heading"
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--accent-violet)' : 'var(--text-secondary)',
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </span>
              <style>{`
                @media (max-width: 359px) {
                  .mobile-nav-label { display: none; }
                }
              `}</style>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
