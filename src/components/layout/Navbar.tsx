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
      if (window.scrollY < 160) {
        setCurrentSection('home');
        return;
      }

      const scrollPos = window.scrollY + 180;
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
    <header className="sticky top-0 z-40 px-4 py-3 pointer-events-auto">
      <div className="max-w-[1120px] mx-auto">
        <nav
          className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-[16px] border border-[var(--hair)] transition-all duration-300"
          style={{
            background: 'var(--nav)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
          aria-label="Main"
        >
          {/* Logo: Circular crop of face + cobalt ring + MP */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-2.5 group no-underline flex-shrink-0"
            aria-label="Manthan Patel, home"
          >
            <div
              className="w-[38px] h-[38px] rounded-full overflow-hidden border-2 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
              style={{
                borderColor: 'var(--amber)',
                background: 'radial-gradient(circle at 50% 30%, #2C3480, #05060d 75%)',
              }}
            >
              <img
                src={theme === 'light' ? '/hero/hero-portrait-light.webp' : '/hero/hero-portrait-dark.webp'}
                alt="Manthan Patel"
                className="w-full h-full object-cover object-top scale-125"
              />
            </div>
            <span
              className="font-display text-[26px] leading-none font-black tracking-wide text-[var(--amber)]"
            >
              MP
            </span>
          </a>

          {/* Desktop Nav Links Centered with Instrument Sans 13px/500 */}
          <ul className="hidden min-[860px]:flex items-center justify-center gap-1 list-none p-0 m-0 flex-1 overflow-x-auto min-w-0">
            {visibleLinks.map((link) => {
              const linkId = link.path.substring(1);
              const isActive =
                location.pathname === '/'
                  ? activeId === linkId
                  : location.pathname === link.path;

              return (
                <li key={link.path}>
                  <a
                    href={location.pathname === '/' ? link.path : `/${link.path}`}
                    onClick={(e) => handleNavClick(e, link.path)}
                    className="block px-[14px] py-[8px] rounded-[10px] text-[13px] font-body font-medium whitespace-nowrap transition-all duration-200 no-underline"
                    style={{
                      color: isActive ? '#ffffff' : 'var(--ink2)',
                      background: isActive ? 'rgba(44, 52, 128, 0.35)' : 'transparent',
                      border: isActive ? '1px solid var(--amber)' : '1px solid transparent',
                      boxShadow: isActive ? '0 0 14px rgba(86, 104, 230, 0.3)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--ink)';
                        e.currentTarget.style.background = 'rgba(44, 52, 128, 0.18)';
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
                </li>
              );
            })}
          </ul>

          {/* Right actions: Theme Toggle (40px round glass button) & Mobile Menu Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-10 h-10 rounded-full border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:bg-[rgba(var(--glow-rgb),0.16)] transition-all duration-200 flex-shrink-0 cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                boxShadow: '0 0 10px rgba(var(--glow-rgb), 0.15)',
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
                    <svg className="w-[18px] h-[18px] text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
                    </svg>
                  ) : (
                    <svg className="w-[18px] h-[18px] text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="min-[860px]:hidden w-10 h-10 rounded-full border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:bg-[rgba(var(--glow-rgb),0.16)] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <IconX size={20} /> : <IconMenu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown / Full-width Sheet (<860px) with 48px tap targets */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="min-[860px]:hidden max-w-[1120px] mx-auto mt-2 rounded-[16px] border border-[var(--hair)] overflow-hidden shadow-2xl"
            style={{
              background: 'var(--bg2)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            <div className="p-3 flex flex-col gap-1.5">
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
                    className="no-underline flex items-center min-h-[48px] px-4 rounded-[10px] text-[15px] font-body font-medium transition-all"
                    style={{
                      color: isActive ? '#ffffff' : 'var(--ink2)',
                      background: isActive ? 'rgba(44, 52, 128, 0.4)' : 'transparent',
                      border: isActive ? '1px solid var(--amber)' : '1px solid transparent',
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
