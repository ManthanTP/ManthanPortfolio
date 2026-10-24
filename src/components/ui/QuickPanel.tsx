import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconX,
  IconCopy,
  IconCheck,
  IconDownload,
  IconGithub,
  IconLinkedin,
  IconInstagram,
  IconPhone,
  IconMusic,
  IconPlay,
  IconPause,
} from './Icons';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { api } from '../../lib/api';

export default function QuickPanel() {
  const settings = useSettingsStore((s) => s.settings);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'music'>('info');
  const [copied, setCopied] = useState(false);
  const [localTime, setLocalTime] = useState('');
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem('mp_music_volume');
      return saved !== null ? parseFloat(saved) : 0.6;
    } catch {
      return 0.6;
    }
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const quickInfoEnabled = settings.quick_info_enabled !== 'false';
  const hasMusic = Boolean(settings.music_url && settings.music_url.trim());
  const showPhone = settings.show_phone === 'true';

  // Live time in Hubballi (Asia/Kolkata)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        setLocalTime(formatted);
      } catch {
        setLocalTime(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation & Focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Audio lifecycle (created only on first play)
  const togglePlay = () => {
    if (!settings.music_url) return;

    if (!audioRef.current) {
      const audio = new Audio(settings.music_url);
      audio.loop = true;
      audio.volume = volume;
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.error('Audio play failed', e);
        setIsPlaying(false);
      });
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    try {
      localStorage.setItem('mp_music_volume', newVol.toString());
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText('manthantp0321@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResumeDownload = async () => {
    const resumeUrl = settings.resume_url;
    if (!resumeUrl) return alert('Resume PDF is not available yet.');
    const count = parseInt(settings.resume_downloads || '0', 10) + 1;
    try {
      await api.settings.update('resume_downloads', count.toString());
    } catch (e) {
      console.error(e);
    }
    window.open(resumeUrl, '_blank');
  };

  if (!quickInfoEnabled) return null;

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open quick info and music panel"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 49,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-violet), #4f46e5)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 30px rgba(108, 99, 255, 0.35)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <IconX size={22} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} style={{ position: 'relative' }}>
              <span className="font-heading" style={{ fontSize: '1rem', fontWeight: 700 }}>MP</span>
              {isPlaying && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: 'var(--accent-cyan)',
                    boxShadow: '0 0 8px var(--accent-cyan)',
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Quick info and music player"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: 86,
              right: 24,
              zIndex: 50,
              width: 'min(380px, calc(100vw - 32px))',
              background: 'var(--surface-card)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--border-color)',
              borderRadius: 20,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
              overflow: 'hidden',
            }}
          >
            {/* Header Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border-color)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <button
                onClick={() => setActiveTab('info')}
                className="font-heading"
                style={{
                  flex: 1,
                  padding: '14px',
                  background: activeTab === 'info' ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'info' ? '2px solid var(--accent-violet)' : '2px solid transparent',
                  color: activeTab === 'info' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Quick Info
              </button>

              {hasMusic && (
                <button
                  onClick={() => setActiveTab('music')}
                  className="font-heading"
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: activeTab === 'music' ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'music' ? '2px solid var(--accent-violet)' : '2px solid transparent',
                    color: activeTab === 'music' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    transition: 'all 0.2s',
                  }}
                >
                  <IconMusic size={14} />
                  Music {isPlaying && '♫'}
                </button>
              )}
            </div>

            {/* Panel Body */}
            <div style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
              {activeTab === 'info' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Availability Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: 'rgba(0, 245, 212, 0.08)',
                      border: '1px solid rgba(0, 245, 212, 0.25)',
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--accent-cyan)',
                        boxShadow: '0 0 10px var(--accent-cyan)',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                      <span className="font-heading" style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                        {settings.availability_text || 'Available for freelance & full-time roles'}
                      </span>
                    </div>
                  </div>

                  {/* Currently Building */}
                  {settings.building_status && (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: 2 }}>
                        CURRENTLY BUILDING
                      </div>
                      <div className="font-heading" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {settings.building_status}
                      </div>
                    </div>
                  )}

                  {/* Local Time in Hubballi */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Hubballi (IST)
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                      {localTime}
                    </span>
                  </div>

                  {/* Actions: Copy Email & Resume */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                      onClick={copyEmail}
                      className="btn-secondary"
                      style={{
                        fontSize: '0.8rem',
                        padding: '10px',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                      aria-label="Copy email address"
                    >
                      {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                      {copied ? 'Copied!' : 'Copy Email'}
                    </button>

                    <button
                      onClick={handleResumeDownload}
                      className="btn-primary"
                      style={{
                        fontSize: '0.8rem',
                        padding: '10px',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                      aria-label="Download resume"
                    >
                      <IconDownload size={14} /> Resume
                    </button>
                  </div>

                  {/* Social & Contact Links */}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', paddingTop: 6 }}>
                    {settings.social_github && (
                      <a
                        href={settings.social_github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ padding: '8px 12px' }}
                        aria-label="GitHub profile"
                      >
                        <IconGithub size={16} />
                      </a>
                    )}
                    {settings.social_linkedin && (
                      <a
                        href={settings.social_linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ padding: '8px 12px' }}
                        aria-label="LinkedIn profile"
                      >
                        <IconLinkedin size={16} />
                      </a>
                    )}
                    {settings.social_instagram && (
                      <a
                        href={settings.social_instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ padding: '8px 12px' }}
                        aria-label="Instagram profile"
                      >
                        <IconInstagram size={16} />
                      </a>
                    )}
                    {showPhone && (
                      <a
                        href="tel:+919686335075"
                        className="btn-secondary"
                        style={{ padding: '8px 12px' }}
                        aria-label="Call me"
                      >
                        <IconPhone size={16} />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                /* Music Tab */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, textAlign: 'center' }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'rgba(108, 99, 255, 0.15)',
                      border: '1px solid var(--accent-violet)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      color: 'var(--accent-violet)',
                    }}
                  >
                    <IconMusic size={28} />
                  </div>

                  <div>
                    <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                      {settings.music_title || 'Ambient Track'}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Focus & relax while browsing
                    </p>
                  </div>

                  {/* Play / Pause Toggle */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <motion.button
                      onClick={togglePlay}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-violet), #4f46e5)',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(108, 99, 255, 0.4)',
                      }}
                      aria-label={isPlaying ? 'Pause music' : 'Play music'}
                    >
                      {isPlaying ? <IconPause size={20} /> : <IconPlay size={20} />}
                    </motion.button>
                  </div>

                  {/* Volume Slider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Vol</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      style={{
                        flex: 1,
                        accentColor: 'var(--accent-violet)',
                        cursor: 'pointer',
                      }}
                      aria-label="Volume slider"
                    />
                    <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minWidth: 28 }}>
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
