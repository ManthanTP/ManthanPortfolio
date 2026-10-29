import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppStore } from './stores/useAppStore';
import { useSettingsStore } from './stores/useSettingsStore';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import QuickPanel from './components/ui/QuickPanel';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { useGlobalCardGlow } from './hooks/useGlobalCardGlow';
import Splash from './pages/Splash';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import {
  ProjectsManager,
  BlogManager,
  MediaLibrary,
  GalleryManager,
  ResumeManager,
  MessagesManager,
  SkillsManager,
  ExperienceManager,
  SiteSettings,
} from './pages/admin/AdminPages';

function App() {
  const { splashDone } = useAppStore();
  const fetchSettings = useSettingsStore((s) => s.fetchSettings);
  useGlobalCardGlow();

  useEffect(() => {
    fetchSettings();

    // If splash screen was already completed, ensure site data is hydrated
    if (splashDone) {
      import('./lib/preload').then(({ preloadSite }) => {
        preloadSite().catch((err) => console.error('Background preload error:', err));
      });
    }

    // Scroll restoration manual to prevent unwanted auto-jumps
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Lock body scroll during splash loader
    document.body.style.overflow = splashDone ? '' : 'hidden';

    // Analytics: Increment visit count once per session
    if (!sessionStorage.getItem('mp_has_visited')) {
      import('./lib/api').then(({ api }) => {
        api.analytics.incrementVisit().catch((err) => console.error('Analytics error:', err));
      });
      sessionStorage.setItem('mp_has_visited', 'true');
    }
  }, [fetchSettings, splashDone]);

  return (
    <BrowserRouter>
      {!splashDone && <Splash />}
      <ErrorBoundary>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="resume" element={<ResumeManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="experience" element={<ExperienceManager />} />
            <Route path="settings" element={<SiteSettings />} />
          </Route>
        </Routes>
      </ErrorBoundary>

      {/* Quick Info & Music Floating Panel — only on public pages when splash is done */}
      {splashDone && <QuickPanel />}
    </BrowserRouter>
  );
}

export default App;
