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
            <span className="hk">Connect</span>
            <div className="big font-black uppercase text-5xl sm:text-6xl text-[var(--ink)]">
              Let's build something <em>resilient</em>.
            </div>

            <p className="vs text-base leading-relaxed max-w-lg">
              Have an opening, an ambitious AI integration, or an engineering challenge that needs decisive ownership? Send a message or copy my direct email.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-mono tracking-wider uppercase text-[var(--ink2)]">
                Direct Email
              </span>
              <div className="flex items-center gap-3">
                <span className="mail">{settings.social_email || 'manthantp0321@gmail.com'}</span>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="px-3 py-1 rounded text-xs font-mono tracking-wider uppercase border border-[var(--hair)] hover:border-[var(--amber)] text-[var(--ink)] transition-colors"
                >
                  {copySuccess ? 'Copied' : 'Copy'}
                </button>
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
                className="hbtn p w-full justify-center text-center mt-2"
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
                <span className="hk">Base</span>
                <div className="big">Hubballi, India</div>
                <p className="vs mt-2">
                  Operating out of Karnataka, India. Available worldwide for remote technical engineering, system architecture, and production frontend work.
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-4 text-sm font-mono uppercase text-[var(--ink2)] mb-4">
                  <div>
                    <span className="opacity-60 mr-1.5">Zone</span>
                    <b className="text-[var(--ink)]">IST · UTC+5:30</b>
                  </div>
                  <div>
                    <span className="opacity-60 mr-1.5">Coords</span>
                    <b className="text-[var(--ink)]">15.36° N, 75.12° E</b>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Hubballi,Karnataka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hbtn p"
                >
                  Open in Maps
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
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
