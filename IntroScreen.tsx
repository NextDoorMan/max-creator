import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { audioManager } from '../utils/audioManager';
import MuteButton from './MuteButton';

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const activationAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    activationAudioRef.current = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%B0%D0%BA%D1%82%D0%B8%D0%B2%D0%B0%D1%86%D0%B8%D1%8F_luobxd.mp3');
    activationAudioRef.current.volume = 0.6;
    activationAudioRef.current.preload = 'auto';
    activationAudioRef.current.load();

    activationAudioRef.current.addEventListener('error', () => {
      console.warn('Activation audio failed to load, retrying...');
      if (activationAudioRef.current) {
        const timestamp = new Date().getTime();
        activationAudioRef.current.src = `https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%B0%D0%BA%D1%82%D0%B8%D0%B2%D0%B0%D1%86%D0%B8%D1%8F_luobxd.mp3?retry=${timestamp}`;
        activationAudioRef.current.load();
      }
    });

    return () => {
      if (activationAudioRef.current) {
        activationAudioRef.current.pause();
        activationAudioRef.current = null;
      }
    };
  }, []);

  const handleStart = () => {
    if (isButtonClicked) return;

    setIsButtonClicked(true);

    if (!audioManager.getMuted() && activationAudioRef.current) {
      const audio = activationAudioRef.current;
      audio.play().catch(err => {
        console.warn('Activation sound play failed:', err);
        onStart();
      });

      const checkTime = () => {
        if (audio.duration && audio.currentTime >= audio.duration - 1) {
          onStart();
        } else if (audio.currentTime < audio.duration - 1) {
          requestAnimationFrame(checkTime);
        }
      };

      audio.onloadedmetadata = () => {
        requestAnimationFrame(checkTime);
      };

      if (audio.duration) {
        requestAnimationFrame(checkTime);
      }
    } else {
      onStart();
    }
  };

  return (
    <>
      <MuteButton />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col items-center justify-center relative arcade-grid-background"
      >
        <div className="text-center space-y-12 px-4 intro-content">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="space-y-8"
          >
            <h1 className="intro-title-portfolio text-4xl md:text-6xl neon-pink leading-relaxed">
              ПОРТФОЛИО
            </h1>
            <h2 className="intro-title-creator text-2xl md:text-4xl neon-blue leading-relaxed">
              КРЕАТОРА
            </h2>
          </motion.div>

          <motion.div
            animate={{
              opacity: isButtonClicked ? [1, 0.2, 1] : [1, 0.5, 1],
            }}
            transition={{
              duration: isButtonClicked ? 0.15 : 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex flex-col items-center space-y-6 intro-button-group"
          >
            <Coins className="w-16 h-16 neon-green intro-coin-icon" strokeWidth={1} />
            <button
              onClick={handleStart}
              disabled={isButtonClicked}
              className="text-xl md:text-2xl neon-green hover:neon-pink transition-all duration-300 leading-relaxed px-8 py-4 pixel-corners bg-black border-4 border-current intro-insert-button"
            >
              ВСТАВЬТЕ МОНЕТУ
            </button>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs md:text-sm neon-blue leading-relaxed intro-bonus-text"
          >
            И получите +1 к креативности
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 text-xs md:text-sm neon-green"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          © 2026 МАКС БОНДАРЕНКО
        </motion.div>
      </motion.div>
    </>
  );
}
