import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { soundEffects, audioManager } from '../../utils/audioManager';
import MobilePortfolio from './MobilePortfolio';
import { MobileAbout } from './MobileAbout';
import { MobileResume } from './MobileResume';
import { MobileContacts } from './MobileContacts';
import { AudioToggle } from './AudioToggle';
import { BackgroundTraffic } from './BackgroundTraffic';

interface MobileMainMenuProps {
  onStartGame: () => void;
}

export const MobileMainMenu = ({ onStartGame }: MobileMainMenuProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [japaneseText, setJapaneseText] = useState('最高傑作');
  const [displayText, setDisplayText] = useState('最高傑作');
  const [isScrambling, setIsScrambling] = useState(false);
  const [hideUI, setHideUI] = useState(false);
  const [isGameStarting, setIsGameStarting] = useState(false);
  const isProcessingRef = useRef(false);

  const japaneseWords = ['最高傑作', 'クリエイティブ', '未来', '電脳'];
  const scrambleChars = ['█', '▓', '▒', '░', '■', '□', '▪', '▫', '◆', '◇', '●', '○'];

  useEffect(() => {
    setIsGameStarting(false);
    setHideUI(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsScrambling(true);
      const nextIndex = (japaneseWords.indexOf(japaneseText) + 1) % japaneseWords.length;
      const nextWord = japaneseWords[nextIndex];

      let scrambleCount = 0;
      const scrambleInterval = setInterval(() => {
        setDisplayText(nextWord.split('').map(() =>
          scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
        ).join(''));

        scrambleCount++;
        if (scrambleCount >= 3) {
          clearInterval(scrambleInterval);
          setDisplayText(nextWord);
          setJapaneseText(nextWord);
          setIsScrambling(false);
        }
      }, 60);
    }, 2500);

    return () => clearInterval(interval);
  }, [japaneseText]);

  const menuItems = [
    { id: 'game', label: 'НОВАЯ ИГРА', action: () => handleMenuClick('game', 0) },
    { id: 'portfolio', label: 'ПОРТФОЛИО', action: () => handleMenuClick('portfolio', 1) },
    { id: 'about', label: 'ABOUT', action: () => handleMenuClick('about', 2) },
    { id: 'resume', label: 'РЕЗЮМЕ', action: () => handleMenuClick('resume', 3) },
    { id: 'contact', label: 'СВЯЗАТЬСЯ', action: () => handleMenuClick('contact', 4) },
  ];

  const handleMenuClick = (itemId: string, index: number) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    setSelectedIndex(index);
    setIsFlashing(true);

    try {
      const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1774035473/%D0%92%D1%8B%D0%B1%D0%BE%D1%80_%D0%B3%D0%B5%D1%80%D0%BE%D1%8F_jval80.mp3');
      audio.volume = audioManager.getMuted() ? 0 : 0.6;
      audio.play().catch(err => console.warn('Failed to play menu sound:', err));
    } catch (err) {
      console.warn('Failed to create menu sound:', err);
    }

    if (itemId === 'game') {
      setIsGameStarting(true);
      setTimeout(() => {
        setHideUI(true);
        onStartGame();
        isProcessingRef.current = false;
      }, 200);
    } else {
      setTimeout(() => {
        setIsFlashing(false);
        if (itemId === 'portfolio') {
          setShowPortfolio(true);
        } else {
          setActiveModal(itemId);
        }
        isProcessingRef.current = false;
      }, 500);
    }
  };

  if (showPortfolio) {
    return <MobilePortfolio onBack={() => setShowPortfolio(false)} />;
  }

  if (activeModal === 'about') {
    return <MobileAbout onClose={() => setActiveModal(null)} />;
  }

  if (activeModal === 'resume') {
    return <MobileResume onClose={() => setActiveModal(null)} />;
  }

  if (activeModal === 'contact') {
    return <MobileContacts onClose={() => setActiveModal(null)} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-8 relative overflow-hidden" style={{ background: 'transparent' }}>

      <BackgroundTraffic isGameStarting={isGameStarting} />

      <motion.div
        className="absolute top-6 right-6"
        style={{ zIndex: 100 }}
        animate={{ opacity: hideUI ? 0 : 1, scale: hideUI ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <AudioToggle />
      </motion.div>

      <motion.div
        className="relative flex flex-col items-center justify-center gap-10 w-full max-w-md"
        style={{ zIndex: 10 }}
        animate={{ opacity: hideUI ? 0 : 1, scale: hideUI ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.img
          src="https://res.cloudinary.com/djihbhmzz/image/upload/v1772574254/Mobile_logo_1_1_dyohnj.png"
          alt="Mobile Game Logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[280px] md:max-w-[320px] h-auto"
        />

        <div className="flex flex-col gap-5 w-full">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={item.action}
              className={`w-full ${
                index === selectedIndex && isFlashing
                  ? 'mobile-menu-button mobile-menu-flash'
                  : index === selectedIndex
                  ? 'mobile-menu-button'
                  : 'mobile-menu-button-outline'
              }`}
            >
              <span className="mobile-white-pixel text-base md:text-lg font-bold uppercase">
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="fixed bottom-0 left-0 right-0 pb-5 px-6 text-white mobile-white-pixel-thin"
        style={{
          zIndex: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          fontSize: '9px',
          gap: '8px'
        }}
        animate={{ opacity: hideUI ? 0 : 1, scale: hideUI ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <span className="opacity-70" style={{ whiteSpace: 'nowrap' }}>STATUS: ACTIVE</span>
        <span className="opacity-70" style={{ whiteSpace: 'nowrap' }}>VER: 1.0.86</span>
        <span
          className={`transition-opacity duration-75 ${isScrambling ? 'opacity-60' : 'opacity-70'}`}
          style={{ whiteSpace: 'nowrap' }}
        >
          [{displayText}]
        </span>
      </motion.div>
    </div>
  );
};
