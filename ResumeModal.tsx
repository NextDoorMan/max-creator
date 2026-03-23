import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { soundEffects } from '../utils/audioManager';
import { CachedImage } from './CachedImage';
import GlitchText from './GlitchText';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string;
  brands: string[];
  image: string;
  stats: {
    creativity: number;
    strategy: number;
    storytelling: number;
    adaptability: number;
    teamwork: number;
    speed: number;
  };
}

const experiences: Experience[] = [
  {
    id: 1,
    company: 'MILK CREATIVE',
    role: 'СТАЖЕР',
    period: 'Май 2015 — Май 2016',
    description: 'Первые шаги в креативе. Впервые узнал, что такое BIG IDEA, инсайты и креативные штурмы. И что плохих идей не бывает, но бывают те, что не в бриф. Помогал команде креативно и морально на самых разных проектах.',
    brands: ['VELKOPOPOVICKY KOZEL', 'СБЕРБАНК', 'MERCI', 'CORDIANT', 'ЦИАН', 'TEVA'],
    image: '/assets/cv/резюме_1.png',
    stats: {
      creativity: 8,
      strategy: 5,
      storytelling: 6,
      adaptability: 10,
      teamwork: 9,
      speed: 7
    }
  },
  {
    id: 2,
    company: 'RAPP RUSSIA',
    role: 'МЛАДШИЙ КОПИРАЙТЕР',
    period: 'Май 2016 — Дек 2016',
    description: 'Медленно, но верно набираемся опыта. Здесь я открыл для себя фишки BTL-коммуникаций и только начал осознавать весь масштаб возможностей современного креатива.',
    brands: ['RENAULT CIS', 'RENAULT LOGAN', 'J.D.BURGERS', 'MCDONALD\'S', 'FRESH BAR', 'TELE 2'],
    image: '/assets/cv/резюме_2.png',
    stats: {
      creativity: 18,
      strategy: 15,
      storytelling: 17,
      adaptability: 20,
      teamwork: 19,
      speed: 16
    }
  },
  {
    id: 3,
    company: 'MARVELOUS',
    role: 'МЛАДШИЙ КРЕАТОР',
    period: 'Янв 2017 — Апр 2018',
    description: 'Кайфовал на брендах Hasbro и с головой погрузился в креатив-360: сценарии, наружка, SMM, cпецпроекты, digital, PR. А еще съемки, озвучка и прочие особенности национального продакшна. Понравилось.',
    brands: ['NERF', 'TRANSFORMERS', 'FURREAL FRIENDS', 'DOH-VINCI', 'MY LITTLE PONY', 'HASBRO GAMING'],
    image: '/assets/cv/резюме_3.png',
    stats: {
      creativity: 28,
      strategy: 24,
      storytelling: 27,
      adaptability: 30,
      teamwork: 29,
      speed: 25
    }
  },
  {
    id: 4,
    company: 'MINDSHARE RUSSIA',
    role: 'МЛАДШИЙ КРЕАТОР',
    period: 'Апр 2018 — Сен 2018',
    description: 'Впервые попал в глобальную рекламную сеть. Участвовал в проектной работе для брендов Nestle Purina. Работал над роликами, спецпроектами и SMM.',
    brands: ['FELIX', 'FRISKIES', 'GOURMET', 'PURINA ONE'],
    image: '/assets/cv/резюме_4.png',
    stats: {
      creativity: 38,
      strategy: 35,
      storytelling: 37,
      adaptability: 40,
      teamwork: 38,
      speed: 36
    }
  },
  {
    id: 5,
    company: 'FABULA CONTENT',
    role: 'SMM-КРЕАТОР',
    period: 'Сен 2018 — Июн 2019',
    description: 'Трудился на поприще SMM-креатора и понял, что в социальных сетях можно развернуться не менее круто, чем в ATL или BTL.',
    brands: ['ZEWA', 'VALIO', 'KAGOTSEL', 'WELEDA', 'AMWAY'],
    image: '/assets/cv/резюме_5.png',
    stats: {
      creativity: 48,
      strategy: 45,
      storytelling: 47,
      adaptability: 50,
      teamwork: 48,
      speed: 46
    }
  },
  {
    id: 6,
    company: 'ACCORD DIGITAL',
    role: 'КРЕАТОР',
    period: 'Авг 2019 — Ноя 2020',
    description: 'Всё и сразу: ролики, SMM, спецпроекты, наружка, радио, брендинг. Львиная доля приходилась на бренды алкогольной продукции.',
    brands: ['BELUGA', 'BALTIKA', 'ТРИ КОТА', 'DANONE'],
    image: '/assets/cv/резюме_6.png',
    stats: {
      creativity: 57,
      strategy: 54,
      storytelling: 56,
      adaptability: 59,
      teamwork: 57,
      speed: 55
    }
  },
  {
    id: 7,
    company: 'TBWA',
    role: 'КРЕАТОР',
    period: 'Янв 2021 — Янв 2023',
    description: 'Набрался огромного опыта в работе с сектором автомобилей. Креативил для Nissan 24/7: ролики, радио, SMM, спецпроекты, наружка, киберспортивные проекты',
    brands: ['NISSAN', 'NISSAN', 'И ЕЩЕ РАЗ NISSAN'],
    image: '/assets/cv/резюме_7.png',
    stats: {
      creativity: 66,
      strategy: 63,
      storytelling: 65,
      adaptability: 68,
      teamwork: 66,
      speed: 64
    }
  },
  {
    id: 8,
    company: 'MADNESS',
    role: 'КОПИРАЙТЕР',
    period: 'Янв 2023 — Июн 2024',
    description: 'Мощно ворвался в ATL: ролики, наружка, креативные платформы, радио. Помимо креатива участвовал в съемках и пост-продакшне.',
    brands: ['ZATECKY GUS', 'RADIO ENERGY', 'ЯСНО СОЛНЫШКО', 'HOLSTEN', 'LAVINA', 'VTB', 'FLASH UP'],
    image: '/assets/cv/резюме_8.png',
    stats: {
      creativity: 74,
      strategy: 71,
      storytelling: 73,
      adaptability: 76,
      teamwork: 74,
      speed: 72
    }
  },
  {
    id: 9,
    company: 'ACTION',
    role: 'СТАРШИЙ КРЕАТОР',
    period: 'Июн 2024 — Окт 2025',
    description: 'Бодро креативил 360 с упором на BTL и event, был лидом на ряде проектов. Участвовал в массе тендеров для Авито, Lactalis и других брендов. Выиграл 60% тендеров.',
    brands: ['АВИТО', 'PRESIDENT', 'PARMALAT', 'MTS', 'YANDEX', 'S7'],
    image: '/assets/cv/резюме_9.png',
    stats: {
      creativity: 82,
      strategy: 78,
      storytelling: 81,
      adaptability: 84,
      teamwork: 80,
      speed: 79
    }
  }
];

const StatBar = ({ label, value, delay, isInitialMount }: { label: string; value: number; delay: number; isInitialMount: boolean }) => {
  const [currentValue, setCurrentValue] = useState(isInitialMount ? 0 : value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="space-y-1">
      <div className="flex items-center">
        <span
          className="uppercase"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '0.55rem',
            color: '#00ff00',
            textShadow: '0 0 5px rgba(0, 255, 0, 0.5)'
          }}
        >
          {label}
        </span>
      </div>
      <div
        className="w-full h-3 border-2 border-cyan-400 bg-black relative overflow-hidden"
        style={{ imageRendering: 'pixelated' }}
      >
        <motion.div
          animate={{ width: `${currentValue}%` }}
          transition={{ duration: 0.8, delay: delay / 1000, ease: 'easeOut' }}
          className="h-full"
          style={{
            background: 'linear-gradient(90deg, #00ffff 0%, #00ccff 50%, #0099ff 100%)',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.8), inset 0 0 10px rgba(0, 255, 255, 0.4)'
          }}
        />
      </div>
    </div>
  );
};

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [selectedId, setSelectedId] = useState(1);
  const [isInitialMount, setIsInitialMount] = useState(true);

  const selectedExperience = experiences.find(exp => exp.id === selectedId) || experiences[0];

  const gradientMap: { [key: number]: string } = {
    1: 'radial-gradient(circle at 80% 85%, #00bfff 0%, #0066cc 30%, #000000 65%)', // MILK CREATIVE - Electric Blue bottom-right (matching old MARVELOUS)
    2: 'radial-gradient(circle at 70% 40%, #ff1493 0%, #8b0a50 25%, #000000 60%)', // RAPP RUSSIA - Magenta off-center
    3: 'radial-gradient(circle at 50% 50%, #8b004b 0%, #4d0026 30%, #000000 70%)', // MARVELOUS - Deep pink/dark magenta atmospheric
    4: 'radial-gradient(circle at 50% 100%, #00ced1 0%, #008b8b 35%, #000000 70%)', // MINDSHARE - Cyan glow from bottom upward
    5: 'radial-gradient(circle at 25% 60%, #ff1493 0%, #8b0a50 25%, #000000 60%)', // FABULA CONTENT - Magenta off-center
    6: 'linear-gradient(to bottom, #50c878 0%, #2d7f4f 20%, #000000 50%, #000000 100%)', // ACCORD DIGITAL - Emerald Green halo from top edge only
    7: 'linear-gradient(to top, #dc143c 0%, #8b0000 40%, #000000 70%)', // TBWA - Deep Crimson bottom-up
    8: 'radial-gradient(circle at 15% 15%, #8b00ff 0%, #4b0082 30%, #000000 65%)', // MADNESS - Neon Violet top-left
    9: 'radial-gradient(circle at 80% 85%, #00bfff 0%, #0066cc 30%, #000000 65%)' // ACTION - Electric Blue bottom-right
  };

  const characterGradient = gradientMap[selectedId] || 'radial-gradient(circle at 50% 50%, #ff4500 0%, #8b2500 25%, #000000 60%)';

  const handleTabClick = (id: number) => {
    soundEffects.play('button');
    setSelectedId(id);
    setIsInitialMount(false);
  };

  const handleClose = () => {
    soundEffects.play('button');
    onClose();
  };

  const handleDownload = async () => {
    soundEffects.play('button');
    try {
      const response = await fetch('/assets/cv/Maxim_Bondarenko_CV.pdf');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Maxim_Bondarenko_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
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
            className="w-full max-w-6xl border-4 border-pink-500 relative pixel-corners"
            style={{
              background: 'linear-gradient(180deg, #05000a 0%, #1a0033 100%)',
              boxShadow: '0 0 40px rgba(255, 20, 147, 0.8), inset 0 0 60px rgba(255, 20, 147, 0.15)',
              imageRendering: 'pixelated',
              marginTop: '0',
              marginBottom: '0'
            }}
          >
            {/* Scanlines overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'repeating-linear-gradient(0deg, rgba(0, 255, 255, 0.03) 0px, rgba(0, 255, 255, 0.03) 1px, transparent 1px, transparent 2px)',
                mixBlendMode: 'overlay'
              }}
            />

            {/* Static 2D Grid Background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-15"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(138, 43, 226, 0.4) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(138, 43, 226, 0.4) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px'
              }}
            />

            {/* Header */}
            <div
              className="border-b-2 border-pink-500 px-6 py-4 flex justify-between items-center relative z-20"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }}
            >
              <div className="flex items-center gap-8">
                <h2
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '2rem',
                    color: '#ff1493',
                    textShadow: '0 0 20px rgba(255,20,147,0.8), 0 0 40px rgba(255,20,147,0.4)',
                    letterSpacing: '0.1em',
                    textTransform: 'none'
                  }}
                >
                  РЕЗЮМЕ.exe
                </h2>
                <div className="flex items-center gap-8">
                  <div
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: '0.9rem',
                      color: '#ff1493',
                      textShadow: '0 0 10px rgba(255, 20, 147, 0.8)',
                      letterSpacing: '0.05em',
                      fontWeight: 'bold'
                    }}
                  >
                    STATUS: STABLE
                  </div>
                  <div
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: '0.9rem',
                      color: '#ff1493',
                      textShadow: '0 0 10px rgba(255, 20, 147, 0.8)',
                      letterSpacing: '0.05em',
                      fontWeight: 'bold'
                    }}
                  >
                    MODE: <GlitchText words={['広告戦略', 'クリエイティブ', 'ひらめき', 'ブランド', '最高傑作']} color="#ff1493" fontSize="0.9rem" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={handleDownload}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 flex items-center gap-2 border-2 border-cyan-400 hover:bg-cyan-950 transition-all duration-300"
                  style={{
                    color: '#00ffff',
                    textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                    imageRendering: 'pixelated',
                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)'
                  }}
                >
                  <Download className="w-5 h-5" />
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', cursive",
                      fontSize: '0.7rem'
                    }}
                  >
                    DOWNLOAD
                  </span>
                </motion.button>
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

            {/* Main content */}
            <div className="flex relative z-20">
              {/* Left panel - Navigation */}
              <div
                className="w-80 border-r-2 border-pink-500"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}
              >
                <div className="p-4 space-y-2">
                  {experiences.map((exp) => (
                    <motion.button
                      key={exp.id}
                      onClick={() => handleTabClick(exp.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-4 border-2 transition-all duration-300 ${
                        selectedId === exp.id
                          ? 'border-cyan-400 bg-cyan-950'
                          : 'border-gray-600 bg-gray-900 bg-opacity-50'
                      }`}
                      style={{
                        imageRendering: 'pixelated',
                        boxShadow: selectedId === exp.id
                          ? '0 0 20px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.2)'
                          : 'none'
                      }}
                    >
                      <div className="space-y-2">
                        <div
                          className="font-bold uppercase"
                          style={{
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            color: selectedId === exp.id ? '#00ffff' : '#ffffff',
                            textShadow: selectedId === exp.id
                              ? '0 0 10px rgba(0, 255, 255, 0.8)'
                              : 'none'
                          }}
                        >
                          {exp.company}
                        </div>
                        <div
                          className="text-xs"
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            color: selectedId === exp.id ? '#00ffff' : '#999999',
                            textShadow: selectedId === exp.id
                              ? '0 0 8px rgba(0, 255, 255, 0.6)'
                              : 'none',
                            lineHeight: '1.3'
                          }}
                        >
                          {exp.period}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Right panel - Content */}
              <div className="flex-1 p-6">
                <div className="space-y-6">
                  {/* Header section - Static */}
                  <div className="space-y-2">
                    <h3
                      className="uppercase"
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '1.8rem',
                        lineHeight: '1.4',
                        color: '#FFFFFF',
                        textShadow: '0 0 10px rgba(255, 105, 180, 0.7), 0 0 20px rgba(255, 105, 180, 0.4), 0 0 30px rgba(255, 105, 180, 0.2)'
                      }}
                    >
                      {selectedExperience.company}
                    </h3>
                    <p
                      className="uppercase"
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '1rem',
                        color: '#00ffff',
                        textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'
                      }}
                    >
                      {selectedExperience.role}
                    </p>
                    <p
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        color: '#ffffff',
                        opacity: 0.8
                      }}
                    >
                      {selectedExperience.period}
                    </p>
                  </div>

                  {/* Top Row: Two Square Containers */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Square: Hero Evolution - Static */}
                    <div
                      className="border-4 border-cyan-400 p-4 flex items-center justify-center aspect-square"
                      style={{
                        background: characterGradient,
                        boxShadow: '0 0 20px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.2)',
                        imageRendering: 'pixelated'
                      }}
                    >
                      <CachedImage
                        key={selectedExperience.image}
                        src={selectedExperience.image}
                        alt={selectedExperience.company}
                        className="max-w-full max-h-full object-contain"
                        style={{
                          imageRendering: 'pixelated'
                        }}
                      />
                    </div>

                    {/* Right Square: Skill Stats - Animated */}
                    <div
                      className="border-4 border-cyan-400 bg-black bg-opacity-80 p-6 space-y-3 aspect-square flex flex-col justify-center"
                      style={{
                        boxShadow: '0 0 20px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.2)',
                        imageRendering: 'pixelated'
                      }}
                    >
                      <h4
                        className="mb-2 uppercase text-center"
                        style={{
                          fontFamily: "'Press Start 2P', cursive",
                          fontSize: '0.85rem',
                          color: '#00ffff',
                          textShadow: '0 0 15px rgba(0, 255, 255, 0.8)',
                          letterSpacing: '0.1em'
                        }}
                      >
                        НАВЫКИ
                      </h4>
                      <StatBar label="КРЕАТИВ" value={selectedExperience.stats.creativity} delay={100} isInitialMount={isInitialMount} />
                      <StatBar label="СТРАТЕГИЯ" value={selectedExperience.stats.strategy} delay={200} isInitialMount={isInitialMount} />
                      <StatBar label="СТОРИТЕЛЛИНГ" value={selectedExperience.stats.storytelling} delay={300} isInitialMount={isInitialMount} />
                      <StatBar label="АДАПТИВНОСТЬ" value={selectedExperience.stats.adaptability} delay={400} isInitialMount={isInitialMount} />
                      <StatBar label="РАБОТА В КОМАНДЕ" value={selectedExperience.stats.teamwork} delay={500} isInitialMount={isInitialMount} />
                      <StatBar label="СКОРОСТЬ" value={selectedExperience.stats.speed} delay={600} isInitialMount={isInitialMount} />
                    </div>
                  </div>

                  {/* Bottom Section: Description and Brand Tags */}
                  <div
                    className="border-4 border-pink-500 bg-black bg-opacity-70 p-6 space-y-6 pixel-corners"
                    style={{
                      boxShadow: '0 0 20px rgba(255, 20, 147, 0.6), inset 0 0 20px rgba(255, 20, 147, 0.2)',
                      imageRendering: 'pixelated'
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '0.75rem',
                        lineHeight: '1.8',
                        color: '#ffffff',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {selectedExperience.description}
                    </p>

                    {/* Brand Tags Section - Animated */}
                    <div className="space-y-3">
                      <h5
                        style={{
                          fontFamily: "'Press Start 2P', cursive",
                          fontSize: '0.7rem',
                          color: '#00ffff',
                          textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                          letterSpacing: '0.05em'
                        }}
                      >
                        С ЧЕМ РАБОТАЛ:
                      </h5>
                      <div className="flex flex-wrap gap-3">
                        {selectedExperience.brands.map((brand, index) => (
                          <motion.span
                            key={`${selectedId}-brand-${index}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="px-3 py-2 border-2 border-cyan-400 bg-black bg-opacity-60 transition-all duration-300 hover:border-pink-500 hover:shadow-[0_0_15px_rgba(255,20,147,0.6)]"
                            style={{
                              fontFamily: "'Press Start 2P', cursive",
                              fontSize: '0.6rem',
                              color: '#ffffff',
                              textShadow: '0 0 8px rgba(0, 255, 255, 0.5)',
                              imageRendering: 'pixelated',
                              cursor: 'default',
                              letterSpacing: '0.05em'
                            }}
                          >
                            {brand}
                          </motion.span>
                        ))}
                      </div>
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
