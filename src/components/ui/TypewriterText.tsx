import { useEffect, useState, useCallback } from 'react';

interface TypewriterTextProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export default function TypewriterText({ texts, speed = 60, deleteSpeed = 30, pauseDuration = 2000, className = '' }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentText = texts[textIndex];
    if (!isDeleting) {
      setDisplayText(currentText.substring(0, charIndex + 1));
      setCharIndex((prev) => prev + 1);
      if (charIndex + 1 === currentText.length) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
    } else {
      setDisplayText(currentText.substring(0, charIndex - 1));
      setCharIndex((prev) => prev - 1);
      if (charIndex - 1 === 0) {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
        return;
      }
    }
  }, [texts, textIndex, charIndex, isDeleting, pauseDuration]);

  useEffect(() => {
    const timeout = setTimeout(tick, isDeleting ? deleteSpeed : speed);
    return () => clearTimeout(timeout);
  }, [tick, isDeleting, deleteSpeed, speed]);

  return (
    <span className={className}>
      {displayText}
      <span style={{ animation: 'typewriter-blink 1s step-end infinite', borderRight: '2px solid var(--accent-violet)', marginLeft: '2px' }} />
    </span>
  );
}
