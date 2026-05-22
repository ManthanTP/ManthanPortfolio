import { create } from 'zustand';

interface AppStore {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  toggleChat: () => void;
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  splashDone: boolean;
  setSplashDone: (done: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentSection: 'home',
  setCurrentSection: (section) => set({ currentSection: section }),
  isChatOpen: false,
  setChatOpen: (open) => set({ isChatOpen: open }),
  toggleChat: () => set((s) => ({ isChatOpen: !s.isChatOpen })),
  isMusicPlaying: false,
  toggleMusic: () => set((s) => ({ isMusicPlaying: !s.isMusicPlaying })),
  splashDone: sessionStorage.getItem('splashDone') === 'true',
  setSplashDone: (done) => {
    sessionStorage.setItem('splashDone', String(done));
    set({ splashDone: done });
  },
}));
