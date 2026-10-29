import { useState, useEffect } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useDataStore } from '../stores/useDataStore';
import HeroCarousel from '../components/gallery/HeroCarousel';
import { api } from '../lib/api';
import { DEMO_GALLERY } from '../lib/data';

const CATEGORIES = ['All', 'UI Designs', 'Project Screenshots', 'Events'];

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

  return (
    <div className="section-container sec">
      <ScrollReveal>
        <div className="sh flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="eyebrow">Gallery</span>
            <h2>MOMENTS AND SCREENS</h2>
          </div>

          {/* Pill filter buttons */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-[#2C3480] text-white border border-[#7686f0]'
                    : 'border border-[var(--hair)] text-[var(--ink2)] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
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
            categories={CATEGORIES}
          />
        </ScrollReveal>
      )}
    </div>
  );
}
