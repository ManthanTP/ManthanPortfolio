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

  return (
    <div className="section-container pt-20">
      <ScrollReveal>
        <div className="mb-12">
          <span className="hk">Trajectory</span>
          <h2 className="big text-4xl sm:text-5xl mt-2">
            Experience & <em>Impact</em>
          </h2>
          <p className="vs max-w-xl mt-3">
            Real-world deployments, engineering leadership, and high-concurrency production track record.
          </p>
        </div>
      </ScrollReveal>

      {/* Experience Grid: Left Timeline + Right Sticky Achievements */}
      <ScrollReveal delay={0.08}>
        <div className="xgrid">
          {/* Left Timeline */}
          <ul className="tl" id="tl">
            {workExp.map((exp, i) => (
              <li key={exp.id || i} className="tli">
                <div className="dot" />
                <div className="card">
                  <span className="when">
                    {exp.start_date} — {exp.current ? 'Present' : exp.end_date || '2024'}
                  </span>
                  <div className="text-xl font-heading font-black uppercase text-[var(--ink)]">
                    {exp.title}
                  </div>
                  <div className="org text-sm font-semibold text-[var(--amber)]">
                    {exp.org}
                  </div>
                  <p className="vs text-sm leading-relaxed mt-1">
                    {exp.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Right Sticky Achievements Column */}
          <div className="ach">
            {achievements.slice(0, 4).map((ach, i) => (
              <div key={ach.title || i} className="card">
                <span className="text-2xl mb-1">{ach.icon || '🏆'}</span>
                <b className="font-heading text-lg font-black uppercase text-[var(--ink)]">
                  {ach.title}
                </b>
                <p className="vs text-xs leading-relaxed mt-1">
                  {ach.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
