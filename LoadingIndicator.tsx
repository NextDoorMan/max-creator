import { useEffect, useState, useRef } from 'react';

interface LoadingIndicatorProps {
  phrases: string[];
  onAccessGranted?: () => void;
}

export default function LoadingIndicator({ phrases, onAccessGranted }: LoadingIndicatorProps) {
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState(0);
  const [rgbShift, setRgbShift] = useState({ r: 0, g: 0, b: 0 });
  const shuffledDeckRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const shuffleDeck = (array: string[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const getNextPhrase = () => {
      if (shuffledDeckRef.current.length === 0 || currentIndexRef.current >= shuffledDeckRef.current.length) {
        shuffledDeckRef.current = shuffleDeck(phrases);
        currentIndexRef.current = 0;
      }
      const phrase = shuffledDeckRef.current[currentIndexRef.current];
      currentIndexRef.current++;
      return phrase;
    };

    const scrambleText = (text: string) => {
      const chars = '&%01#@$!*+=<>[]{}\\|~';
      return text.split('').map(() =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
    };

    setCurrentPhrase(getNextPhrase());

    const interval = setInterval(() => {
      setIsGlitching(true);

      let glitchCount = 0;
      const glitchInterval = setInterval(() => {
        const currentText = currentPhrase;
        setCurrentPhrase(scrambleText(currentText));
        setGlitchOffset(Math.random() > 0.5 ? (Math.random() * 8 - 4) : 0);
        setRgbShift({
          r: Math.random() * 4 - 2,
          g: Math.random() * 4 - 2,
          b: Math.random() * 4 - 2
        });
        glitchCount++;

        if (glitchCount >= 2) {
          clearInterval(glitchInterval);
          setCurrentPhrase(getNextPhrase());
          setIsGlitching(false);
          setGlitchOffset(0);
          setRgbShift({ r: 0, g: 0, b: 0 });
        }
      }, 50);
    }, 300);

    return () => clearInterval(interval);
  }, [phrases]);

  return (
    <span
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '1rem',
        color: isGlitching ? '#5ff5ff' : '#00f0ff',
        textShadow: isGlitching
          ? `${rgbShift.r}px 0 0 #ff0080, ${rgbShift.g}px 0 0 #00ff80, 0 0 10px rgba(0, 240, 255, 0.8)`
          : '0 0 10px rgba(0, 240, 255, 0.8)',
        transition: 'none',
        letterSpacing: isGlitching ? '0.2em' : '0.05em',
        display: 'inline-block',
        width: '400px',
        maxWidth: '90vw',
        textAlign: 'center',
        fontWeight: 'bold',
        transform: `translateX(${glitchOffset}px)`,
        filter: isGlitching ? 'blur(0.5px)' : 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'clip'
      }}
    >
      {currentPhrase}
    </span>
  );
}
