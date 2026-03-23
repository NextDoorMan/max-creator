import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { audioManager } from '../utils/audioManager';
import LoadingIndicator from './LoadingIndicator';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showAccessGranted, setShowAccessGranted] = useState(false);

  useEffect(() => {
    audioManager.startBackgroundMusic();
  }, []);

  useEffect(() => {
    if (animationComplete) {
      setShowAccessGranted(true);
      const timer = setTimeout(() => {
        onLoadingComplete();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [animationComplete, onLoadingComplete]);

  const barCount = 20;
  const animationDuration = 3.3;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center relative arcade-grid-background"
    >
      <div className="text-center space-y-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-2xl md:text-3xl neon-cyan font-bold"
          style={{
            imageRendering: 'pixelated',
            transform: 'translate3d(0,0,0)',
            WebkitFontSmoothing: 'none',
            textShadow: '0 0 5px #00f0ff, 0 0 15px rgba(0, 240, 255, 0.8), 0 0 30px rgba(0, 240, 255, 0.4)',
            filter: 'none'
              }}
        >
          ЗАГРУЗКА СИСТЕМЫ...
        </motion.div>

        <div
          className="relative bg-gray-900 border-4 border-cyan-400 mx-auto"
          style={{
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.8)',
            imageRendering: 'pixelated',
            clipPath: 'polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px))',
            width: '420px',
            maxWidth: '90vw',
            padding: '6px'
          }}
        >
          <div className="flex items-center gap-[2px] h-[22px] w-full">
            {Array.from({ length: barCount }).map((_, index) => {
              const colorClasses = [
                'bg-pink-500',
                'bg-pink-400',
                'bg-cyan-400',
                'bg-cyan-500',
                'bg-green-400',
                'bg-green-500',
              ];

              const shadowColors = [
                '0 0 20px rgba(255, 16, 240, 1), 0 0 10px rgba(255, 16, 240, 0.8)',
                '0 0 20px rgba(255, 82, 245, 1), 0 0 10px rgba(255, 82, 245, 0.8)',
                '0 0 20px rgba(0, 240, 255, 1), 0 0 10px rgba(0, 240, 255, 0.8)',
                '0 0 20px rgba(0, 200, 255, 1), 0 0 10px rgba(0, 200, 255, 0.8)',
                '0 0 20px rgba(0, 255, 0, 1), 0 0 10px rgba(0, 255, 0, 0.8)',
                '0 0 20px rgba(0, 200, 0, 1), 0 0 10px rgba(0, 200, 0, 0.8)',
              ];

              const colorIndex = index % colorClasses.length;
              const isLastSegment = index === barCount - 1;
              const delayPerSegment = animationDuration / barCount;

              return (
                <motion.div
                  key={index}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: index * delayPerSegment,
                    duration: delayPerSegment,
                    ease: 'linear'
                  }}
                  onAnimationComplete={() => {
                    if (isLastSegment) {
                      setAnimationComplete(true);
                    }
                  }}
                  className={`flex-1 ${colorClasses[colorIndex]} origin-left`}
                  style={{
                    height: '100%',
                    boxShadow: shadowColors[colorIndex],
                    imageRendering: 'pixelated',
                    minWidth: '16px'
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="text-center flex items-center justify-center" style={{ minHeight: '48px', height: '48px' }}>
          {showAccessGranted ? (
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '1.2rem',
                color: '#00ff00',
                textShadow: '0 0 20px rgba(0, 255, 0, 1)',
                letterSpacing: '0.15em',
                fontWeight: 'bold'
              }}
            >
              ACCESS GRANTED
            </span>
          ) : (
            <LoadingIndicator
              phrases={[
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
              ]}
            />
          )}
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 text-xs md:text-sm neon-green"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        © 2026 МАКС БОНДАРЕНКО
      </motion.div>
    </motion.div>
  );
}
