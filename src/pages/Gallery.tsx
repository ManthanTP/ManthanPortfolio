import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import { api } from '../lib/api';
import type { GalleryItem } from '../lib/supabase';
import { IconX2, IconChevronLeft, IconChevronRight } from '../components/ui/Icons';

const CATEGORIES = ['All', 'UI Designs', 'Project Screenshots', 'Events'];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxState, setLightboxState] = useState<{ itemIndex: number; imageIndex: number } | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.gallery.getAll();
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return items;
    return items.filter((g) => g.category === activeFilter);
  }, [activeFilter, items]);

  const closeLightbox = () => setLightboxState(null);
  
  const prev = () => {
    setLightboxState((current) => {
      if (!current) return null;
      const { itemIndex, imageIndex } = current;
      if (imageIndex > 0) {
        return { itemIndex, imageIndex: imageIndex - 1 };
      } else {
        const newItemIndex = itemIndex > 0 ? itemIndex - 1 : filtered.length - 1;
        const newImages = (filtered[newItemIndex]?.image_url || '').split(',').filter(Boolean);
        return { itemIndex: newItemIndex, imageIndex: Math.max(0, newImages.length - 1) };
      }
    });
  };

  const next = () => {
    setLightboxState((current) => {
      if (!current) return null;
      const { itemIndex, imageIndex } = current;
      const images = (filtered[itemIndex]?.image_url || '').split(',').filter(Boolean);
      if (imageIndex < images.length - 1) {
        return { itemIndex, imageIndex: imageIndex + 1 };
      } else {
        return { itemIndex: itemIndex < filtered.length - 1 ? itemIndex + 1 : 0, imageIndex: 0 };
      }
    });
  };

  return (
    <div className="section-container" style={{ paddingTop: 100 }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 className="font-hero" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 12 }}>
            <span className="neon-text">Gallery</span>
          </h1>
          <p className="font-heading" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Visual showcase of my work
          </p>
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

      {/* Masonry Grid */}
      <motion.div
        layout
        style={{
          columns: '2',
          columnGap: 16,
          maxWidth: 1000,
          margin: '0 auto',
        }}
        className="gallery-grid"
      >
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading gallery...</p>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              style={{
                breakInside: 'avoid',
                marginBottom: 16,
                cursor: 'pointer',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid var(--glass-border)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onClick={() => setLightboxState({ itemIndex: i, imageIndex: 0 })}
              whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(108,99,255,0.15)' }}
            >
              <div style={{ position: 'relative' }}>
                {(() => {
                  const firstUrl = (item.image_url || '').split(',')[0] || '';
                  const isVid = /\.(mp4|webm|ogg)$/i.test(firstUrl.split('?')[0]);
                  return isVid ? (
                    <video src={firstUrl} style={{ width: '100%', height: 'auto', display: 'block' }} muted loop playsInline />
                  ) : (
                    <img src={firstUrl} alt={item.title} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  );
                })()}
                {item.image_url && item.image_url.split(',').length > 1 && (
                  <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 8px', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600 }}>
                    1 / {item.image_url.split(',').filter(Boolean).length}
                  </div>
                )}
              </div>
              <div style={{ padding: '10px 12px', background: 'var(--bg-secondary)' }}>
                <p className="font-heading" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{item.title}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{item.category}</p>
              </div>
            </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxState !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={closeLightbox}
          >
            <button onClick={(e) => { e.stopPropagation(); prev(); }} style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 10 }}>
              <IconChevronLeft size={24} />
            </button>
            
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {(() => {
                const currentUrl = (filtered[lightboxState.itemIndex].image_url || '').split(',').filter(Boolean)[lightboxState.imageIndex];
                const isVid = /\.(mp4|webm|ogg)$/i.test((currentUrl || '').split('?')[0]);
                const key = `${lightboxState.itemIndex}-${lightboxState.imageIndex}`;
                
                return isVid ? (
                  <motion.video
                    key={key}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={currentUrl}
                    style={{ maxWidth: '85vw', maxHeight: '80vh', borderRadius: 12, outline: 'none' }}
                    onClick={(e) => e.stopPropagation()}
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <motion.img
                    key={key}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={currentUrl}
                    alt={filtered[lightboxState.itemIndex].title}
                    style={{ maxWidth: '85vw', maxHeight: '80vh', borderRadius: 12, objectFit: 'contain' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                );
              })()}
              
              <div style={{ marginTop: 16, display: 'flex', gap: 6, justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
                {(filtered[lightboxState.itemIndex].image_url || '').split(',').filter(Boolean).map((_, i) => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === lightboxState.imageIndex ? '#fff' : 'rgba(255,255,255,0.3)', transition: 'background 0.3s' }} />
                ))}
              </div>
              
              <div style={{ marginTop: 12, textAlign: 'center', color: '#fff' }}>
                <p className="font-heading" style={{ fontSize: '1rem', fontWeight: 600 }}>{filtered[lightboxState.itemIndex].title}</p>
              </div>
            </div>

            <button onClick={(e) => { e.stopPropagation(); next(); }} style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 10 }}>
              <IconChevronRight size={24} />
            </button>
            <button onClick={closeLightbox} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 10 }}>
              <IconX2 size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) { .gallery-grid { columns: 3 !important; } }
        @media (min-width: 1024px) { .gallery-grid { columns: 4 !important; } }
      `}</style>
    </div>
  );
}
