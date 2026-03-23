import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

export default function TypewriterText({
  text,
  delay = 0,
  speed = 30,
  className = '',
  style = {},
  onComplete
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex === 0 && delay > 0) {
      const delayTimeout = setTimeout(() => {
        setCurrentIndex(1);
      }, delay);
      return () => clearTimeout(delayTimeout);
    }

    if (currentIndex > 0 && currentIndex <= text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }

    if (currentIndex > text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, speed, onComplete]);

  return (
    <span className={className} style={style}>
      <span dangerouslySetInnerHTML={{ __html: displayText }} />
      {currentIndex > 0 && currentIndex <= text.length && (
        <span className="animate-pulse">▮</span>
      )}
    </span>
  );
}
