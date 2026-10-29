import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ScrollReveal from '../components/ui/ScrollReveal';
import { api } from '../lib/api';
import { useSettingsStore } from '../stores/useSettingsStore';

const contactSchema = z.object({
  name: z.string().min(1, 'Enter your name.'),
  email: z.string().email('Enter a valid email address.'),
  message: z.string().min(10, 'Write at least 10 characters.'),
  honeypot: z.string().max(0),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const settings = useSettingsStore((s) => s.settings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { honeypot: '', name: '', email: '', message: '' },
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const onSubmit = async (data: ContactForm) => {
    try {
      await api.messages.create({
        name: data.name,
        email: data.email,
        subject: 'Portfolio Contact Form',
        body: data.message,
      });
      showToast('Message sent! Saved to inbox.');
      reset();
    } catch (err) {
      console.error(err);
      showToast('Failed to send message. Please try again.');
    }
  };

  const copyEmail = () => {
    const email = settings.social_email || 'manthantp0321@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        setCopySuccess(true);
        showToast('Email address copied!');
        setTimeout(() => setCopySuccess(false), 2500);
      });
    } else {
      showToast(email);
    }
  };

  const showMap = settings.show_map !== 'false';
  const showPhone = settings.show_phone === 'true';

  return (
    <div className="section-container pt-20 pb-28">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg border border-[var(--amber)] bg-[var(--bg2)] text-[var(--ink)] shadow-2xl text-sm font-mono tracking-wide"
        >
          {toastMessage}
        </div>
      )}

      {/* ─── Contact Section ─── */}
      <ScrollReveal>
        <div className="contact mb-20">
          {/* Left Column */}
          <div className="cl">
            <span className="eyebrow">Contact</span>
            <div className="big font-display font-black uppercase text-4xl sm:text-6xl text-[var(--ink)] mt-2">
              GOT A SYSTEM THAT NEEDS BUILDING?
            </div>

            <p className="vs font-body text-base leading-relaxed max-w-lg mt-3 text-[var(--ink2)]">
              Have an opening, an ambitious AI integration, or an engineering challenge that needs decisive ownership? Send a message or copy my direct email.
            </p>

            <div className="flex flex-col gap-2 pt-4">
              <span className="text-xs font-mono tracking-wider uppercase text-[var(--ink2)]">
                Direct Email
              </span>
              <div className="flex items-center gap-3">
                <span className="mail font-mono text-sm sm:text-base text-[var(--ink)]">{settings.social_email || 'manthantp0321@gmail.com'}</span>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="px-3 py-1 rounded text-xs font-mono tracking-wider uppercase border border-[var(--hair)] hover:border-[var(--amber)] text-[var(--ink)] transition-colors cursor-pointer"
                >
                  {copySuccess ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Social Links Row: 44px glass buttons, 18px SVG */}
              <div className="flex items-center gap-2.5 pt-3">
                <a
                  href={settings.social_github || 'https://github.com/ManthanTP'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:border-[var(--amber)] transition-colors"
                  style={{ background: 'rgba(var(--glow-rgb), 0.08)' }}
                  aria-label="GitHub profile"
                >
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>
                <a
                  href={settings.social_linkedin || 'https://www.linkedin.com/in/manthan-patel-763a00383'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:border-[var(--amber)] transition-colors"
                  style={{ background: 'rgba(var(--glow-rgb), 0.08)' }}
                  aria-label="LinkedIn profile"
                >
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a
                  href={settings.social_instagram || 'https://instagram.com/manthan_tp'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:border-[var(--amber)] transition-colors"
                  style={{ background: 'rgba(var(--glow-rgb), 0.08)' }}
                  aria-label="Instagram profile"
                >
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a
                  href={settings.social_x || 'https://x.com/manthanpatel'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl border border-[var(--hair)] flex items-center justify-center text-[var(--ink)] hover:border-[var(--amber)] transition-colors"
                  style={{ background: 'rgba(var(--glow-rgb), 0.08)' }}
                  aria-label="X (Twitter) profile"
                >
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>

              {showPhone && (
                <div className="pt-2">
                  <span className="text-xs font-mono tracking-wider uppercase text-[var(--ink2)]">
                    Phone
                  </span>
                  <div className="text-sm font-mono text-[var(--amber)] mt-0.5">
                    +91 9686335075
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Form */}
          <div className="card form">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} />

              <div className={`fld ${errors.name ? 'bad' : ''}`}>
                <input
                  id="contact-name"
                  type="text"
                  placeholder=" "
                  {...register('name')}
                />
                <label htmlFor="contact-name">Your Name</label>
                {errors.name && <p className="err">{errors.name.message}</p>}
              </div>

              <div className={`fld ${errors.email ? 'bad' : ''}`}>
                <input
                  id="contact-email"
                  type="email"
                  placeholder=" "
                  {...register('email')}
                />
                <label htmlFor="contact-email">Email Address</label>
                {errors.email && <p className="err">{errors.email.message}</p>}
              </div>

              <div className={`fld ${errors.message ? 'bad' : ''}`}>
                <textarea
                  id="contact-message"
                  placeholder=" "
                  {...register('message')}
                />
                <label htmlFor="contact-message">Message or Project Brief</label>
                {errors.message && <p className="err">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn primary w-full justify-center text-center mt-2"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </ScrollReveal>

      {/* ─── Location & Schematic Hubballi Map ─── */}
      {showMap && (
        <ScrollReveal delay={0.08}>
          <div className="loc">
            {/* Location Info */}
            <div className="card locinfo">
              <div>
                <span className="eyebrow">Base</span>
                <div className="big font-black uppercase text-3xl sm:text-5xl text-[var(--ink)] mt-2">Hubballi, India</div>
                <p className="vs mt-2 text-[var(--ink2)] leading-relaxed">
                  Operating out of Karnataka, India. Available worldwide for remote technical engineering, system architecture, and production frontend work.
                </p>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono uppercase text-[var(--ink2)] mb-5">
                  <div className="p-3 rounded-lg border border-[var(--hair)] bg-[rgba(var(--glow-rgb),0.04)]">
                    <span className="opacity-60 block text-[10px] tracking-wider mb-0.5">Zone</span>
                    <b className="text-[var(--ink)] text-sm">IST · UTC+5:30</b>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--hair)] bg-[rgba(var(--glow-rgb),0.04)]">
                    <span className="opacity-60 block text-[10px] tracking-wider mb-0.5">Coords</span>
                    <b className="text-[var(--ink)] text-sm">15.36° N, 75.12° E</b>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Hubballi,Karnataka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn primary h-[46px] px-6 whitespace-nowrap"
                >
                  Open in Maps
                  <svg className="w-4 h-4 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Schematic SVG Map of Hubballi */}
            <div className="card mapc">
              <svg
                viewBox="0 0 640 380"
                role="img"
                aria-label="Schematic map of Hubballi, Karnataka, with Dharwad to the northwest"
              >
                <rect className="mbg" width="640" height="380" />
                <path
                  className="mland"
                  d="M30 60 C120 20 240 40 300 90 C360 140 330 220 260 250 C190 280 90 270 50 210 C20 160 10 100 30 60z"
                />
                <path
                  className="mland"
                  d="M390 150 C470 110 580 130 610 200 C630 260 560 330 470 330 C400 330 360 260 390 150z"
                />
                <path
                  className="mwater"
                  d="M470 226 q30 -24 66 -6 q20 20 -8 38 q-42 14 -58 -32z"
                />
                <path
                  className="road hw"
                  d="M-10 262 C120 240 220 200 330 188 S540 120 650 84"
                />
                <path className="road" d="M330 188 C340 250 330 310 350 390" />
                <path
                  className="road sm"
                  d="M0 140 C90 160 170 130 250 160 S400 240 480 390"
                />
                <path
                  className="road sm"
                  d="M200 -10 C210 60 190 110 200 170 S250 300 230 390"
                />
                <path className="road sm" d="M420 -10 C430 60 400 110 380 150" />
                <circle cx="196" cy="122" r="6" fill="var(--ink2)" />
                <text className="mt1" x="208" y="120">
                  DHARWAD
                </text>
                <text className="mt1" x="468" y="96" transform="rotate(-9 468 96)">
                  NH 48
                </text>
                <circle className="pr" cx="352" cy="190" r="14" />
                <circle className="pr p2" cx="352" cy="190" r="14" />
                <circle className="pin" cx="352" cy="190" r="9" />
                <text className="mt2" x="372" y="222">
                  Hubballi
                </text>
                <text className="mt1" x="372" y="240">
                  15.36° N · 75.12° E
                </text>
                <path d="M600 40 l8 22 l-8 -6 l-8 6z" fill="var(--ink2)" />
                <text className="mt1" x="594" y="82">
                  N
                </text>
              </svg>
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
