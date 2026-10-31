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

    // Preload adjacent images
    if (filteredItems.length > 1) {
      const nextIdx = (safeIndex + 1) % filteredItems.length;
      const nextUrl = (filteredItems[nextIdx]?.image_url || '').split(',')[0]?.trim();
      if (nextUrl && !/\.(mp4|webm|ogg)$/i.test(nextUrl.split('?')[0])) {
        const nextImg = new Image();
        nextImg.src = nextUrl;
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
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
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

  const formattedCredit = activeItem?.credit?.trim()
    ? activeItem.credit.trim().toUpperCase().startsWith('BY ')
      ? activeItem.credit.trim().toUpperCase()
      : `BY ${activeItem.credit.trim().toUpperCase()}`
    : (activeItem?.category ? activeItem.category.toUpperCase() : null);

  const totalItems = filteredItems.length;
  const currentFormatted = String(safeIndex + 1).padStart(2, '0');
  const totalFormatted = String(totalItems).padStart(2, '0');

  return (
    <div className="w-full relative select-none">
      {/* ─── Cinematic Full-Widescreen Stage (GCL Project Design) ─── */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0a0c1b] shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
        <div className="relative w-full h-[460px] sm:h-[580px] lg:h-[640px] flex items-center justify-center overflow-hidden">
          {/* Main Full-Cover Media */}
          {isVideo ? (
            <video
              key={activeMediaUrl}
              src={activeMediaUrl}
              controls
              playsInline
              className="w-full h-full object-cover bg-black"
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
                className="w-full h-full object-cover select-none cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              />
            </AnimatePresence>
          )}

          {/* Shimmer loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse pointer-events-none" />
          )}

          {/* Dark bottom gradient for GCL high-contrast overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/95 via-black/45 to-transparent z-10" />

          {/* Top-right Sub-gallery counter if multiple images */}
          {currentUrls.length > 1 && (
            <div
              className="absolute top-5 right-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-semibold shadow-xl"
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
              <span>{subIndex + 1} / {currentUrls.length}</span>
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

          {/* Left / Right Navigation Chevrons */}
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#2C3480] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl hover:scale-110"
          >
            <IconChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#2C3480] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl hover:scale-110"
          >
            <IconChevronRight size={22} />
          </button>

          {/* ─── Bottom Info Overlay (Exact GCL Layout) ─── */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20 flex flex-col justify-end gap-5 pointer-events-none">
            {/* Top row: Massive Bold Title on left + Credit on right */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-3xl">
                {activeItem?.title && (
                  <h3 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white uppercase tracking-tight leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                    {activeItem.title}
                  </h3>
                )}
                {activeItem?.description && (
                  <p className="font-body text-xs sm:text-sm text-gray-300 mt-2 max-w-xl line-clamp-2 drop-shadow">
                    {activeItem.description}
                  </p>
                )}
              </div>

              {formattedCredit && (
                <div className="font-mono text-xs uppercase tracking-widest text-gray-300 font-semibold self-start sm:self-end drop-shadow">
                  {formattedCredit}
                </div>
              )}
            </div>

            {/* Bottom row: Slide progress indicator on left + Filmstrip thumbnails on right */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
              {/* Progress counter: 01 ────── 09 (matching GCL) */}
              <div className="flex items-center gap-3 font-mono text-xs text-gray-400">
                <span className="text-white font-bold">{currentFormatted}</span>
                <div className="w-16 sm:w-24 h-[1.5px] bg-white/20 overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-[#7686f0] transition-all duration-300"
                    style={{ width: `${((safeIndex + 1) / totalItems) * 100}%` }}
                  />
                </div>
                <span>{totalFormatted}</span>
              </div>

              {/* Integrated Filmstrip Thumbnails inside Stage */}
              <div
                ref={thumbnailStripRef}
                className="flex items-center gap-2 overflow-x-auto py-1 max-w-full sm:max-w-xl no-scrollbar pointer-events-auto"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {filteredItems.map((item, index) => {
                  const firstUrl = (item.image_url || '').split(',')[0]?.trim() || '';
                  const isThumbVideo = /\.(mp4|webm|ogg)$/i.test(firstUrl.split('?')[0]);
                  const isActive = index === currentIndex;

                  return (
                    <button
                      key={item.id || index}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(index);
                        setSubIndex(0);
                      }}
                      aria-label={`View ${item.title || 'photo'}`}
                      className={`relative flex-shrink-0 w-16 sm:w-24 aspect-[16/10] rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'border-white ring-2 ring-[#7686f0] scale-110 opacity-100 z-10 shadow-[0_6px_20px_rgba(0,0,0,0.8)]'
                          : 'border-white/20 opacity-50 hover:opacity-90 hover:border-white/50'
                      }`}
                      style={{ scrollSnapAlign: 'center' }}
                    >
                      {isThumbVideo ? (
                        <video src={firstUrl} muted playsInline className="w-full h-full object-cover" />
                      ) : (
                        <img src={firstUrl} alt="" loading="lazy" className="w-full h-full object-cover" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
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
            <div
              className="absolute top-6 left-6 right-6 flex items-center justify-between z-50 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-mono text-sm tracking-wider uppercase text-gray-400">
                {currentFormatted} / {totalFormatted}
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

            <div
              className="relative max-w-6xl max-h-[80vh] flex items-center justify-center cursor-default pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {isVideo ? (
                <video src={activeMediaUrl} controls autoPlay className="max-h-[80vh] rounded-xl shadow-2xl" />
              ) : (
                <img
                  src={displayUrl || activeMediaUrl}
                  alt={activeItem?.title || 'Fullscreen photo'}
                  className="max-h-[80vh] object-contain rounded-xl shadow-2xl"
                />
              )}
            </div>

            {activeItem?.title && (
              <div
                className="absolute bottom-6 text-center max-w-xl px-4 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="font-display font-black text-2xl uppercase text-white tracking-wide">
                  {activeItem.title}
                </h4>
                {activeItem.description && (
                  <p className="font-body text-sm text-gray-400 mt-1">{activeItem.description}</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
