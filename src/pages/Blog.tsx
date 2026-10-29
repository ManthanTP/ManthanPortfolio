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

  return (
    <div className="section-container pt-20">
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="hk">Writing</span>
            <h2 className="big text-4xl sm:text-5xl mt-2">
              Engineering <em>Notes</em>
            </h2>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--hair)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--amber)]"
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Blog Cards Grid */}
      <ScrollReveal delay={0.08}>
        <div className="blog">
          {filtered.map((post, i) => (
            <Link
              key={post.id || post.slug}
              to={`/blog/${post.slug}`}
              className="card post no-underline block group"
            >
              <div
                className="cover"
                style={{ background: GRADIENTS[i % GRADIENTS.length] }}
              >
                {post.cover_url && (
                  <img
                    src={post.cover_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <span>0{i + 1}</span>
              </div>

              <div className="pb">
                <div className="pm">
                  <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}</span>
                  <span>{post.read_time || '5 min read'}</span>
                </div>

                <div className="text-xl font-heading font-black uppercase text-[var(--ink)] group-hover:text-[var(--amber)] transition-colors mt-1">
                  {post.title}
                </div>

                <p className="vs text-sm line-clamp-2 mt-1">
                  {post.excerpt || 'Technical breakdown, architecture patterns, and key takeaways.'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
