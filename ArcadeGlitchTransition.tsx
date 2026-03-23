import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArcadeGlitchTransitionProps {
  isActive: boolean;
  onComplete: () => void;
  shortMode?: boolean;
}

const colors = [
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF',
  '#FFA500',
  '#FF1493',
  '#00FF7F',
  '#FF4500'
];

export default function ArcadeGlitchTransition({ isActive, onComplete, shortMode = false }: ArcadeGlitchTransitionProps) {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [showJapanese, setShowJapanese] = useState(false);
  const [phase, setPhase] = useState<'main' | 'overlay' | 'complete'>('main');
  const [glitchOffsets, setGlitchOffsets] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isActive) return;

    const colorInterval = setInterval(() => {
      setCurrentColorIndex(prev => (prev + 1) % colors.length);
    }, 50);

    const glitchInterval = setInterval(() => {
      setGlitchOffsets({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40
      });
    }, Math.random() * 20 + 30);

    let japaneseTimeout: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;

    if (shortMode) {
      phaseTimeout = setTimeout(() => {
        setPhase('complete');
        setTimeout(() => {
          onComplete();
        }, 50);
      }, 100);
    } else {
      japaneseTimeout = setTimeout(() => {
        setShowJapanese(true);
        setTimeout(() => setShowJapanese(false), 300);
      }, 400);

      phaseTimeout = setTimeout(() => {
        setPhase('overlay');
      }, 800);

      const completeTimeout = setTimeout(() => {
        setPhase('complete');
        setTimeout(() => {
          onComplete();
        }, 50);
      }, 1000);

      return () => {
        clearInterval(colorInterval);
        clearInterval(glitchInterval);
        clearTimeout(japaneseTimeout);
        clearTimeout(phaseTimeout);
        clearTimeout(completeTimeout);
      };
    }

    return () => {
      clearInterval(colorInterval);
      clearInterval(glitchInterval);
      clearTimeout(phaseTimeout);
    };
  }, [isActive, onComplete, shortMode]);

  if (!isActive || phase === 'complete') return null;

  const currentColor = colors[currentColorIndex];
  const text = showJapanese ? 'みんな準備してね' : 'ПРИГОТОВИТЬСЯ!';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center"
        style={{
          zIndex: phase === 'main' ? 60 : 100,
          pointerEvents: 'none',
          imageRendering: 'pixelated',
          WebkitFontSmoothing: 'none',
          MozOsxFontSmoothing: 'grayscale'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: phase === 'overlay' ? '#000000' : 'rgba(0, 0, 0, 0.85)',
            backdropFilter: phase === 'main' ? 'blur(2px)' : 'none'
          }}
        />

        <div className="relative px-4">
          <motion.div
            className="mobile-white-pixel font-bold text-center"
            style={{
              fontSize: showJapanese ? 'clamp(1.2rem, 6vw, 2.1rem)' : (phase === 'main' ? 'clamp(1.2rem, 6vw, 2.1rem)' : 'clamp(1.5rem, 7.2vw, 2.7rem)'),
              color: currentColor,
              textShadow: `
                5px 5px 0px rgba(0,0,0,1),
                -5px -5px 0px rgba(0,0,0,1),
                5px -5px 0px rgba(0,0,0,1),
                -5px 5px 0px rgba(0,0,0,1),
                0 0 20px ${currentColor},
                0 0 40px ${currentColor}
              `,
              imageRendering: 'pixelated',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              transform: `translate(${glitchOffsets.x}px, ${glitchOffsets.y}px)`,
              animation: 'shake 0.1s infinite'
            }}
            animate={{
              scale: [1, 1.05, 0.95, 1.02, 1],
              rotate: [0, -2, 2, -1, 0]
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {text}
          </motion.div>

          <motion.div
            className="mobile-white-pixel font-bold text-center absolute inset-0"
            style={{
              fontSize: showJapanese ? 'clamp(1.2rem, 6vw, 2.1rem)' : (phase === 'main' ? 'clamp(1.2rem, 6vw, 2.1rem)' : 'clamp(1.5rem, 7.2vw, 2.7rem)'),
              color: '#FF0000',
              textShadow: '0 0 10px #FF0000',
              imageRendering: 'pixelated',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              transform: `translate(${-8 + glitchOffsets.x * 0.5}px, ${glitchOffsets.y * 0.3}px)`,
              opacity: 0.8,
              mixBlendMode: 'screen'
            }}
          >
            {text}
          </motion.div>

          <motion.div
            className="mobile-white-pixel font-bold text-center absolute inset-0"
            style={{
              fontSize: showJapanese ? 'clamp(1.2rem, 6vw, 2.1rem)' : (phase === 'main' ? 'clamp(1.2rem, 6vw, 2.1rem)' : 'clamp(1.5rem, 7.2vw, 2.7rem)'),
              color: '#0000FF',
              textShadow: '0 0 10px #0000FF',
              imageRendering: 'pixelated',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              transform: `translate(${8 + glitchOffsets.x * 0.5}px, ${-glitchOffsets.y * 0.3}px)`,
              opacity: 0.8,
              mixBlendMode: 'screen'
            }}
          >
            {text}
          </motion.div>
        </div>

        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: colors[Math.floor(Math.random() * colors.length)],
              opacity: Math.random() * 0.7 + 0.3,
              imageRendering: 'pixelated',
              mixBlendMode: 'screen'
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              opacity: [1, 0]
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              delay: i * 0.05
            }}
          />
        ))}
      </motion.div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2px, 2px); }
          20% { transform: translate(2px, -2px); }
          30% { transform: translate(-2px, -2px); }
          40% { transform: translate(2px, 2px); }
          50% { transform: translate(-2px, 2px); }
          60% { transform: translate(2px, -2px); }
          70% { transform: translate(-2px, -2px); }
          80% { transform: translate(2px, 2px); }
          90% { transform: translate(-2px, 2px); }
        }
      `}</style>
    </AnimatePresence>
  );
}
