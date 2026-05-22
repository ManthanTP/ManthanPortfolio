import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useEffect } from 'react';
import { api } from '../lib/api';
import type { Post } from '../lib/supabase';
import { IconSearch } from '../components/ui/Icons';

const CATEGORIES = ['All', 'AI', 'Development', 'UI Design', 'Campus Innovation'];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.posts.getPublished();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const fuse = useMemo(() => new Fuse(posts, {
    keys: ['title', 'excerpt', 'tags'],
    threshold: 0.3,
  }), [posts]);

  const filtered = useMemo(() => {
    let result = posts;
    if (searchQuery) {
      result = fuse.search(searchQuery).map((r) => r.item);
    }
    if (activeFilter !== 'All') {
      result = result.filter((p) => p.tags.includes(activeFilter));
    }
    return result;
  }, [searchQuery, activeFilter, fuse, posts]);

  return (
    <div className="section-container" style={{ paddingTop: 100 }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 className="font-hero" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 12 }}>
            <span className="neon-text">Blog</span>
          </h1>
          <p className="font-heading" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Thoughts, tutorials, and deep dives
          </p>
        </div>
      </ScrollReveal>

      {/* Search */}
      <ScrollReveal>
        <div style={{ maxWidth: 500, margin: '0 auto 24px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="font-heading"
            style={{
              width: '100%',
              padding: '14px 16px 14px 44px',
              borderRadius: 12,
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--accent-violet)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
          />
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }}>
            <IconSearch size={18} />
          </div>
        </div>
      </ScrollReveal>

      {/* Filter */}
      <ScrollReveal>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`chip ${activeFilter === cat ? 'active' : ''}`} onClick={() => setActiveFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Blog Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.02, boxShadow: '0 10px 30px rgba(0, 245, 212, 0.15)' }}
              style={{ borderRadius: 16 }}
            >
              <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                <div className="glass-card" style={{ overflow: 'hidden', cursor: 'pointer', height: '100%', position: 'relative', borderTop: '2px solid rgba(0, 245, 212, 0.3)' }}>
                  
                  {/* Subtle inner glow */}
                  <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'radial-gradient(circle, rgba(0, 245, 212, 0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

                  {/* Top glowing decorative line indicating "reading progress" */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '30%', height: 2, background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)', zIndex: 2 }} />

                  <div style={{ position: 'relative', overflow: 'hidden', zIndex: 1 }}>
                    <motion.img 
                      src={post.cover_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'} 
                      alt={post.title} 
                      loading="lazy" 
                      style={{ width: '100%', height: 180, objectFit: 'cover' }} 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  <div style={{ padding: 24, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 180px)' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                      {(post.tags || []).slice(0, 3).map((c) => (
                        <span key={c} className="font-accent" style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', letterSpacing: '1px', background: 'rgba(0, 245, 212, 0.1)', padding: '4px 10px', borderRadius: 4 }}>
                          {c}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12, lineHeight: 1.4, color: 'var(--text-primary)' }}>
                      {post.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <span className="font-mono" style={{ color: 'var(--accent-violet)', fontSize: '0.75rem', fontWeight: 600 }}>{post.read_time} MIN READ</span>
                      <span className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
          <p className="font-heading" style={{ fontSize: '1.1rem' }}>Loading posts...</p>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
          <p className="font-heading" style={{ fontSize: '1.1rem' }}>No posts found</p>
        </div>
      )}
    </div>
  );
}
