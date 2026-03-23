import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CachedImage } from './CachedImage';

interface DialogueBoxProps {
  text: string;
  heroImage: string;
  heroName: string;
  isVisible: boolean;
  onComplete?: () => void;
}

export default function DialogueBox({ text, heroImage, heroName, isVisible, onComplete }: DialogueBoxProps) {
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const [isSmallHeight, setIsSmallHeight] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      const isDesktop = window.innerWidth >= 768;
      const isShortScreen = window.innerHeight < 850;
      const isSmallScreen = window.innerHeight <= 800;
      setIsSmallHeight(isDesktop && isShortScreen || isSmallScreen);
    };

    checkHeight();
    window.addEventListener('resize', checkHeight);

    return () => window.removeEventListener('resize', checkHeight);
  }, []);

  useEffect(() => {
    if (isVisible) {
      setShouldFadeOut(false);
      const timer = setTimeout(() => {
        setShouldFadeOut(true);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const portraitSize = isSmallHeight ? '115.2px' : '144px';
  const bottomPosition = isSmallHeight ? 'bottom-6' : 'bottom-8';
  const leftPosition = isSmallHeight ? 'left-6' : 'left-8';
  const textPadding = isSmallHeight ? 'px-6 py-4' : 'px-8 py-5';
  const maxWidth = isSmallHeight ? 'calc(90vw - 160px)' : 'calc(90vw - 200px)';
  const fontSize = isSmallHeight ? '1.296rem' : '1.62rem';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: shouldFadeOut ? 0 : 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onAnimationComplete={(definition) => {
            if (definition === 'exit' && onComplete) {
              onComplete();
            }
          }}
          className={`fixed ${bottomPosition} ${leftPosition} flex items-center gap-4`}
          style={{ zIndex: 2000, pointerEvents: 'none' }}
        >
          <div
            className="pixel-corners border-4 border-white bg-black overflow-hidden flex-shrink-0"
            style={{ width: portraitSize, height: portraitSize }}
          >
            <CachedImage
              src={heroImage}
              alt={heroName}
              className="w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div
            className={`pixel-corners border-4 border-white bg-black ${textPadding} relative`}
            style={{
              width: 'fit-content',
              maxWidth
            }}
          >
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-white"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-white"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white"></div>
            <div
              className="text-white font-bold"
              style={{
                fontSize,
                imageRendering: 'pixelated',
                lineHeight: '1.3'
              }}
            >
              {text}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
