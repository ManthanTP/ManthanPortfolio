import { useEffect, useMemo } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useDataStore } from '../stores/useDataStore';
import { api } from '../lib/api';
import { DEMO_SKILLS } from '../lib/data';

interface SkillGroup {
  badge: string;
  title: string;
  items: Array<{ name: string; level: string }>;
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

  // Group skills into 3 rack columns: Frontend, AI & Tools, Backend & Cloud
  const columns: SkillGroup[] = useMemo(() => {
    const frontend = allSkills.filter(
      (s) =>
        s.category?.toLowerCase().includes('front') ||
        s.category?.toLowerCase().includes('client') ||
        s.category?.toLowerCase().includes('ui') ||
        ['react', 'typescript', 'tailwind', 'next.js', 'vue', 'html', 'css'].some((k) =>
          s.name.toLowerCase().includes(k)
        )
    );

    const aiTools = allSkills.filter(
      (s) =>
        s.category?.toLowerCase().includes('ai') ||
        s.category?.toLowerCase().includes('tool') ||
        s.category?.toLowerCase().includes('ml') ||
        ['claude', 'openai', 'gemini', 'python', 'git', 'vite', 'docker'].some((k) =>
          s.name.toLowerCase().includes(k)
        )
    );

    const backend = allSkills.filter(
      (s) => !frontend.includes(s) && !aiTools.includes(s)
    );

    const formatLevel = (proficiency?: number) => {
      if (!proficiency || proficiency >= 85) return 'Production';
      if (proficiency >= 70) return 'Advanced';
      return 'Proficient';
    };

    return [
      {
        badge: 'Interface',
        title: 'Frontend Architecture',
        items:
          frontend.length > 0
            ? frontend.map((s) => ({ name: s.name, level: formatLevel(s.proficiency) }))
            : [
                { name: 'React 19 & Next.js', level: 'Production' },
                { name: 'TypeScript', level: 'Production' },
                { name: 'Tailwind CSS v4', level: 'Production' },
                { name: 'Framer Motion', level: 'Production' },
                { name: 'Zustand & State Machines', level: 'Production' },
              ],
      },
      {
        badge: 'Intelligence',
        title: 'AI & Developer Toolchains',
        items:
          aiTools.length > 0
            ? aiTools.map((s) => ({ name: s.name, level: formatLevel(s.proficiency) }))
            : [
                { name: 'Claude & Gemini SDKs', level: 'Production' },
                { name: 'Tool Calling & Agents', level: 'Production' },
                { name: 'Vector Embeddings', level: 'Advanced' },
                { name: 'Vite & Modern Bundlers', level: 'Production' },
                { name: 'Git & CI/CD Pipelines', level: 'Production' },
              ],
      },
      {
        badge: 'Infrastructure',
        title: 'Backend & Cloud Systems',
        items:
          backend.length > 0
            ? backend.map((s) => ({ name: s.name, level: formatLevel(s.proficiency) }))
            : [
                { name: 'Node.js & Express', level: 'Production' },
                { name: 'Supabase & PostgreSQL', level: 'Production' },
                { name: 'REST & GraphQL APIs', level: 'Production' },
                { name: 'WebSockets & Realtime', level: 'Production' },
                { name: 'Serverless Edge Functions', level: 'Production' },
              ],
      },
    ];
  }, [allSkills]);

  return (
    <div className="section-container pt-20">
      <ScrollReveal>
        <div className="mb-10">
          <span className="hk">Capabilities</span>
          <h2 className="big text-4xl sm:text-5xl mt-2">
            Technical <em>Stack</em>
          </h2>
          <p className="vs max-w-xl mt-3">
            A battle-tested stack tuned for reliability, high-speed rendering, and deterministic data flow.
          </p>
        </div>
      </ScrollReveal>

      {/* 3-Column Glass Rack */}
      <ScrollReveal delay={0.08}>
        <div className="card rack">
          {columns.map((col) => (
            <div key={col.title} className="col">
              <span className="hk text-xs">{col.badge}</span>
              <b className="font-heading text-xl uppercase tracking-wide text-[var(--ink)]">
                {col.title}
              </b>
              <ul>
                {col.items.map((it) => (
                  <li key={it.name}>
                    <span className="font-medium text-[var(--ink)]">{it.name}</span>
                    <i className="font-mono text-xs text-[var(--ink2)]">{it.level}</i>
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
