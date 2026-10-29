import { create } from 'zustand';

interface ThemeStore {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

function getInitialTheme(): 'dark' | 'light' {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

const initial = getInitialTheme();
try {
  document.documentElement.setAttribute('data-theme', initial);
} catch {}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: initial,
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', next);
      } catch {}
      try {
        document.documentElement.setAttribute('data-theme', next);
      } catch {}
      return { theme: next };
    }),
  setTheme: (theme) => {
    try {
      localStorage.setItem('theme', theme);
    } catch {}
    try {
      document.documentElement.setAttribute('data-theme', theme);
    } catch {}
    set({ theme });
  },
}));
