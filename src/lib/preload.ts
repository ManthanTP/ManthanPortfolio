import { api } from './api';
import {
  DEMO_PROJECTS,
  DEMO_POSTS,
  DEMO_SKILLS,
  DEMO_EXPERIENCE,
  DEMO_GALLERY,
} from './data';
import { useDataStore } from '../stores/useDataStore';
import { useSettingsStore } from '../stores/useSettingsStore';

export interface PreloadProgress {
  statusText: string;
  progress: number;
}

function decodeImageWithCap(url: string, timeoutMs = 6000): Promise<boolean> {
  return new Promise((resolve) => {
    let resolved = false;
    const finish = (ok: boolean) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve(ok);
      }
    };

    const timer = setTimeout(() => finish(false), timeoutMs);
    const img = new Image();
    img.src = url;

    // Use HTMLImageElement.decode if supported
    if (typeof img.decode === 'function') {
      img
        .decode()
        .then(() => finish(true))
        .catch(() => {
          // If decode fails, fallback to simple onload
          if (img.complete && img.naturalWidth > 0) finish(true);
          else finish(false);
        });
    } else {
      img.onload = () => finish(true);
      img.onerror = () => finish(false);
    }
  });
}

const isVideoUrl = (url: string): boolean => {
  return /\.(mp4|webm|ogg)($|\?)/i.test(url);
};

export async function preloadSite(
  onProgress?: (info: PreloadProgress) => void
): Promise<{ success: boolean; error?: string }> {
  const store = useDataStore.getState();
  const settingsStore = useSettingsStore.getState();

  // Initial status
  onProgress?.({ statusText: 'Initializing portfolio...', progress: 5 });

  let completedTasks = 0;
  // Total initial tasks: 7 data fetches + 1 font load = 8 base tasks
  let totalTasks = 8;

  const notify = (statusText: string) => {
    const pct = Math.min(99, Math.round((completedTasks / totalTasks) * 100));
    onProgress?.({ statusText, progress: Math.max(5, pct) });
  };

  try {
    // 1. Run all data queries and settings in PARALLEL
    const [
      ,
      projectsRes,
      postsRes,
      skillsRes,
      experienceRes,
      galleryRes,
      visitorsRes,
    ] = await Promise.allSettled([
      settingsStore.fetchSettings().then(() => {
        completedTasks++;
        notify('Loading settings...');
      }),
      api.projects.getVisible().then((data) => {
        completedTasks++;
        notify('Loading projects...');
        return data && data.length > 0 ? data : DEMO_PROJECTS;
      }),
      api.posts.getPublished().then((data) => {
        completedTasks++;
        notify('Loading stories...');
        return data && data.length > 0 ? data : DEMO_POSTS;
      }),
      api.skills.getAll().then((data) => {
        completedTasks++;
        notify('Loading skills...');
        return data && data.length > 0 ? data : DEMO_SKILLS;
      }),
      api.experience.getAll().then((data) => {
        completedTasks++;
        notify('Loading experience...');
        return data && data.length > 0 ? data : DEMO_EXPERIENCE;
      }),
      api.gallery.getAll().then((data) => {
        completedTasks++;
        notify('Loading gallery...');
        return data && data.length > 0 ? data : DEMO_GALLERY;
      }),
      api.analytics.getVisitCount().then((count) => {
        completedTasks++;
        return count;
      }),
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
        completedTasks++;
        notify('Preparing typography...');
      }),
    ]);

    // Check query results
    const projects = projectsRes.status === 'fulfilled' ? projectsRes.value : DEMO_PROJECTS;
    const posts = postsRes.status === 'fulfilled' ? postsRes.value : DEMO_POSTS;
    const skills = skillsRes.status === 'fulfilled' ? skillsRes.value : DEMO_SKILLS;
    const experience = experienceRes.status === 'fulfilled' ? experienceRes.value : DEMO_EXPERIENCE;
    const gallery = galleryRes.status === 'fulfilled' ? galleryRes.value : DEMO_GALLERY;
    const visitorCount = visitorsRes.status === 'fulfilled' ? visitorsRes.value : null;

    // Check if critical queries threw an error
    const anyDataFailed =
      projectsRes.status === 'rejected' &&
      postsRes.status === 'rejected' &&
      skillsRes.status === 'rejected';

    if (anyDataFailed) {
      store.setError('Failed to connect to database.');
      return { success: false, error: 'Failed to connect to database.' };
    }

    // Populate data store
    store.setAllData({
      projects,
      posts,
      skills,
      experience,
      gallery,
      visitorCount,
    });

    // 2. Collect critical images to decode:
    // - Profile image
    // - First image of every visible project
    // - First 6 gallery images (skip videos)
    const settings = useSettingsStore.getState().settings;
    const criticalImageUrls: string[] = [];

    if (settings.profile_image_url) {
      criticalImageUrls.push(settings.profile_image_url);
    }

    projects.forEach((p) => {
      if (p.images && p.images.length > 0 && p.images[0]) {
        criticalImageUrls.push(p.images[0]);
      }
    });

    gallery.slice(0, 6).forEach((item) => {
      const firstUrl = (item.image_url || '').split(',')[0]?.trim();
      if (firstUrl && !isVideoUrl(firstUrl)) {
        criticalImageUrls.push(firstUrl);
      }
    });

    // Remove duplicates
    const uniqueImages = Array.from(new Set(criticalImageUrls.filter(Boolean)));

    // Recalculate total tasks with images
    totalTasks = 8 + uniqueImages.length;
    notify('Loading images...');

    // Decode critical images in parallel with 6s cap
    if (uniqueImages.length > 0) {
      await Promise.all(
        uniqueImages.map(async (url) => {
          await decodeImageWithCap(url, 6000);
          completedTasks++;
          const remaining = totalTasks - completedTasks;
          notify(remaining <= 2 ? 'Almost there...' : 'Loading images...');
        })
      );
    }

    onProgress?.({ statusText: 'Ready', progress: 100 });
    return { success: true };
  } catch (err: any) {
    console.error('Preload site error:', err);
    store.setError(err?.message || 'Preload error');
    return { success: false, error: err?.message || 'Preload error' };
  }
}
