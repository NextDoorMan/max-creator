import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioToggle } from './AudioToggle';
import PixelSpeechBubble from './PixelSpeechBubble';
import ArcadeGlitchTransition from './ArcadeGlitchTransition';

interface Hero {
  id: string;
  name: string;
  portrait: string;
  description: string;
  quote: string;
}

const heroes: Hero[] = [
  {
    id: 'mudborya',
    name: 'Мудборя',
    portrait: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490572/%D0%9C%D1%83%D0%B4%D0%B1%D0%BE%D1%80%D1%8F_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_yakafm.png',
    description: 'Самый хороший мальчик на проекте',
    quote: 'А можно как-нибудь без правок?'
  },
  {
    id: 'smmario',
    name: 'SMMарио',
    portrait: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490571/SMM%D0%B0%D1%80%D0%B8%D0%BE_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_jfrqki.png',
    description: 'Знает, как довести тебя до допкоста',
    quote: 'That turns me on!'
  },
  {
    id: 'brendinho',
    name: 'Брендиньо',
    portrait: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490571/%D0%91%D1%80%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D1%8C%D0%BE_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_b3cxqq.png',
    description: 'Ни разу не токсик с манией величия',
    quote: 'Держи свои комменты при себе'
  }
];

const spaceships: Record<string, string> = {
  mudborya: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772566105/%D0%BC%D1%83%D0%B4%D0%B1%D0%BE%D1%80%D1%8F_%D0%BA%D0%BE%D1%80%D0%B0%D0%B1%D0%BB%D1%8C_1_xlkwrm.png',
  smmario: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772566105/Smm%D0%B0%D1%80%D0%B8%D0%BE_%D0%BA%D0%BE%D1%80%D0%B0%D0%B1%D0%BB%D1%8C_1_vo3pvh.png',
  brendinho: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772569080/%D0%B1%D1%80%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D1%8C%D0%BE_%D0%BA%D0%BE%D1%80%D0%B0%D0%B1%D0%BB%D1%8C_1_qtx3df.png'
};

const spaceshipSizes: Record<string, string> = {
  mudborya: 'min(34.4vw, 141.75px)',
  smmario: 'min(34.4vw, 141.75px)',
  brendinho: 'min(30.6vw, 126px)'
};

interface MobileHeroSelectorProps {
  onBack: () => void;
  onSelect: (heroId: string) => void;
  backgroundSpeed: number;
}

export default function MobileHeroSelector({ onBack, onSelect, backgroundSpeed }: MobileHeroSelectorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [displayedQuote, setDisplayedQuote] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  const currentHero = heroes[currentIndex];

  useEffect(() => {
    if (backgroundSpeed >= 6) {
      setShowUI(true);
    }
  }, [backgroundSpeed]);

  const playButtonSound = () => {
    const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  const handlePrevious = () => {
    playButtonSound();
    setCurrentIndex((prev) => (prev - 1 + heroes.length) % heroes.length);
    setShowBubble(false);
    setDisplayedQuote('');
  };

  const handleNext = () => {
    playButtonSound();
    setCurrentIndex((prev) => (prev + 1) % heroes.length);
    setShowBubble(false);
    setDisplayedQuote('');
  };

  const handleBack = () => {
    playButtonSound();
    setTimeout(() => onBack(), 100);
  };

  const handleGo = async () => {
    try {
      const AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
      if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
      }
    } catch (err) {
      console.warn('AudioContext resume failed:', err);
    }

    const transitionAudio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1772654791/%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4_%D0%B2_%D0%B8%D0%B3%D1%80%D1%83_ratbjx.mp3');
    transitionAudio.volume = 0.5;

    const heroAudio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1774035473/%D0%92%D1%8B%D0%B1%D0%BE%D1%80_%D0%B3%D0%B5%D1%80%D0%BE%D1%8F_jval80.mp3');
    heroAudio.volume = 0.5;
    heroAudio.play().catch(() => {});

    setShowBubble(true);
    setIsTyping(true);
    setDisplayedQuote('');

    const quote = currentHero.quote;
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < quote.length) {
        setDisplayedQuote(quote.substring(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);

        setTimeout(() => {
          transitionAudio.play().catch(() => {});
          setShowTransition(true);
        }, 1000);
      }
    }, 100);
  };

  const handleTransitionComplete = () => {
    onSelect(currentHero.id);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{
        background: 'transparent',
        imageRendering: 'pixelated',
        WebkitFontSmoothing: 'none',
        MozOsxFontSmoothing: 'grayscale',
        height: '100dvh',
        maxHeight: '100dvh',
        opacity: showTransition ? 0 : 1,
        pointerEvents: showTransition ? 'none' : 'auto'
      }}
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        y: {
          type: 'spring',
          stiffness: 260,
          damping: 24,
          mass: 0.8
        },
        opacity: {
          duration: 0.15,
          ease: 'easeOut'
        }
      }}
    >
      <motion.div
        className="relative pt-6 pb-4 px-4 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: showUI ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={handleBack}
          className="text-white mobile-white-pixel text-sm active:scale-95 transition-transform"
          style={{
            textShadow: '3px 3px 0px rgba(0,0,0,0.9)',
            imageRendering: 'pixelated',
            position: 'absolute',
            top: '24px',
            left: '16px'
          }}
        >
          &lt; НАЗАД
        </button>

        <div style={{ position: 'absolute', top: '24px', right: '16px', zIndex: 100 }}>
          <AudioToggle />
        </div>
      </motion.div>

      <motion.div
        className="text-center z-10"
        style={{ marginTop: '36px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showUI ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <h1 className="mobile-3d-text" style={{ fontSize: '1.6rem' }}>
          ВЫБЕРИТЕ ГЕРОЯ
        </h1>
      </motion.div>

      <div className="flex items-center justify-center px-4 relative z-10" style={{ marginTop: '24px' }}>
        <motion.button
          onClick={handlePrevious}
          className="absolute left-12 z-20 active:scale-90 transition-transform duration-100"
          style={{
            width: '45.9px',
            height: '45.9px',
            imageRendering: 'pixelated'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showUI ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src="https://res.cloudinary.com/djihbhmzz/image/upload/v1772894626/%D1%81%D1%82%D1%80%D0%B5%D0%BB%D0%BA%D0%B0_%D0%B2%D0%BB%D0%B5%D0%B2%D0%BE_2_kc7far.png"
            alt="Previous"
            style={{
              width: '100%',
              height: '100%',
              imageRendering: 'pixelated'
            }}
          />
        </motion.button>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: showBubble ? 0.95 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div
                className="relative"
                style={{
                  background: 'transparent',
                  padding: '4px',
                  imageRendering: 'pixelated',
                  position: 'relative'
                }}
              >
                <AnimatePresence>
                  {showBubble && (
                    <div style={{
                      position: 'absolute',
                      top: '25.46px',
                      left: '-20%',
                      transform: 'translateX(-50%)',
                      width: 'calc(100vw - 32px)',
                      maxWidth: '340px',
                      display: 'flex',
                      justifyContent: 'center',
                      zIndex: 200
                    }}>
                      <PixelSpeechBubble text={displayedQuote} isTyping={isTyping} />
                    </div>
                  )}
                </AnimatePresence>

                <div
                  style={{
                    position: 'relative',
                    width: '169.6px',
                    height: '169.6px',
                    background: '#ffffff',
                    padding: '4px',
                    imageRendering: 'pixelated',
                    clipPath: `polygon(
                      0 16px, 4px 16px, 4px 12px, 8px 12px, 8px 8px, 12px 8px, 12px 4px, 16px 4px, 16px 0,
                      calc(100% - 16px) 0, calc(100% - 16px) 4px, calc(100% - 12px) 4px, calc(100% - 12px) 8px,
                      calc(100% - 8px) 8px, calc(100% - 8px) 12px, calc(100% - 4px) 12px, calc(100% - 4px) 16px, 100% 16px,
                      100% calc(100% - 16px), calc(100% - 4px) calc(100% - 16px), calc(100% - 4px) calc(100% - 12px),
                      calc(100% - 8px) calc(100% - 12px), calc(100% - 8px) calc(100% - 8px), calc(100% - 12px) calc(100% - 8px),
                      calc(100% - 12px) calc(100% - 4px), calc(100% - 16px) calc(100% - 4px), calc(100% - 16px) 100%,
                      16px 100%, 16px calc(100% - 4px), 12px calc(100% - 4px), 12px calc(100% - 8px),
                      8px calc(100% - 8px), 8px calc(100% - 12px), 4px calc(100% - 12px), 4px calc(100% - 16px), 0 calc(100% - 16px)
                    )`,
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'rgba(0, 0, 0, 0.9)',
                      clipPath: `polygon(
                        0 12px, 4px 12px, 4px 8px, 8px 8px, 8px 4px, 12px 4px, 12px 0,
                        calc(100% - 12px) 0, calc(100% - 12px) 4px, calc(100% - 8px) 4px, calc(100% - 8px) 8px,
                        calc(100% - 4px) 8px, calc(100% - 4px) 12px, 100% 12px,
                        100% calc(100% - 12px), calc(100% - 4px) calc(100% - 12px), calc(100% - 4px) calc(100% - 8px),
                        calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) calc(100% - 4px), calc(100% - 12px) calc(100% - 4px),
                        calc(100% - 12px) 100%, 12px 100%, 12px calc(100% - 4px), 8px calc(100% - 4px),
                        8px calc(100% - 8px), 4px calc(100% - 8px), 4px calc(100% - 12px), 0 calc(100% - 12px)
                      )`,
                      imageRendering: 'pixelated',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={currentHero.portrait}
                      alt={currentHero.name}
                      className="w-full h-full object-cover"
                      style={{
                        imageRendering: 'pixelated',
                        transform: 'scale(1.15)',
                        transformOrigin: 'center'
                      }}
                    />
                  </div>
                </div>
              </div>

              <h2
                className="mobile-white-pixel text-center"
                style={{
                  fontSize: '1.35rem',
                  textShadow: '4px 4px 0px rgba(0,0,0,0.9)',
                  imageRendering: 'pixelated'
                }}
              >
                {currentHero.name}
              </h2>

              <div
                className="mx-auto"
                style={{
                  width: 'calc(100vw - 64px)',
                  maxWidth: '300px'               
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    imageRendering: 'pixelated'
                  }}
                >
                  <p
                    className="text-center"
                    style={{
                      display: 'block',
                      imageRendering: 'pixelated',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '1rem',
                      lineHeight: '1.4',
                      textShadow: '2px 2px 0px #000',
                      WebkitFontSmoothing: 'none',
                      opacity: 1,
                      color: '#C084FC',
                      visibility: 'visible'
                    }}
                  >
                    {currentHero.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.button
          onClick={handleNext}
          className="absolute right-12 z-20 active:scale-90 transition-transform duration-100"
          style={{
            width: '45.9px',
            height: '45.9px',
            imageRendering: 'pixelated'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showUI ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src="https://res.cloudinary.com/djihbhmzz/image/upload/v1772894626/%D1%81%D1%82%D1%80%D0%B5%D0%BB%D0%BA%D0%B0_%D0%B2%D0%BF%D1%80%D0%B0%D0%B2%D0%BE_1_hjrgy2.png"
            alt="Next"
            style={{
              width: '100%',
              height: '100%',
              imageRendering: 'pixelated'
            }}
          />
        </motion.button>
      </div>

      <motion.div
        className="flex-1 flex items-end justify-center z-10"
        style={{ paddingBottom: '24px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showUI ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -8, 0]
            }}
            exit={{ opacity: 0, x: -30 }}
            transition={{
              opacity: { duration: 0.2 },
              x: { duration: 0.2 },
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="w-full flex justify-center"
          >
            <img
              src={spaceships[currentHero.id]}
              alt={`${currentHero.name} spaceship`}
              style={{
                width: spaceshipSizes[currentHero.id],
                height: 'auto',
                imageRendering: 'pixelated',
                filter: 'drop-shadow(0 0 16px rgba(187, 38, 73, 0.5))'
              }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="px-4 z-10"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom, 20px))' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showUI ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={handleGo}
          disabled={showBubble}
          className="w-full py-4 mobile-white-pixel text-white active:scale-95 transition-transform disabled:opacity-50"
          style={{
            fontSize: '1.125rem',
            background: '#BB2649',
            textShadow: '3px 3px 0px rgba(0,0,0,0.9)',
            imageRendering: 'pixelated',
            clipPath: `polygon(
              0 8px, 4px 8px, 4px 4px, 8px 4px, 8px 0,
              calc(100% - 8px) 0, calc(100% - 8px) 4px, calc(100% - 4px) 4px, calc(100% - 4px) 8px, 100% 8px,
              100% calc(100% - 8px), calc(100% - 4px) calc(100% - 8px), calc(100% - 4px) calc(100% - 4px),
              calc(100% - 8px) calc(100% - 4px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 4px),
              4px calc(100% - 4px), 4px calc(100% - 8px), 0 calc(100% - 8px)
            )`,
            boxShadow: '0 4px 0 #8B1C38'
          }}
        >
          ПОЕХАЛИ!
        </button>
      </motion.div>

      <ArcadeGlitchTransition
        isActive={showTransition}
        onComplete={handleTransitionComplete}
      />
    </motion.div>
  );
}
