import { useState } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useDataStore } from '../stores/useDataStore';
import HeroCarousel from '../components/gallery/HeroCarousel';

const CATEGORIES = ['All', 'UI Designs', 'Project Screenshots', 'Events'];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const items = useDataStore((s) => s.gallery);
  const status = useDataStore((s) => s.status.gallery);

  return (
    <div className="section-container" style={{ paddingTop: 100, paddingBottom: 60 }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1
            className="font-hero"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 12 }}
          >
            <span className="neon-text">Gallery</span>
          </h1>
          <p
            className="font-heading"
            style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 600, margin: '0 auto' }}
          >
            Visual showcase of my work, event highlights, and milestones
          </p>
        </div>
      </ScrollReveal>

      {status === 'loading' && items.length === 0 ? (
        <div
          style={{
            maxWidth: 1300,
            margin: '0 auto',
            borderRadius: 20,
            height: 520,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.6,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: '3px solid var(--border-color)',
              borderTopColor: 'var(--accent-violet)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
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
