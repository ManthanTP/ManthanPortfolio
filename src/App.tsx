import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppStore } from './stores/useAppStore';
import { useSettingsStore } from './stores/useSettingsStore';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import ChatWidget from './components/chat/ChatWidget';
import Splash from './pages/Splash';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import { ProjectsManager, BlogManager, MediaLibrary, GalleryManager, ResumeManager, MessagesManager, SkillsManager, ExperienceManager, SiteSettings } from './pages/admin/AdminPages';

function App() {
  const { splashDone } = useAppStore();
  const fetchSettings = useSettingsStore(s => s.fetchSettings);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <BrowserRouter>
      {!splashDone && <Splash />}
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

      {/* AI Chat Widget — only on public pages */}
      {splashDone && <ChatWidget />}
    </BrowserRouter>
  );
}

export default App;
