import { useEffect, useMemo } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useDataStore } from '../stores/useDataStore';
import { api } from '../lib/api';
import { DEMO_SKILLS } from '../lib/data';

interface SkillItem {
  name: string;
  tag: string;
}

interface SkillGroup {
  badge: string;
  title: string;
  items: SkillItem[];
}

export default function Skills() {
  const storeSkills = useDataStore((s) => s.skills);
  const setSkills = useDataStore((s) => s.setSkills);

  useEffect(() => {
    if (storeSkills.length === 0) {
      api.skills
        .getAll()
        .then((data) => setSkills(data && data.length > 0 ? data : DEMO_SKILLS))
        .catch(() => setSkills(DEMO_SKILLS));
    }
  }, [storeSkills.length, setSkills]);

  const allSkills = storeSkills.length > 0 ? storeSkills : DEMO_SKILLS;

  // Deduplicate and filter out unwanted duplicates
  const cleanedSkills = useMemo(() => {
    const seen = new Set<string>();
    return allSkills.filter((s) => {
      const lower = s.name.toLowerCase().trim();
      if (lower.includes('gemini canva')) return false;
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
  }, [allSkills]);

  const defaultTag = (name: string, category?: string): string => {
    const n = name.toLowerCase();
    if (n.includes('react') || n.includes('next.js') || n.includes('vue')) return 'UI';
    if (n === 'typescript' || n === 'sql' || n === 'python' || n === 'c++' || n === 'javascript') return 'language';
    if (n.includes('tailwind') || n.includes('css')) return 'styling';
    if (n.includes('vite') || n.includes('webpack')) return 'build';
    if (n.includes('html')) return 'markup';
    if (n.includes('gemini') || n.includes('claude') || n.includes('openai') || n.includes('ai')) return 'AI';
    if (n.includes('git')) return 'workflow';
    if (n.includes('supabase') || n.includes('firebase')) return 'platform';
    if (n.includes('postgres') || n.includes('mongo') || n.includes('redis')) return 'database';
    if (n.includes('node')) return 'runtime';
    return (category || 'tool').toLowerCase();
  };

  // Group skills into 3 rack columns: Frontend, AI and tools, Backend
  const columns: SkillGroup[] = useMemo(() => {
    const frontend = cleanedSkills.filter(
      (s) =>
        s.category?.toLowerCase().includes('front') ||
        s.category?.toLowerCase().includes('client') ||
        s.category?.toLowerCase().includes('ui') ||
        ['react', 'typescript', 'tailwind', 'next.js', 'vue', 'html', 'css', 'framer'].some((k) =>
          s.name.toLowerCase().includes(k)
        )
    );

    const aiTools = cleanedSkills.filter(
      (s) =>
        !frontend.includes(s) &&
        (s.category?.toLowerCase().includes('ai') ||
         s.category?.toLowerCase().includes('tool') ||
         s.category?.toLowerCase().includes('ml') ||
         ['claude', 'openai', 'gemini', 'python', 'git', 'vite', 'docker'].some((k) =>
           s.name.toLowerCase().includes(k)
         ))
    );

    const backend = cleanedSkills.filter(
      (s) => !frontend.includes(s) && !aiTools.includes(s)
    );

    return [
      {
        badge: 'Frontend',
        title: 'Frontend',
        items:
          frontend.length > 0
            ? frontend.map((s) => ({ name: s.name, tag: (s as any).tag || defaultTag(s.name, s.category) }))
            : [
                { name: 'React', tag: 'UI' },
                { name: 'TypeScript', tag: 'language' },
                { name: 'Tailwind CSS', tag: 'styling' },
                { name: 'Vite', tag: 'build' },
                { name: 'HTML', tag: 'markup' },
              ],
      },
      {
        badge: 'AI and tools',
        title: 'AI and tools',
        items:
          aiTools.length > 0
            ? aiTools.map((s) => ({ name: s.name, tag: (s as any).tag || defaultTag(s.name, s.category) }))
            : [
                { name: 'Gemini API', tag: 'AI' },
                { name: 'Claude', tag: 'AI' },
                { name: 'OpenAI', tag: 'AI' },
                { name: 'Git', tag: 'workflow' },
              ],
      },
      {
        badge: 'Backend',
        title: 'Backend',
        items:
          backend.length > 0
            ? backend.map((s) => ({ name: s.name, tag: (s as any).tag || defaultTag(s.name, s.category) }))
            : [
                { name: 'Supabase', tag: 'platform' },
                { name: 'PostgreSQL', tag: 'database' },
                { name: 'SQL', tag: 'language' },
                { name: 'Node.js', tag: 'runtime' },
                { name: 'Firebase', tag: 'platform' },
              ],
      },
    ];
  }, [cleanedSkills]);

  return (
    <div className="section-container sec">
      <ScrollReveal>
        <div className="sh">
          <span className="eyebrow">Stack</span>
          <h2>TECHNOLOGIES I WORK WITH</h2>
        </div>
      </ScrollReveal>

      {/* 3-Column Glass Rack */}
      <ScrollReveal delay={0.08}>
        <div className="card rack">
          {columns.map((col) => (
            <div key={col.title} className="col">
              <span className="k font-heading text-lg sm:text-xl uppercase font-black tracking-wide text-[var(--amber)]">
                {col.title}
              </span>
              <ul className="mt-3">
                {col.items.map((it) => (
                  <li key={it.name} className="flex items-center justify-between py-2.5 border-b border-[var(--hair)] last:border-b-0">
                    <span className="text-[16px] font-sans font-medium text-[var(--ink)]">{it.name}</span>
                    <i className="font-mono text-xs not-italic text-[var(--ink2)]">{it.tag}</i>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
