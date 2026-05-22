import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { IconDownload, IconEye } from '../components/ui/Icons';
import { api } from '../lib/api';
import type { Experience } from '../lib/supabase';

export default function Resume() {
  const [downloadCount, setDownloadCount] = useState(0);
  const [resumeUrl, setResumeUrl] = useState('');
  const [experience, setExperience] = useState<Experience[]>([]);

  useEffect(() => {
    // Fetch settings and experience
    api.settings.getAll().then(settings => {
      const resume = settings.find(s => s.key === 'resume_url');
      if (resume) setResumeUrl(resume.value);
      const downloads = settings.find(s => s.key === 'resume_downloads');
      if (downloads) setDownloadCount(parseInt(downloads.value) || 0);
    });
    api.experience.getAll().then(data => {
      setExperience(data.filter(e => e.type !== 'achievement'));
    });
  }, []);

  const handleDownload = async () => {
    if (!resumeUrl) return alert('Resume PDF is not available yet.');
    const newCount = downloadCount + 1;
    setDownloadCount(newCount);
    try {
      await api.settings.update('resume_downloads', newCount.toString());
    } catch(e) { console.error('Failed to update count'); }
    window.open(resumeUrl, '_blank');
  };

  return (
    <div className="section-container" style={{ paddingTop: 100 }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 className="font-hero" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 12 }}>
            My <span className="neon-text">Resume</span>
          </h1>
          <p className="font-heading" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Download or preview my resume
          </p>
        </div>
      </ScrollReveal>

      {/* PDF Preview */}
      <ScrollReveal>
        <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto 40px', overflow: 'hidden', minHeight: 400 }}>
          {resumeUrl ? (
            <iframe src={`${resumeUrl}#toolbar=0`} width="100%" height="600" style={{ border: 'none', background: 'var(--bg-secondary)' }} title="Resume PDF" />
          ) : (
            <div style={{ background: 'var(--surface-elevated)', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
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
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(108, 99, 255, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            className={`btn-primary ${resumeUrl ? 'animate-glow' : ''}`}
            onClick={handleDownload}
            style={{ fontSize: '1rem', padding: '14px 32px', opacity: resumeUrl ? 1 : 0.5, cursor: resumeUrl ? 'pointer' : 'not-allowed', position: 'relative' }}
            disabled={!resumeUrl}
          >
            <IconDownload size={18} /> Download PDF
          </motion.button>
          {resumeUrl && (
            <button onClick={() => window.open(resumeUrl, '_blank')} className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              <IconEye size={18} /> View Full Screen
            </button>
          )}
        </div>
        <p className="font-heading" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 60 }}>
          Downloaded <span className="font-accent" style={{ color: 'var(--accent-violet)' }}><AnimatedCounter target={downloadCount} /></span> times
        </p>
      </ScrollReveal>

      {/* Key Highlights */}
      <ScrollReveal>
        <h2 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>
          Key Highlights
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, maxWidth: 800, margin: '0 auto 60px' }}>
          {['React Developer', 'AI Integration Specialist', 'Full Stack Engineer'].map((h, i) => (
            <motion.div
              key={h}
              whileHover={{ y: -8, scale: 1.05, boxShadow: '0 10px 30px rgba(108, 99, 255, 0.15)' }}
              className="glass-card"
              style={{ padding: 24, textAlign: 'center', position: 'relative', overflow: 'hidden', borderTop: '2px solid rgba(108, 99, 255, 0.3)' }}
            >
              <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, background: 'radial-gradient(circle, rgba(108, 99, 255, 0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.2 }}
                style={{ fontSize: '2rem', marginBottom: 12, display: 'inline-block' }}
              >
                {['⚛️', '🤖', '🚀'][i]}
              </motion.div>
              <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{h}</h3>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* Recent Experience */}
      <ScrollReveal>
        <h2 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>
          Recent Experience
        </h2>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {experience.slice(0, 3).map((exp) => (
            <motion.div 
              key={exp.id} 
              whileHover={{ x: 10, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(0, 245, 212, 0.3)' }}
              className="glass-card" 
              style={{ padding: '24px 32px', marginBottom: 16, borderLeft: '4px solid var(--accent-cyan)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <div>
                  <h3 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{exp.title}</h3>
                  <p style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', marginTop: 4 }}>{exp.org}</p>
                </div>
                <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 20 }}>
                  {exp.start_date} — {exp.current ? 'Present' : exp.end_date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
