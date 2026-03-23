import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { soundEffects } from '../utils/audioManager';
import { CachedImage } from './CachedImage';

interface AboutModalProps {
  isOpen: boolean;
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

interface SkillTag {
  text: string;
  border: string;
  neonClass: string;
}

const skillTags: SkillTag[] = [
  { text: 'КРЕАТИВ', border: 'border-pink-400', neonClass: 'neon-pink' },
  { text: 'КОПИРАЙТИНГ', border: 'border-cyan-400', neonClass: 'neon-cyan' },
  { text: 'СТРАТЕГИЯ', border: 'border-green-400', neonClass: 'neon-green' },
  { text: 'СТОРИТЕЛЛИНГ', border: 'border-yellow-400', neonClass: 'neon-yellow' },
  { text: 'ATL', border: 'border-purple-400', neonClass: 'neon-purple' },
  { text: 'DIGITAL', border: 'border-pink-400', neonClass: 'neon-pink' },
  { text: 'BTL', border: 'border-cyan-400', neonClass: 'neon-cyan' },
  { text: 'EVENT', border: 'border-green-400', neonClass: 'neon-green' }
];

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

type TabType = 'bio' | 'skills' | 'hobbies';

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('bio');

  const handleClose = () => {
    soundEffects.play('button');
    onClose();
  };

  const handleTabClick = (tab: TabType) => {
    soundEffects.play('button');
    setActiveTab(tab);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto arcade-grid-background"
          style={{
            backdropFilter: 'blur(8px)',
            paddingTop: '2rem',
            paddingBottom: '2rem'
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full border-4 border-pink-500 relative pixel-corners"
            style={{
              maxWidth: '1100px',
              background: 'linear-gradient(180deg, #05000a 0%, #1a0033 100%)',
              boxShadow: '0 0 40px rgba(255, 20, 147, 0.8), inset 0 0 60px rgba(255, 20, 147, 0.15)',
              imageRendering: 'pixelated',
              marginTop: '0',
              marginBottom: '0'
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(0deg, rgba(0, 255, 255, 0.03) 0px, rgba(0, 255, 255, 0.03) 1px, transparent 1px, transparent 2px)',
                mixBlendMode: 'overlay'
              }}
            />

            {/* TITLE BAR */}
            <div
              className="flex justify-between items-center px-4 py-3 border-b-2 border-pink-500"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                boxShadow: '0 2px 15px rgba(255, 20, 147, 0.5)'
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '2rem',
                    color: '#ff1493',
                    textShadow: '0 0 20px rgba(255,20,147,0.8), 0 0 40px rgba(255,20,147,0.4)',
                    letterSpacing: '0.1em'
                  }}
                >
                  ПЕРСОНАЖ
                </span>
                <span
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '2rem',
                    color: '#ff1493',
                    textShadow: '0 0 20px rgba(255,20,147,0.8), 0 0 40px rgba(255,20,147,0.4)',
                    letterSpacing: '0.1em'
                  }}
                >
                  .game
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.4rem',
                    color: '#00FF00',
                    textShadow: '0 0 8px rgba(0, 255, 0, 0.8)'
                  }}
                >
                  STATUS: OK
                </div>
                <div
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.4rem',
                    color: '#FF69B4',
                    textShadow: '0 0 8px rgba(255, 105, 180, 0.8)'
                  }}
                >
                  MODE: CREATIVE
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 flex items-center justify-center border-2 border-pink-500 hover:bg-pink-950 transition-all duration-300"
                  style={{
                    color: '#ff1493',
                    textShadow: '0 0 10px rgba(255, 20, 147, 0.8)',
                    imageRendering: 'pixelated'
                  }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="p-6">

                <div className="grid grid-cols-2 gap-6" style={{ minHeight: '550px' }}>

                  {/* LEFT PANEL - Character & Gear */}
                  <div className="flex flex-col space-y-3">

                    <div className="flex items-center justify-between">
                      <div
                        style={{
                          fontFamily: "'Press Start 2P', cursive",
                          fontSize: '0.48rem',
                          textShadow: '0 0 8px rgba(0, 255, 255, 0.8)',
                          whiteSpace: 'nowrap',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ color: '#FFFFFF' }}>КЛАСС:</span>
                        <br/>
                        <span style={{ color: '#00FFFF' }}>КРЕАТОР</span>
                      </div>
                      <h2
                        className="uppercase text-center"
                        style={{
                          fontFamily: "'Press Start 2P', cursive",
                          fontSize: '1.08rem',
                          color: '#FFFFFF',
                          textShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 35px rgba(255, 60, 50, 1), 0 0 50px rgba(255, 40, 40, 0.7)'
                        }}
                      >
                        МАКСИМ БОНДАРЕНКО
                      </h2>
                      <div
                        style={{
                          fontFamily: "'Press Start 2P', cursive",
                          fontSize: '0.48rem',
                          textShadow: '0 0 8px rgba(0, 255, 255, 0.8)',
                          whiteSpace: 'nowrap',
                          textAlign: 'right'
                        }}
                      >
                        <span style={{ color: '#FFFFFF' }}>УРОВЕНЬ:</span>
                        <br/>
                        <span style={{ color: '#00FFFF' }}>ВЫСОКИЙ</span>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-center" style={{ minHeight: '370px' }}>
                      <div className="absolute left-[30px] top-[calc(50%-150px-71px)] flex items-center gap-2">
                        <div
                          style={{
                            width: '34px',
                            height: '18px',
                            backgroundColor: '#27AE60',
                            border: '2px solid #145A32',
                            position: 'relative',
                            boxShadow: '0 0 10px rgba(46, 204, 113, 0.9)',
                            imageRendering: 'pixelated'
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              top: '2px',
                              left: '2px',
                              right: '2px',
                              bottom: '2px',
                              border: '1px solid #145A32'
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '7px',
                              height: '7px',
                              backgroundColor: '#145A32',
                              borderRadius: '50%'
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '3px',
                              left: '3px',
                              width: '5px',
                              height: '2px',
                              backgroundColor: '#58D68D'
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '3px',
                              right: '3px',
                              width: '5px',
                              height: '2px',
                              backgroundColor: '#58D68D'
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.8rem',
                            color: '#ffffff',
                            textShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          $300
                        </span>
                      </div>

                      <div className="relative" style={{ width: '450px', margin: '0 auto' }}>
                        <div className="absolute left-0 flex flex-col" style={{ top: 'calc(50% + 5px)', transform: 'translateY(-50%)', gap: '7px' }}>
                          {artifacts.slice(0, 3).map((artifact, index) => (
                            <motion.div
                              key={artifact.name}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                              className="flex flex-col items-center"
                              style={{
                                width: '90px',
                                gap: '6px'
                              }}
                            >
                              <div
                                className="w-20 h-20 flex items-center justify-center hover:scale-105 transition-transform duration-300 border-2 border-white"
                                style={{
                                  boxShadow: '0 0 12px rgba(255, 255, 255, 0.6)',
                                  imageRendering: 'pixelated',
                                  backgroundColor: 'transparent'
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
                                className="text-center"
                                style={{
                                  fontFamily: "'Press Start 2P', cursive",
                                  fontSize: '0.6rem',
                                  color: '#ffffff',
                                  textShadow: '0 0 8px rgba(255, 255, 255, 0.7)',
                                  lineHeight: '1.3'
                                }}
                              >
                                {artifact.name === 'Очки Кларка Кента' ? (
                                  <>
                                    Очки
                                    <br />
                                    Кларка Кента
                                  </>
                                ) : (
                                  artifact.name
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          style={{
                            filter: 'drop-shadow(0 0 40px rgba(0, 255, 255, 0.7))',
                            margin: '0 auto',
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          <img
                            src="https://res.cloudinary.com/djihbhmzz/image/upload/v1771579301/%D1%81%D0%BF%D1%80%D0%B0%D0%B9%D1%82_about_pg1uww.png"
                            alt="Character"
                            style={{
                              imageRendering: 'pixelated',
                              width: '211px',
                              height: 'auto',
                              display: 'block'
                            }}
                          />
                        </motion.div>

                        <div className="absolute right-0 flex flex-col" style={{ top: 'calc(50% + 5px)', transform: 'translateY(-50%)', gap: '7px' }}>
                          {artifacts.slice(3, 6).map((artifact, index) => (
                            <motion.div
                              key={artifact.name}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: (index + 3) * 0.1 + 0.3 }}
                              className="flex flex-col items-center"
                              style={{
                                width: '90px',
                                gap: '6px'
                              }}
                            >
                              <div
                                className="w-20 h-20 flex items-center justify-center hover:scale-105 transition-transform duration-300 border-2 border-white"
                                style={{
                                  boxShadow: '0 0 12px rgba(255, 255, 255, 0.6)',
                                  imageRendering: 'pixelated',
                                  backgroundColor: 'transparent'
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
                                className="text-center"
                                style={{
                                  fontFamily: "'Press Start 2P', cursive",
                                  fontSize: artifact.name === 'Очки Кларка Кента' ? '0.59rem' : '0.6rem',
                                  color: '#ffffff',
                                  textShadow: '0 0 8px rgba(255, 255, 255, 0.7)',
                                  lineHeight: '1.3'
                                }}
                              >
                                {artifact.name === 'Очки Кларка Кента' ? (
                                  <>
                                    Очки
                                    <br />
                                    Кларка Кента
                                  </>
                                ) : (
                                  artifact.name
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="absolute right-[30px] top-[calc(50%-150px-71px)] flex items-center gap-2">
                        <span
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.6rem',
                            color: '#ffffff',
                            textShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          ТОКСИЧНОСТЬ
                        </span>
                        <div className="flex gap-1">
                          <div
                            style={{
                              width: '8px',
                              height: '22px',
                              backgroundColor: '#ffffff',
                              border: '2px solid #ffffff',
                              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                              imageRendering: 'pixelated'
                            }}
                          />
                          <div
                            style={{
                              width: '8px',
                              height: '22px',
                              backgroundColor: 'transparent',
                              border: '2px solid rgba(255, 255, 255, 0.4)',
                              imageRendering: 'pixelated'
                            }}
                          />
                          <div
                            style={{
                              width: '8px',
                              height: '22px',
                              backgroundColor: 'transparent',
                              border: '2px solid rgba(255, 255, 255, 0.4)',
                              imageRendering: 'pixelated'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      className="grid grid-cols-3 gap-3 p-3 border-2 border-cyan-400"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)'
                      }}
                    >
                      <div className="text-center">
                        <div
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.54rem',
                            color: '#00FFFF',
                            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                            marginBottom: '6px'
                          }}
                        >
                          ДЕНЬ РОЖДЕНИЯ
                        </div>
                        <div
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.72rem',
                            color: '#ffffff',
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          29 НОЯБРЯ
                        </div>
                      </div>
                      <div className="text-center">
                        <div
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.54rem',
                            color: '#00FFFF',
                            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                            marginBottom: '6px'
                          }}
                        >
                          ХАРАКТЕР
                        </div>
                        <div
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.72rem',
                            color: '#ffffff',
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                            lineHeight: '1.3'
                          }}
                        >
                          ЗАДУМЧИВЫЙ
                        </div>
                      </div>
                      <div className="text-center">
                        <div
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.54rem',
                            color: '#00FFFF',
                            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                            marginBottom: '6px'
                          }}
                        >
                          ОПЫТ
                        </div>
                        <div
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.72rem',
                            color: '#ffffff',
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          10+ ЛЕТ
                        </div>
                      </div>
                      <div className="text-center">
                        <div
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.54rem',
                            color: '#00FFFF',
                            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                            marginBottom: '6px'
                          }}
                        >
                          РОСТ
                        </div>
                        <div
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.72rem',
                            color: '#ffffff',
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          181
                        </div>
                      </div>
                      <div className="text-center">
                        <div
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.54rem',
                            color: '#00FFFF',
                            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                            marginBottom: '6px'
                          }}
                        >
                          СЛОЖНОСТЬ
                        </div>
                        <div
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.72rem',
                            color: '#ffffff',
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          СРЕДНЯЯ
                        </div>
                      </div>
                      <div className="text-center">
                        <div
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.54rem',
                            color: '#00FFFF',
                            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                            marginBottom: '6px'
                          }}
                        >
                          ДАВЛЕНИЕ
                        </div>
                        <div
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.72rem',
                            color: '#ffffff',
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          115/70
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT PANEL - Tabbed Interface */}
                  <div className="flex flex-col">

                    <div
                      className="border-2 border-b-0 border-pink-500 overflow-hidden"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        boxShadow: '0 0 20px rgba(255, 20, 147, 0.4)'
                      }}
                    >
                      <div className="flex w-full">
                        {(['bio', 'skills', 'hobbies'] as TabType[]).map((tab) => {
                          const labels = { bio: 'БИО', skills: 'УМЕНИЯ', hobbies: 'ХОББИ' };
                          const isActive = activeTab === tab;
                          return (
                            <button
                              key={tab}
                              onClick={() => handleTabClick(tab)}
                              className="flex-1 px-4 py-3 transition-all duration-300 border-r-2 border-pink-500 last:border-r-0"
                              style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '0.6rem',
                                color: isActive ? '#ff1493' : '#ffffff',
                                textShadow: isActive ? '0 0 10px rgba(255, 20, 147, 0.8)' : 'none',
                                backgroundColor: isActive ? 'rgba(255, 20, 147, 0.1)' : 'transparent',
                                borderBottom: isActive ? '2px solid #ff1493' : 'none'
                              }}
                            >
                              {labels[tab]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div
                      className="flex-1 border-2 border-pink-500 overflow-y-auto"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        boxShadow: '0 0 20px rgba(255, 20, 147, 0.4)',
                        minHeight: '488px'
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {activeTab === 'bio' && (
                          <motion.div
                            key="bio"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-5 h-full flex flex-col justify-center p-6"
                            style={{
                              background: 'radial-gradient(ellipse at center, rgba(90, 0, 156, 0.84) 0%, rgba(0, 0, 0, 1) 70%)'
                            }}
                          >
                            <p
                              style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '0.65rem',
                                lineHeight: '1.8',
                                color: '#ffffff',
                                textAlign: 'left'
                              }}
                            >
                              Креативный копирайтер. Эстет. Иногда философ. В рекламе с 2015 года, за это время проделал долгий путь от стажера до старшего креатора.
                            </p>

                            <div className="border-4 border-cyan-400" style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.6)', backgroundColor: 'transparent' }}>
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
                                className="uppercase mb-4"
                                style={{
                                  fontFamily: "'Press Start 2P', cursive",
                                  fontSize: '0.7rem',
                                  color: '#00FFFF',
                                  textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                                  textAlign: 'center'
                                }}
                              >
                                ИНТЕРЕСНЫЕ ФАКТЫ
                              </h3>
                              <div className="grid grid-cols-2 gap-3">
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
                                    className="border-2 border-cyan-400 p-3 text-center"
                                    style={{
                                      backgroundColor: 'rgba(0, 255, 255, 0.05)',
                                      boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontFamily: "'Press Start 2P', cursive",
                                        fontSize: '0.65rem',
                                        lineHeight: '1.6',
                                        color: '#ffffff',
                                        textShadow: '0 0 8px rgba(255, 255, 255, 0.6)'
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
                            className="flex flex-col justify-center items-center space-y-8 h-full p-6"
                            style={{
                              background: 'radial-gradient(ellipse at center, rgba(0, 102, 102, 0.4) 0%, rgba(0, 0, 0, 1) 70%)'
                            }}
                          >
                            <div className="w-full">
                              <h4
                                className="uppercase text-center mb-5"
                                style={{
                                  fontFamily: "'Press Start 2P', cursive",
                                  fontSize: '0.85rem',
                                  color: '#00FFFF',
                                  textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                                  letterSpacing: '0.1em'
                                }}
                              >
                                УМЕНИЯ
                              </h4>
                              <div className="grid grid-cols-4 gap-4 justify-items-center">
                                {abilities.map((ability, index) => {
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
                                  return (
                                  <motion.div
                                    key={ability}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex flex-col items-center"
                                  >
                                    <div
                                      className="w-20 h-20 flex items-center justify-center mb-2"
                                      style={{
                                        border: '1px solid white',
                                        padding: 0,
                                        boxShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
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
                                        fontSize: '0.41rem',
                                        color: '#ffffff',
                                        lineHeight: '1.3'
                                      }}
                                    >
                                      {ability}
                                    </div>
                                  </motion.div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="w-full">
                              <h4
                                className="uppercase text-center mb-5"
                                style={{
                                  fontFamily: "'Press Start 2P', cursive",
                                  fontSize: '0.85rem',
                                  color: '#00FFFF',
                                  textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                                  letterSpacing: '0.1em'
                                }}
                              >
                                УСИЛЕНИЯ
                              </h4>
                              <div className="grid grid-cols-4 gap-4 justify-items-center">
                                {traits.map((trait, index) => {
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
                                  return (
                                  <motion.div
                                    key={trait}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 + 0.4 }}
                                    className="flex flex-col items-center"
                                  >
                                    <div
                                      className="w-20 h-20 flex items-center justify-center mb-2"
                                      style={{
                                        border: '1px solid white',
                                        padding: 0,
                                        boxShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
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
                                        fontSize: '0.4rem',
                                        color: '#ffffff',
                                        lineHeight: '1.3'
                                      }}
                                    >
                                      {trait}
                                    </div>
                                  </motion.div>
                                  );
                                })}
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
                            className="flex items-center justify-center h-full p-6"
                            style={{
                              background: 'radial-gradient(ellipse at center, rgba(102, 0, 102, 0.4) 0%, rgba(0, 0, 0, 1) 70%)'
                            }}
                          >
                            <div className="grid grid-cols-2 gap-6">
                              {hobbies.map((hobby, index) => (
                                <motion.div
                                  key={hobby.name}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex flex-col items-center"
                                  style={{ gap: '10px' }}
                                >
                                  <div
                                    className="w-32 h-32 border-4 p-2 flex items-center justify-center hover:scale-105 transition-transform duration-300"
                                    style={{
                                      borderColor: rarityBorders[hobby.rarity],
                                      backgroundColor: hobby.rarity === 'cyan' ? 'rgba(0, 255, 255, 0.35)' :
                                                      hobby.rarity === 'pink' ? 'rgba(255, 20, 147, 0.35)' :
                                                      (hobby.icon ? rarityColors[hobby.rarity] : 'rgba(255, 255, 255, 0.05)'),
                                      boxShadow: `0 0 20px ${rarityBorders[hobby.rarity]}`,
                                      imageRendering: 'pixelated'
                                    }}
                                  >
                                    {hobby.icon ? (
                                      <CachedImage
                                        src={hobby.icon}
                                        alt={hobby.name}
                                        className="w-full h-full object-contain"
                                        style={{ imageRendering: 'pixelated' }}
                                      />
                                    ) : (
                                      <div className="text-4xl">?</div>
                                    )}
                                  </div>
                                  <span
                                    className="text-center"
                                    style={{
                                      fontFamily: "'Press Start 2P', cursive",
                                      fontSize: '0.5rem', 
                                      color: '#ffffff',
                                      lineHeight: '1.3',
                                      textShadow: '0 0 8px rgba(255, 255, 255, 0.7)'
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
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
