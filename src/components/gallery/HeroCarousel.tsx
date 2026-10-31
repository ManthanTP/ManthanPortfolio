import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { IconChevronLeft, IconChevronRight } from '../ui/Icons';
import type { GalleryItem } from '../../lib/supabase';

interface HeroCarouselProps {
  items: GalleryItem[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export default function HeroCarousel({
  items,
  activeCategory,
  onCategoryChange: _onCategoryChange,
  categories: _categories,
}: HeroCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  // Filter items by active category
  const filteredItems = items.filter((item) => {
    if (activeCategory.toLowerCase() === 'all') return true;
    return item.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setSubIndex(0);
  }, [activeCategory]);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredItems.length - 1));
  const activeItem = filteredItems[safeIndex];

  // Comma-separated multi-image parsing
  const currentUrls = (activeItem?.image_url || '')
    .split(',')
    .map((u: string) => u.trim())
    .filter(Boolean);

  const activeMediaUrl = currentUrls[subIndex] || currentUrls[0] || '';
  const isVideo = /\.(mp4|webm|ogg)$/i.test(activeMediaUrl.split('?')[0]);

  // Handle active slide changed & preloading
  const [displayUrl, setDisplayUrl] = useState(activeMediaUrl);

  useEffect(() => {
    if (!activeMediaUrl) return;

    if (isVideo) {
      setDisplayUrl(activeMediaUrl);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const img = new Image();
    img.src = activeMediaUrl;
    img.onload = () => {
      setDisplayUrl(activeMediaUrl);
      setIsLoading(false);
    };
    img.onerror = () => {
      setDisplayUrl(activeMediaUrl);
      setIsLoading(false);
    };

    // Preload next image
    if (filteredItems.length > 1) {
      const nextIdx = (safeIndex + 1) % filteredItems.length;
      const nextItem = filteredItems[nextIdx];
      const nextUrl = (nextItem?.image_url || '').split(',')[0]?.trim();
      if (nextUrl && !/\.(mp4|webm|ogg)$/i.test(nextUrl.split('?')[0])) {
        const nextImg = new Image();
        nextImg.src = nextUrl;
      }
    }

    // Preload previous image
    if (filteredItems.length > 1) {
      const prevIdx = (safeIndex - 1 + filteredItems.length) % filteredItems.length;
      const prevItem = filteredItems[prevIdx];
      const prevUrl = (prevItem?.image_url || '').split(',')[0]?.trim();
      if (prevUrl && !/\.(mp4|webm|ogg)$/i.test(prevUrl.split('?')[0])) {
        const prevImg = new Image();
        prevImg.src = prevUrl;
      }
    }
  }, [activeMediaUrl, isVideo, safeIndex, filteredItems]);

  const goToNext = useCallback(() => {
    if (filteredItems.length === 0) return;
    setCurrentIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    setSubIndex(0);
  }, [filteredItems.length]);

  const goToPrev = useCallback(() => {
    if (filteredItems.length === 0) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    setSubIndex(0);
  }, [filteredItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') setIsLightboxOpen(false);
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'ArrowLeft') goToPrev();
        return;
      }

      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, isLightboxOpen]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!thumbnailStripRef.current) return;
    const activeThumb = thumbnailStripRef.current.children[safeIndex] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [safeIndex]);

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
      <div className="card py-16 text-center text-[var(--ink2)] font-mono text-sm">
        No gallery items found in this category.
      </div>
    );
  }

  // Credit formatting
  const formattedCredit = activeItem?.credit?.trim()
    ? activeItem.credit.trim().toUpperCase().startsWith('BY ')
      ? activeItem.credit.trim().toUpperCase()
      : `BY ${activeItem.credit.trim().toUpperCase()}`
    : null;

  return (
    <div className="w-full relative select-none">
      {/* ─── Main Cinematic Photo Stage (matching GCL style) ─── */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-[var(--hair)] bg-[var(--bg2)] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        {/* Natural Photo Backdrop blur for ambient glow */}
        {displayUrl && !isVideo && (
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <img
              src={displayUrl}
              alt=""
              className="w-full h-full object-cover blur-2xl opacity-20 scale-110"
            />
          </div>
        )}

        {/* Cinematic Stage Area */}
        <div className="relative z-10 w-full h-[360px] sm:h-[480px] lg:h-[560px] flex items-center justify-center overflow-hidden">
          {/* Swipeable drag container */}
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
            onClick={() => setIsLightboxOpen(true)}
            className="w-full h-full flex items-center justify-center cursor-zoom-in relative"
          >
            {/* Loading Shimmer */}
            {isLoading && (
              <div className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            )}

            {/* Main Media Rendering */}
            {isVideo ? (
              <video
                key={activeMediaUrl}
                src={activeMediaUrl}
                controls
                playsInline
                autoPlay={false}
                className="w-full h-full object-contain bg-black"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <AnimatePresence mode="sync">
                <motion.img
                  key={displayUrl || activeMediaUrl}
                  src={displayUrl || activeMediaUrl}
                  alt={activeItem?.title || 'Gallery photograph'}
                  initial={{ opacity: shouldReduceMotion ? 1 : 0.4 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: shouldReduceMotion ? 1 : 0.4 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: 'easeInOut' }}
                  draggable={false}
                  className="w-full h-full object-cover sm:object-contain select-none"
                />
              </AnimatePresence>
            )}

            {/* Dark gradient overlay at bottom for bold text contrast (GCL style) */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

            {/* Sub-gallery "1/N" Badge if multiple images */}
            {currentUrls.length > 1 && (
              <div
                className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-semibold shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={prevSubImage}
                  aria-label="Previous sub-image"
                  className="p-1 hover:text-[var(--amber)] transition-colors cursor-pointer"
                >
                  <IconChevronLeft size={14} />
                </button>
                <span>
                  {subIndex + 1} / {currentUrls.length}
                </span>
                <button
                  type="button"
                  onClick={nextSubImage}
                  aria-label="Next sub-image"
                  className="p-1 hover:text-[var(--amber)] transition-colors cursor-pointer"
                >
                  <IconChevronRight size={14} />
                </button>
              </div>
            )}

            {/* Bold Headline Overlay on Photo (GCL Reference style) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
              <div className="max-w-2xl">
                {formattedCredit && (
                  <div className="font-mono text-xs tracking-widest uppercase text-[#7686f0] font-semibold mb-1">
                    {formattedCredit}
                  </div>
                )}
                {activeItem?.title && (
                  <h3 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-wide leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                    {activeItem.title}
                  </h3>
                )}
                {activeItem?.description && (
                  <p className="font-body text-xs sm:text-sm text-gray-300 mt-2 max-w-xl line-clamp-2 drop-shadow">
                    {activeItem.description}
                  </p>
                )}
              </div>

              {/* Right Tag / Category */}
              {activeItem?.category && (
                <div className="font-mono text-xs uppercase tracking-wider text-gray-400 font-semibold self-start sm:self-end bg-black/50 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                  {activeItem.category}
                </div>
              )}
            </div>
          </motion.div>

          {/* Previous / Next Floating Arrows */}
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-[#2C3480] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:scale-105"
          >
            <IconChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-[#2C3480] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:scale-105"
          >
            <IconChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* ─── Filmstrip Thumbnail Row (matching GCL style) ─── */}
      <div className="mt-4 w-full">
        <div
          ref={thumbnailStripRef}
          className="flex items-center gap-3 overflow-x-auto py-2 px-1 scroll-smooth no-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {filteredItems.map((item, index) => {
            const firstUrl = (item.image_url || '').split(',')[0]?.trim() || '';
            const isThumbVideo = /\.(mp4|webm|ogg)$/i.test(firstUrl.split('?')[0]);
            const isActive = index === currentIndex;
            const extraCount = (item.image_url || '').split(',').filter(Boolean).length - 1;

            return (
              <button
                key={item.id || index}
                type="button"
                onClick={() => {
                  setCurrentIndex(index);
                  setSubIndex(0);
                }}
                aria-label={`Select photo ${index + 1}: ${item.title || 'Photo'}`}
                className={`relative flex-shrink-0 w-24 sm:w-32 aspect-[16/10] rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-[#7686f0] ring-2 ring-[#7686f0]/50 scale-105 opacity-100 shadow-[0_4px_16px_rgba(44,52,128,0.5)]'
                    : 'border-[var(--hair)] opacity-60 hover:opacity-90 hover:border-white/40'
                }`}
                style={{ scrollSnapAlign: 'center' }}
              >
                {isThumbVideo ? (
                  <video
                    src={firstUrl}
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={firstUrl}
                    alt={item.title || 'Thumbnail'}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}

                {extraCount > 0 && (
                  <div className="absolute top-1 right-1 bg-black/80 text-[10px] font-mono font-bold text-[#7686f0] px-1.5 py-0.5 rounded">
                    +{extraCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Fullscreen Lightbox Modal ─── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            {/* Top Close Button & Counter */}
            <div
              className="absolute top-6 left-6 right-6 flex items-center justify-between z-50 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-mono text-sm tracking-wider uppercase text-gray-400">
                {String(safeIndex + 1).padStart(2, '0')} / {String(filteredItems.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close fullscreen view"
              >
                ✕
              </button>
            </div>

            {/* Media */}
            <div
              className="relative max-w-6xl max-h-[80vh] flex items-center justify-center cursor-default pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {isVideo ? (
                <video
                  src={activeMediaUrl}
                  controls
                  autoPlay
                  className="max-h-[80vh] rounded-xl shadow-2xl"
                />
              ) : (
                <img
                  src={displayUrl || activeMediaUrl}
                  alt={activeItem?.title || 'Fullscreen photo'}
                  className="max-h-[80vh] object-contain rounded-xl shadow-2xl"
                />
              )}
            </div>

            {/* Lightbox Caption */}
            {activeItem && (activeItem.title || activeItem.description) && (
              <div
                className="absolute bottom-6 text-center max-w-xl px-4 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {activeItem.title && (
                  <h4 className="font-display font-black text-2xl uppercase text-white tracking-wide">
                    {activeItem.title}
                  </h4>
                )}
                {activeItem.description && (
                  <p className="font-body text-sm text-gray-400 mt-1">
                    {activeItem.description}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
