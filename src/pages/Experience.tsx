import { useEffect } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useDataStore } from '../stores/useDataStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { safeJsonParse } from '../lib/safeJson';
import { DEFAULT_ACHIEVEMENTS } from '../lib/constants';
import { DEMO_EXPERIENCE } from '../lib/data';
import { api } from '../lib/api';

export default function Experience() {
  const storeExperience = useDataStore((s) => s.experience);
  const setExperience = useDataStore((s) => s.setExperience);
  const settings = useSettingsStore((s) => s.settings);

  useEffect(() => {
    if (storeExperience.length === 0) {
      api.experience
        .getAll()
        .then((data) => {
          setExperience(data && data.length > 0 ? data : DEMO_EXPERIENCE);
        })
        .catch(() => setExperience(DEMO_EXPERIENCE));
    }
  }, [storeExperience.length, setExperience]);

  const activeExperience = storeExperience.length > 0 ? storeExperience : DEMO_EXPERIENCE;
  const achievements = safeJsonParse(settings.achievements, DEFAULT_ACHIEVEMENTS);
  const workExp = activeExperience.filter((e) => e.type !== 'achievement');

  const formatDate = (val?: string) => {
    if (!val) return '';
    if (/^\d{4}-\d{2}/.test(val)) {
      const parts = val.split('-');
      const year = parts[0];
      const month = parseInt(parts[1], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[month - 1] || ''} ${year}`.trim();
    }
    return val;
  };

  const formatRange = (start?: string, end?: string, current?: boolean) => {
    const s = formatDate(start);
    if (current) return `${s} to now`;
    const e = formatDate(end);
    return e ? `${s} to ${e}` : s;
  };

  return (
    <div className="section-container sec pt-10 sm:pt-16 pb-16 sm:pb-24">
      <ScrollReveal>
        <div className="sh">
          <span className="eyebrow">Path so far</span>
          <h2>EXPERIENCE</h2>
        </div>
      </ScrollReveal>

      {/* Experience Grid: Left Timeline + Right Sticky Achievements */}
      <ScrollReveal delay={0.08}>
        <div className="xgrid">
          {/* Left Timeline */}
          <ol className="tl" id="tl">
            {workExp.map((exp, i) => (
              <li key={exp.id || i} className="tli">
                <i className="dot" />
                <article
                  className="card p-5"
                  data-exp-id={exp.id || exp.title?.toLowerCase().replace(/\s+/g, '-')}
                >
                  <span className="when text-xs font-mono text-[var(--amber)] uppercase tracking-wider block mb-1">
                    {formatRange(exp.start_date, exp.end_date, exp.current)}
                  </span>
                  <h3 className="text-xl font-heading font-black uppercase text-[var(--ink)]">
                    {exp.title}
                  </h3>
                  <div className="org text-sm font-semibold text-[var(--ink2)] mt-0.5">
                    {exp.org}
                  </div>
                  <p className="vs text-sm leading-relaxed mt-2 text-[var(--ink2)]">
                    {exp.description}
                  </p>
                  {exp.tags && exp.tags.length > 0 && (
                    <div className="tags flex flex-wrap gap-1.5 mt-3">
                      {exp.tags.map((tag) => (
                        <span key={tag} className="chip text-[11px] font-mono px-2 py-0.5 rounded border border-[var(--hair)] text-[var(--ink2)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </li>
            ))}
          </ol>

          {/* Right Sticky Achievements Column */}
          <div className="ach">
            {achievements.slice(0, 3).map((ach, i) => (
              <div key={ach.title || i} className="card p-5">
                <b className="font-heading text-2xl font-black uppercase text-[var(--ink)] block">
                  {ach.title}
                </b>
                <span className="vs text-xs sm:text-sm text-[var(--ink2)] mt-1 block">
                  {ach.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
