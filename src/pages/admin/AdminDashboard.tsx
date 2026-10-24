import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { safeJsonParse } from '../../lib/safeJson';
import type { Message, Project, Skill, Experience, GalleryItem, Post } from '../../lib/supabase';

interface HealthWarning {
  id: string;
  message: string;
  link: string;
  linkText: string;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ visitors: 0, messages: 0, projects: 0 });
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [warnings, setWarnings] = useState<HealthWarning[]>([]);
  const [healthChecking, setHealthChecking] = useState(true);
  const settings = useSettingsStore((s) => s.settings);

  useEffect(() => {
    const fetchData = async () => {
      setHealthChecking(true);
      try {
        const [msgs, projs, posts, skills, exps, gallery, visitors] = await Promise.all([
          api.messages.getAll().catch(() => [] as Message[]),
          api.projects.getAll().catch(() => [] as Project[]),
          api.posts.getAll().catch(() => [] as Post[]),
          api.skills.getAll().catch(() => [] as Skill[]),
          api.experience.getAll().catch(() => [] as Experience[]),
          api.gallery.getAll().catch(() => [] as GalleryItem[]),
          api.analytics.getVisitCount().catch(() => 0),
        ]);

        setRecentMessages(msgs.slice(0, 5));
        setCounts({
          visitors,
          messages: msgs.length,
          projects: projs.length,
        });

        // Compute Content Health Warnings
        const healthIssues: HealthWarning[] = [];

        // 1. Placeholder text check (...., TBD, lorem)
        const checkPlaceholder = (text: string | null | undefined, label: string, link: string, linkText: string) => {
          if (!text) return;
          if (/\.\.\.\.|TBD|lorem/i.test(text)) {
            healthIssues.push({
              id: `placeholder-${link}-${label}`,
              message: `Placeholder text ("...", "TBD", or "lorem") found in ${label}`,
              link,
              linkText,
            });
          }
        };

        projs.forEach((p) => {
          const pAny = p as any;
          checkPlaceholder(p.description, `project "${p.title}"`, '/admin/projects', 'Edit Project');
          checkPlaceholder(pAny.tagline, `project tagline "${p.title}"`, '/admin/projects', 'Edit Project');
          checkPlaceholder(pAny.problem, `project problem "${p.title}"`, '/admin/projects', 'Edit Project');
        });
        posts.forEach((p) => checkPlaceholder(p.content, `blog post "${p.title}"`, '/admin/blog', 'Edit Post'));
        exps.forEach((e) => checkPlaceholder(e.description, `experience "${e.title}"`, '/admin/experience', 'Edit Experience'));
        checkPlaceholder(settings.about_text, 'About Me text', '/admin/settings', 'Edit Settings');

        // 2. Experience with identical start/end dates
        exps.forEach((e) => {
          if (e.start_date && e.end_date && !e.current && e.start_date.trim() === e.end_date.trim()) {
            healthIssues.push({
              id: `exp-dates-${e.id}`,
              message: `Experience "${e.title} @ ${e.org}" has identical start and end dates (${e.start_date})`,
              link: '/admin/experience',
              linkText: 'Check Experience',
            });
          }
        });

        // 3. ALL-CAPS descriptions longer than 20 chars
        projs.forEach((p) => {
          if (p.description && p.description.length > 20 && p.description === p.description.toUpperCase() && /[A-Z]/.test(p.description)) {
            healthIssues.push({
              id: `caps-proj-${p.id}`,
              message: `Project "${p.title}" description is written in all-caps`,
              link: '/admin/projects',
              linkText: 'Edit Project',
            });
          }
        });
        exps.forEach((e) => {
          if (e.description && e.description.length > 20 && e.description === e.description.toUpperCase() && /[A-Z]/.test(e.description)) {
            healthIssues.push({
              id: `caps-exp-${e.id}`,
              message: `Experience "${e.title}" description is written in all-caps`,
              link: '/admin/experience',
              linkText: 'Edit Experience',
            });
          }
        });

        // 4. Projects missing image, description, live or GitHub URL
        projs.forEach((p) => {
          if (!p.images || p.images.length === 0) {
            healthIssues.push({
              id: `proj-img-${p.id}`,
              message: `Project "${p.title}" has no cover or preview images`,
              link: '/admin/projects',
              linkText: 'Add Image',
            });
          }
          if (!p.description || !p.description.trim()) {
            healthIssues.push({
              id: `proj-desc-${p.id}`,
              message: `Project "${p.title}" is missing a description`,
              link: '/admin/projects',
              linkText: 'Add Description',
            });
          }
          if (!p.live_url && !p.github_url) {
            healthIssues.push({
              id: `proj-url-${p.id}`,
              message: `Project "${p.title}" is missing both Live Demo and GitHub URLs`,
              link: '/admin/projects',
              linkText: 'Add Link',
            });
          }
        });

        // 5. Featured projects > 4
        const featuredCount = projs.filter((p) => p.featured).length;
        if (featuredCount > 4) {
          healthIssues.push({
            id: 'featured-excess',
            message: `${featuredCount} projects marked as featured (Home displays up to 4; others appear in View All)`,
            link: '/admin/projects',
            linkText: 'Manage Featured',
          });
        }

        // 6. Gallery or projects images missing alt-able titles
        gallery.forEach((g) => {
          if (!g.title || !g.title.trim()) {
            healthIssues.push({
              id: `gal-title-${g.id}`,
              message: 'A gallery item is missing a title (needed for accessible alt text)',
              link: '/admin/gallery',
              linkText: 'Fix Gallery',
            });
          }
        });
        projs.forEach((p) => {
          if (!p.title || !p.title.trim()) {
            healthIssues.push({
              id: `proj-title-${p.id}`,
              message: 'A project is missing a title',
              link: '/admin/projects',
              linkText: 'Fix Project',
            });
          }
        });

        // 7. Counts mismatch between about_stats projects value and visible projects
        const stats = safeJsonParse<any[]>(settings.about_stats, []);
        const projectsStat = stats.find((s: any) => /project/i.test(s.label || ''));
        const visibleProjectsCount = projs.filter((p) => p.visible).length;
        if (projectsStat && typeof projectsStat.value === 'number' && projectsStat.value !== visibleProjectsCount) {
          healthIssues.push({
            id: 'stats-mismatch',
            message: `About Stats "${projectsStat.label}" shows ${projectsStat.value}, but visible projects count in database is ${visibleProjectsCount}`,
            link: '/admin/settings',
            linkText: 'Sync Stats',
          });
        }

        // 8. Skills with category empty
        skills.forEach((s) => {
          if (!s.category || !s.category.trim()) {
            healthIssues.push({
              id: `skill-cat-${s.id}`,
              message: `Skill "${s.name}" is missing a category`,
              link: '/admin/skills',
              linkText: 'Assign Category',
            });
          }
        });

        setWarnings(healthIssues);
      } catch (e) {
        console.error('Failed to compute dashboard health', e);
      } finally {
        setHealthChecking(false);
      }
    };

    fetchData();
  }, [settings.about_stats, settings.about_text]);

  const stats = [
    { label: 'Total Visitors', value: counts.visitors.toString(), icon: '👥', color: '#6c63ff' },
    { label: 'Resume Downloads', value: settings.resume_downloads || '0', icon: '📄', color: '#00f5d4' },
    { label: 'Messages', value: counts.messages.toString(), icon: '✉️', color: '#f4a738' },
    { label: 'Total Projects', value: counts.projects.toString(), icon: '🚀', color: '#6c63ff' },
  ];

  return (
    <div>
      <h1 className="font-hero" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
        Dashboard
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Welcome back, Manthan 👋</p>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 36,
        }}
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} whileHover={{ y: -4 }} className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '1.8rem' }}>{stat.icon}</span>
              <span className="font-accent" style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>
                {stat.value}
              </span>
            </div>
            <p className="font-heading" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Content Health Card */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.2rem' }}>🩺</span>
            <h2 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              Content Health
            </h2>
          </div>
          {warnings.length === 0 && !healthChecking ? (
            <span
              style={{
                fontSize: '0.75rem',
                background: 'rgba(0, 245, 212, 0.15)',
                color: 'var(--accent-cyan)',
                padding: '4px 12px',
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              ✓ All good
            </span>
          ) : (
            <span
              style={{
                fontSize: '0.75rem',
                background: 'rgba(255, 68, 68, 0.15)',
                color: '#ff6666',
                padding: '4px 12px',
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              {warnings.length} {warnings.length === 1 ? 'item' : 'items'} need attention
            </span>
          )}
        </div>

        {healthChecking ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Analyzing content health...</p>
        ) : warnings.length === 0 ? (
          <div style={{ padding: '12px 0', color: 'var(--accent-cyan)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>✓</span> All good! All portfolio content is complete, formatted, and ready for visitors.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {warnings.map((w) => (
              <div
                key={w.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem',
                }}
              >
                <span style={{ color: 'var(--text-primary)', marginRight: 16 }}>
                  ⚠️ {w.message}
                </span>
                <Link
                  to={w.link}
                  style={{
                    color: 'var(--accent-violet)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    flexShrink: 0,
                  }}
                >
                  {w.linkText} →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
        <Link to="/admin/projects" className="btn-primary" style={{ textDecoration: 'none' }}>
          + Add Project
        </Link>
        <Link to="/admin/blog" className="btn-secondary" style={{ textDecoration: 'none' }}>
          + New Blog Post
        </Link>
      </div>

      {/* Recent Messages */}
      <div className="glass-card" style={{ padding: 24, maxWidth: 800 }}>
        <h2 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>
          Recent Messages
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {recentMessages.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '12px 0' }}>
              No recent messages.
            </p>
          ) : (
            recentMessages.map((msg, i) => (
              <div
                key={msg.id || i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: i < recentMessages.length - 1 ? '1px solid var(--border-color)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {!msg.read && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--accent-violet)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div>
                    <p className="font-heading" style={{ fontSize: '0.9rem', fontWeight: msg.read ? 400 : 600 }}>
                      {msg.name}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {msg.subject || 'No Subject'}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <a
                    href={`mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent('Re: ' + (msg.subject || 'Portfolio Inquiry'))}`}
                    style={{
                      color: 'var(--accent-cyan)',
                      fontSize: '0.75rem',
                      textDecoration: 'none',
                    }}
                  >
                    Reply
                  </a>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', flexShrink: 0 }}>
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
