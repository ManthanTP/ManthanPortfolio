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

  // Live IST Clock
  const [istTime, setIstTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        setIstTime(formatted);
      } catch {
        setIstTime(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const blogMinPosts = parseInt(settings.blog_min_posts ?? '1', 10);
  const showBlog = blogMinPosts === 0 || posts.length >= blogMinPosts;

  const visibleLinks = NAV_LINKS.filter((link) => {
    if (link.path === '#resume' && settings.show_resume_section === 'false') return false;
    if (link.path === '#blog' && !showBlog) return false;
    return true;
  });

  const hookActive = useActiveSection(visibleLinks.map((link) => link.path.substring(1)));

  // Scroll position tracking with sticky header offset
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      if (window.scrollY < 120) {
        setCurrentSection('home');
        return;
      }

      const scrollPos = window.scrollY + 220;
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
    <header
      className="sticky top-0 z-50 w-full border-b border-[var(--hair)] transition-colors duration-300"
      style={{
        background: 'var(--nav)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="w-full max-w-[min(1440px,94vw)] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Brand & Status (matching GCL header) */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-2.5 group no-underline"
            aria-label="Manthan Patel, home"
          >
            <div
              className="w-9 h-9 rounded-full overflow-hidden border border-[var(--hair)] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
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
            <div className="flex flex-col">
              <span className="font-display text-[22px] leading-none font-black tracking-wide text-[var(--ink)] group-hover:text-[var(--amber)] transition-colors">
                MP
              </span>
              <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-widest text-[var(--ink2)] mt-0.5">
                PORTFOLIO · 2026
              </span>
            </div>
          </a>

          <div className="hidden lg:block w-[1px] h-5 bg-[var(--hair)]" />

          {/* Availability pill */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-mono tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AVAILABLE FOR WORK</span>
          </div>
        </div>

        {/* Center: Nav links with correct GCL gapping & theme-aware button styling */}
        <nav className="hidden min-[900px]:flex items-center gap-1.5 sm:gap-2">
          {visibleLinks.map((link) => {
            const linkId = link.path.substring(1);
            const isActive =
              location.pathname === '/'
                ? activeId === linkId
                : location.pathname === link.path;

            return (
              <a
                key={link.path}
                href={location.pathname === '/' ? link.path : `/${link.path}`}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`relative px-3.5 py-1.5 rounded-lg text-[13px] font-body font-medium transition-all duration-200 no-underline whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-[#2C3480] shadow-[0_2px_12px_rgba(44,52,128,0.4)]'
                    : 'text-[var(--ink2)] hover:text-[var(--ink)] hover:bg-[rgba(var(--glow-rgb),0.08)]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right: Clock & Theme Toggle & Mobile Menu */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          {istTime && (
            <div className="hidden md:flex items-center gap-1.5 font-mono text-xs text-[var(--ink2)] tracking-wider">
              <span className="text-[var(--ink)] font-semibold">{istTime}</span>
              <span className="opacity-60 text-[10px]">IST</span>
            </div>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-lg border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:bg-[rgba(var(--glow-rgb),0.1)] transition-colors cursor-pointer"
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
            className="min-[900px]:hidden w-9 h-9 rounded-lg border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:bg-[rgba(var(--glow-rgb),0.1)] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <IconX size={18} /> : <IconMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (<900px) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="min-[900px]:hidden border-t border-[var(--hair)]"
            style={{
              background: 'var(--bg2)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="p-4 flex flex-col gap-1.5 max-w-[min(1440px,94vw)] mx-auto">
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
                    className={`no-underline flex items-center min-h-[44px] px-4 rounded-lg text-[14px] font-body font-medium transition-all ${
                      isActive
                        ? 'text-white bg-[#2C3480]'
                        : 'text-[var(--ink2)] hover:text-[var(--ink)] hover:bg-[rgba(var(--glow-rgb),0.08)]'
                    }`}
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
