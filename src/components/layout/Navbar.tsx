import { useState } from 'react';
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

  const blogMinPosts = parseInt(settings.blog_min_posts ?? '1', 10);
  const showBlog = blogMinPosts === 0 || posts.length >= blogMinPosts;

  const visibleLinks = NAV_LINKS.filter((link) => {
    if (link.path === '#resume' && settings.show_resume_section === 'false') return false;
    if (link.path === '#blog' && !showBlog) return false;
    return true;
  });

  const activeSection = useActiveSection(visibleLinks.map((link) => link.path.substring(1)));

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
    <header className="sticky top-0 z-40 px-3 sm:px-4 py-3 pointer-events-auto">
      <div className="max-w-[1120px] mx-auto">
        <nav
          className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2 rounded-[14px] border border-[var(--hair)] transition-all duration-300"
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
                src="/hero/hero-portrait-dark.webp"
                alt="Manthan Patel"
                className="w-full h-full object-cover object-top scale-125"
              />
            </div>
            <span
              className="font-heading text-[26px] leading-none font-black tracking-wide text-[var(--amber)]"
            >
              MP
            </span>
          </a>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-1 list-none p-0 m-0 flex-1 justify-center overflow-x-auto min-w-0">
            {visibleLinks.map((link) => {
              const isActive =
                location.pathname === '/'
                  ? (activeSection === link.path.substring(1) || (!activeSection && link.path === '#home'))
                  : location.pathname === link.path;

              return (
                <li key={link.path}>
                  <a
                    href={location.pathname === '/' ? link.path : `/${link.path}`}
                    onClick={(e) => handleNavClick(e, link.path)}
                    className="block px-3 py-1.5 rounded-lg text-[13px] font-sans font-medium whitespace-nowrap transition-colors duration-200 no-underline"
                    style={{
                      color: isActive ? 'var(--ink)' : 'var(--ink2)',
                      background: isActive ? 'rgba(var(--glow-rgb), 0.14)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Right actions: Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-10 h-10 rounded-full border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:bg-[rgba(var(--glow-rgb),0.16)] transition-colors flex-shrink-0 cursor-pointer"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
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
              className="md:hidden w-10 h-10 rounded-full border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:bg-[rgba(var(--glow-rgb),0.16)] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <IconX size={20} /> : <IconMenu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden max-w-[1120px] mx-auto mt-2 rounded-[14px] border border-[var(--hair)] overflow-hidden"
            style={{
              background: 'var(--bg2)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="p-3 flex flex-col gap-1">
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
                    className="no-underline py-2.5 px-3 rounded-lg text-sm font-sans font-medium transition-colors"
                    style={{
                      color: isActive ? 'var(--ink)' : 'var(--ink2)',
                      background: isActive ? 'rgba(var(--glow-rgb), 0.14)' : 'transparent',
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
