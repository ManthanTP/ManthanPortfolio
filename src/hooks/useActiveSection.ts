import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useActiveSection(sectionIds: string[]) {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    // If not on home page, active section is basically empty unless we have hash logic
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    let visibleSections = new Map<string, number>();

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      if (visibleSections.size > 0) {
        // Find the section with the highest intersection ratio
        let maxRatio = 0;
        let mostVisible = '';
        visibleSections.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisible = id;
          }
        });
        
        if (mostVisible) {
          setActiveSection(mostVisible);
          // Optional: silently update the URL hash without scrolling
          // window.history.replaceState(null, '', `#${mostVisible}`);
        }
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname, sectionIds.join(',')]);

  // Use the hash if available and valid on initial load
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const hashId = location.hash.substring(1);
      if (sectionIds.includes(hashId)) {
        setActiveSection(hashId);
      }
    }
  }, [location.hash, location.pathname, sectionIds.join(',')]);

  return activeSection || (location.pathname === '/' ? sectionIds[0] : '');
}
