import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { IconDownload, IconEye } from '../components/ui/Icons';
import { api } from '../lib/api';
import { useDataStore } from '../stores/useDataStore';
import { useSettingsStore } from '../stores/useSettingsStore';

export default function Resume() {
  const [downloadCount, setDownloadCount] = useState(0);
  const settings = useSettingsStore((s) => s.settings);
  const experience = useDataStore((s) => s.experience);
  const resumeUrl = settings.resume_url || '';

  useEffect(() => {
    if (settings.resume_downloads) {
      setDownloadCount(parseInt(settings.resume_downloads, 10) || 0);
    }
  }, [settings.resume_downloads]);

  const handleDownload = async () => {
    if (!resumeUrl) return alert('Resume PDF is not available yet.');
    const newCount = downloadCount + 1;
    setDownloadCount(newCount);
    try {
      await api.settings.update('resume_downloads', newCount.toString());
    } catch (e) {
      console.error('Failed to update count', e);
    }
    window.open(resumeUrl, '_blank');
  };

  const workExp = experience.filter((e) => e.type !== 'achievement');

  return (
    <div className="section-container" style={{ paddingTop: 100 }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 className="font-hero" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 12 }}>
            My <span className="neon-text">Resume</span>
          </h1>
          <p className="font-heading" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Download or preview my latest credentials
          </p>
        </div>
      </ScrollReveal>

      {/* PDF Preview */}
      <ScrollReveal>
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto 40px', overflow: 'hidden', minHeight: 400 }}>
          {resumeUrl ? (
            <iframe
              src={`${resumeUrl}#toolbar=0`}
              width="100%"
              height="600"
              style={{ border: 'none', background: 'var(--bg-secondary)' }}
              title="Resume PDF"
            />
          ) : (
            <div
              style={{
                background: 'var(--surface-elevated)',
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{ fontSize: '3rem', opacity: 0.3 }}>📄</div>
              <p className="font-heading" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Resume PDF Not Uploaded
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textAlign: 'center', maxWidth: 300 }}>
                Upload your resume PDF via the Admin Dashboard to enable preview
              </p>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Actions */}
      <ScrollReveal>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`btn-primary ${resumeUrl ? 'animate-glow' : ''}`}
            onClick={handleDownload}
            style={{
              fontSize: '1rem',
              padding: '14px 32px',
              opacity: resumeUrl ? 1 : 0.5,
              cursor: resumeUrl ? 'pointer' : 'not-allowed',
              position: 'relative',
            }}
            disabled={!resumeUrl}
            aria-label="Download resume PDF"
          >
            <IconDownload size={18} /> Download PDF
          </motion.button>
          {resumeUrl && (
            <button
              onClick={() => window.open(resumeUrl, '_blank')}
              className="btn-secondary"
              style={{ fontSize: '1rem', padding: '14px 32px' }}
              aria-label="View full screen resume"
            >
              <IconEye size={18} /> View Full Screen
            </button>
          )}
        </div>
        <p
          className="font-heading"
          style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            marginBottom: 60,
          }}
        >
          Downloaded{' '}
          <span className="font-mono" style={{ color: 'var(--accent-violet)', fontWeight: 700 }}>
            <AnimatedCounter target={downloadCount} />
          </span>{' '}
          times
        </p>
      </ScrollReveal>

      {/* Key Highlights */}
      <ScrollReveal>
        <h2 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>
          Key Highlights
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
            maxWidth: 800,
            margin: '0 auto 60px',
          }}
        >
          {['React Developer', 'AI Integration Specialist', 'Full Stack Engineer'].map((h, i) => (
            <motion.div
              key={h}
              whileHover={{ y: -6 }}
              className="glass-card"
              style={{
                padding: 24,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                borderTop: '2px solid rgba(108, 99, 255, 0.3)',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>
                {['⚛️', '🤖', '🚀'][i]}
              </div>
              <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {h}
              </h3>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* Recent Experience */}
      {workExp.length > 0 && (
        <ScrollReveal>
          <h2 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>
            Recent Experience
          </h2>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {workExp.slice(0, 3).map((exp) => (
              <motion.div
                key={exp.id}
                whileHover={{ x: 6 }}
                className="glass-card"
                style={{ padding: '20px 28px', marginBottom: 14, borderLeft: '4px solid var(--accent-cyan)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  <div>
                    <h3 className="font-heading" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {exp.title}
                    </h3>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', marginTop: 2 }}>{exp.org}</p>
                  </div>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '4px 10px',
                      borderRadius: 16,
                    }}
                  >
                    {exp.start_date} — {exp.current ? 'Present' : exp.end_date || 'Present'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
