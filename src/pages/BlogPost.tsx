import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import type { Post } from '../lib/supabase';
import { IconArrowLeft, IconHeart, IconShare } from '../components/ui/Icons';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [readProgress, setReadProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [related, setRelated] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await api.posts.getBySlug(slug);
        setPost(data);
        if (data) {
          setLikeCount(data.likes || 0);
        }
        // Fetch related
        const all = await api.posts.getPublished();
        setRelated(all.filter((p: any) => p.id !== data?.id).slice(0, 2));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Realtime likes subscription
  useEffect(() => {
    if (!post?.id) return;

    const channel = supabase
      .channel(`public:posts:${post.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
          filter: `id=eq.${post.id}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new.likes === 'number') {
            setLikeCount(payload.new.likes);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [post?.id]);

  const handleLike = async () => {
    if (!post) return;
    
    // Optimistic UI update
    setLiked(true);
    setLikeCount((c) => c + 1);

    try {
      await api.posts.incrementLike(post.id);
    } catch (err) {
      console.error('Failed to increment like', err);
      // Revert on failure
      setLikeCount((c) => c - 1);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="section-container" style={{ paddingTop: 120, textAlign: 'center' }}>
        <h1 className="font-hero" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>Loading post...</h1>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="section-container" style={{ paddingTop: 120, textAlign: 'center' }}>
        <h1 className="font-hero" style={{ fontSize: '2rem' }}>Post not found</h1>
        <Link to="/#blog" className="btn-primary" style={{ marginTop: 24, textDecoration: 'none' }}>
          <IconArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Reading Progress */}
      <div className="reading-progress" style={{ width: `${readProgress}%` }} />

      <div className="section-container" style={{ paddingTop: 100, maxWidth: 800, margin: '0 auto' }}>
        <Link to="/#blog" className="font-heading" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.9rem' }}>
          <IconArrowLeft size={16} /> Back to Blog
        </Link>

        <ScrollReveal>
          <img src={post.cover_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'} alt={post.title} style={{ width: '100%', height: 'auto', maxHeight: 360, objectFit: 'cover', borderRadius: 16, marginBottom: 32 }} />
        </ScrollReveal>

        <ScrollReveal>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            {(post.tags || []).map((c) => (
              <span key={c} className="font-accent" style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', letterSpacing: '2px' }}>{c}</span>
            ))}
          </div>
          <h1 className="font-hero" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', gap: 16, color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 40 }}>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            <span>·</span>
            <span>{post.read_time} min read</span>
          </div>
        </ScrollReveal>

        {/* Content */}
        <ScrollReveal>
          <div
            className="font-body blog-content"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.9,
              marginBottom: 48,
            }}
          >
            {post.content.split('\n\n').map((para, i) => {
              if (para.startsWith('# ')) return <h1 key={i} className="font-hero" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '32px 0 16px' }}>{para.slice(2)}</h1>;
              if (para.startsWith('## ')) return <h2 key={i} className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', margin: '28px 0 12px' }}>{para.slice(3)}</h2>;
              if (para.startsWith('```')) {
                const lines = para.split('\n');
                const code = lines.slice(1, -1).join('\n');
                return (
                  <pre key={i} className="font-mono" style={{ background: 'var(--surface-elevated)', padding: 20, borderRadius: 12, overflow: 'auto', fontSize: '0.85rem', margin: '16px 0', border: '1px solid var(--border-color)', color: 'var(--accent-cyan)' }}>
                    <code>{code}</code>
                  </pre>
                );
              }
              if (para.startsWith('- ')) {
                return (
                  <ul key={i} style={{ margin: '12px 0', paddingLeft: 24 }}>
                    {para.split('\n').map((li, j) => (
                      <li key={j} style={{ marginBottom: 6 }}>{li.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                );
              }
              if (para.match(/^\d\./)) {
                return (
                  <ol key={i} style={{ margin: '12px 0', paddingLeft: 24 }}>
                    {para.split('\n').map((li, j) => (
                      <li key={j} style={{ marginBottom: 6 }}>{li.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                  </ol>
                );
              }
              if (para.startsWith('**') && para.endsWith('**')) {
                return <p key={i} style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0' }}>{para.slice(2, -2)}</p>;
              }
              return <p key={i} style={{ margin: '12px 0' }}>{para}</p>;
            })}
          </div>
        </ScrollReveal>

        {/* Like & Share */}
        <ScrollReveal>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingBottom: 40, borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(108,99,255,0.4)' }}
              whileTap={{ scale: 0.9, rotate: -10 }}
              onClick={handleLike}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10,
                border: `1px solid ${liked ? 'var(--accent-violet)' : 'var(--border-color)'}`,
                background: liked ? 'rgba(108,99,255,0.15)' : 'transparent',
                color: liked ? 'var(--accent-violet)' : 'var(--text-secondary)',
                cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: '0.9rem',
                transition: 'all 0.3s',
              }}
            >
              <motion.div animate={{ scale: liked ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
                <IconHeart size={18} />
              </motion.div>
              <span>{likeCount}</span>
            </motion.button>
            <button
              onClick={handleShare}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10,
                border: '1px solid var(--border-color)', background: 'transparent',
                color: 'var(--text-secondary)', cursor: 'pointer',
                fontFamily: 'var(--font-heading)', fontSize: '0.9rem',
              }}
            >
              <IconShare size={18} /> Share
            </button>
          </div>
        </ScrollReveal>

        {/* Related Posts */}
        <ScrollReveal>
          <div style={{ marginTop: 48 }}>
            <h2 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>Related Posts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
              {related.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="glass-card" style={{ overflow: 'hidden' }}>
                    <img src={p.cover_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'} alt={p.title} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                    <div style={{ padding: 14 }}>
                      <h3 className="font-heading" style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 4 }}>{p.read_time} min read</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </>
  );
}
