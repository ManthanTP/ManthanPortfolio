import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { GalleryItem } from '../../lib/supabase';
import { IconChevronLeft, IconChevronRight } from '../ui/Icons';

interface HeroCarouselProps {
  items: GalleryItem[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export default function HeroCarousel({
  items,
  activeCategory,
  onCategoryChange,
  categories,
}: HeroCarouselProps) {
  const shouldReduceMotion = useReducedMotion();

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);

  // Clamping and resetting when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setSubIndex(0);
  }, [activeCategory]);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredItems.length - 1));
  const activeItem: GalleryItem | undefined = filteredItems[safeIndex];

  // Comma-separated media urls
  const currentUrls = useMemo(() => {
    if (!activeItem?.image_url) return [];
    return activeItem.image_url
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean);
  }, [activeItem]);

  // Current active media URL
  const activeMediaUrl = currentUrls[subIndex] || currentUrls[0] || '';
  const isVideo = useMemo(() => {
    return /\.(mp4|webm|ogg)$/i.test((activeMediaUrl || '').split('?')[0]);
  }, [activeMediaUrl]);

  // Decoding & zero black-flash state:
  // displayUrl holds the currently rendered and verified image so the previous photo
  // stays visible until the next one finishes decoding.
  const [displayUrl, setDisplayUrl] = useState<string>(activeMediaUrl);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const decodeReqId = useRef(0);

  useEffect(() => {
    if (!activeMediaUrl) {
      setDisplayUrl('');
      setIsLoading(false);
      return;
    }

    if (isVideo) {
      setDisplayUrl(activeMediaUrl);
      setIsLoading(false);
      return;
    }

    // If displayUrl is empty or already matches activeMediaUrl, update immediately
    if (!displayUrl) {
      setDisplayUrl(activeMediaUrl);
    }
    if (displayUrl === activeMediaUrl) {
      setIsLoading(false);
      return;
    }

    const currentReq = ++decodeReqId.current;
    setIsLoading(true);

    const timer = setTimeout(() => {
      if (currentReq === decodeReqId.current) {
        setDisplayUrl(activeMediaUrl);
        setIsLoading(false);
      }
    }, 1800);

    const img = new Image();
    img.src = activeMediaUrl;

    img
      .decode()
      .then(() => {
        clearTimeout(timer);
        if (currentReq === decodeReqId.current) {
          setDisplayUrl(activeMediaUrl);
          setIsLoading(false);
        }
      })
      .catch(() => {
        clearTimeout(timer);
        if (currentReq === decodeReqId.current) {
          setDisplayUrl(activeMediaUrl);
          setIsLoading(false);
        }
      });

    return () => {
      clearTimeout(timer);
    };
  }, [activeMediaUrl, isVideo, displayUrl]);

  // Preload previous and next photos
  useEffect(() => {
    if (filteredItems.length <= 1) return;

    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    const nextIndex = (currentIndex + 1) % filteredItems.length;

    [filteredItems[prevIndex], filteredItems[nextIndex]].forEach((item) => {
      if (!item) return;
      const firstUrl = (item.image_url || '').split(',')[0]?.trim();
      if (firstUrl && !/\.(mp4|webm|ogg)$/i.test(firstUrl.split('?')[0])) {
        const pre = new Image();
        pre.src = firstUrl;
      }
    });
  }, [currentIndex, filteredItems]);

  // Thumbnail strip scrolling ref
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!thumbnailStripRef.current) return;
    const activeThumb = thumbnailStripRef.current.children[currentIndex] as HTMLElement | undefined;
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  const goToPrev = useCallback(() => {
    if (filteredItems.length === 0) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    setSubIndex(0);
  }, [filteredItems.length]);

  const goToNext = useCallback(() => {
    if (filteredItems.length === 0) return;
    setCurrentIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    setSubIndex(0);
  }, [filteredItems.length]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  // Sub-gallery navigation for comma-separated items
  const nextSubImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentUrls.length <= 1) return;
    setSubIndex((prev) => (prev < currentUrls.length - 1 ? prev + 1 : 0));
  };

  const prevSubImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentUrls.length <= 1) return;
    setSubIndex((prev) => (prev > 0 ? prev - 1 : currentUrls.length - 1));
  };

  if (filteredItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
        <p className="font-heading">No gallery items found in this category.</p>
      </div>
    );
  }

  // Credit formatting (e.g. "BY GCL MEDIA TEAM.")
  const formattedCredit = activeItem?.credit?.trim()
    ? activeItem.credit.trim().toUpperCase().startsWith('BY ')
      ? activeItem.credit.trim().toUpperCase()
      : `BY ${activeItem.credit.trim().toUpperCase()}`
    : null;

  return (
    <div
      className="hero-carousel-root"
      style={{
        position: 'relative',
        width: '100%',
        margin: '0 auto',
        maxWidth: 1300,
        overflow: 'hidden',
      }}
    >
      {/* Category filter chips */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 32,
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            className={`chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: 20,
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Carousel Stage with Natural Backdrop */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Natural Photo as Backdrop (NO color tint) */}
        {displayUrl && !isVideo && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: -20,
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <img
              src={displayUrl}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(45px) saturate(1.2)',
                opacity: 0.26,
                transform: 'scale(1.15)',
              }}
            />
            {/* Soft edge fade into container background */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at center, transparent 30%, var(--bg-secondary) 95%)',
              }}
            />
          </div>
        )}

        {/* Foreground Content Frame */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            minHeight: 'min(72vh, 600px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Framer motion interactive swipe area */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, { offset, velocity }) => {
              const swipeThreshold = 50;
              if (offset.x > swipeThreshold || velocity.x > 400) {
                goToPrev();
              } else if (offset.x < -swipeThreshold || velocity.x < -400) {
                goToNext();
              }
            }}
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 20px 16px 20px',
              cursor: 'grab',
              touchAction: 'pan-y',
            }}
            whileTap={{ cursor: 'grabbing' }}
          >
            {/* Large Active Photo / Video container */}
            <div
              style={{
                position: 'relative',
                maxWidth: '100%',
                maxHeight: 'min(58vh, 520px)',
                width: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
              }}
            >
              {/* Loading Shimmer / Skeleton */}
              {isLoading && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 3,
                    background:
                      'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.03) 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite linear',
                    backdropFilter: 'blur(4px)',
                    borderRadius: 14,
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Media rendering with smooth crossfade */}
              {isVideo ? (
                <video
                  key={activeMediaUrl}
                  src={activeMediaUrl}
                  controls
                  playsInline
                  autoPlay={false}
                  preload="metadata"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 'min(58vh, 520px)',
                    display: 'block',
                    borderRadius: 14,
                    outline: 'none',
                    backgroundColor: '#000',
                  }}
                />
              ) : (
                <AnimatePresence mode="sync">
                  <motion.img
                    key={displayUrl || activeMediaUrl}
                    src={displayUrl || activeMediaUrl}
                    alt={activeItem?.title || 'Gallery item'}
                    initial={{ opacity: shouldReduceMotion ? 1 : 0.4 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: shouldReduceMotion ? 1 : 0.4 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: 'easeInOut' }}
                    draggable={false}
                    style={{
                      maxWidth: '100%',
                      maxHeight: 'min(58vh, 520px)',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      borderRadius: 14,
                      userSelect: 'none',
                    }}
                  />
                </AnimatePresence>
              )}

              {/* Sub-gallery "1/N" Badge & controls if multiple images */}
              {currentUrls.length > 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    zIndex: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'rgba(0, 0, 0, 0.72)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '4px 10px',
                    borderRadius: 20,
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                    userSelect: 'none',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={prevSubImage}
                    aria-label="Previous sub-image"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 2,
                    }}
                  >
                    <IconChevronLeft size={14} />
                  </button>
                  <span style={{ minWidth: 32, textAlign: 'center' }}>
                    {subIndex + 1} / {currentUrls.length}
                  </span>
                  <button
                    onClick={nextSubImage}
                    aria-label="Next sub-image"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 2,
                    }}
                  >
                    <IconChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Prev/Next floating buttons */}
          <button
            onClick={goToPrev}
            aria-label="Previous slide"
            style={{
              position: 'absolute',
              left: 16,
              top: '46%',
              transform: 'translateY(-50%)',
              zIndex: 5,
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              e.currentTarget.style.borderColor = 'var(--accent-violet)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <IconChevronLeft size={24} />
          </button>

          <button
            onClick={goToNext}
            aria-label="Next slide"
            style={{
              position: 'absolute',
              right: 16,
              top: '46%',
              transform: 'translateY(-50%)',
              zIndex: 5,
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              e.currentTarget.style.borderColor = 'var(--accent-violet)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <IconChevronRight size={24} />
          </button>

          {/* Photo Metadata Display: Title, "By" credit, Description */}
          {activeItem && (activeItem.title || formattedCredit || activeItem.description) && (
            <div
              style={{
                width: '100%',
                padding: '14px 28px 20px',
                textAlign: 'center',
                zIndex: 2,
              }}
            >
              {activeItem.title && activeItem.title.trim() && (
                <h3
                  className="font-hero"
                  style={{
                    fontSize: 'clamp(1.1rem, 2.4vw, 1.45rem)',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                  }}
                >
                  {activeItem.title}
                </h3>
              )}

              {formattedCredit && (
                <div
                  className="font-mono"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--accent-cyan)',
                    marginBottom: activeItem.description ? 6 : 0,
                  }}
                >
                  {formattedCredit}
                </div>
              )}

              {activeItem.description && activeItem.description.trim() && (
                <p
                  className="font-body"
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    maxWidth: 720,
                    margin: '0 auto',
                    lineHeight: 1.5,
                  }}
                >
                  {activeItem.description.trim()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filmstrip Thumbnail Strip */}
      <div
        style={{
          marginTop: 20,
          position: 'relative',
        }}
      >
        <div
          ref={thumbnailStripRef}
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            padding: '8px 4px 14px 4px',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'thin',
          }}
        >
          {filteredItems.map((item, index) => {
            const firstUrl = (item.image_url || '').split(',')[0]?.trim() || '';
            const isThumbVideo = /\.(mp4|webm|ogg)$/i.test(firstUrl.split('?')[0]);
            const isActive = index === currentIndex;
            const extraCount = (item.image_url || '').split(',').filter(Boolean).length - 1;

            return (
              <button
                key={item.id || index}
                onClick={() => {
                  setCurrentIndex(index);
                  setSubIndex(0);
                }}
                aria-label={`Go to slide ${index + 1}: ${item.title || 'Photo'}`}
                style={{
                  position: 'relative',
                  flex: '0 0 auto',
                  width: 'clamp(84px, 12vw, 120px)',
                  aspectRatio: '16/10',
                  borderRadius: 10,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isActive
                    ? '2px solid var(--accent-violet)'
                    : '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  padding: 0,
                  opacity: isActive ? 1 : 0.62,
                  transform: isActive ? 'scale(1.04)' : 'scale(1)',
                  transition: 'all 0.22s ease',
                  scrollSnapAlign: 'center',
                  outline: 'none',
                }}
              >
                {isThumbVideo ? (
                  <video
                    src={firstUrl}
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={firstUrl}
                    alt={item.title || 'Thumbnail'}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}

                {/* Sub-gallery count indicator on thumbnail */}
                {extraCount > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: 'rgba(0, 0, 0, 0.75)',
                      borderRadius: 4,
                      padding: '1px 5px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    +{extraCount}
                  </div>
                )}

                {/* Video icon on thumbnail */}
                {isThumbVideo && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      left: 4,
                      background: 'rgba(0, 0, 0, 0.75)',
                      borderRadius: 4,
                      padding: '1px 5px',
                      fontSize: '0.62rem',
                      fontWeight: 600,
                      color: '#fff',
                    }}
                  >
                    VIDEO
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Shimmer animation keyframe style */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
