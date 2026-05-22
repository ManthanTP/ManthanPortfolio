import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useSettingsStore } from '../../stores/useSettingsStore';
import type { Message } from '../../lib/supabase';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ visitors: 0, messages: 0, projects: 0 });
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const settings = useSettingsStore(s => s.settings);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const msgs = await api.messages.getAll();
        const projs = await api.projects.getAll();
        const visitors = await api.analytics.getVisitCount();
        
        setRecentMessages(msgs.slice(0, 5));
        setCounts(prev => ({
          ...prev,
          visitors: visitors,
          messages: msgs.length,
          projects: projs.length
        }));
      } catch(e) {
        console.error('Failed to fetch dashboard data', e);
      }
    };
    fetchData();
  }, []);

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        {stats.map((stat) => (
          <motion.div key={stat.label} whileHover={{ y: -4 }} className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '1.8rem' }}>{stat.icon}</span>
              <span className="font-accent" style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>{stat.value}</span>
            </div>
            <p className="font-heading" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
        <button className="btn-primary">+ Add Project</button>
        <button className="btn-secondary">+ New Blog Post</button>
      </div>

      {/* Recent Messages */}
      <div className="glass-card" style={{ padding: 24, maxWidth: 700 }}>
        <h2 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>Recent Messages</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {recentMessages.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '12px 0' }}>No recent messages.</p>
          ) : recentMessages.map((msg, i) => (
            <div
              key={msg.id || i}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: i < recentMessages.length - 1 ? '1px solid var(--border-color)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {!msg.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-violet)', flexShrink: 0 }} />}
                <div>
                  <p className="font-heading" style={{ fontSize: '0.9rem', fontWeight: msg.read ? 400 : 600 }}>{msg.name}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{msg.subject || 'No Subject'}</p>
                </div>
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', flexShrink: 0 }}>
                {new Date(msg.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
