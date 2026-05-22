import { create } from 'zustand';
import { api } from '../lib/api';

interface SettingsStore {
  settings: Record<string, string>;
  loading: boolean;
  fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {
    social_github: 'https://github.com/manthanpatel',
    social_linkedin: 'https://linkedin.com/in/manthanpatel',
    social_instagram: 'https://instagram.com/manthanpatel',
    social_x: 'https://x.com/manthanpatel',
    social_email: 'manthan@example.com',
    achievements: JSON.stringify([
      {
        icon: '🏆',
        title: 'Built First Full Stack App',
        description: 'Shipped a complete web application with frontend, backend, and database — from scratch.'
      },
      {
        icon: '🤖',
        title: 'Integrated AI APIs',
        description: 'Connected Claude, OpenAI, and custom ML models to production applications.'
      },
      {
        icon: '📊',
        title: 'Built Real-time Dashboard',
        description: 'Created live-updating analytics dashboards with WebSocket and Supabase Realtime.'
      },
      {
        icon: '🥇',
        title: 'Hackathon Winner',
        description: 'Won a campus-wide hackathon with the Smart Campus Sustainability System.'
      },
      {
        icon: '🚀',
        title: 'Shipped 10+ Apps',
        description: 'Delivered over 10 production-ready applications for clients and personal projects.'
      },
      {
        icon: '📦',
        title: 'Open Source Contributor',
        description: 'Contributed to popular open source projects and shared my own tools with the community.'
      }
    ])
  },
  loading: false,
  fetchSettings: async () => {
    set({ loading: true });
    try {
      const data = await api.settings.getAll();
      const obj: Record<string, string> = {};
      data.forEach(s => obj[s.key] = s.value);
      set((state) => ({ settings: { ...state.settings, ...obj }, loading: false }));
    } catch (e) {
      console.error('Failed to fetch settings', e);
      set({ loading: false });
    }
  }
}));
