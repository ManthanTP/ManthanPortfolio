import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { IconHome, IconFolder, IconPen, IconImage, IconFile, IconSend, IconCode, IconBriefcase, IconTrophy } from '../../components/ui/Icons';
import { supabase } from '../../lib/supabase';

const SIDEBAR_ITEMS = [
  { path: '/admin', label: 'Overview', Icon: IconHome },
  { path: '/admin/projects', label: 'Projects', Icon: IconFolder },
  { path: '/admin/blog', label: 'Blog', Icon: IconPen },
  { path: '/admin/gallery', label: 'Gallery', Icon: IconImage },
  { path: '/admin/media', label: 'Media', Icon: IconFile },
  { path: '/admin/resume', label: 'Resume', Icon: IconFile },
  { path: '/admin/messages', label: 'Messages', Icon: IconSend },
  { path: '/admin/skills', label: 'Skills', Icon: IconCode },
  { path: '/admin/experience', label: 'Experience', Icon: IconBriefcase },
  { path: '/admin/settings', label: 'Settings', Icon: IconTrophy },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/admin/login');
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/admin/login');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ display: 'none' }} id="admin-sidebar">
        <div style={{ padding: '0 24px 24px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border-color)', marginBottom: 8 }}>
          <span className="font-accent" style={{ fontSize: '1.2rem', color: '#6c63ff' }}>MP</span>
          <span className="font-heading" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Admin</span>
        </div>
        {SIDEBAR_ITEMS.map(({ path, label, Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path} className={isActive ? 'active' : ''}>
              <Icon size={18} /> {label}
            </Link>
          );
        })}
        <div style={{ marginTop: 'auto', padding: '16px 24px', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '10px', borderRadius: 8,
              border: '1px solid var(--border-color)', background: 'transparent',
              color: 'var(--text-secondary)', cursor: 'pointer',
              fontFamily: 'var(--font-heading)', fontSize: '0.85rem',
            }}
          >
            Sign Out
          </button>
          <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: 'var(--text-secondary)', fontSize: '0.8rem', textDecoration: 'none' }}>
            ← View Site
          </Link>
        </div>
      </aside>

      {/* Mobile Admin Nav */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--glass-border)', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="lg:hidden">
        <span className="font-accent" style={{ color: '#6c63ff', fontSize: '1rem' }}>MP Admin</span>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 8, padding: '6px 14px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}>
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '80px 20px 40px' }} className="admin-main">
        <Outlet />
      </main>

      <style>{`
        @media (min-width: 1024px) {
          #admin-sidebar { display: block !important; }
          .admin-main { margin-left: 260px !important; padding: 40px 40px !important; }
        }
      `}</style>
    </div>
  );
}
