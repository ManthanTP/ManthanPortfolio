import { supabase } from './supabase';
import type { Project, Post, Skill, Experience, Certificate, GalleryItem, Message, SiteSetting } from './supabase';

// Projects
export const api = {
  projects: {
    getAll: async () => {
      const { data, error } = await supabase.from('projects').select('*').order('order_index', { ascending: true });
      if (error) throw error;
      return data as Project[];
    },
    getVisible: async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('visible', true).order('order_index', { ascending: true });
      if (error) throw error;
      return data as Project[];
    },
    getFeatured: async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('visible', true).eq('featured', true).order('order_index', { ascending: true });
      if (error) throw error;
      return data as Project[];
    },
    getBySlug: async (slug: string) => {
      const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
      if (error) throw error;
      return data as Project;
    },
    create: async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('projects').insert(project).select().single();
      if (error) throw error;
      return data as Project;
    },
    update: async (id: string, updates: Partial<Project>) => {
      const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Project;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    }
  },

  // Posts
  posts: {
    getAll: async () => {
      const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
    getPublished: async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('status', 'published').order('published_at', { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
    getBySlug: async (slug: string) => {
      const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single();
      if (error) throw error;
      return data as Post;
    },
    create: async (post: Omit<Post, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('posts').insert(post).select().single();
      if (error) throw error;
      return data as Post;
    },
    update: async (id: string, updates: Partial<Post>) => {
      const { data, error } = await supabase.from('posts').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Post;
    },
    incrementLike: async (id: string) => {
      // Calls a secure RPC to increment likes without exposing the posts table to public updates
      const { error } = await supabase.rpc('increment_post_likes', { post_id: id });
      if (error) throw error;
      return true;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
    }
  },

  // Skills
  skills: {
    getAll: async () => {
      const { data, error } = await supabase.from('skills').select('*').order('order_index', { ascending: true });
      if (error) throw error;
      return data as Skill[];
    },
    create: async (skill: Omit<Skill, 'id'>) => {
      const { data, error } = await supabase.from('skills').insert(skill).select().single();
      if (error) throw error;
      return data as Skill;
    },
    update: async (id: string, updates: Partial<Skill>) => {
      const { data, error } = await supabase.from('skills').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Skill;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
    }
  },

  // Experience
  experience: {
    getAll: async () => {
      const { data, error } = await supabase.from('experience').select('*').order('order_index', { ascending: true });
      if (error) throw error;
      return data as Experience[];
    },
    create: async (exp: Omit<Experience, 'id'>) => {
      const { data, error } = await supabase.from('experience').insert(exp).select().single();
      if (error) throw error;
      return data as Experience;
    },
    update: async (id: string, updates: Partial<Experience>) => {
      const { data, error } = await supabase.from('experience').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Experience;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('experience').delete().eq('id', id);
      if (error) throw error;
    }
  },

  // Certificates
  certificates: {
    getAll: async () => {
      const { data, error } = await supabase.from('certificates').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data as Certificate[];
    }
  },

  // Gallery
  gallery: {
    getAll: async () => {
      const { data, error } = await supabase.from('gallery_items').select('*').order('order_index', { ascending: true });
      if (error) throw error;
      return data as GalleryItem[];
    },
    create: async (item: Omit<GalleryItem, 'id'>) => {
      const { data, error } = await supabase.from('gallery_items').insert(item).select().single();
      if (error) throw error;
      return data as GalleryItem;
    },
    update: async (id: string, updates: Partial<GalleryItem>) => {
      const { data, error } = await supabase.from('gallery_items').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as GalleryItem;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('gallery_items').delete().eq('id', id);
      if (error) throw error;
    }
  },

  // Messages
  messages: {
    getAll: async () => {
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Message[];
    },
    create: async (message: Omit<Message, 'id' | 'created_at' | 'read'>) => {
      const { error } = await supabase.from('messages').insert(message);
      if (error) throw error;
      return true;
    },
    update: async (id: string, updates: Partial<Message>) => {
      const { data, error } = await supabase.from('messages').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Message;
    },
    delete: async (id: string) => {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
    }
  },

  // Settings
  settings: {
    getAll: async () => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      return data as SiteSetting[];
    },
    update: async (key: string, value: string) => {
      const { data, error } = await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() }).select().single();
      if (error) throw error;
      return data as SiteSetting;
    }
  },

  // Storage
  storage: {
    uploadFile: async (file: File, bucket = 'portfolio-media', pathPrefix = '') => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = pathPrefix ? `${pathPrefix}/${fileName}` : fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    },
    // Alias for backward compatibility
    uploadImage: async (file: File, bucket = 'portfolio-media') => {
      return api.storage.uploadFile(file, bucket, '');
    },
    listFiles: async (bucket = 'portfolio-media', pathPrefix = '') => {
      const { data, error } = await supabase.storage.from(bucket).list(pathPrefix);
      if (error) throw error;
      // return full URLs for each file
      return data.filter(f => f.name !== '.emptyFolderPlaceholder').map(f => {
        const filePath = pathPrefix ? `${pathPrefix}/${f.name}` : f.name;
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return { ...f, publicUrl, filePath };
      });
    },
    deleteFile: async (filePath: string, bucket = 'portfolio-media') => {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) throw error;
    }
  },

  // Analytics
  analytics: {
    incrementVisit: async () => {
      const { error } = await supabase.rpc('increment_page_visits');
      if (error) throw error;
      return true;
    },
    getVisitCount: async () => {
      const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'total_visitors').single();
      // If error or not found, return 0
      if (error || !data) return 0;
      return parseInt(data.value || '0', 10);
    }
  }
};
