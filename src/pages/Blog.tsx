import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useDataStore } from '../stores/useDataStore';
import { IconSearch } from '../components/ui/Icons';

const CATEGORIES = ['All', 'AI', 'Development', 'UI Design', 'Campus Innovation'];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const posts = useDataStore((s) => s.posts);
  const status = useDataStore((s) => s.status.posts);

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ['title', 'excerpt', 'tags'],
        threshold: 0.3,
      }),
    [posts]
  );

  const filtered = useMemo(() => {
    let result = posts;
    if (searchQuery) {
      result = fuse.search(searchQuery).map((r) => r.item);
    }
    if (activeFilter !== 'All') {
      result = result.filter((p) => p.tags && p.tags.includes(activeFilter));
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
            Thoughts, tutorials, and deep dives into engineering & design
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
            aria-label="Search articles"
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
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-violet)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
              pointerEvents: 'none',
            }}
          >
            <IconSearch size={18} />
          </div>
        </div>
      </ScrollReveal>

      {/* Filter */}
      <ScrollReveal>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`chip ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Blog Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 24,
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              style={{ borderRadius: 16 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
              >
                <div
                  className="glass-card"
                  style={{
                    overflow: 'hidden',
                    cursor: 'pointer',
                    height: '100%',
                    position: 'relative',
                    borderTop: '2px solid rgba(0, 245, 212, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={post.cover_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
                      alt={post.title}
                      loading="lazy"
                      style={{ width: '100%', height: 180, objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                      {(post.tags || []).slice(0, 3).map((c) => (
                        <span
                          key={c}
                          className="font-mono"
                          style={{
                            fontSize: '0.68rem',
                            color: 'var(--accent-cyan)',
                            letterSpacing: '0.5px',
                            background: 'rgba(0, 245, 212, 0.1)',
                            padding: '3px 8px',
                            borderRadius: 4,
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <h3
                      className="font-heading"
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        marginBottom: 10,
                        lineHeight: 1.4,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {post.title}
                    </h3>
                    <p
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.88rem',
                        lineHeight: 1.6,
                        marginBottom: 20,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: 1,
                      }}
                    >
                      {post.excerpt}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 14,
                        borderTop: '1px solid var(--border-color)',
                      }}
                    >
                      <span className="font-mono" style={{ color: 'var(--accent-violet)', fontSize: '0.75rem', fontWeight: 600 }}>
                        {post.read_time} MIN READ
                      </span>
                      <span className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                        {new Date(post.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {status === 'loading' && posts.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
          <p className="font-heading" style={{ fontSize: '1.1rem' }}>Loading posts...</p>
        </div>
      )}

      {status !== 'loading' && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
          <p className="font-heading" style={{ fontSize: '1.1rem' }}>No articles found</p>
        </div>
      )}
    </div>
  );
}
