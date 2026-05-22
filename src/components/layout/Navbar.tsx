import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../stores/useThemeStore';
import { IconSun, IconMoon } from '../ui/Icons';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useSettingsStore } from '../../stores/useSettingsStore';

const NAV_LINKS = [
  { path: '#home', label: 'Home' },
  { path: '#about', label: 'About' },
  { path: '#projects', label: 'Projects' },
  { path: '#skills', label: 'Skills' },
  { path: '#experience', label: 'Experience' },
  { path: '#gallery', label: 'Gallery' },
  { path: '#blog', label: 'Blog' },
  { path: '#resume', label: 'Resume' },
  { path: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const settings = useSettingsStore(s => s.settings);
  const [scrolled, setScrolled] = useState(false);
  
  const visibleLinks = NAV_LINKS.filter(link => 
    link.path !== '#resume' || settings.show_resume_section !== 'false'
  );
  
  const activeSection = useActiveSection(visibleLinks.map(link => link.path.substring(1)));

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
        transition: 'background 0.3s, backdrop-filter 0.3s, border-bottom 0.3s',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span
            className="font-accent"
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--accent-violet)',
              textShadow: '0 0 20px rgba(108,99,255,0.4)',
              letterSpacing: '2px',
            }}
          >
            MP
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 6 }}>
          {visibleLinks.map((link) => {
            const isActive = location.pathname === '/' ? activeSection === link.path.substring(1) : location.pathname === link.path;
            return (
              <a
                key={link.path}
                href={location.pathname === '/' ? link.path : `/${link.path}`}
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    window.history.pushState(null, '', link.path);
                    const el = document.getElementById(link.path.substring(1));
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  textDecoration: 'none',
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 500,
                  color: isActive ? 'var(--accent-violet)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(108,99,255,0.1)' : 'transparent',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.color = 'var(--text-primary)';
                    (e.target as HTMLElement).style.background = 'rgba(108,99,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                    (e.target as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            background: 'rgba(108,99,255,0.1)',
            border: '1px solid var(--border-color)',
            borderRadius: 10,
            padding: 10,
            cursor: 'pointer',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>
    </nav>
  );
}
