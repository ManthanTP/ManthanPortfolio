import { useState, useEffect, useMemo } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useDataStore } from '../stores/useDataStore';
import HeroCarousel from '../components/gallery/HeroCarousel';
import { api } from '../lib/api';
import { DEMO_GALLERY } from '../lib/data';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const storeItems = useDataStore((s) => s.gallery);
  const setGallery = useDataStore((s) => s.setGallery);
  const [loading, setLoading] = useState(storeItems.length === 0);

  useEffect(() => {
    if (storeItems.length === 0) {
      setLoading(true);
      api.gallery
        .getAll()
        .then((data) => {
          setGallery(data && data.length > 0 ? data : DEMO_GALLERY);
        })
        .catch((err) => {
          console.error('Gallery load error:', err);
          setGallery(DEMO_GALLERY);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [storeItems.length, setGallery]);

  const items = storeItems.length > 0 ? storeItems : (loading ? [] : DEMO_GALLERY);

  // Dynamically compute unique, trimmed, case-insensitive deduped categories
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((item) => {
      const raw = (item.category || '').trim();
      if (raw && raw.toLowerCase() !== 'all') {
        const lower = raw.toLowerCase();
        if (!map.has(lower)) {
          map.set(lower, raw);
        }
      }
    });
    return ['All', ...Array.from(map.values())];
  }, [items]);

  return (
    <div className="section-container sec">
      <ScrollReveal>
        <div className="sh flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="eyebrow">Gallery</span>
            <h2>MOMENTS AND SCREENS</h2>
          </div>

          {/* Category Chips styled identical to Top Nav */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const isActive = activeFilter.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className="px-[14px] py-[8px] rounded-[10px] text-[13px] font-body font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    color: isActive ? '#ffffff' : 'var(--ink2)',
                    background: isActive ? 'rgba(44, 52, 128, 0.35)' : 'transparent',
                    border: isActive ? '1px solid var(--amber)' : '1px solid var(--hair)',
                    boxShadow: isActive ? '0 0 14px rgba(86, 104, 230, 0.3)' : 'none',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {loading && items.length === 0 ? (
        <div className="card h-[400px] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--hair)] border-t-[var(--amber)] animate-spin" />
        </div>
      ) : (
        <ScrollReveal delay={0.1}>
          <HeroCarousel
            items={items}
            activeCategory={activeFilter}
            onCategoryChange={setActiveFilter}
            categories={categories}
          />
        </ScrollReveal>
      )}
    </div>
  );
}
