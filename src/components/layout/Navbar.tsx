import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../stores/useThemeStore';
import { IconSun, IconMoon, IconMenu, IconX } from '../ui/Icons';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useDataStore } from '../../stores/useDataStore';

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
  const settings = useSettingsStore((s) => s.settings);
  const posts = useDataStore((s) => s.posts);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const blogMinPosts = parseInt(settings.blog_min_posts ?? '1', 10);
  const showBlog = blogMinPosts === 0 || posts.length >= blogMinPosts;

  const visibleLinks = NAV_LINKS.filter((link) => {
    if (link.path === '#resume' && settings.show_resume_section === 'false') return false;
    if (link.path === '#blog' && !showBlog) return false;
    return true;
  });

  const activeSection = useActiveSection(visibleLinks.map((link) => link.path.substring(1)));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.history.pushState(null, '', path);
      const el = document.getElementById(path.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'var(--nav)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--hair)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">
        {/* Logo: Circular crop of face + cobalt ring + MP */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group no-underline"
          aria-label="Manthan Patel Portfolio Home"
        >
          <div
            className="w-9 h-9 rounded-full overflow-hidden border-2 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center"
            style={{
              borderColor: 'var(--amber)',
              background: 'radial-gradient(circle at 30% 25%, #2C3480, #0a0c1b 72%)',
            }}
          >
            {settings.profile_image_url ? (
              <img
                src={settings.profile_image_url}
                alt="Manthan Patel"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <b className="font-heading text-xs text-white">MP</b>
            )}
          </div>
          <span
            className="font-heading text-2xl font-black tracking-wider transition-colors duration-200"
            style={{ color: 'var(--ink)' }}
          >
            MP
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {visibleLinks.map((link) => {
            const isActive =
              location.pathname === '/'
                ? activeSection === link.path.substring(1)
                : location.pathname === link.path;

            return (
              <a
                key={link.path}
                href={location.pathname === '/' ? link.path : `/${link.path}`}
                onClick={(e) => handleNavClick(e, link.path)}
                className="no-underline px-3.5 py-1.5 rounded-md text-xs font-mono font-medium tracking-wider uppercase transition-all duration-200"
                style={{
                  color: isActive ? 'var(--amber)' : 'var(--ink2)',
                  background: isActive ? 'rgba(var(--glow-rgb), 0.12)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--ink)';
                    e.currentTarget.style.background = 'rgba(var(--glow-rgb), 0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--ink2)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right actions: Theme Toggle & Mobile Menu Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background: 'rgba(var(--glow-rgb), 0.08)',
              border: '1px solid var(--hair)',
              color: 'var(--ink)',
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
                {theme === 'dark' ? <IconSun size={17} /> : <IconMoon size={17} />}
              </motion.div>
            </AnimatePresence>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background: 'rgba(var(--glow-rgb), 0.08)',
              border: '1px solid var(--hair)',
              color: 'var(--ink)',
            }}
          >
            {mobileMenuOpen ? <IconX size={20} /> : <IconMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b overflow-hidden"
            style={{
              background: 'var(--bg2)',
              borderColor: 'var(--hair)',
            }}
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {visibleLinks.map((link) => {
                const isActive =
                  location.pathname === '/'
                    ? activeSection === link.path.substring(1)
                    : location.pathname === link.path;
                return (
                  <a
                    key={link.path}
                    href={location.pathname === '/' ? link.path : `/${link.path}`}
                    onClick={(e) => handleNavClick(e, link.path)}
                    className="no-underline py-2.5 px-3 rounded text-sm font-mono tracking-wider uppercase transition-colors"
                    style={{
                      color: isActive ? 'var(--amber)' : 'var(--ink2)',
                      background: isActive ? 'rgba(var(--glow-rgb), 0.12)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
