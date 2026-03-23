import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { soundEffects, audioManager } from '../../utils/audioManager';
import { useState, useEffect, useRef } from 'react';
import { CachedImage } from '../CachedImage';

interface MobileAboutProps {
  onClose: () => void;
}

interface Artifact {
  name: string;
  icon: string;
}

interface Hobby {
  name: string;
  icon: string;
  rarity: string;
}

const artifacts: Artifact[] = [
  { name: 'Очки Кларка Кента', icon: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771496039/%D0%B8%D0%BD%D0%B2%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%8C_%D0%BE%D1%87%D0%BA%D0%B8_hd8vbb.png' },
  { name: 'Фолианты сноба', icon: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771495389/%D0%B8%D0%BD%D0%B2%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%8C_%D0%BA%D0%BD%D0%B8%D0%B3%D0%B8_nadv4i.png' },
  { name: 'Лопатка вдохновения', icon: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771495390/%D0%B8%D0%BD%D0%B2%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%8C_%D0%BB%D0%BE%D0%BF%D0%B0%D1%82%D0%BA%D0%B0_sunpll.png' },
  { name: 'Батончик неудержимости', icon: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771496040/%D0%B8%D0%BD%D0%B2%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%8C_%D0%BF%D1%80%D0%BE%D1%82%D0%B5%D0%B8%D0%BD_v8gcra.png' },
  { name: 'Кот-говорун', icon: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771495389/%D0%B8%D0%BD%D0%B2%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%8C_%D0%BA%D0%BE%D1%82_dgjr1a.png' },
  { name: 'Кеды пунктуальности', icon: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771495388/%D0%B8%D0%BD%D0%B2%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%8C_%D0%BA%D0%B5%D0%B4%D1%8B_ivebdg.png' }
];

const hobbies: Hobby[] = [
  { name: 'ДВОЕЧКИ-ЛОУКИКИ', icon: '/assets/about/хобби_муаи_таи_(1).png', rarity: 'legendary' },
  { name: 'КОНЦЕРТЫ ДЛЯ СОСЕДЕЙ', icon: '/assets/about/хобби_пианино_(1).png', rarity: 'epic' },
  { name: 'ВЗЛЕТЫ И ПАДЕНИЯ', icon: '/assets/about/хобби_сноуборд_(1).png', rarity: 'rare' },
  { name: 'ИГРА НА НЕРВАХ', icon: '/assets/about/хобби_игры_(1).png', rarity: 'uncommon' },
  { name: 'ПРИКЛАДНАЯ МЕМОЛОГИЯ', icon: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771601858/хобби_мемы_qe8lig.png', rarity: 'cyan' },
  { name: 'НАСТОЛОЧКИ-МНОГОХОДОВОЧКИ', icon: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771601971/хобби_настолки_wsapzw.png', rarity: 'pink' }
];

const abilities = ['SMM', 'КОПИРАЙТИНГ', 'ПРОДАКШН', 'СТОРИТЕЛЛИНГ', 'ATL', 'DIGITAL', 'BTL', 'EVENT'];
const traits = ['ФАНТАЗИЯ', 'УВЛЕЧЕННОСТЬ', 'ПЕРФЕКЦИОНИЗМ', 'НАСМОТРЕННОСТЬ', 'ЛЮБОПЫТСТВО', 'ВЕРНОСТЬ', 'ПРИНЦИПИАЛЬНОСТЬ', 'ЭМПАТИЯ'];

const abilityIcons: { [key: string]: string } = {
  'SMM': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586727/skills_SMM_zmmgax.png',
  'КОПИРАЙТИНГ': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586733/skills_copy_npeehw.png',
  'ПРОДАКШН': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586728/skills_production_ovqd0u.png',
  'СТОРИТЕЛЛИНГ': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586727/skills_storytelling_ix1irg.png',
  'ATL': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586737/skills_ATL_xlteio.png',
  'DIGITAL': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586732/skills_digital_sn6ffj.png',
  'BTL': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586735/skills_BTL_x6clfm.png',
  'EVENT': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586731/skills_event_rpxxwp.png'
};

const traitIcons: { [key: string]: string } = {
  'ФАНТАЗИЯ': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586745/features_fantasy_apjs0s.png',
  'УВЛЕЧЕННОСТЬ': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586749/features_affection_nxmo6e.png',
  'ПЕРФЕКЦИОНИЗМ': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586739/features_perfectionism_ps2mhb.png',
  'НАСМОТРЕННОСТЬ': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586742/features_look_ghd0ft.png',
  'ЛЮБОПЫТСТВО': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586748/features_curiosity_opeewk.png',
  'ВЕРНОСТЬ': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586741/features_loyalty_aj0gxc.png',
  'ПРИНЦИПИАЛЬНОСТЬ': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586738/features_principles_vxaalp.png',
  'ЭМПАТИЯ': 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771586746/features_empathy_dm4xpi.png'
};

const rarityColors: { [key: string]: string } = {
  legendary: 'rgba(255, 165, 0, 0.4)',
  epic: 'rgba(138, 43, 226, 0.4)',
  rare: 'rgba(0, 112, 221, 0.4)',
  uncommon: 'rgba(30, 255, 0, 0.4)',
  cyan: 'rgba(0, 255, 255, 0.15)',
  pink: 'rgba(255, 20, 147, 0.15)'
};

const rarityBorders: { [key: string]: string } = {
  legendary: '#ffa500',
  epic: '#8a2be2',
  rare: '#0070dd',
  uncommon: '#1eff00',
  cyan: '#00FFFF',
  pink: '#ff1493'
};

type TabType = 'character' | 'bio' | 'skills' | 'hobbies';

export const MobileAbout = ({ onClose }: MobileAboutProps) => {
  const [isMuted, setIsMuted] = useState(audioManager.getMuted());
  const [statusBlink, setStatusBlink] = useState(true);
  const [japaneseText, setJapaneseText] = useState('最高傑作');
  const [displayText, setDisplayText] = useState('最高傑作');
  const [activeTab, setActiveTab] = useState<TabType>('character');
  const isProcessingRef = useRef(false);
  const lastTabClickRef = useRef<number>(0);

  const japaneseWords = ['最高傑作', 'クリエイティブ', '未来', '電脳'];
  const scrambleChars = ['█', '▓', '▒', '░', '■', '□', '▪', '▫', '◆', '◇', '●', '○'];

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((muted) => {
      setIsMuted(muted);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setStatusBlink(prev => !prev);
    }, 800);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
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
        }
      }, 60);
    }, 2500);

    return () => clearInterval(interval);
  }, [japaneseText]);

  const handleBackClick = () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
      audio.volume = audioManager.getMuted() ? 0 : 0.6;
      audio.play().catch(err => console.warn('Failed to play button sound:', err));
    } catch (err) {
      console.warn('Failed to create button sound:', err);
    }

    setTimeout(() => {
      onClose();
      isProcessingRef.current = false;
    }, 100);
  };

  const handleMuteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
      audio.volume = audioManager.getMuted() ? 0 : 0.6;
      audio.play().catch(err => console.warn('Failed to play button sound:', err));
    } catch (err) {
      console.warn('Failed to create button sound:', err);
    }

    audioManager.toggleMute();
  };

  const handleTabClick = (tab: TabType) => {
    if (tab === activeTab) return;

    const now = Date.now();
    if (now - lastTabClickRef.current < 200) return;
    lastTabClickRef.current = now;

    try {
      const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
      audio.volume = audioManager.getMuted() ? 0 : 0.6;
      audio.play().catch(err => console.warn('Failed to play button sound:', err));
    } catch (err) {
      console.warn('Failed to create button sound:', err);
    }

    setActiveTab(tab);
  };

  const tagColors = ['#A855F7', '#BE3455', '#22C55E', '#3B82F6'];
  const tabs: { id: TabType; label: string }[] = [
    { id: 'character', label: 'ПЕРСОНАЖ' },
    { id: 'bio', label: 'БИО' },
    { id: 'skills', label: 'УМЕНИЯ' },
    { id: 'hobbies', label: 'ХОББИ' }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] overflow-y-auto"
        style={{
          backgroundImage: 'url(https://res.cloudinary.com/djihbhmzz/image/upload/v1773337386/mobile_portfolio_bg_p4gswy.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="mobile-crt-overlay" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 101 }} />

        <div className="mobile-sticky-header px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 mobile-white-pixel text-xs"
            >
              <ArrowLeft className="w-3 h-3" />
              НАЗАД
            </button>

            <p
              className="text-center flex-1 mx-4"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '8px',
                color: '#BE3455',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                lineHeight: '1.4'
              }}
            >
              CHARACTER ID #MB-007
            </p>

            <button
              onClick={handleMuteClick}
              className="flex items-center justify-center"
              style={{
                minWidth: '32px',
                minHeight: '32px',
                background: 'transparent',
                border: 'none'
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ imageRendering: 'pixelated' }}
              >
                <rect x="4" y="14" width="4" height="12" fill="#FFFFFF"/>
                <rect x="8" y="12" width="3" height="16" fill="#FFFFFF"/>
                <rect x="11" y="10" width="3" height="20" fill="#FFFFFF"/>
                <rect x="14" y="8" width="4" height="24" fill="#FFFFFF"/>
                <rect x="18" y="10" width="3" height="20" fill="#FFFFFF"/>

                <path d="M22 12 Q26 12 26 20 Q26 28 22 28" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
                <path d="M26 8 Q32 8 32 20 Q32 32 26 32" stroke="#FFFFFF" strokeWidth="2" fill="none"/>

                {isMuted && (
                  <>
                    <rect x="8" y="8" width="3" height="3" fill="#FF1493"/>
                    <rect x="11" y="11" width="3" height="3" fill="#FF1493"/>
                    <rect x="14" y="14" width="3" height="3" fill="#FF1493"/>
                    <rect x="17" y="17" width="3" height="3" fill="#FF1493"/>
                    <rect x="20" y="20" width="3" height="3" fill="#FF1493"/>
                    <rect x="23" y="23" width="3" height="3" fill="#FF1493"/>
                    <rect x="26" y="26" width="3" height="3" fill="#FF1493"/>
                    <rect x="29" y="29" width="3" height="3" fill="#FF1493"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative z-10 px-6 pt-20 pb-20 space-y-6 w-full"
          style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ flex: '0 0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mobile-3d-text-large"
                data-text="ABOUT"
                style={{
                  fontSize: '1.8rem',
                  lineHeight: '1.4',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}
              >
                ABOUT
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-1.5 justify-center mb-6"
            >
              {tabs.map((tab, index) => {
                const bgColor = tagColors[index % tagColors.length];
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className="px-2 py-1.5"
                    style={{
                      fontSize: '10px',
                      fontWeight: '400',
                      textTransform: 'uppercase',
                      border: '2px solid #FFFFFF',
                      borderRadius: '50px',
                      backgroundColor: isActive ? bgColor : 'rgba(0, 0, 0, 0.5)',
                      color: '#FFFFFF',
                      letterSpacing: '0.02em',
                      imageRendering: 'pixelated',
                      textShadow: isActive ? '0 0 8px rgba(255, 255, 255, 0.6)' : 'none',
                      lineHeight: 'normal',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                      display: 'inline-block',
                      cursor: 'pointer',
                      fontFamily: "'Press Start 2P', cursive"
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </motion.div>
          </div>

          <div style={{ flex: '1 1 auto', overflow: 'visible' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'character' && (
                <motion.div
                  key="character"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                  style={{ overflow: 'visible' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '8px',
                        whiteSpace: 'nowrap',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ color: '#FFFFFF' }}>КЛАСС:</span>
                      <br/>
                      <span style={{ color: '#397eed' }}>КРЕАТОР</span>
                      <div className="flex items-center gap-1 mt-2">
                        <div
                          style={{
                            width: '20px',
                            height: '10px',
                            backgroundColor: '#27AE60',
                            border: '1px solid #145A32',
                            position: 'relative',
                            boxShadow: '0 0 6px rgba(46, 204, 113, 0.7)',
                            imageRendering: 'pixelated'
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              top: '1px',
                              left: '1px',
                              right: '1px',
                              bottom: '1px',
                              border: '1px solid #145A32'
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '4px',
                              height: '4px',
                              backgroundColor: '#145A32',
                              borderRadius: '50%'
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '2px',
                              left: '2px',
                              width: '3px',
                              height: '1px',
                              backgroundColor: '#58D68D'
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              width: '3px',
                              height: '1px',
                              backgroundColor: '#58D68D'
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '8px',
                            color: '#ffffff',
                            textShadow: '0 0 6px rgba(255, 255, 255, 0.6)'
                          }}
                        >
                          $300
                        </span>
                      </div>
                    </div>

                    <h2
                      className="uppercase text-center flex-1 mx-2"
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '13px',
                        color: '#A855F7',
                        textShadow: '0 0 12px rgba(168, 85, 247, 0.8)',
                        lineHeight: '1.3'
                      }}
                    >
                      МАКСИМ БОНДАРЕНКО
                    </h2>

                    <div
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '8px',
                        whiteSpace: 'nowrap',
                        textAlign: 'right'
                      }}
                    >
                      <span style={{ color: '#FFFFFF' }}>УРОВЕНЬ:</span>
                      <br/>
                      <span style={{ color: '#397eed' }}>ВЫСОКИЙ</span>
                      <div className="flex items-center gap-1 mt-2 justify-end">
                        <span
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '7px',
                            color: '#ffffff',
                            textShadow: '0 0 4px rgba(255, 255, 255, 0.6)'
                          }}
                        >
                          ТОКСИЧНОСТЬ
                        </span>
                        <div className="flex gap-0.5">
                          <div
                            style={{
                              width: '5px',
                              height: '12px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #ffffff',
                              boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)',
                              imageRendering: 'pixelated'
                            }}
                          />
                          <div
                            style={{
                              width: '5px',
                              height: '12px',
                              backgroundColor: 'transparent',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              imageRendering: 'pixelated'
                            }}
                          />
                          <div
                            style={{
                              width: '5px',
                              height: '12px',
                              backgroundColor: 'transparent',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              imageRendering: 'pixelated'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center" style={{ minHeight: '240px', overflow: 'visible' }}>
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                      {artifacts.slice(0, 3).map((artifact, index) => {
                        const shortName = artifact.name === 'Очки Кларка Кента' ? 'Очки Кларка Кента' :
                                         artifact.name === 'Фолианты сноба' ? 'Фолианты сноба' :
                                         artifact.name === 'Лопатка вдохновения' ? 'Лопатка вдохновения' : artifact.name;
                        return (
                        <motion.div
                          key={artifact.name}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          className="flex flex-col items-center gap-1"
                        >
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              border: '1px solid white',
                              boxShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
                              imageRendering: 'pixelated',
                              borderRadius: '8px',
                              overflow: 'hidden', 
                              backgroundColor: 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <img
                              src={artifact.icon}
                              alt={artifact.name}
                              className="w-full h-full object-contain"
                              style={{ imageRendering: 'pixelated', padding: 0 }}
                            />
                          </div>
                          <div
                            style={{
                              fontFamily: "'Press Start 2P', cursive",
                              fontSize: '7px',
                              color: '#ffffff',
                              textAlign: 'center',
                              lineHeight: '1.2',
                              width: '80px'
                            }}
                          >
                            {shortName}
                          </div>
                        </motion.div>
                        );
                      })}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      style={{
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'center',
                        overflow: 'visible',
                        padding: '20px 0'
                      }}
                    >
                      <img
                        src="https://res.cloudinary.com/djihbhmzz/image/upload/v1771579301/%D1%81%D0%BF%D1%80%D0%B0%D0%B9%D1%82_about_pg1uww.png"
                        alt="Character"
                        style={{
                          imageRendering: 'pixelated',
                          width: '150px',
                          height: 'auto',
                          display: 'block',
                          filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))'
                        }}
                      />
                    </motion.div>

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                      {artifacts.slice(3, 6).map((artifact, index) => {
                        const shortName = artifact.name === 'Батончик неудержимости' ? 'Батончик неудержимого' :
                                         artifact.name === 'Кот-говорун' ? 'Кот-говорун' :
                                         artifact.name === 'Кеды пунктуальности' ? 'Кеды пунктуальности' : artifact.name;
                        return (
                        <motion.div
                          key={artifact.name}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (index + 3) * 0.1 + 0.3 }}
                          className="flex flex-col items-center gap-1"
                        >
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              border: '1px solid white',
                              boxShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
                              imageRendering: 'pixelated',
                              borderRadius: '8px',
                              overflow: 'hidden', 
                              backgroundColor: 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <img
                              src={artifact.icon}
                              alt={artifact.name}
                              className="w-full h-full object-contain"
                              style={{ imageRendering: 'pixelated', padding: 0 }}
                            />
                          </div>
                          <div
                            style={{
                              fontFamily: "'Press Start 2P', cursive",
                              fontSize: '7px',
                              color: '#ffffff',
                              textAlign: 'center',
                              lineHeight: '1.2',
                              width: '85px'
                            }}
                          >
                            {shortName}
                          </div>
                        </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    className="grid grid-cols-3 gap-2 p-3"
                    style={{
                      backgroundColor: 'transparent',
                      border: '2px solid #FFFFFF', 
                      boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
                      borderRadius: '12px',
                      imageRendering: 'pixelated',
                      clipPath: 'polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))'
                    }}
                  >
                    {[
                      { label: 'BIRTHDAY', value: '29 НОЯБРЯ' },
                      { label: 'ХАРАКТЕР', value: 'ЗАДУМЧИВЫЙ' },
                      { label: 'ОПЫТ', value: '10+ ЛЕТ' },
                      { label: 'РОСТ', value: '181' },
                      { label: 'СЛОЖНОСТЬ', value: 'СРЕДНЯЯ' },
                      { label: 'ДАВЛЕНИЕ', value: '115/70' }
                    ].map((stat, index) => (
                      <div key={index} className="text-center">
                        <div
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '8px',
                            color: '#397eed',
                            marginBottom: '3px',
                            lineHeight: '1.2'
                          }}
                        >
                          {stat.label}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '9px',
                            color: '#ffffff',
                            textShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
                            lineHeight: '1.2'
                          }}
                        >
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'bio' && (
                <motion.div
                  key="bio"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p
                    style={{
                      fontFamily: "'Press Start 2P', cursive",
                      fontSize: '11px',
                      lineHeight: '1.6',
                      color: '#ffffff',
                      textAlign: 'center'
                    }}
                  >
                    Креативный копирайтер. Эстет. Иногда философ. В рекламе с 2015 года, за это время проделал долгий путь от стажера до старшего креатора.
                  </p>

                  <div
                    style={{
                      border: '2px solid #FFFFFF',
                      boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)',
                      backgroundColor: 'transparent',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      imageRendering: 'pixelated',
                      clipPath: 'polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))'
                    }}
                  >
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-auto"
                      style={{
                        imageRendering: 'pixelated',
                        display: 'block'
                      }}
                    >
                      <source src="https://res.cloudinary.com/djihbhmzz/video/upload/v1771450606/about_%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE_j3qhtf.mp4" type="video/mp4" />
                    </video>
                  </div>

                  <div>
                    <h3
                      className="uppercase mb-3"
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '12px', 
                        color: '#A855F7',
                        textAlign: 'center'
                      }}
                    >
                      ИНТЕРЕСНЫЕ ФАКТЫ
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Освоил пианино в 31',
                        'Побывал в 26 странах',
                        'Не понял Дэвида Линча',
                        'Не был в файлах Эпштейна'
                      ].map((fact, index) => (
                        <motion.div
                          key={fact}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-2 text-center"
                          style={{
                            backgroundColor: 'rgba(0, 255, 255, 0.1)',
                            border: '2px solid #FFFFFF',
                            borderRadius: '8px',
                            imageRendering: 'pixelated'
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "'Press Start 2P', cursive",
                              fontSize: '9.5px',
                              lineHeight: '1.4',
                              color: '#ffffff',
                            }}
                          >
                            {fact}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h4
                      className="uppercase text-center mb-3"
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '10px',
                        color: '#a855f7',
                        textShadow: '0 0 8px rgba(0, 255, 255, 0.6)',
                        letterSpacing: '0.05em'
                      }}
                    >
                      УМЕНИЯ
                    </h4>
                    <div className="grid grid-cols-4 gap-3">
                      {abilities.map((ability, index) => (
                        <motion.div
                          key={ability}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex flex-col items-center gap-1"
                        >
                          <div
                            className="w-14 h-14 flex items-center justify-center"
                            style={{
                              border: '1px solid white',
                              borderRadius: '8px',
                              overflow: 'hidden', 
                              padding: 0,
                              boxShadow: '0 0 6px rgba(255, 255, 255, 0.3)',
                              backgroundColor: 'transparent'
                            }}
                          >
                            <CachedImage
                              src={abilityIcons[ability]}
                              alt={ability}
                              className="w-full h-full object-contain"
                              style={{
                                imageRendering: 'pixelated',
                                padding: 0,
                                margin: 0,
                                display: 'block'
                              }}
                            />
                          </div>
                          <div
                            className="text-center"
                            style={{
                              fontFamily: "'Press Start 2P', cursive",
                              fontSize: '6px',
                              color: '#ffffff',
                              lineHeight: '1.2'
                            }}
                          >
                            {ability}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4
                      className="uppercase text-center mb-3"
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '10px',
                        color: '#a855f7',
                        textShadow: '0 0 8px rgba(0, 255, 255, 0.6)',
                        letterSpacing: '0.05em'
                      }}
                    >
                      УСИЛЕНИЯ
                    </h4>
                    <div className="grid grid-cols-4 gap-3">
                      {traits.map((trait, index) => (
                        <motion.div
                          key={trait}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.4 }}
                          className="flex flex-col items-center gap-1"
                        >
                          <div
                            className="w-14 h-14 flex items-center justify-center" 
                            style={{
                              border: '1px solid white',
                              borderRadius: '8px',
                              overflow: 'hidden', 
                              padding: 0,
                              boxShadow: '0 0 6px rgba(255, 255, 255, 0.3)',
                              backgroundColor: 'transparent'
                            }}
                          >
                            <CachedImage
                              src={traitIcons[trait]}
                              alt={trait}
                              className="w-full h-full object-contain"
                              style={{
                                imageRendering: 'pixelated',
                                padding: 0,
                                margin: 0,
                                display: 'block'
                              }}
                            />
                          </div>
                          <div
                            className="text-center"
                            style={{
                              fontFamily: "'Press Start 2P', cursive",
                              fontSize: '6px',
                              color: '#ffffff',
                              lineHeight: '1.2'
                            }}
                          >
                            {trait}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'hobbies' && (
                <motion.div
                  key="hobbies"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    {hobbies.map((hobby, index) => (
                      <motion.div
                        key={hobby.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className="w-24 h-24 border-2 p-2 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                          style={{
                            borderColor: rarityBorders[hobby.rarity],
                            backgroundColor: rarityColors[hobby.rarity],
                            boxShadow: `0 0 12px ${rarityBorders[hobby.rarity]}`,
                            imageRendering: 'pixelated',
                            borderRadius: '8px'
                          }}
                        >
                          <CachedImage
                            src={hobby.icon}
                            alt={hobby.name}
                            className="w-full h-full object-contain"
                            style={{ imageRendering: 'pixelated' }}
                          />
                        </div>
                        <span
                          className="text-center"
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '8px',
                            color: '#ffffff',
                            lineHeight: '1.3'
                          }}
                        >
                          {hobby.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-10 pb-3 w-full border-t-2 border-[#BE345580]"
            style={{
              marginTop: '3rem',
              flex: '0 0 auto',
              fontFamily: "'Press Start 2P', cursive"
            }}
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#22C55E',
                    opacity: statusBlink ? 1 : 0.3,
                    transition: 'opacity 0.3s'
                  }}
                />
                <span
                  style={{
                    fontSize: '8px',
                    color: '#BE3455',
                    letterSpacing: '0.05em'
                  }}
                >
                  STATUS: OK
                </span>
              </div>

              <div
                style={{
                  fontSize: '14px',
                  color: '#A855F7',
                  letterSpacing: '0.05em',
                  textAlign: 'center',
                  flex: 1,
                  textShadow: '0 0 10px rgba(168, 85, 247, 0.8)'
                }}
              >
                {displayText}
              </div>

              <span
                style={{
                  fontSize: '8px',
                  color: '#BE3455',
                  letterSpacing: '0.05em'
                }}
              >
                VER 1.1.0
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
