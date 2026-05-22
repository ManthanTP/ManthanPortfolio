import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import { IconSend, IconCheck, IconGithub, IconLinkedin, IconInstagram, IconX, IconEmail, IconMapPin, IconPhone } from '../components/ui/Icons';


const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0), // spam protection
});

type ContactForm = z.infer<typeof contactSchema>;

const socialIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  github: IconGithub, linkedin: IconLinkedin, instagram: IconInstagram, x: IconX, email: IconEmail,
};

import { api } from '../lib/api';
import { useSettingsStore } from '../stores/useSettingsStore';

export default function Contact() {
  const settings = useSettingsStore(s => s.settings);
  
  const dynamicSocialLinks = [
    { name: 'GitHub', url: settings.social_github, icon: 'github', color: '#fff' },
    { name: 'LinkedIn', url: settings.social_linkedin, icon: 'linkedin', color: '#0A66C2' },
    { name: 'X / Twitter', url: settings.social_x, icon: 'x', color: '#fff' },
    { name: 'Instagram', url: settings.social_instagram, icon: 'instagram', color: '#E4405F' },
  ].filter(link => !!link.url);

  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { honeypot: '' },
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      await api.messages.create({
        name: data.name,
        email: data.email,
        subject: data.subject || '',
        body: data.message
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="section-container" style={{ paddingTop: 100 }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 className="font-hero" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: 12 }}>
            Let's <span className="neon-text">Connect</span>
          </h1>
          <p className="font-heading" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Got a question or proposal? Drop me a message
          </p>
        </div>
      </ScrollReveal>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40, maxWidth: 1000, margin: '0 auto' }} className="contact-grid">
        {/* Contact Form */}
        <ScrollReveal>
          <div className="glass-card" style={{ padding: 32 }}>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                >
                  {/* Honeypot */}
                  <input type="text" {...register('honeypot')} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                  <div>
                    <label className="font-heading" style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 8 }}>Name *</label>
                    <input
                      {...register('name')}
                      placeholder="Your name"
                      className="font-body"
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 10,
                        border: `1px solid ${errors.name ? '#ff4444' : 'var(--border-color)'}`,
                        background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                        fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.3s',
                      }}
                    />
                    {errors.name && <p style={{ color: '#ff4444', fontSize: '0.75rem', marginTop: 4 }}>{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="font-heading" style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 8 }}>Email *</label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="your@email.com"
                      className="font-body"
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 10,
                        border: `1px solid ${errors.email ? '#ff4444' : 'var(--border-color)'}`,
                        background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                        fontSize: '0.9rem', outline: 'none',
                      }}
                    />
                    {errors.email && <p style={{ color: '#ff4444', fontSize: '0.75rem', marginTop: 4 }}>{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="font-heading" style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 8 }}>Subject</label>
                    <input
                      {...register('subject')}
                      placeholder="What's this about?"
                      className="font-body"
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 10,
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                        fontSize: '0.9rem', outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label className="font-heading" style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 8 }}>Message *</label>
                    <textarea
                      {...register('message')}
                      placeholder="Tell me about your project or question..."
                      rows={5}
                      className="font-body"
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 10,
                        border: `1px solid ${errors.message ? '#ff4444' : 'var(--border-color)'}`,
                        background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                        fontSize: '0.9rem', outline: 'none', resize: 'vertical',
                      }}
                    />
                    {errors.message && <p style={{ color: '#ff4444', fontSize: '0.75rem', marginTop: 4 }}>{errors.message.message}</p>}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 245, 212, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: isSubmitting ? 0.7 : 1, marginTop: 10, position: 'relative', overflow: 'hidden' }}
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <><IconSend size={16} /> Send Message</>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '60px 20px' }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    style={{
                      width: 80, height: 80, borderRadius: '50%',
                      background: 'rgba(0,245,212,0.1)', border: '2px solid var(--accent-cyan)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 24px',
                    }}
                  >
                    <IconCheck size={36} className="" />
                  </motion.div>
                  <h2 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12, color: 'var(--accent-cyan)' }}>
                    Message Sent!
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    I'll reply within 24h 👋
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* Info Side */}
        <div>
          {/* Social Links */}
          <ScrollReveal>
            <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>Find Me</h3>
              <div style={{ display: 'flex', gap: 16 }}>
                {dynamicSocialLinks.map((link) => {
                  const Icon = socialIconMap[link.icon];
                  return (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -5, scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        width: 54, height: 54, borderRadius: 16,
                        border: '1px solid var(--border-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s, border-color 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = link.color;
                        e.currentTarget.style.borderColor = link.color;
                        e.currentTarget.style.boxShadow = `0 0 15px ${link.color}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      aria-label={link.name}
                    >
                      {Icon && <Icon size={22} />}
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>

          {/* Direct Contact Info */}
          <ScrollReveal delay={0.05}>
            <div className="glass-card" style={{ padding: 24, marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -50, left: -50, width: 100, height: 100, background: 'rgba(108,99,255,0.2)', filter: 'blur(40px)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: -50, right: -50, width: 100, height: 100, background: 'rgba(0,245,212,0.2)', filter: 'blur(40px)', borderRadius: '50%' }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 1 }}>
                <a 
                  href="mailto:manthantp0321@gmail.com"
                  style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', transition: 'all 0.3s' }}
                  className="contact-highlight-link"
                >
                  <div className="contact-icon-wrapper" style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, rgba(234, 67, 53, 0.2), rgba(234, 67, 53, 0.05))', color: '#EA4335', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(234, 67, 53, 0.2)', transition: 'all 0.3s' }}>
                    <IconEmail size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 2 }}>Email Me</div>
                    <span className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>manthantp0321@gmail.com</span>
                  </div>
                </a>
                
                <a 
                  href="tel:+919686335075"
                  style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', transition: 'all 0.3s' }}
                  className="contact-highlight-link"
                >
                  <div className="contact-icon-wrapper" style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.2), rgba(108, 99, 255, 0.05))', color: 'var(--accent-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(108, 99, 255, 0.2)', transition: 'all 0.3s' }}>
                    <IconPhone size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 2 }}>Call Me</div>
                    <span className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>+91 9686335075</span>
                  </div>
                </a>
              </div>
            </div>
            <style>{`
              .contact-highlight-link:hover {
                transform: translateX(5px);
              }
              .contact-highlight-link:hover .contact-icon-wrapper {
                transform: scale(1.1) rotate(5deg);
                box-shadow: 0 0 20px currentColor;
              }
            `}</style>
          </ScrollReveal>

          {/* Map */}
          <ScrollReveal delay={0.1}>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconMapPin size={16} />
                <span className="font-heading" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Hubli, Karnataka, India</span>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123011.53507005436!2d75.0560724555029!3d15.35019808389658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb8d73b0632a9e3%3A0xc47b99c0d54025d2!2sHubballi%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Location"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .contact-grid { grid-template-columns: 1.2fr 0.8fr !important; }
        }
      `}</style>
    </div>
  );
}
