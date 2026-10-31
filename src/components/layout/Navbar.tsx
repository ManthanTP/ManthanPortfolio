import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../stores/useThemeStore';
import { IconMenu, IconX } from '../ui/Icons';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');

  const blogMinPosts = parseInt(settings.blog_min_posts ?? '1', 10);
  const showBlog = blogMinPosts === 0 || posts.length >= blogMinPosts;

  const visibleLinks = NAV_LINKS.filter((link) => {
    if (link.path === '#resume' && settings.show_resume_section === 'false') return false;
    if (link.path === '#blog' && !showBlog) return false;
    return true;
  });

  const hookActive = useActiveSection(visibleLinks.map((link) => link.path.substring(1)));

  // Precise scroll position tracking with sticky header offset
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      if (window.scrollY < 120) {
        setCurrentSection('home');
        return;
      }

      const scrollPos = window.scrollY + 200;
      for (let i = visibleLinks.length - 1; i >= 0; i--) {
        const id = visibleLinks[i].path.substring(1);
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPos >= top) {
            setCurrentSection(id);
            return;
          }
        }
      }
      setCurrentSection('home');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, visibleLinks]);

  const activeId = currentSection || hookActive || 'home';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const targetId = path.substring(1);
      setCurrentSection(targetId);
      window.history.pushState(null, '', path);
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-3.5 z-50 px-3 sm:px-6 pointer-events-auto">
      <div className="max-w-fit sm:max-w-5xl mx-auto flex justify-center">
        <nav
          className="flex items-center gap-2 sm:gap-6 px-3.5 sm:px-5 py-2 rounded-full border border-[var(--hair)] transition-all duration-300 shadow-[0_12px_36px_rgba(0,0,0,0.45)]"
          style={{
            background: 'var(--nav)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          aria-label="Main"
        >
          {/* Logo: Circular crop of portrait + MP text */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-2.5 group no-underline flex-shrink-0 pr-1 sm:pr-2"
            aria-label="Manthan Patel, home"
          >
            <div
              className="w-[34px] h-[34px] rounded-full overflow-hidden border border-[var(--hair)] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{
                background: 'radial-gradient(circle at 50% 30%, #2C3480, #05060d 75%)',
              }}
            >
              <img
                src={theme === 'light' ? '/hero/hero-portrait-light.webp' : '/hero/hero-portrait-dark.webp'}
                alt="Manthan Patel"
                className="w-full h-full object-cover object-top scale-125"
              />
            </div>
            <span className="font-display text-[22px] leading-none font-black tracking-wide text-[var(--ink)] group-hover:text-[var(--amber)] transition-colors">
              MP
            </span>
          </a>

          {/* Desktop Nav Links Centered */}
          <ul className="hidden min-[860px]:flex items-center justify-center gap-1 list-none p-0 m-0">
            {visibleLinks.map((link) => {
              const linkId = link.path.substring(1);
              const isActive =
                location.pathname === '/'
                  ? activeId === linkId
                  : location.pathname === link.path;

              return (
                <li key={link.path} className="relative">
                  <a
                    href={location.pathname === '/' ? link.path : `/${link.path}`}
                    onClick={(e) => handleNavClick(e, link.path)}
                    className="relative z-10 block px-3 py-1.5 rounded-full text-[13px] font-body font-medium whitespace-nowrap transition-colors duration-200 no-underline"
                    style={{
                      color: isActive ? '#ffffff' : 'var(--ink2)',
                    }}
                  >
                    {link.label}
                  </a>

                  {/* Clean active pill background without harsh borders */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'rgba(44, 52, 128, 0.65)',
                        boxShadow: '0 2px 10px rgba(44, 52, 128, 0.4)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right actions: Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 pl-1 sm:pl-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-9 h-9 rounded-full border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:text-white hover:bg-[rgba(44,52,128,0.35)] transition-all duration-200 flex-shrink-0 cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  {theme === 'dark' ? (
                    <svg className="w-4 h-4 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="min-[860px]:hidden w-9 h-9 rounded-full border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:bg-[rgba(44,52,128,0.35)] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <IconX size={18} /> : <IconMenu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown (<860px) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="min-[860px]:hidden max-w-sm mx-auto mt-2 rounded-2xl border border-[var(--hair)] overflow-hidden shadow-2xl"
            style={{
              background: 'var(--bg2)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            <div className="p-3 flex flex-col gap-1">
              {visibleLinks.map((link) => {
                const isActive =
                  location.pathname === '/'
                    ? activeId === link.path.substring(1)
                    : location.pathname === link.path;
                return (
                  <a
                    key={link.path}
                    href={location.pathname === '/' ? link.path : `/${link.path}`}
                    onClick={(e) => handleNavClick(e, link.path)}
                    className="no-underline flex items-center min-h-[44px] px-4 rounded-xl text-[14px] font-body font-medium transition-all"
                    style={{
                      color: isActive ? '#ffffff' : 'var(--ink2)',
                      background: isActive ? 'rgba(44, 52, 128, 0.65)' : 'transparent',
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
    </header>
  );
}
