import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { soundEffects, audioManager } from '../utils/audioManager';
import { audioEngine } from '../utils/webAudioEngine';
import MuteButton from './MuteButton';
import { CachedImage } from './CachedImage';

export interface Hero {
  id: string;
  name: string;
  description: string;
  color: string;
  image: string;
  sprite: string;
  catchphrase: string;
}

interface HeroSelectionProps {
  onSelectHero: (heroId: string) => void;
}

export const heroes: Hero[] = [
  {
    id: 'mudborya',
    name: 'Мудборя',
    description: 'Самый хороший мальчик на проекте',
    color: 'neon-pink',
    image: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490572/%D0%9C%D1%83%D0%B4%D0%B1%D0%BE%D1%80%D1%8F_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_yakafm.png',
    sprite: '/assets/Мудборя_mini.png',
    catchphrase: 'А можно как-нибудь без правок?',
  },
  {
    id: 'smmario',
    name: 'SMMарио',
    description: 'Знает, как довести тебя до допкоста',
    color: 'neon-blue',
    image: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490571/SMM%D0%B0%D1%80%D0%B8%D0%BE_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_jfrqki.png',
    sprite: '/assets/SMMарио_mini.png',
    catchphrase: 'That turns me on!',
  },
  {
    id: 'brendinho',
    name: 'Брендиньо',
    description: 'Ни разу не токсик с манией величия',
    color: 'neon-green',
    image: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490571/%D0%91%D1%80%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D1%8C%D0%BE_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_b3cxqq.png',
    sprite: '/assets/Брендиньо_миниатюра.png',
    catchphrase: 'Держи свои комменты при себе',
  },
];

export default function HeroSelection({ onSelectHero }: HeroSelectionProps) {
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [showDialogue, setShowDialogue] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);

  const currentHero = heroes.find((h) => h.id === selectedHero);
  const catchphrase = currentHero?.catchphrase || '';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, src: string) => {
    const img = e.currentTarget;
    if (!img.dataset.retried) {
      img.dataset.retried = 'true';
      const timestamp = new Date().getTime();
      img.src = `${src}?retry=${timestamp}`;
    }
  };

  useEffect(() => {
    const initAudio = async () => {
      await audioEngine.init();
      await audioEngine.resume();
      soundEffects.setWebAudioEngine(audioEngine);
      await soundEffects.preloadDesktopSounds();
    };

    initAudio();
    audioManager.playThemeMusic('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/hero_selection_loud_bdty1t.mp3', 1);

    return () => {
      audioManager.stopThemeMusic();
    };
  }, []);

  useEffect(() => {
    if (!showDialogue || !catchphrase) return;

    let currentIndex = 0;
    setTypedText('');

    const typeInterval = setInterval(() => {
      if (currentIndex < catchphrase.length) {
        setTypedText(catchphrase.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setIsGlitching(true);
          setTimeout(() => {
            if (selectedHero) {
              onSelectHero(selectedHero);
            }
          }, 500);
        }, 2000);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [showDialogue, catchphrase, selectedHero, onSelectHero]);

  const handleSelect = async (heroId: string) => {
    await audioEngine.resume();
    await audioManager.resume();
    soundEffects.play('heroSelection');
    setSelectedHero(heroId);
    setShowDialogue(true);
  };

  return (
    <>
      <MuteButton />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col items-center p-4 pt-12 relative overflow-hidden hero-selection-screen"
        style={{ backgroundColor: 'transparent' }}
      >
      <div className="relative w-full flex flex-col items-center hero-selection-content">
        <AnimatePresence>
          {isGlitching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0, 1, 0, 1, 0],
                x: [0, -5, 5, -5, 5, 0],
              }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-black z-50"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,255,0.1) 0px, transparent 2px, transparent 4px, rgba(0,255,255,0.1) 4px)',
              }}
            />
          )}
        </AnimatePresence>

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{
            y: 0,
            opacity: [0, 1, 0, 1, 0, 1, 1],
          }}
          transition={{
            y: { type: 'spring', stiffness: 100, damping: 15 },
            opacity: { duration: 0.8 }
          }}
          className="flex justify-center mb-[20px] hero-logo-container"
        >
          <img
            src="https://res.cloudinary.com/djihbhmzz/image/upload/v1771491171/game_logo_yex451.png"
            alt="Game Logo"
            className="hero-logo w-[25.6rem] md:w-[38.4rem] h-auto"
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => handleImageError(e, 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771491171/game_logo_yex451.png')}
          />
        </motion.div>

        <div className="hero-cards-container grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full mb-[30px]">
          {heroes.map((hero) => (
            <motion.button
              key={hero.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: 0,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(hero.id)}
              disabled={showDialogue}
              className={`${hero.color} p-4 px-3 pixel-corners border-4 border-current bg-black relative group transition-all duration-300 ${
                selectedHero === hero.id ? 'animate-pulse' : ''
              }`}
            >
              <motion.div
                className="flex flex-col items-center space-y-3"
                animate={
                  selectedHero === hero.id
                    ? { scale: [1, 1.1, 1] }
                    : {}
                }
                transition={{ duration: 0.5, repeat: selectedHero === hero.id ? Infinity : 0 }}
              >
                <div className="w-48 h-64 flex items-center justify-center pixel-corners border-2 border-current bg-black overflow-hidden">
                  <CachedImage
                    src={hero.image}
                    alt={hero.name}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <h2 className="text-xl md:text-2xl leading-relaxed whitespace-nowrap">{hero.name}</h2>
                  <p className="text-sm text-center px-1 leading-tight">
                    {hero.description}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="absolute inset-0 bg-current opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ mixBlendMode: 'screen' }}
              />
            </motion.button>
          ))}
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="hero-select-button text-2xl md:text-4xl neon-pink text-center leading-relaxed"
        >
          ВЫБЕРИТЕ ГЕРОЯ
        </motion.h1>
      </div>

      <AnimatePresence>
        {showDialogue && currentHero && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4"
            >
              <div className="bg-black border-4 border-white pixel-corners p-6 relative">
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-white"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-white"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white"></div>

                <div className={`text-xl md:text-2xl ${currentHero.color} leading-relaxed hero-dialogue-text`}>
                  {typedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-3 h-6 bg-current ml-1"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  );
}
