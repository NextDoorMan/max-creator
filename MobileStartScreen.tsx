import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { soundEffects, audioManager } from '../../utils/audioManager';
import { AudioToggle } from './AudioToggle';

interface Slice {
  id: number;
  offset: number;
  height: number;
  top: number;
}

interface MobileStartScreenProps {
  onStart: () => void;
}

export const MobileStartScreen = ({ onStart }: MobileStartScreenProps) => {
  const [isActivating, setIsActivating] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const soundDurationRef = useRef(0);
  const [glitchOffset, setGlitchOffset] = useState(0);
  const [rgbShift, setRgbShift] = useState({ r: 0, g: 0, b: 0 });
  const [screenShake, setScreenShake] = useState({ x: 0, y: 0 });
  const [aberration, setAberration] = useState(0);
  const [screenSlices, setScreenSlices] = useState<Slice[]>([]);
  const [noiseOpacity, setNoiseOpacity] = useState(0);
  const [fullScreenRgb, setFullScreenRgb] = useState({ r: 0, g: 0, b: 0 });
  const [flashOpacity, setFlashOpacity] = useState(0);
  const [flashColor, setFlashColor] = useState('#ffffff');
  const [invert, setInvert] = useState(false);

  useEffect(() => {
    const audioElement = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%B0%D0%BA%D1%82%D0%B8%D0%B2%D0%B0%D1%86%D0%B8%D1%8F_luobxd.mp3');
    audioElement.addEventListener('loadedmetadata', () => {
      soundDurationRef.current = audioElement.duration * 1000;
    });
    audioElement.load();
  }, []);

  useEffect(() => {
    if (isGlitching) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const generateSlices = (): Slice[] => {
        const sliceCount = 10 + Math.floor(Math.random() * 3);
        const slices: Slice[] = [];
        for (let i = 0; i < sliceCount; i++) {
          slices.push({
            id: i,
            offset: (Math.random() - 0.5) * 60,
            height: 100 / sliceCount,
            top: (100 / sliceCount) * i
          });
        }
        return slices;
      };

      const glitchInterval = setInterval(() => {
        setGlitchOffset(Math.random() > 0.5 ? (Math.random() * 20 - 10) : 0);
        setRgbShift({
          r: Math.random() * 24 - 12,
          g: Math.random() * 24 - 12,
          b: Math.random() * 24 - 12
        });
        setScreenShake({
          x: Math.random() * 20 - 10,
          y: Math.random() * 20 - 10
        });
        setAberration(Math.random() * 4);
        setScreenSlices(generateSlices());
        setNoiseOpacity(Math.random() * 0.4);
        setFullScreenRgb({
          r: Math.random() * 60 - 30,
          g: Math.random() * 60 - 30,
          b: Math.random() * 60 - 30
        });

        if (Math.random() > 0.4) {
          setFlashOpacity(Math.random() * 0.7 + 0.3);
          const colors = ['#ff0080', '#00ff80', '#0080ff', '#ffff00', '#ff00ff', '#00ffff'];
          setFlashColor(colors[Math.floor(Math.random() * colors.length)]);
          setTimeout(() => setFlashOpacity(0), 50);
        }

        setInvert(Math.random() > 0.7);
      }, 80);

      return () => {
        clearInterval(glitchInterval);
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isGlitching]);

  const handleStart = async () => {
    try {
      await audioManager.resume?.();
    } catch (err) {
      console.warn('AudioContext resume failed:', err);
    }

    try {
      const AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
      if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
      }
    } catch (err) {
      console.warn('AudioContext initialization failed:', err);
    }

    setIsActivating(true);

    soundEffects.playWithOverlap('coin', 'glitch', 300, () => {
      setIsGlitching(true);
    });

    const duration = soundDurationRef.current || 1200;
    setTimeout(() => {
      onStart();
    }, duration + 500);
  };

  return (
    <div
      className="mobile-starfield-background min-h-screen w-full flex flex-col items-center justify-between px-6 py-8 relative"
      style={{ overflow: 'hidden' }}
    >
      <div className="mobile-crt-overlay" />

      <div
        className="absolute inset-0 z-[99999] pointer-events-none"
        style={{
          filter: isGlitching
            ? `${invert ? 'invert(1) hue-rotate(180deg) ' : ''}saturate(${1.5 + Math.random() * 0.5}) contrast(${1.1 + Math.random() * 0.3}) drop-shadow(${fullScreenRgb.r}px 0 0 #ff0080) drop-shadow(${fullScreenRgb.g}px 0 0 #00ff80) drop-shadow(0 ${fullScreenRgb.b}px 0 #0080ff) drop-shadow(${fullScreenRgb.r * 0.5}px ${fullScreenRgb.b * 0.5}px 0 #ff00ff)`
            : 'none',
          transform: isGlitching ? `translate(${screenShake.x}px, ${screenShake.y}px)` : 'none'
        }}
      >
        {isGlitching && screenSlices.map((slice) => (
          <div
            key={slice.id}
            className="absolute w-full overflow-hidden"
            style={{
              height: `${slice.height}%`,
              top: `${slice.top}%`,
              transform: `translateX(${slice.offset}px)`,
              borderTop: Math.random() > 0.6 ? '2px solid rgba(255, 255, 255, 0.4)' : 'none',
              borderBottom: Math.random() > 0.6 ? '2px solid rgba(255, 255, 255, 0.4)' : 'none',
              background: Math.random() > 0.8 ? 'rgba(255, 0, 128, 0.1)' : 'transparent'
            }}
          />
        ))}
      </div>

      {isGlitching && (
        <>
          <div
            className="absolute inset-0 z-[99998] pointer-events-none"
            style={{
              opacity: noiseOpacity,
              background: `repeating-linear-gradient(
                0deg,
                transparent 0px,
                rgba(255, 255, 255, ${Math.random() * 0.15}) 1px,
                transparent 2px,
                rgba(255, 255, 255, ${Math.random() * 0.15}) 3px
              )`,
              backgroundSize: '100% 4px',
              mixBlendMode: 'overlay'
            }}
          />
          <div
            className="absolute inset-0 z-[99998] pointer-events-none transition-opacity duration-75"
            style={{
              opacity: flashOpacity,
              background: flashColor,
              mixBlendMode: 'screen'
            }}
          />
        </>
      )}

      <div className="absolute top-6 right-6 z-[10000]">
        <AudioToggle />
      </div>

      <motion.div
        className="flex-1 flex flex-col items-center relative z-10 w-full max-w-md px-4"
        style={{ paddingTop: '22vh' }}
        animate={isGlitching ? {
          x: [0, -20, 18, -15, 22, -18, 15, -12, 20, -10, 8, -5, 0],
          y: [0, 8, -6, 10, -8, 6, -10, 8, -5, 6, -3, 2, 0],
          scaleX: [1, 1.02, 0.98, 1.03, 0.97, 1.02, 0.98, 1.01, 0.99, 1.02, 0.98, 1]
        } : { x: 0, y: 0, scaleX: 1 }}
        transition={{ duration: 0.5, ease: "linear" }}
      >
        <div
          className="relative w-full flex flex-col gap-3"
          style={{ marginBottom: '12vh' }}
        >
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}>
            <h1
              className="mobile-3d-text-large leading-none tracking-tight"
              data-text="ПОРТФОЛИО"
              style={{
                fontSize: 'clamp(2.375rem, 10.45vw, 4.275rem)',
                whiteSpace: 'nowrap',
                fontFamily: "'Press Start 2P', monospace"
              }}
            >
              ПОРТФОЛИО
            </h1>
          </div>
          <h1
            className="mobile-3d-text leading-none tracking-tight"
            style={{
              fontSize: 'clamp(1.5rem, 7vw, 2.75rem)',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              top: 'clamp(3.375rem, 14.45vw, 5.275rem)'
            }}
          >
            КРЕАТОРА
          </h1>
        </div>

        <div
          className="flex flex-col items-center gap-6 w-full"
          style={{ marginTop: '6vh' }}
        >
          <div className="relative flex items-center justify-center" style={{ height: '60px', width: '80px' }}>
            <img
              src="https://res.cloudinary.com/djihbhmzz/image/upload/v1772359189/%D0%BC%D0%BE%D0%BD%D0%B5%D1%82%D0%BA%D0%B0_fxmyej.gif"
              alt="Animated coin"
              style={{
                width: '80px',
                height: '60px',
                imageRendering: 'pixelated',
                objectFit: 'contain'
              }}
            />
          </div>

          <button
            onClick={handleStart}
            disabled={isActivating}
            className={`mobile-insert-coin-button ${isActivating ? 'mobile-button-blink' : 'mobile-pulse'}`}
            style={{ width: 'auto', paddingLeft: '24px', paddingRight: '24px' }}
          >
            <span className="mobile-white-pixel text-base font-bold uppercase tracking-wide whitespace-nowrap">
              ВСТАВЬТЕ МОНЕТУ
            </span>
          </button>

          <p className="mobile-white-pixel text-xs text-center mt-2">
            И получите +1 к креативности
          </p>
        </div>
      </motion.div>

      <div className="relative z-10 text-center">
        <p className="mobile-white-pixel text-xs">
          © 2026 МАКС БОНДАРЕНКО
        </p>
      </div>
    </div>
  );
};
