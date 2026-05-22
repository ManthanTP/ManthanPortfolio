import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { IconChat, IconX2, IconSend } from '../ui/Icons';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}



const QUICK_COMMANDS = [
  'Who is Manthan?',
  'Show me projects',
  'What skills does he have?',
  'Download resume',
];

const getDemoResponse = (msg: string): string => {
  const lower = msg.toLowerCase();
  if (lower.includes('who') && lower.includes('manthan')) {
    return "Manthan Patel is a full stack developer and AI builder from India 🇮🇳. He specializes in building production-grade web applications with React, Supabase, and AI integrations. He's passionate about creating technology that solves real problems — from smart campus systems to emergency management platforms.";
  }
  if (lower.includes('project')) {
    return "Manthan has built some impressive projects! His featured ones include:\n\n🏫 **Smart Campus Sustainability System** — AI-powered campus management with QR attendance & carbon tracking\n\n🚨 **Emergency Crowd Management** — Real-time SOS alerts & crowd analytics\n\n🚌 **Bus Tracking System** — GPS tracking with ETA prediction\n\nCheck out the Projects page for more details!";
  }
  if (lower.includes('skill') || lower.includes('tech')) {
    return "Manthan's tech stack includes:\n\n⚛️ **Frontend:** React (85%), Tailwind CSS (90%), TypeScript, Vite\n🔧 **Backend:** Supabase (82%), Node.js (70%), REST APIs (88%)\n🤖 **AI & Tools:** AI Integration (78%), GSAP, Git (92%)\n\nVisit the Skills page to see the full breakdown!";
  }
  if (lower.includes('resume') || lower.includes('download')) {
    return "You can download Manthan's resume from the Resume page! Click the 'Download PDF' button to get the latest version. 📄";
  }
  if (lower.includes('contact') || lower.includes('hire') || lower.includes('reach')) {
    return "You can reach Manthan through:\n\n📧 Email via the Contact page\n💼 LinkedIn\n🐙 GitHub\n\nHe typically responds within 24 hours!";
  }
  return "Thanks for your question! I'm Manthan's AI assistant. I can help you learn about his projects, skills, experience, or how to get in touch. What would you like to know? 😊";
};

export default function ChatWidget() {
  const { isChatOpen, setChatOpen } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hey! 👋 I'm Manthan's AI assistant. Ask me anything about his work, skills, or projects!" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1000));
    const response = getDemoResponse(userMsg);
    setIsTyping(false);
    setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setChatOpen(!isChatOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: 90,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--accent-violet)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 24px rgba(108,99,255,0.4)',
          zIndex: 60,
        }}
        className="lg:bottom-24"
        aria-label="Chat with AI assistant"
      >
        {isChatOpen ? <IconX2 size={22} /> : <IconChat size={22} />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              bottom: 160,
              right: 20,
              width: 360,
              maxWidth: 'calc(100vw - 40px)',
              height: 480,
              maxHeight: 'calc(100vh - 200px)',
              borderRadius: 20,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 60,
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6c63ff, #00f5d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span className="font-accent" style={{ fontSize: '0.7rem', color: '#fff' }}>AI</span>
              </div>
              <div>
                <h3 className="font-heading" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Manthan's AI</h3>
                <p style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>● Online</p>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: msg.role === 'user' ? 'var(--accent-violet)' : 'var(--surface-elevated)',
                    color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}
                </motion.div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', padding: '10px 14px', borderRadius: '14px 14px 14px 4px', background: 'var(--surface-elevated)', display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                      style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)', display: 'inline-block' }}
                    />
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Commands */}
            {messages.length <= 1 && (
              <div style={{ padding: '0 16px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {QUICK_COMMANDS.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => sendMessage(cmd)}
                    className="font-heading"
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border-color)',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask me anything..."
                className="font-body"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'var(--accent-violet)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                <IconSend size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
