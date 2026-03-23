  import { motion } from 'framer-motion';
  import { useState, useEffect, useRef } from 'react';
  import { AudioToggle } from './AudioToggle';
  import { audioManager } from '../../utils/audioManager';
  
  interface MobileLoadingScreenProps {
    onComplete: () => void;
  }
  
  export const MobileLoadingScreen = ({ onComplete }: MobileLoadingScreenProps) => {
    const [progress, setProgress] = useState(0);
    const [dots, setDots] = useState('.');
    const [currentPhrase, setCurrentPhrase] = useState('');
    const [isGlitching, setIsGlitching] = useState(false);
    const [glitchOffset, setGlitchOffset] = useState(0);
    const [rgbShift, setRgbShift] = useState({ r: 0, g: 0, b: 0 });
    const [showAccessGranted, setShowAccessGranted] = useState(false);
    const shuffledDeckRef = useRef<string[]>([]);
    const currentIndexRef = useRef(0);
  
    const phrases = [
      "O SHI, I'M SORRY",
      'YOU SOOO CREATIVE',
      'GET OVER HERE',
      'IN BRIEF WE TRUST',
      'LET ME SPEAK FROM MY HEART',
      'ENGLISH M#$%CKER DO YOU SPEAK IT?!',
      'SHUT UP AND TAKE MY IDEAS',
      'クリエイティブ',
      'ひらめき',
      '最高傑作'
    ];
  
    useEffect(() => {
      audioManager.setMobileMode(true);
      audioManager.startBackgroundMusic();
  
      const duration = 2500;
      const steps = 100;
      const interval = duration / steps;
  
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setShowAccessGranted(true);
            setTimeout(onComplete, 500);
            return 100;
          }
          return prev + 1;
        });
      }, interval);
  
      return () => clearInterval(timer);
    }, [onComplete]);
  
    useEffect(() => {
      const dotsInterval = setInterval(() => {
        setDots((prev) => {
          if (prev === '.') return '..';
          if (prev === '..') return '...';
          return '.';
        });
      }, 500);
  
      return () => clearInterval(dotsInterval);
    }, []);
  
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
    }, []);
  
    const segmentCount = 20;
  
    return (
      <div className="mobile-starfield-background min-h-screen w-full flex flex-col items-center justify-center px-8 relative">
        <div className="mobile-crt-overlay" />
  
        <div className="absolute top-6 right-6 z-50">
          <AudioToggle />
        </div>
  
        <div className="relative z-10 flex flex-col items-center justify-center gap-8 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-1"
          >
            <h2 className="mobile-white-pixel text-lg md:text-xl text-center tracking-wide">
              ЗАГРУЗКА
            </h2>
            <h2 className="mobile-white-pixel text-lg md:text-xl text-center tracking-wide">
              СИСТЕМЫ<span style={{ display: 'inline-block', width: '1.8em', textAlign: 'left' }}>{dots}</span>
            </h2>
          </motion.div>
  
          <div className="w-full flex flex-col gap-6">
            <div
              className="relative bg-black mx-auto"
              style={{
                border: '4px solid #FF1493',
                boxShadow: '0 0 20px rgba(255, 20, 147, 0.5)',
                imageRendering: 'pixelated',
                clipPath: 'polygon(0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), 0 calc(100% - 6px))',
                width: '100%',
                maxWidth: '360px',
                padding: '4px'
              }}
            >
              <div className="flex items-center gap-[3px] h-[20px] w-full">
                {Array.from({ length: segmentCount }).map((_, index) => {
                  const isVisible = index < Math.floor((progress / 100) * segmentCount);
                  return (
                    <div
                      key={index}
                      className="flex-1"
                      style={{
                        height: '100%',
                        backgroundColor: isVisible ? '#facc15' : 'transparent',
                        boxShadow: isVisible ? '0 0 8px rgba(250, 204, 21, 0.8)' : 'none',
                        imageRendering: 'pixelated',
                        minWidth: '12px',
                        transition: 'none'
                      }}
                    />
                  );
                })}
              </div>
            </div>
  
            <div className="text-center flex items-center justify-center" style={{ minHeight: '40px', height: '40px' }}>
              {showAccessGranted ? (
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '0.9rem',
                    color: '#00ff00',
                    textShadow: '0 0 15px rgba(0, 255, 0, 1)',
                    letterSpacing: '0.15em',
                    fontWeight: 'bold'
                  }}
                >
                  ACCESS GRANTED
                </span>
              ) : (
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '0.75rem',
                    color: '#ffffff',
                    textShadow: isGlitching
                      ? `${rgbShift.r}px 0 0 #ff0080, ${rgbShift.g}px 0 0 #00ff80, 0 0 8px rgba(255, 255, 255, 0.8)`
                      : '0 0 6px rgba(255, 255, 255, 0.5)',
                    transition: 'none',
                    letterSpacing: isGlitching ? '0.2em' : '0.05em',
                    display: 'inline-block',
                    width: '100%',
                    maxWidth: '320px',
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
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
