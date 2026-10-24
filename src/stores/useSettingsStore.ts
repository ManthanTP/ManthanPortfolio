import { create } from 'zustand';
import { api } from '../lib/api';
import { DEFAULT_ACHIEVEMENTS, DEFAULT_DRIVE_CARDS } from '../lib/constants';

interface SettingsStore {
  settings: Record<string, string>;
  loading: boolean;
  fetchSettings: () => Promise<void>;
  updateLocalSetting: (key: string, value: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {
    social_github: 'https://github.com/manthanpatel',
    social_linkedin: 'https://linkedin.com/in/manthanpatel',
    social_instagram: 'https://instagram.com/manthanpatel',
    social_x: 'https://x.com/manthanpatel',
    social_email: 'manthan@example.com',
    hero_tagline: 'Full-stack developer building AI-powered web apps',
    availability_status: 'open',
    availability_text: 'Available for freelance & full-time roles',
    career_start_date: '2023-01',
    show_phone: 'false',
    show_map: 'false',
    blog_min_posts: '1',
    bg_video_enabled: 'true',
    quick_info_enabled: 'true',
    music_url: '',
    music_title: '',
    achievements: JSON.stringify(DEFAULT_ACHIEVEMENTS),
    drive_cards: JSON.stringify(DEFAULT_DRIVE_CARDS),
  },
  loading: false,
  fetchSettings: async () => {
    set({ loading: true });
    try {
      const data = await api.settings.getAll();
      const obj: Record<string, string> = {};
      data.forEach((s) => (obj[s.key] = s.value));
      set((state) => ({ settings: { ...state.settings, ...obj }, loading: false }));
    } catch (e) {
      console.error('Failed to fetch settings', e);
      set({ loading: false });
    }
  },
  updateLocalSetting: (key: string, value: string) => {
    set((state) => ({ settings: { ...state.settings, [key]: value } }));
  },
}));
