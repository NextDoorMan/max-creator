import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { audioManager } from '../../utils/audioManager';

interface MobileGlitchTransitionProps {
  onComplete: () => void;
  playGlitchSound?: boolean;
}

interface Slice {
  id: number;
  offset: number;
  height: number;
  top: number;
}

export const MobileGlitchTransition = ({ onComplete, playGlitchSound = false }: MobileGlitchTransitionProps) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState(0);
  const [rgbShift, setRgbShift] = useState({ r: 0, g: 0, b: 0 });
  const [currentText, setCurrentText] = useState('ИНИЦИАЛИЗАЦИЯ');
  const [screenShake, setScreenShake] = useState({ x: 0, y: 0 });
  const [aberration, setAberration] = useState(0);
  const [screenSlices, setScreenSlices] = useState<Slice[]>([]);
  const [noiseOpacity, setNoiseOpacity] = useState(0);
  const [fullScreenRgb, setFullScreenRgb] = useState({ r: 0, g: 0, b: 0 });
  const [flashOpacity, setFlashOpacity] = useState(0);
  const [flashColor, setFlashColor] = useState('#ffffff');
  const [invert, setInvert] = useState(false);
  const [finalWhiteFlash, setFinalWhiteFlash] = useState(0);
  useEffect(() => {

    const scrambleChars = '&%01#@$!*+=<>[]{}\\|~';

    const scrambleText = (text: string) => {
      return text.split('').map(() =>
        scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
      ).join('');
    };

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

    setIsGlitching(true);

    let glitchCount = 0;
    const glitchInterval = setInterval(() => {
      setCurrentText(scrambleText('ИНИЦИАЛИЗАЦИЯ'));
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

      glitchCount++;

      if (glitchCount >= 6) {
        clearInterval(glitchInterval);
        setCurrentText('СИСТЕМА ГОТОВА');
        setIsGlitching(false);
        setGlitchOffset(0);
        setRgbShift({ r: 0, g: 0, b: 0 });
        setScreenShake({ x: 0, y: 0 });
        setAberration(0);
        setScreenSlices([]);
        setNoiseOpacity(0);
        setFullScreenRgb({ r: 0, g: 0, b: 0 });
        setFlashOpacity(0);
        setInvert(false);

        setFinalWhiteFlash(0.8);
        setTimeout(() => {
          setFinalWhiteFlash(0);
        }, 200);

        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 80);

    return () => {
      clearInterval(glitchInterval);
    };
  }, [onComplete, playGlitchSound]);

  return (
    <>
      <div
        className="fixed inset-0 z-[9997]"
        style={{
          filter: isGlitching
            ? `${invert ? 'invert(1) hue-rotate(180deg) ' : ''}saturate(${1.5 + Math.random() * 0.5}) contrast(${1.1 + Math.random() * 0.3}) drop-shadow(${fullScreenRgb.r}px 0 0 #ff0080) drop-shadow(${fullScreenRgb.g}px 0 0 #00ff80) drop-shadow(0 ${fullScreenRgb.b}px 0 #0080ff) drop-shadow(${fullScreenRgb.r * 0.5}px ${fullScreenRgb.b * 0.5}px 0 #ff00ff)`
            : 'none',
          pointerEvents: 'none'
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
            className="fixed inset-0 z-[9998] pointer-events-none"
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
            className="fixed inset-0 z-[9998] pointer-events-none transition-opacity duration-75"
            style={{
              opacity: flashOpacity,
              background: flashColor,
              mixBlendMode: 'screen'
            }}
          />
        </>
      )}

      <div
        className="fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-200"
        style={{
          opacity: finalWhiteFlash,
          background: '#ffffff'
        }}
      />

      <div
        className="fixed inset-0 z-[9998] flex items-center justify-center"
        style={{
          background: 'transparent',
          transform: `translate(${screenShake.x}px, ${screenShake.y}px)`
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <span
            className="mobile-white-pixel"
            style={{
              fontSize: isGlitching ? 'min(12vw, 10vh)' : 'min(8vw, 7vh)',
              color: '#ffffff',
              textShadow: isGlitching
                ? `${rgbShift.r}px 0 0 #ff0080, ${rgbShift.g}px 0 0 #00ff80, ${rgbShift.b}px ${rgbShift.r}px 0 #0080ff, ${-rgbShift.g}px 0 0 #ffff00, 0 0 20px rgba(255, 255, 255, 0.9)`
                : '0 0 8px rgba(255, 255, 255, 0.7), 4px 4px 0px rgba(0,0,0,0.9)',
              display: 'inline-block',
              transform: `translateX(${glitchOffset}px)`,
              filter: isGlitching ? `blur(${aberration}px)` : 'none',
              letterSpacing: isGlitching ? '0.4em' : '0.15em',
              imageRendering: 'pixelated',
              transition: 'font-size 0.3s ease'
            }}
          >
            {currentText}
          </span>
        </motion.div>
      </div>
    </>
  );
};
