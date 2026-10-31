import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useDataStore } from '../stores/useDataStore';
import { api } from '../lib/api';
import { DEMO_POSTS } from '../lib/data';

const GRADIENTS = [
  'linear-gradient(135deg, #1b2259, #3845a6)',
  'linear-gradient(135deg, #0d1642, #2C3480)',
  'linear-gradient(135deg, #232b6e, #5362cf)',
  'linear-gradient(135deg, #151c4a, #414ea6)',
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const storePosts = useDataStore((s) => s.posts);
  const setPosts = useDataStore((s) => s.setPosts);

  useEffect(() => {
    if (storePosts.length === 0) {
      api.posts
        .getPublished()
        .then((data) => setPosts(data && data.length > 0 ? data : DEMO_POSTS))
        .catch(() => setPosts(DEMO_POSTS));
    }
  }, [storePosts.length, setPosts]);

  const posts = storePosts.length > 0 ? storePosts : DEMO_POSTS;

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ['title', 'excerpt', 'tags'],
        threshold: 0.3,
      }),
    [posts]
  );

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    return fuse.search(searchQuery).map((r) => r.item);
  }, [searchQuery, fuse, posts]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const year = d.getFullYear();
      if (year > 2099 || year < 1990) return 'Recent';
      return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="section-container sec">
      <ScrollReveal>
        <div className="sh flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="eyebrow">Writing</span>
            <h2>BLOG</h2>
          </div>

          {/* Search Input: 260px right-aligned */}
          <div className="w-full sm:w-[260px]">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--hair)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--amber)]"
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Blog Cards Grid: 2-column layout matching design reference */}
      <ScrollReveal delay={0.08}>
        <div className="blog grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.slice(0, 4).map((post, i) => (
            <Link
              key={post.id || post.slug}
              to={`/blog/${post.slug}`}
              className="card post no-underline block group p-3.5 transition-transform duration-300 hover:-translate-y-1"
            >
              <div
                className="cover aspect-[16/9] relative overflow-hidden rounded-[10px] border border-[var(--hair)]"
                style={{ background: GRADIENTS[i % GRADIENTS.length] }}
              >
                {post.cover_url ? (
                  <>
                    <img
                      src={post.cover_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(3,4,9,0.75)] via-[rgba(3,4,9,0.2)] to-transparent pointer-events-none" />
                    <span className="absolute left-3.5 bottom-2.5 font-display text-2xl font-black text-white uppercase drop-shadow-md">
                      0{i + 1} · {post.tags?.[0] || 'Dev Notes'}
                    </span>
                  </>
                ) : (
                  <span className="absolute left-3.5 bottom-2.5 font-display text-3xl font-black text-white uppercase">
                    0{i + 1} · {post.tags?.[0] || 'Dev Notes'}
                  </span>
                )}
              </div>

              <div className="pb pt-3">
                <div className="pm flex items-center justify-between text-xs font-mono text-[var(--ink2)] mb-1.5 tracking-wider uppercase">
                  <span>{formatDate(post.published_at)}</span>
                  <span>{post.read_time ? `${post.read_time} min read` : '5 min read'}</span>
                </div>

                <div className="text-xl sm:text-2xl font-display font-black uppercase text-[var(--ink)] group-hover:text-[var(--amber)] transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </div>

                <p className="vs font-body text-[15px] line-clamp-2 mt-2 text-[var(--ink2)] leading-relaxed">
                  {post.excerpt || 'Technical breakdown, architecture patterns, and key takeaways.'}
                </p>

                <div className="pt-3 text-xs font-mono text-[var(--amber)] font-medium tracking-wider uppercase inline-flex items-center gap-1.5">
                  Read post →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
