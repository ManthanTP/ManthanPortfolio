import { create } from 'zustand';
import type { Project, Post, Skill, Experience, GalleryItem } from '../lib/supabase';

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

interface DataStore {
  projects: Project[];
  posts: Post[];
  skills: Skill[];
  experience: Experience[];
  gallery: GalleryItem[];
  visitorCount: number | null;
  status: {
    projects: LoadStatus;
    posts: LoadStatus;
    skills: LoadStatus;
    experience: LoadStatus;
    gallery: LoadStatus;
  };
  error: string | null;

  setProjects: (projects: Project[]) => void;
  setPosts: (posts: Post[]) => void;
  setSkills: (skills: Skill[]) => void;
  setExperience: (experience: Experience[]) => void;
  setGallery: (gallery: GalleryItem[]) => void;
  setVisitorCount: (count: number | null) => void;
  setStatus: (key: keyof DataStore['status'], status: LoadStatus) => void;
  setError: (error: string | null) => void;
  setAllData: (data: {
    projects?: Project[];
    posts?: Post[];
    skills?: Skill[];
    experience?: Experience[];
    gallery?: GalleryItem[];
    visitorCount?: number | null;
  }) => void;

  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  openProject: (slugOrId: string, navigate?: (path: string) => void) => void;
}

export const useDataStore = create<DataStore>((set, get) => ({
  projects: [],
  posts: [],
  skills: [],
  experience: [],
  gallery: [],
  visitorCount: null,
  selectedProjectId: null,
  setSelectedProjectId: (selectedProjectId) => set({ selectedProjectId }),

  openProject: (slugOrId, navigate) => {
    const list = get().projects;
    const match = list.find((p) => p.id === slugOrId || p.slug === slugOrId);
    const targetSlug = match ? match.slug : slugOrId;
    if (match) {
      set({ selectedProjectId: match.id });
    }
    // Deep-link or navigate directly to the project detail view
    if (navigate) {
      navigate(`/project/${targetSlug}`);
    } else {
      window.location.href = `/project/${targetSlug}`;
    }
  },
  status: {
    projects: 'idle',
    posts: 'idle',
    skills: 'idle',
    experience: 'idle',
    gallery: 'idle',
  },
  error: null,

  setProjects: (projects) => set((s) => ({ projects, status: { ...s.status, projects: 'ready' } })),
  setPosts: (posts) => set((s) => ({ posts, status: { ...s.status, posts: 'ready' } })),
  setSkills: (skills) => set((s) => ({ skills, status: { ...s.status, skills: 'ready' } })),
  setExperience: (experience) => set((s) => ({ experience, status: { ...s.status, experience: 'ready' } })),
  setGallery: (gallery) => set((s) => ({ gallery, status: { ...s.status, gallery: 'ready' } })),
  setVisitorCount: (visitorCount) => set({ visitorCount }),
  setStatus: (key, status) => set((s) => ({ status: { ...s.status, [key]: status } })),
  setError: (error) => set({ error }),
  setAllData: (data) =>
    set((s) => ({
      projects: data.projects ?? s.projects,
      posts: data.posts ?? s.posts,
      skills: data.skills ?? s.skills,
      experience: data.experience ?? s.experience,
      gallery: data.gallery ?? s.gallery,
      visitorCount: data.visitorCount !== undefined ? data.visitorCount : s.visitorCount,
      status: {
        projects: data.projects ? 'ready' : s.status.projects,
        posts: data.posts ? 'ready' : s.status.posts,
        skills: data.skills ? 'ready' : s.status.skills,
        experience: data.experience ? 'ready' : s.status.experience,
        gallery: data.gallery ? 'ready' : s.status.gallery,
      },
    })),
}));
