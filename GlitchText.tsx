import { useEffect, useState } from 'react';

interface GlitchTextProps {
  words?: string[];
  color?: string;
  fontSize?: string;
}

const defaultWords = ['創造', '洞察', 'アイデア'];

export default function GlitchText({ words = defaultWords, color = '#ff1493', fontSize = '0.75rem' }: GlitchTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchText, setGlitchText] = useState(words[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);

      let glitchCount = 0;
      const glitchInterval = setInterval(() => {
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        const randomChars = Array.from({ length: 4 }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join('');
        setGlitchText(randomChars);
        glitchCount++;

        if (glitchCount >= 8) {
          clearInterval(glitchInterval);
          const nextIndex = (currentIndex + 1) % words.length;
          setCurrentIndex(nextIndex);
          setGlitchText(words[nextIndex]);
          setIsGlitching(false);
        }
      }, 50);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, words]);

  const lighterColor = color === '#ff1493' ? '#ff69b4' : '#ff6666';
  const glowColor = color === '#ff1493'
    ? 'rgba(255, 20, 147, 0.8)'
    : 'rgba(255, 51, 51, 0.6)';

  return (
    <span
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: fontSize,
        color: isGlitching ? lighterColor : color,
        textShadow: `0 0 10px ${glowColor}`,
        transition: 'color 0.1s',
        letterSpacing: isGlitching ? '0.1em' : '0.05em',
        display: 'inline-block',
        minWidth: '100px',
        textAlign: 'left',
        fontWeight: 'bold'
      }}
    >
      {glitchText}
    </span>
  );
}
