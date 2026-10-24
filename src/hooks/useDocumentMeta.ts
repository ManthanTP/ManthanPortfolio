import { useEffect } from 'react';

interface DocumentMetaOptions {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

const DEFAULT_TITLE = 'Manthan Patel — Full Stack Developer & AI Builder';
const DEFAULT_DESC =
  'Interactive portfolio of Manthan Patel — full stack developer and AI builder specializing in React, Supabase, and AI integrations.';

function setMetaTag(selector: string, attributeName: string, value: string) {
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    if (selector.startsWith('meta[name=')) {
      const match = selector.match(/meta\[name="([^"]+)"\]/);
      if (match) element.setAttribute('name', match[1]);
    } else if (selector.startsWith('meta[property=')) {
      const match = selector.match(/meta\[property="([^"]+)"\]/);
      if (match) element.setAttribute('property', match[1]);
    }
    document.head.appendChild(element);
  }
  element.setAttribute(attributeName, value);
}

export function useDocumentMeta({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
}: DocumentMetaOptions) {
  useEffect(() => {
    // Update title
    const fullTitle = title ? `${title} | Manthan Patel` : DEFAULT_TITLE;
    document.title = fullTitle;

    // Update meta description
    if (description) {
      setMetaTag('meta[name="description"]', 'content', description);
    }

    // Update OpenGraph tags
    setMetaTag('meta[property="og:title"]', 'content', ogTitle || fullTitle);
    if (ogDescription || description) {
      setMetaTag('meta[property="og:description"]', 'content', ogDescription || description || DEFAULT_DESC);
    }
    if (ogImage) {
      setMetaTag('meta[property="og:image"]', 'content', ogImage);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      setMetaTag('meta[name="description"]', 'content', DEFAULT_DESC);
      setMetaTag('meta[property="og:title"]', 'content', DEFAULT_TITLE);
    };
  }, [title, description, ogTitle, ogDescription, ogImage]);
}
